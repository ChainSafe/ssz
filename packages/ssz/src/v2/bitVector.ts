import {
  getNodesAtDepth,
  LeafNode,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/tree";
import {fromHexString} from "../util/byteArray";
import {CompositeType} from "./abstract";
import {BitArray, BitArrayTreeView} from "./bitArrayTreeView";

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
export class BitVectorType extends CompositeType<BitArray, BitArrayTreeView> {
  // Immutable characteristics
  protected readonly maxChunkCount: number;
  readonly chunkCount: number;
  readonly depth: number;
  readonly fixedLen: number;
  readonly minLen: number;
  readonly maxLen: number;
  /**
   * Mask to check if trailing bits are zero'ed. Mask returns bits that must be zero'ed
   * ```
   * lengthBits % 8 | zeroBitsMask
   * 0              | 0
   * 1              | 11111110
   * 2              | 11111100
   * 7              | 10000000
   * ```
   */
  private readonly zeroBitsMask: number;

  constructor(readonly lengthBits: number) {
    super();

    if (lengthBits === 0) {
      throw Error("Vector types must not be empty");
    }

    this.chunkCount = Math.ceil(this.lengthBits / 8 / 32);
    this.maxChunkCount = this.chunkCount;
    this.depth = maxChunksToDepth(this.chunkCount);
    this.fixedLen = Math.ceil(this.lengthBits / 8);
    this.minLen = this.fixedLen;
    this.maxLen = this.fixedLen;
    // To cache mask for trailing zero bits validation
    this.zeroBitsMask = lengthBits % 8 === 0 ? 0 : 0xff & (0xff << lengthBits % 8);
  }

  get defaultValue(): BitArray {
    return new BitArray(new Uint8Array(this.fixedLen), this.lengthBits);
  }

  getView(tree: Tree): BitArrayTreeView {
    // TODO: Develop BitListTreeView
    const byteLen = this.fixedLen;
    const nodes = getNodesAtDepth(tree.rootNode, this.depth, 0, this.chunkCount);
    const uint8Array = new Uint8Array(byteLen);
    packedNodeRootsToBytes(uint8Array, 0, byteLen, nodes);

    // TODO
    // return new BitArray(uint8Array, this.lengthBits);
    return new BitArrayTreeView();
  }

  // Serialization + deserialization

  struct_serializedSize(): number {
    return this.fixedLen;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): BitArray {
    this.assertValidLength(data, start, end);
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
    this.assertValidLength(data, start, end);
    return packedRootsBytesToNode(this.depth, data, start, end);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const nodes = getNodesAtDepth(node, this.depth, 0, this.chunkCount);
    packedNodeRootsToBytes(output, offset, this.fixedLen, nodes);
    return offset + this.fixedLen;
  }

  tree_getLength(node: Node): number {
    return (node.right as LeafNode).getUint(4, 0);
  }

  // Merkleization

  protected getRoots(value: BitArray): Uint8Array {
    return value.uint8Array;
  }

  // JSON

  fromJson(data: unknown): BitArray {
    // TODO: Validate
    const bytes = fromHexString(data as string);
    return this.struct_deserializeFromBytes(bytes, 0, this.fixedLen);
  }

  // Deserializer helpers

  private assertValidLength(data: Uint8Array, start: number, end: number): void {
    const size = end - start;
    if (end - start !== this.fixedLen) {
      throw Error(`BitVector size ${size} must be exactly ${this.fixedLen}`);
    }

    // If lengthBits is not aligned to bytes, ensure trailing bits are zeroed
    if (
      // If zeroBitsMask == 0, then the BitVector uses full bytes only
      this.zeroBitsMask > 0 &&
      // if the last byte is partial, retrieve it and use the cached mask to check if trailing bits are zeroed
      (data[end - 1] & this.zeroBitsMask) > 0
    ) {
      throw Error("BitVector: nonzero bits past length");
    }
  }
}
