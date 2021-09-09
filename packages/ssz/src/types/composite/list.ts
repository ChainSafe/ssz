import {Json, List} from "../../interface";
import {IArrayOptions, BasicArrayType, CompositeArrayType} from "./array";
import {isBasicType, isNumber64UintType, number32Type} from "../basic";
import {IJsonOptions, isTypeOf, Type} from "../type";
import {mixInLength} from "../../util/compat";
import {cloneHashObject} from "../../util/hash";
import {
  BranchNode,
  concatGindices,
  Gindex,
  HashObjectFn,
  LeafNode,
  Node,
  subtreeFillToContents,
  Tree,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";
import {isTreeBacked} from "../../backings/tree/treeValue";
import {HashObject} from "@chainsafe/as-sha256";

/**
 * SSZ Lists (variable-length arrays) include the length of the list in the tree
 * This length is always in the same index in the tree
 * ```
 *   1
 *  / \
 * 2   3 // <-here
 * ```
 */
export const LENGTH_GINDEX = BigInt(3);

export interface IListOptions extends IArrayOptions {
  limit: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListType<T extends List<any> = List<any>> = BasicListType<T> | CompositeListType<T>;
type ListTypeConstructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new <T extends List<any>>(options: IListOptions): ListType<T>;
};

export const LIST_TYPE = Symbol.for("ssz/ListType");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isListType<T extends List<any> = List<any>>(type: Type<unknown>): type is ListType<T> {
  return isTypeOf(type, LIST_TYPE);
}

// Trick typescript into treating ListType as a constructor
export const ListType: ListTypeConstructor =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function ListType<T extends List<any> = List<any>>(options: IListOptions): ListType<T> {
    if (isNumber64UintType(options.elementType)) {
      return new Number64ListType(options);
    } else if (isBasicType(options.elementType)) {
      return new BasicListType(options);
    } else {
      return new CompositeListType(options);
    }
  } as unknown as ListTypeConstructor;

export class BasicListType<T extends List<unknown> = List<unknown>> extends BasicArrayType<T> {
  limit: number;

  constructor(options: IListOptions) {
    super(options);
    this.limit = options.limit;
    this._typeSymbols.add(LIST_TYPE);
  }

  struct_defaultValue(): T {
    return [] as unknown as T;
  }

  struct_getLength(value: T): number {
    return value.length;
  }

  getMaxLength(): number {
    return this.limit;
  }

  getMinLength(): number {
    return 0;
  }

  bytes_validate(data: Uint8Array, start: number, end: number): void {
    super.bytes_validate(data, start, end);
    if (end - start > this.getMaxSerializedLength()) {
      throw new Error("Deserialized list length greater than limit");
    }
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    return super.struct_deserializeFromBytes(data, start, end);
  }

  struct_getChunkCount(value: T): number {
    return Math.ceil((value.length * this.elementType.struct_getSerializedLength()) / 32);
  }

  struct_hashTreeRoot(value: T): Uint8Array {
    return mixInLength(super.struct_hashTreeRoot(value), value.length);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_convertFromJson(data: Json, options?: IJsonOptions): T {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON list: expected an Array");
    }
    const maxLength = this.limit;
    if (data.length > maxLength) {
      throw new Error(`Invalid JSON list: length ${data.length} greater than limit ${maxLength}`);
    }
    return super.struct_convertFromJson(data);
  }

  struct_convertToTree(value: T): Tree {
    if (isTreeBacked<T>(value)) return value.tree.clone();
    const tree = super.struct_convertToTree(value);
    this.tree_setLength(tree, value.length);
    return tree;
  }

  tree_defaultNode(): Node {
    if (!this._defaultNode) {
      this._defaultNode = new BranchNode(zeroNode(super.getChunkDepth()), zeroNode(0));
    }
    return this._defaultNode;
  }

  tree_defaultValue(): Tree {
    return new Tree(this.tree_defaultNode());
  }

  tree_getLength(target: Tree): number {
    return number32Type.struct_deserializeFromBytes(target.getRoot(LENGTH_GINDEX), 0);
  }

  tree_setLength(target: Tree, length: number): void {
    const chunk = new Uint8Array(32);
    number32Type.toBytes(length, chunk, 0);
    target.setRoot(LENGTH_GINDEX, chunk);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const length = (end - start) / this.elementType.struct_getSerializedLength();
    if (!Number.isSafeInteger(length)) {
      throw new Error("Deserialized list byte length must be divisible by element size");
    }
    if (length > this.limit) {
      throw new Error("Deserialized list length greater than limit");
    }
    const value = super.tree_deserializeFromBytes(data, start, end);
    this.tree_setLength(value, length);
    return value;
  }

  tree_getChunkCount(target: Tree): number {
    return Math.ceil((this.tree_getLength(target) * this.elementType.struct_getSerializedLength()) / 32);
  }

  getChunkDepth(): number {
    return super.getChunkDepth() + 1;
  }

  tree_setProperty(target: Tree, property: number, value: T[number]): boolean {
    const length = this.tree_getLength(target);
    if (property > length) {
      throw new Error("Invalid length index");
    } else if (property == length) {
      this.tree_pushSingle(target, value);
      return true;
    } else {
      return this.tree_setValueAtIndex(target, property, value);
    }
  }

  tree_deleteProperty(target: Tree, property: number): boolean {
    const length = this.tree_getLength(target);
    if (property > length) {
      throw new Error("Invalid length index");
    } else if (property == length) {
      this.tree_pop(target);
      return true;
    } else {
      return super.tree_deleteProperty(target, property);
    }
  }

  tree_pushSingle(target: Tree, value: T[number]): number {
    const length = this.tree_getLength(target);
    const expand = this.getChunkIndex(length) != this.getChunkIndex(length + 1);
    this.tree_setValueAtIndex(target, length, value, expand);
    this.tree_setLength(target, length + 1);
    return length + 1;
  }

  tree_push(target: Tree, ...values: T[number][]): number {
    let newLength;
    for (const value of values) newLength = this.tree_pushSingle(target, value);
    return newLength || this.tree_getLength(target);
  }

  tree_pop(target: Tree): T[number] {
    const length = this.tree_getLength(target);
    const value = this.tree_getProperty(target, length - 1);
    super.tree_deleteProperty(target, length - 1);
    this.tree_setLength(target, length - 1);
    return value;
  }

  hasVariableSerializedLength(): boolean {
    return true;
  }

  getFixedSerializedLength(): null | number {
    return null;
  }

  getMaxChunkCount(): number {
    return Math.ceil((this.limit * this.elementType.size()) / 32);
  }
  tree_getLeafGindices(target?: Tree, root: Gindex = BigInt(1)): Gindex[] {
    if (!target) {
      throw new Error("variable type requires tree argument to get leaves");
    }
    const gindices = super.tree_getLeafGindices(target, root);
    // include the length chunk
    gindices.push(concatGindices([root, LENGTH_GINDEX]));
    return gindices;
  }
}

/** For Number64UintType, it takes 64 / 8 = 8 bytes per item, each chunk has 32 bytes = 4 items */
const NUMBER64_LIST_NUM_ITEMS_PER_CHUNK = 4;

/**
 * An optimization for Number64 using HashObject and new method to work with deltas.
 */
export class Number64ListType<T extends List<number> = List<number>> extends BasicListType<T> {
  constructor(options: IListOptions) {
    super(options);
  }

  /** @override */
  tree_getValueAtIndex(target: Tree, index: number): number {
    const chunkGindex = this.getGindexAtChunkIndex(this.getChunkIndex(index));
    const hashObject = target.getHashObject(chunkGindex);
    // 4 items per chunk
    const offsetInChunk = (index % 4) * 8;
    return this.elementType.struct_deserializeFromHashObject!(hashObject, offsetInChunk) as number;
  }

  /** @override */
  tree_setValueAtIndex(target: Tree, index: number, value: number, expand = false): boolean {
    const chunkGindex = this.getGindexAtChunkIndex(this.getChunkIndex(index));
    const hashObject = cloneHashObject(target.getHashObject(chunkGindex));
    // 4 items per chunk
    const offsetInChunk = (index % 4) * 8;
    this.elementType.struct_serializeToHashObject!(value as number, hashObject, offsetInChunk);
    target.setHashObject(chunkGindex, hashObject, expand);
    return true;
  }

  /**
   * delta > 0 increments the underlying value, delta < 0 decrements the underlying value
   * returns the new value
   **/
  tree_applyDeltaAtIndex(target: Tree, index: number, delta: number): number {
    const chunkGindex = this.getGindexAtChunkIndex(this.getChunkIndex(index));
    // 4 items per chunk
    const offsetInChunk = (index % 4) * 8;

    let value = 0;
    const hashObjectFn: HashObjectFn = (hashObject: HashObject) => {
      const newHashObject = cloneHashObject(hashObject);
      value = this.elementType.struct_deserializeFromHashObject!(newHashObject, offsetInChunk) as number;
      value += delta;
      if (value < 0) value = 0;
      this.elementType.struct_serializeToHashObject!(value as number, newHashObject, offsetInChunk);
      return newHashObject;
    };
    // it's 1.8x faster to use setHashObjectFn instead of getHashObject and setHashObject
    target.setHashObjectFn(chunkGindex, hashObjectFn);

    return value;
  }

  /**
   * The same to tree_applyUint64Delta but we do it in batch.
   * returns the new value
   **/
  tree_applyDeltaInBatch(target: Tree, deltaByIndex: Map<number, number>): number[] {
    // work on the new tree to avoid the hook
    const newTree = target.clone();
    const newValues: number[] = [];
    for (const [index, delta] of deltaByIndex.entries()) {
      this.tree_applyDeltaAtIndex(newTree, index, delta);
    }
    // update target, the hook should run 1 time only
    target.rootNode = newTree.rootNode;
    return newValues;
  }

  /**
   * delta > 0 means an increasement, delta < 0 means a decreasement
   * returns the new tree and new values
   **/
  tree_newTreeFromDeltas(target: Tree, deltas: number[]): [Tree, number[]] {
    if (deltas.length !== this.tree_getLength(target)) {
      throw new Error(`Expect delta length ${this.tree_getLength(target)}, actual ${deltas.length}`);
    }
    const chunkDepth = this.getChunkDepth();
    const length = deltas.length;
    let nodeIdx = 0;
    const newLeafNodes: LeafNode[] = [];
    const newValues: number[] = [];
    const chunkCount = Math.ceil(length / NUMBER64_LIST_NUM_ITEMS_PER_CHUNK);
    const currentNodes = target.getNodesAtDepth(chunkDepth, 0, chunkCount);
    for (let i = 0; i < currentNodes.length; i++) {
      const node = currentNodes[i];
      const hashObject = cloneHashObject(node);
      for (let offset = 0; offset < NUMBER64_LIST_NUM_ITEMS_PER_CHUNK; offset++) {
        const index = nodeIdx * NUMBER64_LIST_NUM_ITEMS_PER_CHUNK + offset;
        if (index >= length) break;
        let value =
          (this.elementType.struct_deserializeFromHashObject!(hashObject, offset * 8) as number) + deltas[index];
        if (value < 0) value = 0;
        newValues.push(value);
        // mutate hashObject at offset
        this.elementType.struct_serializeToHashObject!(value, hashObject, offset * 8);
      }
      newLeafNodes.push(new LeafNode(hashObject));
      nodeIdx++;
    }
    const newRootNode = subtreeFillToContents(newLeafNodes, chunkDepth);
    return [new Tree(newRootNode), newValues];
  }
}

export class CompositeListType<T extends List<unknown> = List<unknown>> extends CompositeArrayType<T> {
  limit: number;

  constructor(options: IListOptions) {
    super(options);
    this.limit = options.limit;
    this._typeSymbols.add(LIST_TYPE);
  }

  hasVariableSerializedLength(): boolean {
    return true;
  }

  getFixedSerializedLength(): null | number {
    return null;
  }

  getMaxChunkCount(): number {
    return this.limit;
  }

  struct_defaultValue(): T {
    return [] as unknown as T;
  }

  struct_getLength(value: T): number {
    return value.length;
  }

  getMaxLength(): number {
    return this.limit;
  }

  getMinLength(): number {
    return 0;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    const value = super.struct_deserializeFromBytes(data, start, end);
    if (value.length > this.limit) {
      throw new Error(`Deserialized list length greater than limit: ${value.length} ${this.limit}`);
    }
    return value;
  }

  struct_getChunkCount(value: T): number {
    return value.length;
  }

  struct_hashTreeRoot(value: T): Uint8Array {
    return mixInLength(super.struct_hashTreeRoot(value), value.length);
  }

  struct_convertFromJson(data: Json, options?: IJsonOptions): T {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON list: expected an Array");
    }
    const maxLength = this.limit;
    if (data.length > maxLength) {
      throw new Error(`Invalid JSON list: length ${data.length} greater than limit ${maxLength}`);
    }
    return super.struct_convertFromJson(data, options);
  }

  tree_defaultNode(): Node {
    if (!this._defaultNode) {
      this._defaultNode = new BranchNode(zeroNode(super.getChunkDepth()), zeroNode(0));
    }
    return this._defaultNode;
  }

  tree_defaultValue(): Tree {
    return new Tree(this.tree_defaultNode());
  }

  struct_convertToTree(value: T): Tree {
    if (isTreeBacked<T>(value)) return value.tree.clone();
    const tree = super.struct_convertToTree(value);
    this.tree_setLength(tree, value.length);
    return tree;
  }

  tree_getLength(target: Tree): number {
    return number32Type.struct_deserializeFromBytes(target.getRoot(LENGTH_GINDEX), 0);
  }

  tree_setLength(target: Tree, length: number): void {
    const chunk = new Uint8Array(32);
    number32Type.struct_serializeToBytes(length, chunk, 0);
    target.setRoot(LENGTH_GINDEX, chunk);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const target = this.tree_defaultValue();

    const fixedLen = this.elementType.getFixedSerializedLength();
    if (fixedLen === null) {
      const offsets = this.bytes_getVariableOffsets(new Uint8Array(data.buffer, data.byteOffset + start, end - start));
      if (offsets.length > this.limit) {
        throw new Error("Deserialized list length greater than limit");
      }
      for (let i = 0; i < offsets.length; i++) {
        const [currentOffset, nextOffset] = offsets[i];
        this.tree_setSubtreeAtChunkIndex(
          target,
          i,
          this.elementType.tree_deserializeFromBytes(data, start + currentOffset, start + nextOffset)
        );
      }
      this.tree_setLength(target, offsets.length);
    } else {
      const elementSize = fixedLen;
      const length = (end - start) / elementSize;
      if (!Number.isSafeInteger(length)) {
        throw new Error("Deserialized list byte length must be divisible by element size");
      }
      if (length > this.limit) {
        throw new Error("Deserialized list length greater than limit");
      }
      for (let i = 0; i < length; i++) {
        this.tree_setSubtreeAtChunkIndex(
          target,
          i,
          this.elementType.tree_deserializeFromBytes(data, start + i * elementSize, start + (i + 1) * elementSize),
          true // expand tree as needed
        );
      }
      this.tree_setLength(target, length);
    }
    return target;
  }

  tree_getChunkCount(target: Tree): number {
    return this.tree_getLength(target);
  }

  getChunkDepth(): number {
    return super.getChunkDepth() + 1;
  }

  tree_setProperty(target: Tree, property: number, value: Tree): boolean {
    const length = this.tree_getLength(target);
    if (property > length) {
      throw new Error("Invalid length index");
    } else if (property == length) {
      this.tree_pushSingle(target, value);
    } else {
      this.tree_setSubtreeAtChunkIndex(target, property, value);
    }
    return true;
  }

  tree_deleteProperty(target: Tree, property: number): boolean {
    const length = this.tree_getLength(target);
    if (property > length) {
      throw new Error("Invalid length index");
    } else if (property == length) {
      this.tree_pop(target);
      return true;
    } else {
      return super.tree_deleteProperty(target, property);
    }
  }

  tree_pushSingle(target: Tree, value: Tree): number {
    const length = this.tree_getLength(target);
    this.tree_setSubtreeAtChunkIndex(target, length, value, true);
    this.tree_setLength(target, length + 1);
    return length + 1;
  }

  tree_push(target: Tree, ...values: Tree[]): number {
    let newLength;
    for (const value of values) newLength = this.tree_pushSingle(target, value);
    return newLength || this.tree_getLength(target);
  }

  tree_pop(target: Tree): T[number] {
    const length = this.tree_getLength(target);
    const value = this.tree_getProperty(target, length - 1);
    this.tree_setSubtreeAtChunkIndex(target, length - 1, new Tree(zeroNode(0)));
    this.tree_setLength(target, length - 1);
    return value as T[number];
  }
  tree_getLeafGindices(target?: Tree, root: Gindex = BigInt(1)): Gindex[] {
    if (!target) {
      throw new Error("variable type requires tree argument to get leaves");
    }
    const gindices = super.tree_getLeafGindices(target, root);
    // include the length chunk
    gindices.push(concatGindices([root, LENGTH_GINDEX]));
    return gindices;
  }
}
