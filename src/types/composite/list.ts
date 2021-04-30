/* eslint-disable @typescript-eslint/camelcase */
import {Json, List, ArrayLike} from "../../interface";
import {IArrayOptions, BasicArrayType, CompositeArrayType} from "./array";
import {isBasicType, number32Type} from "../basic";
import {IJsonOptions, isTypeOf, Type} from "../type";
import {mixInLength} from "../../util/compat";
import {BranchNode, Node, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {isTreeBacked} from "../../backings/tree/treeValue";

export interface IListOptions<T extends ArrayLike<unknown>> extends IArrayOptions<T> {
  limit: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListType<T extends List<unknown>> = BasicListType<T> | CompositeListType<T>;
type ListTypeConstructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new <T extends List<unknown>>(options: IListOptions<T>): ListType<T>;
};

export const LIST_TYPE = Symbol.for("ssz/ListType");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isListType<T extends List<unknown>>(type: Type<unknown>): type is ListType<T> {
  return isTypeOf(type, LIST_TYPE);
}

// Trick typescript into treating ListType as a constructor
export const ListType: ListTypeConstructor =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function ListType<T extends List<any>>(options: IListOptions<T>): ListType<T> {
    if (isBasicType(options.elementType)) {
      return new BasicListType(options);
    } else {
      return new CompositeListType(options);
    }
  } as unknown) as ListTypeConstructor;

export class BasicListType<T extends List<unknown> = List<unknown>> extends BasicArrayType<T> {
  limit: number;

  constructor(options: IListOptions<T>) {
    super(options);
    this.limit = options.limit;
    this._typeSymbols.add(LIST_TYPE);
  }

  struct_defaultValue(): T {
    return ([] as unknown) as T;
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
    return number32Type.struct_deserializeFromBytes(target.getRoot(BigInt(3)), 0);
  }

  tree_setLength(target: Tree, length: number): void {
    const chunk = new Uint8Array(32);
    number32Type.toBytes(length, chunk, 0);
    target.setRoot(BigInt(3), chunk);
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
    values.forEach((value) => (newLength = this.tree_pushSingle(target, value)));
    return newLength;
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

  getMaxChunkCount(): number {
    return Math.ceil((this.limit * this.elementType.size()) / 32);
  }
}

export class CompositeListType<T extends List<object> = List<object>> extends CompositeArrayType<T> {
  limit: number;

  constructor(options: IListOptions) {
    super(options);
    this.limit = options.limit;
    this._typeSymbols.add(LIST_TYPE);
  }

  hasVariableSerializedLength(): boolean {
    return true;
  }

  getMaxChunkCount(): number {
    return this.limit;
  }

  struct_defaultValue(): T {
    return ([] as unknown) as T;
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
    return number32Type.struct_deserializeFromBytes(target.getRoot(BigInt(3)), 0);
  }

  tree_setLength(target: Tree, length: number): void {
    const chunk = new Uint8Array(32);
    number32Type.struct_serializeToBytes(length, chunk, 0);
    target.setRoot(BigInt(3), chunk);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const target = this.tree_defaultValue();
    if (this.elementType.hasVariableSerializedLength()) {
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
      const elementSize = this.elementType.struct_getSerializedLength(null);
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
    values.forEach((value) => (newLength = this.tree_pushSingle(target, value)));
    return newLength;
  }

  tree_pop(target: Tree): T[number] {
    const length = this.tree_getLength(target);
    const value = this.tree_getProperty(target, length - 1);
    this.tree_setSubtreeAtChunkIndex(target, length - 1, new Tree(zeroNode(0)));
    this.tree_setLength(target, length - 1);
    return value as T[number];
  }
}
