import {allocUnsafe} from "@chainsafe/as-sha256";
import {
  getNodesAtDepth,
  merkleizeInto,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/merkleize";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {ByteViews} from "./composite";
import {addLengthNode, getLengthFromRootNode, getChunksNodeFromRootNode} from "./arrayBasic";
import {BitArray} from "../value/bitArray";
import {BitArrayType} from "./bitArray";

/* eslint-disable @typescript-eslint/member-ordering */

export interface BitListOptions {
  typeName?: string;
}

/**
 * BitList: ordered variable-length collection of boolean values, limited to N bits
 * - Notation `Bitlist[N]`
 * - Value: `BitArray`, @see BitArray for a justification of its memory efficiency and performance
 * - View: `BitArrayTreeView`
 * - ViewDU: `BitArrayTreeViewDU`
 */
export class BitListType extends BitArrayType {
  readonly typeName: string;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly fixedSize = null;
  readonly minSize = 1; // +1 for the extra padding bit
  readonly maxSize: number;
  readonly maxChunkCount: number;
  readonly isList = true;
  readonly mixInLengthChunkBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthChunkBytes.buffer,
    this.mixInLengthChunkBytes.byteOffset,
    this.mixInLengthChunkBytes.byteLength
  );

  constructor(readonly limitBits: number, opts?: BitListOptions) {
    super();

    if (limitBits === 0) throw Error("List limit must be > 0");

    this.typeName = opts?.typeName ?? `BitList[${limitBits}]`;
    // TODO Check that itemsPerChunk is an integer
    this.maxChunkCount = Math.ceil(this.limitBits / 8 / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    // Depth includes the extra level for the length node
    this.depth = 1 + this.chunkDepth;
    this.maxSize = Math.ceil(limitBits / 8) + 1; // +1 for the extra padding bit
  }

  static named(limitBits: number, opts: Require<BitListOptions, "typeName">): BitListType {
    return new (namedClass(BitListType, opts.typeName))(limitBits, opts);
  }

  defaultValue(): BitArray {
    return BitArray.fromBitLen(0);
  }

  // Views: inherited from BitArrayType

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

  tree_getByteLen(node?: Node): number {
    if (!node) throw new Error("BitListType requires a node to get leaves");
    return Math.ceil(getLengthFromRootNode(node) / 8);
  }

  // Merkleization: inherited from BitArrayType

  hashTreeRoot(value: BitArray): Uint8Array {
    const root = allocUnsafe(32);
    this.hashTreeRootInto(value, root, 0);
    return root;
  }

  hashTreeRootInto(value: BitArray, output: Uint8Array, offset: number): void {
    super.hashTreeRootInto(value, this.mixInLengthChunkBytes, 0);
    // mixInLength
    this.mixInLengthBuffer.writeUIntLE(value.bitLen, 32, 6);
    // one for hashTreeRoot(value), one for length
    const chunkCount = 2;
    merkleizeInto(this.mixInLengthChunkBytes, chunkCount, output, offset);
  }

  // Proofs: inherited from BitArrayType

  // JSON: inherited from BitArrayType

  // Deserializer helpers

  private deserializeUint8ArrayBitListFromBytes(data: Uint8Array, start: number, end: number): BitArrayDeserialized {
    const {uint8Array, bitLen} = deserializeUint8ArrayBitListFromBytes(data, start, end);
    if (bitLen > this.limitBits) {
      throw Error(`bitLen over limit ${bitLen} > ${this.limitBits}`);
    }
    return {uint8Array, bitLen};
  }
}

type BitArrayDeserialized = {uint8Array: Uint8Array; bitLen: number};

export function deserializeUint8ArrayBitListFromBytes(
  data: Uint8Array,
  start: number,
  end: number
): BitArrayDeserialized {
  if (end > data.length) {
    throw Error(`BitList attempting to read byte ${end} of data length ${data.length}`);
  }

  const lastByte = data[end - 1];
  const size = end - start;

  if (lastByte === 0) {
    throw new Error("Invalid deserialized bitlist, padding bit required");
  }

  if (lastByte === 1) {
    // Buffer.prototype.slice does not copy memory, Enforce Uint8Array usage https://github.com/nodejs/node/issues/28087
    const uint8Array = Uint8Array.prototype.slice.call(data, start, end - 1);
    const bitLen = (size - 1) * 8;
    return {uint8Array, bitLen};
  }

  // the last byte is > 1, so a padding bit will exist in the last byte and need to be removed
  // Buffer.prototype.slice does not copy memory, Enforce Uint8Array usage https://github.com/nodejs/node/issues/28087
  const uint8Array = Uint8Array.prototype.slice.call(data, start, end);
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
