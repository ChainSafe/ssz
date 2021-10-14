import {
  getNodesAtDepth,
  LeafNode,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {CompositeType} from "./abstract";
import {addLengthNode} from "./array";
import {BitArray} from "./bitArrayTreeView";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * BitList may be represented as an array of bits or compressed into an array of bytes.
 *
 * **Array of bits**:
 * Require 8.87 bytes per bit, so for 512 bits = 4500 bytes.
 * Are 'faster' to iterate with native tooling but are as fast as array of bytes with precomputed caches.
 *
 * **Array of bytes**:
 * Require an average cost of Uint8Array in JS = 220 bytes for 32 bytes, so for 512 bits = 220 bytes.
 * With precomputed boolean arrays per bytes value are as fast to iterate as an array of bits above.
 *
 * This BitList implementation will represent data as a Uint8Array since it's very cheap to deserialize and can be as
 * fast to iterate as a native array of booleans, precomputing boolean arrays (total memory cost of 16000 bytes).
 */
export class BitVectorType extends CompositeType<BitArray> {
  // Immutable characteristics
  readonly chunkCount: number;
  readonly depth: number;
  readonly fixedLen: number;
  readonly minLen: number;
  readonly maxLen: number;

  constructor(readonly lengthBits: number) {
    super();

    this.chunkCount = Math.ceil(this.lengthBits / 8 / 32);
    this.depth = Math.ceil(Math.log2(this.chunkCount));
    this.fixedLen = Math.ceil(this.lengthBits / 8);
    this.minLen = this.fixedLen;
    this.maxLen = this.fixedLen;
  }

  get defaultValue(): BitArray {
    return new BitArray(new Uint8Array(this.fixedLen), this.lengthBits);
  }

  getView(tree: Tree): BitArray {
    // TODO: Develop BitListTreeView
    const byteLen = this.fixedLen;
    const nodes = getNodesAtDepth(tree.rootNode, this.depth, 0, this.chunkCount);
    const uint8Array = new Uint8Array(byteLen);
    packedNodeRootsToBytes(uint8Array, 0, byteLen, nodes);

    return new BitArray(uint8Array, this.lengthBits);
  }

  // Serialization + deserialization

  struct_serializedSize(): number {
    return this.fixedLen;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): BitArray {
    return new BitArray(data.slice(start, end), this.lengthBits);
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: BitArray): number {
    output.set(value.uint8Array, offset);
    return offset + this.fixedLen;
  }

  tree_serializedSize(): number {
    return this.fixedLen;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const chunksNode = packedRootsBytesToNode(this.depth, data, start, end);
    return addLengthNode(chunksNode, this.lengthBits);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const nodes = getNodesAtDepth(node, this.depth, 0, this.chunkCount);
    packedNodeRootsToBytes(output, offset, this.fixedLen, nodes);
    return offset + this.fixedLen;
  }

  tree_getLength(node: Node): number {
    return (node.right as LeafNode).getUint(4, 0);
  }
}
