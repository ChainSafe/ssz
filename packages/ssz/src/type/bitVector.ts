import {getNodesAtDepth, Node, packedNodeRootsToBytes, packedRootsBytesToNode} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/merkleize";
import {ByteViews} from "./composite";
import {BitArray} from "../value/bitArray";
import {BitArrayType} from "./bitArray";

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * BitVector: ordered fixed-length collection of boolean values, with N bits
 * - Notation: `Bitvector[N]`
 * - Value: `BitArray`, @see BitArray for a justification of its memory efficiency and performance
 * - View: `BitArrayTreeView`
 * - ViewDU: `BitArrayTreeViewDU`
 */
export class BitVectorType extends BitArrayType {
  readonly typeName: string;
  readonly chunkCount: number;
  readonly depth: number;
  readonly fixedSize: number;
  readonly minSize: number;
  readonly maxSize: number;
  readonly maxChunkCount: number;
  readonly isList = false;
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

    if (lengthBits === 0) throw Error("Vector length must be > 0");

    this.typeName = `BitVector[${lengthBits}]`;
    this.chunkCount = Math.ceil(this.lengthBits / 8 / 32);
    this.maxChunkCount = this.chunkCount;
    this.depth = maxChunksToDepth(this.chunkCount);
    this.fixedSize = Math.ceil(this.lengthBits / 8);
    this.minSize = this.fixedSize;
    this.maxSize = this.fixedSize;
    // To cache mask for trailing zero bits validation
    this.zeroBitsMask = lengthBits % 8 === 0 ? 0 : 0xff & (0xff << lengthBits % 8);
  }

  defaultValue(): BitArray {
    return BitArray.fromBitLen(this.lengthBits);
  }

  // Views: inherited from BitArrayType

  // Serialization + deserialization

  value_serializedSize(): number {
    return this.fixedSize;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: BitArray): number {
    output.uint8Array.set(value.uint8Array, offset);
    return offset + this.fixedSize;
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): BitArray {
    this.assertValidLength(data.uint8Array, start, end);
    // Buffer.prototype.slice does not copy memory, Enforce Uint8Array usage https://github.com/nodejs/node/issues/28087
    return new BitArray(Uint8Array.prototype.slice.call(data.uint8Array, start, end), this.lengthBits);
  }

  tree_serializedSize(): number {
    return this.fixedSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const nodes = getNodesAtDepth(node, this.depth, 0, this.chunkCount);
    packedNodeRootsToBytes(output.dataView, offset, this.fixedSize, nodes);
    return offset + this.fixedSize;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    this.assertValidLength(data.uint8Array, start, end);
    return packedRootsBytesToNode(this.depth, data.dataView, start, end);
  }

  tree_getByteLen(): number {
    return this.fixedSize;
  }

  // Merkleization: inherited from BitArrayType

  // Proofs: inherited from BitArrayType

  // JSON: inherited from BitArrayType

  // Deserializer helpers

  private assertValidLength(data: Uint8Array, start: number, end: number): void {
    const size = end - start;
    if (end - start !== this.fixedSize) {
      throw Error(`Invalid BitVector size ${size} != ${this.fixedSize}`);
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
