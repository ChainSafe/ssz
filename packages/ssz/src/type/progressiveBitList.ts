import {allocUnsafe} from "@chainsafe/as-sha256";
import {
  Gindex,
  Node,
  Proof,
  Tree,
  concatGindices,
  merkleizeBlocksBytes,
  packedNodeRootsToBytes,
  packedRootsBytesToLeafNodes,
} from "@chainsafe/persistent-merkle-tree";
import {byteArrayEquals} from "../util/byteArray.ts";
import {namedClass} from "../util/named.ts";
import {Require} from "../util/types.ts";
import {BitArray} from "../value/bitArray.ts";
import {addLengthNode, getChunksNodeFromRootNode, getLengthFromRootNode} from "./arrayBasic.ts";
import {BitArrayType} from "./bitArray.ts";
import {deserializeUint8ArrayBitListFromBytes} from "./bitList.ts";
import {ByteViews} from "./composite.ts";
import {
  PROGRESSIVE_LIST_MAX_SIZE,
  getNodesAtProgressiveDepth,
  merkleizeProgressiveBytes,
  progressiveChunkGindex,
  progressiveSubtreeFillToContents,
} from "./progressive.ts";

export interface ProgressiveBitListOptions {
  typeName?: string;
}

const CHUNKS_GINDEX = BigInt(2);
const LENGTH_GINDEX = BigInt(3);

/**
 * ProgressiveBitList: variable-length collection of boolean values without a limit.
 * - Serialization is identical to BitList, including the padding bit.
 * - Merkleization uses EIP-7916 progressive merkleization.
 */
export class ProgressiveBitListType extends BitArrayType {
  readonly typeName: string;
  readonly depth = 1;
  readonly chunkDepth = 0;
  readonly fixedSize = null;
  readonly minSize = 1;
  readonly maxSize = PROGRESSIVE_LIST_MAX_SIZE;
  readonly maxChunkCount = Number.MAX_SAFE_INTEGER;
  readonly isList = true;
  readonly mixInLengthBlockBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthBlockBytes.buffer,
    this.mixInLengthBlockBytes.byteOffset,
    this.mixInLengthBlockBytes.byteLength
  );

  constructor(opts?: ProgressiveBitListOptions) {
    super();
    this.typeName = opts?.typeName ?? "ProgressiveBitList";
  }

  static named(opts: Require<ProgressiveBitListOptions, "typeName">): ProgressiveBitListType {
    return new (namedClass(ProgressiveBitListType, opts.typeName))(opts);
  }

  defaultValue(): BitArray {
    return BitArray.fromBitLen(0);
  }

  createFromProof(proof: Proof, root?: Uint8Array): ReturnType<BitArrayType["getView"]> {
    const rootNode = Tree.createFromProof(proof).rootNode;
    if (root !== undefined && !byteArrayEquals(rootNode.root, root)) {
      throw new Error("Proof does not match trusted root");
    }
    return this.getView(new Tree(rootNode));
  }

  value_serializedSize(value: BitArray): number {
    return bitLenToSerializedLength(value.bitLen);
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: BitArray): number {
    output.uint8Array.set(value.uint8Array, offset);
    return applyPaddingBit(output.uint8Array, offset, value.bitLen);
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number, reuseBytes?: boolean): BitArray {
    const {uint8Array, bitLen} = deserializeUint8ArrayBitListFromBytes(data.uint8Array, start, end, reuseBytes);
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
    const nodes = getNodesAtProgressiveDepth(chunksNode, chunkLen);
    packedNodeRootsToBytes(output.dataView, offset, byteLen, nodes);

    return applyPaddingBit(output.uint8Array, offset, bitLen);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const {uint8Array, bitLen} = deserializeUint8ArrayBitListFromBytes(data.uint8Array, start, end);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    const nodes = packedRootsBytesToLeafNodes(dataView, 0, uint8Array.length);
    return addLengthNode(progressiveSubtreeFillToContents(nodes), bitLen);
  }

  tree_getByteLen(node?: Node): number {
    if (!node) throw new Error("ProgressiveBitListType requires a node to get leaves");
    return Math.ceil(getLengthFromRootNode(node) / 8);
  }

  hashTreeRoot(value: BitArray): Uint8Array {
    const root = allocUnsafe(32);
    this.hashTreeRootInto(value, root, 0);
    return root;
  }

  hashTreeRootInto(value: BitArray, output: Uint8Array, offset: number): void {
    const byteLen = value.uint8Array.length;
    const chunkCount = Math.ceil(byteLen / 32);
    const blockBytes = this.getBlocksBytes(value);
    merkleizeProgressiveBytes(blockBytes, chunkCount, this.mixInLengthBlockBytes, 0);
    this.mixInLengthBuffer.writeUIntLE(value.bitLen, 32, 6);
    merkleizeBlocksBytes(this.mixInLengthBlockBytes, 2, output, offset);
  }

  tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[] {
    const byteLen = this.tree_getByteLen(rootNode);
    const chunkCount = Math.ceil(byteLen / 32);
    const gindices = new Array<Gindex>(chunkCount);
    for (let i = 0; i < chunkCount; i++) {
      gindices[i] = concatGindices([rootGindex, CHUNKS_GINDEX, progressiveChunkGindex(i)]);
    }
    gindices.push(concatGindices([rootGindex, LENGTH_GINDEX]));
    return gindices;
  }
}

function bitLenToSerializedLength(bitLen: number): number {
  const bytes = Math.ceil(bitLen / 8);
  return bitLen % 8 === 0 ? bytes + 1 : bytes;
}

function applyPaddingBit(output: Uint8Array, offset: number, bitLen: number): number {
  const byteLen = Math.ceil(bitLen / 8);
  const newOffset = offset + byteLen;
  if (bitLen % 8 === 0) {
    output[newOffset] = 1;
    return newOffset + 1;
  }

  output[newOffset - 1] |= 1 << (bitLen % 8);
  return newOffset;
}
