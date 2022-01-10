import {
  getNodesAtDepth,
  LeafNode,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../../util/tree";
import {fromHexString} from "../../util/byteArray";
import {CompositeType} from "../abstract";
import {BitArray} from "../value/bitArray";
import {BitArrayTreeView} from "../view/bitArray";
import {BitArrayTreeViewDU} from "../viewDU/bitArray";

/* eslint-disable @typescript-eslint/member-ordering */

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
export class BitVectorType extends CompositeType<BitArray, BitArrayTreeView, BitArrayTreeViewDU> {
  // Immutable characteristics
  readonly chunkCount: number;
  readonly depth: number;
  readonly fixedLen: number;
  readonly minLen: number;
  readonly maxLen: number;
  protected readonly maxChunkCount: number;
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
    return new BitArrayTreeView(this, tree);
  }

  getViewDU(node: Node): BitArrayTreeViewDU {
    return new BitArrayTreeViewDU(this, node);
  }

  commitView(view: BitArray): Node {
    return this.commitViewDU(view);
  }

  commitViewDU(view: BitArray): Node {
    const bytes = this.serialize(view);
    return this.tree_deserializeFromBytes(bytes, 0, bytes.length);
  }

  cacheOfViewDU(): unknown {
    return;
  }

  // Serialization + deserialization

  value_serializedSize(): number {
    return this.fixedLen;
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): BitArray {
    this.assertValidLength(data, start, end);
    return new BitArray(data.slice(start, end), this.lengthBits);
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: BitArray): number {
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
    return this.value_deserializeFromBytes(bytes, 0, this.fixedLen);
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
