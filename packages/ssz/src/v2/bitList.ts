import {
  getNodesAtDepth,
  LeafNode,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {fromHexString} from "../util/byteArray";
import {CompositeType} from "./abstract";
import {addLengthNode, getLengthFromRootNode, getChunksNodeFromRootNode} from "./array";
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
export class BitListType extends CompositeType<BitArray> {
  // Immutable characteristics
  protected readonly maxChunkCount: number;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly fixedLen = null;
  readonly minLen = 1; // +1 for the extra padding bit
  readonly maxLen: number;

  constructor(readonly limitBits: number) {
    super();

    // TODO Check that itemsPerChunk is an integer
    this.maxChunkCount = Math.ceil(this.limitBits / 8 / 32);
    // Depth includes the extra level for the length node
    this.chunkDepth = Math.ceil(Math.log2(this.maxChunkCount));
    this.depth = 1 + this.chunkDepth;
    this.maxLen = Math.ceil(limitBits / 8) + 1; // +1 for the extra padding bit
  }

  get defaultValue(): BitArray {
    return new BitArray(new Uint8Array(0), 0);
  }

  getView(tree: Tree): BitArray {
    // TODO: Develop BitListTreeView
    const chunksNode = getChunksNodeFromRootNode(tree.rootNode);
    const bitLen = getLengthFromRootNode(tree.rootNode);

    const byteLen = Math.ceil(bitLen / 8);
    const chunkCount = Math.ceil(byteLen / 32);
    const nodes = getNodesAtDepth(chunksNode, this.chunkDepth, 0, chunkCount);
    const uint8Array = new Uint8Array(byteLen);
    packedNodeRootsToBytes(uint8Array, 0, byteLen, nodes);

    return new BitArray(uint8Array, bitLen);
  }

  // Serialization + deserialization

  struct_serializedSize(value: BitArray): number {
    return bitLenToSerializedLength(value.bitLen);
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): BitArray {
    const [uint8Array, bitLen] = deserializeUint8ArrayBitListFromBytes(data, start, end);
    return new BitArray(uint8Array, bitLen);
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: BitArray): number {
    output.set(value.uint8Array, offset);
    return applyPaddingBit(output, offset, value.bitLen);
  }

  tree_serializedSize(node: Node): number {
    return bitLenToSerializedLength(getLengthFromRootNode(node));
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const [uint8Array, bitLen] = deserializeUint8ArrayBitListFromBytes(data, start, end);
    const chunksNode = packedRootsBytesToNode(this.chunkDepth, uint8Array, 0, uint8Array.length);
    return addLengthNode(chunksNode, bitLen);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const chunksNode = getChunksNodeFromRootNode(node);
    const bitLen = getLengthFromRootNode(node);

    const byteLen = Math.ceil(bitLen / 8);
    const chunkCount = Math.ceil(byteLen / 32);
    const nodes = getNodesAtDepth(chunksNode, this.chunkDepth, 0, chunkCount);
    packedNodeRootsToBytes(output, offset, byteLen, nodes);

    return applyPaddingBit(output, offset, bitLen);
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
    return this.struct_deserializeFromBytes(bytes, 0, bytes.length);
  }
}

function deserializeUint8ArrayBitListFromBytes(data: Uint8Array, start: number, end: number): [Uint8Array, number] {
  const lastByte = data[end - 1];

  if (lastByte === 0) {
    throw new Error("Invalid deserialized bitlist, padding bit required");
  }

  if (lastByte === 1) {
    const uint8Array = data.slice(start, end - 1);
    const bitLen = (end - start - 1) * 8;
    return [uint8Array, bitLen];
  }

  // the last byte is > 1, so a padding bit will exist in the last byte and need to be removed
  const uint8Array = data.slice(start, end);
  // copy chunk into new memory
  const lastChunkByte = end - start - 1;
  // mask lastChunkByte
  const lastByteBitLength = lastByte.toString(2).length - 1;
  const bitLen = (end - start - 1) * 8 + lastByteBitLength;
  const mask = 0xff >> (8 - lastByteBitLength);
  uint8Array[lastChunkByte] &= mask;
  return [uint8Array, bitLen];
}

function bitLenToSerializedLength(bitLen: number): number {
  const bytes = Math.ceil(bitLen / 8);
  // +1 for the extra padding bit
  return bitLen % 8 === 0 ? bytes + 1 : bytes;
}

/**
 * Apply padding bit to a serialized BitList already written to `output` at `offset`
 * @returns New offset after (maybe) writting a padding bit.
 */
function applyPaddingBit(output: Uint8Array, offset: number, bitLen: number): number {
  const byteLen = Math.ceil(bitLen / 8);
  const newOffset = offset + byteLen;
  if (bitLen % 8 === 0) {
    output[newOffset] = 1;
    return newOffset + 1;
  } else {
    output[newOffset - 1] |= 1 << bitLen % 8;
    return newOffset;
  }
}
