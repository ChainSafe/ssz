import {
  getNodesAtDepth,
  LeafNode,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {fromHexString, toHexString} from "../util/byteArray";
import {mixInLength, maxChunksToDepth} from "../util/merkleize";
import {CompositeType, ByteViews} from "./composite";
import {addLengthNode, getLengthFromRootNode, getChunksNodeFromRootNode} from "./arrayBasic";
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
export class BitListType extends CompositeType<BitArray, BitArrayTreeView, BitArrayTreeViewDU> {
  readonly typeName: string;
  // Immutable characteristics
  readonly depth: number;
  readonly chunkDepth: number;
  readonly fixedSize = null;
  readonly minSize = 1; // +1 for the extra padding bit
  readonly maxSize: number;
  protected readonly maxChunkCount: number;

  constructor(readonly limitBits: number) {
    super();

    this.typeName = `BitList[${limitBits}]`;
    // TODO Check that itemsPerChunk is an integer
    this.maxChunkCount = Math.ceil(this.limitBits / 8 / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    // Depth includes the extra level for the length node
    this.depth = 1 + this.chunkDepth;
    this.maxSize = Math.ceil(limitBits / 8) + 1; // +1 for the extra padding bit
  }

  get defaultValue(): BitArray {
    return BitArray.fromBitLen(0);
  }

  getView(tree: Tree): BitArrayTreeView {
    return new BitArrayTreeView(this, tree);
  }

  getViewDU(node: Node): BitArrayTreeViewDU {
    return new BitArrayTreeViewDU(this, node);
  }

  commitView(view: BitArrayTreeView): Node {
    return view.node;
  }

  commitViewDU(view: BitArrayTreeViewDU): Node {
    return view.commit();
  }

  cacheOfViewDU(view: BitArrayTreeViewDU): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(value: BitArray): number {
    return bitLenToSerializedLength(value.bitLen);
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: BitArray): number {
    output.uint8Array.set(value.uint8Array, offset);
    return applyPaddingBit(output.uint8Array, offset, value.bitLen);
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): BitArray {
    const {uint8Array, bitLen} = this.deserializeUint8ArrayBitListFromBytes(data.uint8Array, start, end);
    return new BitArray(uint8Array, bitLen);
  }

  tree_serializedSize(node: Node): number {
    return bitLenToSerializedLength(getLengthFromRootNode(node));
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const chunksNode = getChunksNodeFromRootNode(node);
    const bitLen = getLengthFromRootNode(node);

    const byteLen = Math.ceil(bitLen / 8);
    const chunkLen = Math.ceil(byteLen / 32);
    const nodes = getNodesAtDepth(chunksNode, this.chunkDepth, 0, chunkLen);
    packedNodeRootsToBytes(output.dataView, offset, byteLen, nodes);

    return applyPaddingBit(output.uint8Array, offset, bitLen);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const {uint8Array, bitLen} = this.deserializeUint8ArrayBitListFromBytes(data.uint8Array, start, end);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    const chunksNode = packedRootsBytesToNode(this.chunkDepth, dataView, 0, uint8Array.length);
    return addLengthNode(chunksNode, bitLen);
  }

  tree_getLength(node: Node): number {
    return (node.right as LeafNode).getUint(4, 0);
  }

  // Merkleization

  hashTreeRoot(value: BitArray): Uint8Array {
    return mixInLength(super.hashTreeRoot(value), value.bitLen);
  }

  protected getRoots(value: BitArray): Uint8Array {
    return value.uint8Array;
  }

  // JSON

  fromJson(json: unknown): BitArray {
    // TODO: Validate
    const uint8Array = fromHexString(json as string);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    return this.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  toJson(value: BitArray): unknown {
    return toHexString(this.serialize(value));
  }

  // Deserializer helpers

  private deserializeUint8ArrayBitListFromBytes(data: Uint8Array, start: number, end: number): BitArrayDeserialized {
    const {uint8Array, bitLen} = deserializeUint8ArrayBitListFromBytes(data, start, end);
    if (bitLen > this.limitBits) {
      throw Error(`bitLen ${bitLen} over limit ${this.limitBits}`);
    }
    return {uint8Array, bitLen};
  }
}

type BitArrayDeserialized = {uint8Array: Uint8Array; bitLen: number};

function deserializeUint8ArrayBitListFromBytes(data: Uint8Array, start: number, end: number): BitArrayDeserialized {
  if (end > data.length) {
    throw Error(`BitList attempting to read byte ${end} of data length ${data.length}`);
  }

  const lastByte = data[end - 1];
  const size = end - start;

  if (lastByte === 0) {
    throw new Error("Invalid deserialized bitlist, padding bit required");
  }

  if (lastByte === 1) {
    const uint8Array = data.slice(start, end - 1);
    const bitLen = (size - 1) * 8;
    return {uint8Array, bitLen};
  }

  // the last byte is > 1, so a padding bit will exist in the last byte and need to be removed
  const uint8Array = data.slice(start, end);
  // mask lastChunkByte
  const lastByteBitLength = lastByte.toString(2).length - 1;
  const bitLen = (size - 1) * 8 + lastByteBitLength;
  const mask = 0xff >> (8 - lastByteBitLength);
  uint8Array[size - 1] &= mask;
  return {uint8Array, bitLen};
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
