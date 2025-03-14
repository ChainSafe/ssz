import {Node} from "@chainsafe/persistent-merkle-tree";



export type ValueOf<T extends Type<unknown>> = T extends Type<infer V> ? V : never;

/**
 * JSON path property
 * @example Container property
 * ```
 * "validators"
 * ```
 * @example Array index
 * ```
 * 1234
 * ```
 */
export type JsonPathProp = string | number;

/**
 * JSON Proof path
 * @example
 * ```
 * ["validators", 1234, "slashed"]
 * ```
 */
export type JsonPath = JsonPathProp[];

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
 * An SSZ type provides the following operations:
 * - Serialization from/to bytes to either a value or a tree
 * - Merkelization to compute the hashTreeRoot of both a value and a tree
 * - Proof creation from trees
 * - Create a View and a ViewDU instance from a tree
 * - Manipulate views
 */
export abstract class Type<V> {
  /**
   * If `true`, the type is basic.
   *
   * If `false`, the type is composite
   */
  abstract readonly isBasic: boolean;
  /** Tree depth to chunks or LeafNodes */
  abstract readonly depth: number;
  /** Maximum count of LeafNode chunks this type can have when merkleized */
  abstract readonly maxChunkCount: number;
  /**
   * The number of bytes of the serialized value.
   *
   * If `fixedSize === null`, the type has a variable serialized bytelength.
   */
  abstract readonly fixedSize: number | null;
  /** Minimum possible size of this type. Equals `this.fixedSize` if fixed size */
  abstract readonly minSize: number;
  /** Maximum possible size of this type. Equals `this.fixedSize` if fixed size */
  abstract readonly maxSize: number;
  /**
   * Human readable name
   *
   * @example
   * "List(Uint,4)"
   * "BeaconState"
   */
  abstract readonly typeName: string;

  // Serialization + deserialization

  /** INTERNAL METHOD: Return serialized size of a value */
  abstract value_serializedSize(value: V): number;
  /** INTERNAL METHOD: Serialize value to existing output ArrayBuffer views */
  abstract value_serializeToBytes(output: ByteViews, offset: number, value: V): number;
  /** INTERNAL METHOD: Deserialize value from a section of ArrayBuffer views */
  abstract value_deserializeFromBytes(data: ByteViews, start: number, end: number): V;
  /** INTERNAL METHOD: Return serialized size of a tree */
  abstract tree_serializedSize(node: Node): number;
  /** INTERNAL METHOD: Serialize tree to existing output ArrayBuffer views  */
  abstract tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number;
  /** INTERNAL METHOD: Deserialize tree from a section of ArrayBuffer views */
  abstract tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node;

  /** INTERNAL METHOD: Merkleize value to tree */
  value_toTree(value: V): Node {
    // TODO: Un-performant path but useful for prototyping. Overwrite in Type if performance is important
    const uint8Array = new Uint8Array(this.value_serializedSize(value));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, value);
    return this.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  /** INTERNAL METHOD: Un-merkleize tree to value */
  tree_toValue(node: Node): V {
    // TODO: Un-performant path but useful for prototyping. Overwrite in Type if performance is important
    const uint8Array = new Uint8Array(this.tree_serializedSize(node));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.tree_serializeToBytes({uint8Array, dataView}, 0, node);
    return this.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  // User-friendly API

  /** New instance of a recursive zero'ed value of this type */
  abstract defaultValue(): V;

  /** Serialize a value to binary data */
  serialize(value: V): Uint8Array {
    const uint8Array = new Uint8Array(this.value_serializedSize(value));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, value);
    return uint8Array;
  }

  /** Deserialize binary data to value */
  deserialize(uint8Array: Uint8Array): V {
    // Buffer.prototype.slice does not copy memory, force use Uint8Array.prototype.slice https://github.com/nodejs/node/issues/28087
    // - Uint8Array.prototype.slice: Copy memory, safe to mutate
    // - Buffer.prototype.slice: Does NOT copy memory, mutation affects both views
    // We could ensure that all Buffer instances are converted to Uint8Array before calling value_deserializeFromBytes
    // However doing that in a browser friendly way is not easy. Downstream code uses `Uint8Array.prototype.slice.call`
    // to ensure Buffer.prototype.slice is never used. Unit tests also test non-mutability.

    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    return this.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  // Merkleization

  /**
   * Merkleize value and compute its hashTreeRoot.
   *
   * See spec for definition of hashTreeRoot:
   * https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md#merkleization
   */
  abstract hashTreeRoot(value: V): Uint8Array;

  /**
   * Same to hashTreeRoot() but here we write result to output.
   */
  abstract hashTreeRootInto(value: V, output: Uint8Array, offset: number): void;

  // JSON support

  /** Parse JSON representation of a type to value */
  abstract fromJson(json: unknown): V;
  /** Convert value into its JSON representation */
  abstract toJson(value: V): unknown;

  // Clone (for BranchNodeStruct)

  /**
   * Returns a recursive clone of all mutable Types of a value, such that it can be safely mutated.
   *
   * Note: Immutable types and subtypes, such as `ByteVector`, return the original value.
   */
  abstract clone(value: V): V;

  // Util methods

  /**
   * Returns true if values `a` and `b` are deeply equal by value
   */
  abstract equals(a: V, b: V): boolean;
}
