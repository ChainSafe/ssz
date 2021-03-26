/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {CompositeValue, Json} from "../../interface";
import {BackedValue, createTreeBacked, isBackedValue, Path, TreeBacked} from "../../backings";
import {IJsonOptions, isTypeOf, Type} from "../type";
import {
  concatGindices,
  countToDepth,
  Gindex,
  Node,
  Proof,
  ProofType,
  toGindex,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {merkleize} from "../../util/compat";
import {byteArrayEquals} from "../../util/byteArray";

export const COMPOSITE_TYPE = Symbol.for("ssz/CompositeType");

export function isCompositeType(type: Type<unknown>): type is CompositeType<CompositeValue> {
  return isTypeOf(type, COMPOSITE_TYPE);
}

/**
 * A CompositeType is a type containing other types, and is flexible in its representation.
 *
 */
export abstract class CompositeType<T extends CompositeValue> extends Type<T> {
  _chunkDepth: number;
  _defaultNode: Node;

  constructor() {
    super();
    this._typeSymbols.add(COMPOSITE_TYPE);
  }

  abstract struct_assertValidValue(value: unknown): asserts value is T;

  abstract struct_equals(struct1: T, struct2: T): boolean;
  tree_equals(tree1: Tree, tree2: Tree): boolean {
    return byteArrayEquals(tree1.root, tree2.root);
  }
  bytes_equals(bytes1: Uint8Array, bytes2: Uint8Array): boolean {
    return byteArrayEquals(bytes1, bytes2);
  }

  abstract struct_defaultValue(): T;
  abstract tree_defaultNode(): Node;
  tree_defaultValue(): Tree {
    return new Tree(this.tree_defaultNode());
  }

  abstract struct_clone(value: T): T;
  tree_clone(value: Tree): Tree {
    return value.clone();
  }
  bytes_clone(value: Uint8Array, start = 0, end = value.length): Uint8Array {
    const bytes = new Uint8Array(end - start);
    value.subarray(start, end).set(bytes);
    return bytes;
  }

  abstract struct_convertToJson(struct: T, options?: IJsonOptions): Json;
  abstract struct_convertFromJson(json: Json, options?: IJsonOptions): T;

  abstract struct_convertToTree(struct: T): Tree;
  abstract tree_convertToStruct(tree: Tree): T;

  abstract struct_serializeToBytes(struct: T, output: Uint8Array, offset: number): number;
  abstract tree_serializeToBytes(tree: Tree, output: Uint8Array, offset: number): number;
  struct_serialize(struct: T, data: Uint8Array): number {
    const output = new Uint8Array(this.struct_getSerializedLength(struct));
    return this.struct_serializeToBytes(struct, output, 0);
  }
  tree_serialize(tree: Tree, data: Uint8Array): number {
    const output = new Uint8Array(this.tree_getSerializedLength(tree));
    return this.tree_serializeToBytes(tree, output, 0);
  }

  bytes_validate(data: Uint8Array, start: number, end: number): void {
    if (!data) {
      throw new Error("Data is null or undefined");
    }
    if (data.length === 0) {
      throw new Error("Data is empty");
    }
    if (start < 0) {
      throw new Error(`Start param is negative: ${start}`);
    }
    if (start > data.length) {
      throw new Error(`Start param: ${start} is greater than length: ${data.length}`);
    }
    if (end < 0) {
      throw new Error(`End param is negative: ${end}`);
    }
    if (end > data.length) {
      throw new Error(`End param: ${end} is greater than length: ${data.length}`);
    }
    const length = end - start;
    if (!this.hasVariableSerializedLength() && length !== this.struct_getSerializedLength(null)) {
      throw new Error(`Incorrect data length ${length}, expect ${this.struct_getSerializedLength(null)}`);
    }
    if (end - start < this.getMinSerializedLength()) {
      throw new Error(`Data length ${length} is too small, expect at least ${this.getMinSerializedLength()}`);
    }
  }
  abstract struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T;
  abstract tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree;
  struct_deserialize(data: Uint8Array): T {
    return this.struct_deserializeFromBytes(data, 0, data.length);
  }
  tree_deserialize(data: Uint8Array): Tree {
    return this.tree_deserializeFromBytes(data, 0, data.length);
  }

  abstract getMinSerializedLength(): number;
  abstract getMaxSerializedLength(): number;
  abstract struct_getSerializedLength(struct: T): number;
  abstract tree_getSerializedLength(tree: Tree): number;
  abstract hasVariableSerializedLength(): boolean;
  abstract bytes_getVariableOffsets(target: Uint8Array): [number, number][];

  abstract getMaxChunkCount(): number;
  struct_getChunkCount(struct: T): number {
    return this.getMaxChunkCount();
  }
  tree_getChunkCount(target: Tree): number {
    return this.getMaxChunkCount();
  }
  abstract struct_getRootAtChunkIndex(struct: T, chunkIx: number): Uint8Array;
  *struct_yieldChunkRoots(struct: T): Iterable<Uint8Array> {
    const chunkCount = this.struct_getChunkCount(struct);
    for (let i = 0; i < chunkCount; i++) {
      yield this.struct_getRootAtChunkIndex(struct, i);
    }
  }

  getChunkDepth(): number {
    if (!this._chunkDepth) {
      this._chunkDepth = countToDepth(BigInt(this.getMaxChunkCount()));
    }
    return this._chunkDepth;
  }
  getGindexAtChunkIndex(index: number): Gindex {
    return toGindex(this.getChunkDepth(), BigInt(index));
  }
  tree_getSubtreeAtChunkIndex(target: Tree, index: number): Tree {
    return target.getSubtree(this.getGindexAtChunkIndex(index));
  }
  tree_setSubtreeAtChunkIndex(target: Tree, index: number, value: Tree, expand = false): void {
    target.setSubtree(this.getGindexAtChunkIndex(index), value, expand);
  }
  tree_getRootAtChunkIndex(target: Tree, index: number): Uint8Array {
    return target.getRoot(this.getGindexAtChunkIndex(index));
  }
  tree_setRootAtChunkIndex(target: Tree, index: number, value: Uint8Array, expand = false): void {
    target.setRoot(this.getGindexAtChunkIndex(index), value, expand);
  }

  abstract struct_getPropertyNames(struct: T): (string | number)[];
  abstract tree_getPropertyNames(tree: Tree): (string | number)[];

  abstract getPropertyGindex(property: PropertyKey): Gindex;
  getPathGindex(path: Path): Gindex {
    const gindices = [];
    let type = this as CompositeType<CompositeValue>;
    for (const prop of path) {
      if (!isCompositeType(type)) {
        throw new Error("Invalid path: cannot navigate beyond a basic type");
      }
      gindices.push(type.getPropertyGindex(prop));
      type = type.getPropertyType(prop) as CompositeType<CompositeValue>;
    }
    return concatGindices(gindices);
  }
  abstract getPropertyType(property: PropertyKey): Type<unknown> | undefined;
  abstract tree_getProperty(tree: Tree, property: PropertyKey): Tree | unknown;
  abstract tree_setProperty(tree: Tree, property: PropertyKey, value: Tree | unknown): boolean;
  abstract tree_deleteProperty(tree: Tree, property: PropertyKey): boolean;
  abstract tree_iterateValues(tree: Tree): IterableIterator<Tree | unknown>;
  tree_createProof(target: Tree, paths: Path[]): Proof {
    const gindices = paths.map((path) => this.getPathGindex(path));
    return target.getProof({
      type: ProofType.treeOffset,
      gindices,
    });
  }

  struct_hashTreeRoot(struct: T): Uint8Array {
    return merkleize(this.struct_yieldChunkRoots(struct), this.getMaxChunkCount());
  }
  tree_hashTreeRoot(tree: Tree): Uint8Array {
    return tree.root;
  }

  // convenience
  /**
   * Valid value assertion
   */
  assertValidValue(value: unknown): asserts value is T {
    this.struct_assertValidValue(value);
  }

  /**
   * Equality
   */
  equals(value1: BackedValue<T> | T, value2: BackedValue<T> | T): boolean {
    if (isBackedValue(value1) && isBackedValue(value2)) {
      return value1.equals(value2);
    } else {
      return this.struct_equals(value1 as T, value2 as T);
    }
  }

  /**
   * Default constructor
   */
  defaultValue(): T {
    return this.struct_defaultValue();
  }

  /**
   * Clone / copy
   */
  clone(value: T): T {
    if (isBackedValue(value)) {
      return (value.clone() as unknown) as T;
    } else {
      return this.struct_clone(value);
    }
  }

  // Serialization / Deserialization

  /**
   * Serialized byte length
   */
  size(value: T): number {
    if (isBackedValue(value)) {
      return value.size();
    } else {
      return this.struct_getSerializedLength(value);
    }
  }

  /**
   * Maximal serialized byte length
   */
  maxSize(): number {
    return this.getMaxSerializedLength();
  }

  /**
   * Minimal serialized byte length
   */
  minSize(): number {
    return this.getMinSerializedLength();
  }

  /**
   * Low-level deserialization
   */
  fromBytes(data: Uint8Array, start: number, end: number): T {
    return this.struct_deserializeFromBytes(data, start, end);
  }

  /**
   * Deserialization
   */
  deserialize(data: Uint8Array): T {
    return this.fromBytes(data, 0, data.length);
  }

  /**
   * Low-level serialization
   *
   * Serializes to a pre-allocated Uint8Array
   */
  toBytes(value: T, output: Uint8Array, offset: number): number {
    if (isBackedValue(value)) {
      return value.toBytes(output, offset);
    } else {
      return this.struct_serializeToBytes(value, output, offset);
    }
  }
  /**
   * Serialization
   */
  serialize(value: T): Uint8Array {
    if (isBackedValue(value)) {
      return value.serialize();
    } else {
      const output = new Uint8Array(this.size(value));
      this.toBytes(value, output, 0);
      return output;
    }
  }

  // Merkleization

  /**
   * Merkleization
   */
  hashTreeRoot(value: T): Uint8Array {
    if (isBackedValue(value)) {
      return value.hashTreeRoot();
    } else {
      return this.struct_hashTreeRoot(value);
    }
  }

  /**
   * Convert from a JSON-serializable object
   */
  fromJson(data: Json, options?: IJsonOptions): T {
    return this.struct_convertFromJson(data, options);
  }

  /**
   * Convert to a JSON-serializable object
   */
  toJson(value: T, options?: IJsonOptions): Json {
    return this.struct_convertToJson(value, options);
  }

  createTreeBacked(tree: Tree): TreeBacked<T> {
    return createTreeBacked(this, tree);
  }
  createTreeBackedFromStruct(value: T): TreeBacked<T> {
    return this.createTreeBacked(this.struct_convertToTree(value));
  }
  createTreeBackedFromBytes(data: Uint8Array): TreeBacked<T> {
    return this.createTreeBacked(this.tree_deserialize(data));
  }
  createTreeBackedFromJson(data: Json, options?: IJsonOptions): TreeBacked<T> {
    return this.createTreeBackedFromStruct(this.struct_convertFromJson(data, options));
  }
  defaultTreeBacked(): TreeBacked<T> {
    return createTreeBacked(this, this.tree_defaultValue());
  }
}
