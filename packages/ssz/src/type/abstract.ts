import {GindexBitstring, LeafNode, Node, toGindexBitstring} from "@chainsafe/persistent-merkle-tree";

/**
 * Proof path
 * ```
 * ["validators", 1234, "slashed"]
 * ```
 */
export type Path = (string | number)[];

export type JsonOptions = {
  case?:
    | "snake"
    | "constant"
    | "camel"
    | "param"
    | "header"
    | "pascal" //Same as squish
    | "dot"
    | "notransform";
  casingMap?: Record<string, string>;
};

/* eslint-disable @typescript-eslint/member-ordering  */

export type ValueOf<T extends Type<unknown>> = T extends Type<infer V> ? V : never;

/**
 * # Serialization
 * - serialize
 * - deserialize
 * - deserializeToView
 * - deserializeToViewDU
 * Internal
 * - value_serializedSize
 * - value_deserializeFromBytes
 * - value_serializeToBytes
 * - tree_serializedSize
 * - tree_serializeToBytes
 * - tree_deserializeFromBytes
 * Internal - Basic types
 * - tree_getFromNode
 * - tree_setToNode
 * - tree_getFromPackedNode
 * - tree_setToPackedNode
 *
 * # Merkelization
 * - hashTreeRoot
 * Internal
 * - getRoots
 * - maxChunkCount
 *
 * # Views
 * - getView
 * - getViewDU
 * - toValueFromView
 * - toValueFromViewDU
 * - toViewFromValue
 * - toViewDUFromValue
 * Internal
 * - commitView
 * - commitViewDU
 * - cacheOfViewDU
 *
 * # Tree helpers
 * Internal - Arrays
 * - tree_getLength
 * - tree_setLength
 * - tree_getChunksNode
 * - tree_setChunksNode
 *
 * # Proofs
 * - tree_createFromProof
 * - tree_createProof
 * - getPathInfo
 * - tree_getLeafGindices
 * - getPropertyGindex
 * - getPropertyType
 *
 */
export abstract class Type<V> {
  abstract readonly defaultValue: V;
  abstract readonly isBasic: boolean;
  abstract readonly depth: number;
  /** if fixedLen === null has variable length. Otherwise is fixed len of value `fixedLen` */
  abstract readonly fixedLen: number | null;
  abstract readonly minLen: number;
  abstract readonly maxLen: number;
  /** Human readable name: "List(Uint,4)", "BeaconState" */
  abstract readonly typeName: string;

  getGindexBitStringAtChunkIndex(index: number): GindexBitstring {
    return toGindexBitstring(this.depth, index);
  }

  // Serialization + deserialization

  // TODO: From Cayman's chat
  // - Rename struct to value
  // - Type TreeView's Type and at methods to `toValue()` and things like this
  // - Add proofs
  // - Move to schema?
  abstract value_serializedSize(value: V): number;
  abstract value_serializeToBytes(output: Uint8Array, offset: number, value: V): number;
  abstract value_deserializeFromBytes(data: Uint8Array, start: number, end: number): V;
  abstract tree_serializedSize(node: Node): number;
  abstract tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number;
  abstract tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node;

  // Un-performant path but useful for testing and prototyping
  value_toTree(value: V): Node {
    const bytes = new Uint8Array(this.value_serializedSize(value));
    this.value_serializeToBytes(bytes, 0, value);
    return this.tree_deserializeFromBytes(bytes, 0, bytes.length);
  }

  // Un-performant path but useful for testing and prototyping
  tree_toValue(node: Node): V {
    const bytes = new Uint8Array(this.tree_serializedSize(node));
    this.tree_serializeToBytes(bytes, 0, node);
    return this.value_deserializeFromBytes(bytes, 0, bytes.length);
  }

  // User-friendly API

  serialize(value: V): Uint8Array {
    const output = new Uint8Array(this.value_serializedSize(value));
    this.value_serializeToBytes(output, 0, value);
    return output;
  }

  deserialize(data: Uint8Array): V {
    return this.value_deserializeFromBytes(data, 0, data.length);
  }

  // Merkleization

  abstract hashTreeRoot(value: V): Uint8Array;

  equals(value1: V, value2: V): boolean {
    value1;
    value2;
    throw Error("Not implemented");
  }

  // JSON support

  abstract fromJson(json: unknown, opts?: JsonOptions): V;
  abstract toJson(value: V, opts?: JsonOptions): unknown;
}

export abstract class BasicType<V> extends Type<V> {
  readonly isBasic = true;
  readonly depth = 0;
  readonly chunkCount = 1;
  abstract readonly byteLength: number;

  // TODO: Consider just returning `Type<V>`, to make the API consistent in Container ViewOfFields
  getView(): unknown {
    throw Error("Basic types do not return views");
  }

  value_serializedSize(): number {
    return this.byteLength;
  }

  tree_serializedSize(): number {
    return this.byteLength;
  }

  hashTreeRoot(value: V): Uint8Array {
    const output = new Uint8Array(32);
    this.value_serializeToBytes(output, 0, value);
    return output;
  }

  abstract tree_getFromNode(leafNode: LeafNode): V;
  abstract tree_setToNode(leafNode: LeafNode, value: V): void;
  abstract tree_getFromPackedNode(leafNode: LeafNode, index: number): V;
  abstract tree_setToPackedNode(leafNode: LeafNode, index: number, value: V): void;
}
