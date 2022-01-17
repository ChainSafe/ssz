import {GindexBitstring, LeafNode, Node, toGindexBitstring} from "@chainsafe/persistent-merkle-tree";

/**
 * Proof path
 * ```
 * ["validators", 1234, "slashed"]
 * ```
 */
export type Path = (string | number)[];

/* eslint-disable @typescript-eslint/member-ordering  */

export type ValueOf<T extends Type<unknown>> = T extends Type<infer V> ? V : never;

/**
 * Provide two views recursively to any deserialization operation:
 * - For uint it's x10 times faster to read and write with DataView
 * - For ByteArray and BitArray it's x10 times faster to slice a Uint8Array than an ArrayBuffer
 *
 * Providing both allows to optimize for both cases with the tiny overhead of creating a new view.
 */
export type ByteViews = {
  uint8Array: Uint8Array;
  dataView: DataView;
};

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
  /** if fixedSize === null has variable length. Otherwise is fixed size of value `fixedSize` */
  abstract readonly fixedSize: number | null;
  abstract readonly minSize: number;
  abstract readonly maxSize: number;
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
  abstract value_serializeToBytes(output: ByteViews, offset: number, value: V): number;
  abstract value_deserializeFromBytes(data: ByteViews, start: number, end: number): V;
  abstract tree_serializedSize(node: Node): number;
  abstract tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number;
  abstract tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node;

  // Un-performant path but useful for testing and prototyping
  value_toTree(value: V): Node {
    const uint8Array = new Uint8Array(this.value_serializedSize(value));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, value);
    return this.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  // Un-performant path but useful for testing and prototyping
  tree_toValue(node: Node): V {
    const uint8Array = new Uint8Array(this.tree_serializedSize(node));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.tree_serializeToBytes({uint8Array, dataView}, 0, node);
    return this.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  // User-friendly API

  serialize(value: V): Uint8Array {
    const uint8Array = new Uint8Array(this.value_serializedSize(value));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, value);
    return uint8Array;
  }

  deserialize(uint8Array: Uint8Array): V {
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    return this.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  // Merkleization

  abstract hashTreeRoot(value: V): Uint8Array;

  // JSON support

  abstract fromJson(json: unknown): V;
  abstract toJson(value: V): unknown;
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
    const uint8Array = new Uint8Array(32);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, value);
    return uint8Array;
  }

  abstract tree_getFromNode(leafNode: LeafNode): V;
  abstract tree_setToNode(leafNode: LeafNode, value: V): void;
  abstract tree_getFromPackedNode(leafNode: LeafNode, index: number): V;
  abstract tree_setToPackedNode(leafNode: LeafNode, index: number, value: V): void;
}
