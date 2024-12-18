import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {Type} from "./abstract.js";

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * Represents a basic type as defined in the spec:
 * https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md#basic-types
 */
export abstract class BasicType<V> extends Type<V> {
  readonly isBasic = true;
  // Basic types merkleize to exactly one chunk, thus depth of 0
  readonly depth = 0;
  // Basic types merkleize to exactly one chunk
  readonly maxChunkCount = 1;
  abstract readonly byteLength: number;

  value_serializedSize(): number {
    return this.byteLength;
  }

  tree_serializedSize(): number {
    return this.byteLength;
  }

  protected assertValidSize(size: number): void {
    if (size !== this.byteLength) {
      throw Error(`BasicType invalid size ${size} expected ${this.byteLength}`);
    }
  }

  hashTreeRoot(value: V): Uint8Array {
    // TODO: Optimize
    const uint8Array = new Uint8Array(32);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, value);
    return uint8Array;
  }

  clone(value: V): V {
    // All basic types are represented by primitive Javascript types, don't require clone
    return value;
  }

  equals(a: V, b: V): boolean {
    // All basic types are represented by primitive Javascript types, the operator === is sufficient
    return a === b;
  }

  /** INTERNAL METHOD: Efficiently get a value from a LeafNode (not packed) */
  abstract tree_getFromNode(leafNode: LeafNode): V;
  /** INTERNAL METHOD: Efficiently set a value to a LeafNode (not packed) */
  abstract tree_setToNode(leafNode: LeafNode, value: V): void;
  /** INTERNAL METHOD: Efficiently get a value from a LeafNode (packed) */
  abstract tree_getFromPackedNode(leafNode: LeafNode, index: number): V;
  /** INTERNAL METHOD: Efficiently set a value to a LeafNode (packed) */
  abstract tree_setToPackedNode(leafNode: LeafNode, index: number, value: V): void;
}

export function isBasicType<T>(type: Type<T>): type is BasicType<T> {
  return type.isBasic;
}
