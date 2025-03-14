import {allocUnsafe} from "@chainsafe/as-sha256";
import {
  Node,
  getNodesAtDepth,
  merkleizeBlockArray,
  merkleizeBlocksBytes,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/merkleize.js";
import {namedClass} from "../util/named.js";
import {Require} from "../util/types.js";
import {addLengthNode, getChunksNodeFromRootNode, getLengthFromRootNode} from "./arrayBasic.js";
import {ByteArray, ByteArrayType } from "./byteArray.js";
import {ByteViews} from "./composite.js";


export interface ByteListOptions {
  typeName?: string;
}

/**
 * ByteList: Immutable alias of List[byte, N]
 * - Notation: `ByteList[N]`
 * - Value: `Uint8Array`
 * - View: `Uint8Array`
 * - ViewDU: `Uint8Array`
 *
 * ByteList is an immutable value which is represented by a Uint8Array for memory efficiency and performance.
 * Note: Consumers of this type MUST never mutate the `Uint8Array` representation of a ByteList.
 *
 * For a `ByteListType` with mutability, use `ListBasicType(byteType)`
 */
export class ByteListType extends ByteArrayType {
  readonly typeName: string;
  // Immutable characteristics
  readonly depth: number;
  readonly chunkDepth: number;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly maxChunkCount: number;
  readonly isList = true;
  readonly blockArray: Uint8Array[] = [];
  private blockBytesLen = 0;
  readonly mixInLengthBlockBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthBlockBytes.buffer,
    this.mixInLengthBlockBytes.byteOffset,
    this.mixInLengthBlockBytes.byteLength
  );

  constructor(readonly limitBytes: number, opts?: ByteListOptions) {
    super();

    if (limitBytes === 0) throw Error("List limit must be > 0");

    this.typeName = opts?.typeName ?? `ByteList[${limitBytes}]`;
    this.maxChunkCount = Math.ceil(this.limitBytes / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = 1 + this.chunkDepth;
    this.minSize = 0;
    this.maxSize = this.limitBytes;
  }

  static named(limitBits: number, opts: Require<ByteListOptions, "typeName">): ByteListType {
    return new (namedClass(ByteListType, opts.typeName))(limitBits, opts);
  }

  // Views: inherited from ByteArrayType

  // Serialization + deserialization

  value_serializedSize(value: Uint8Array): number {
    return value.length;
  }

  // value_* inherited from ByteArrayType

  tree_serializedSize(node: Node): number {
    return getLengthFromRootNode(node);
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const chunksNode = getChunksNodeFromRootNode(node);
    const byteLen = getLengthFromRootNode(node);
    const chunkLen = Math.ceil(byteLen / 32);
    const nodes = getNodesAtDepth(chunksNode, this.chunkDepth, 0, chunkLen);
    packedNodeRootsToBytes(output.dataView, offset, byteLen, nodes);
    return offset + byteLen;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    this.assertValidSize(end - start);
    const chunksNode = packedRootsBytesToNode(this.chunkDepth, data.dataView, start, end);
    return addLengthNode(chunksNode, end - start);
  }

  tree_getByteLen(node?: Node): number {
    if (!node) throw new Error("ByteListType requires a node to get leaves");
    return getLengthFromRootNode(node);
  }

  // Merkleization: inherited from ByteArrayType

  hashTreeRoot(value: ByteArray): Uint8Array {
    const root = allocUnsafe(32);
    this.hashTreeRootInto(value, root, 0);
    return root;
  }

  /**
   * Use  merkleizeBlockArray() instead of merkleizeBlocksBytes() to avoid big memory allocation
   */
  hashTreeRootInto(value: Uint8Array, output: Uint8Array, offset: number): void {
    // should not call super.hashTreeRoot() here
    // use  merkleizeBlockArray() instead of merkleizeBlocksBytes() to avoid big memory allocation
    // reallocate this.blockArray if needed
    if (value.length > this.blockBytesLen) {
      const newBlockCount = Math.ceil(value.length / 64);
      // this.blockBytesLen should be a multiple of 64
      const oldBlockCount = Math.ceil(this.blockBytesLen / 64);
      const blockDiff = newBlockCount - oldBlockCount;
      const newBlocksBytes = new Uint8Array(blockDiff * 64);
      for (let i = 0; i < blockDiff; i++) {
        this.blockArray.push(newBlocksBytes.subarray(i * 64, (i + 1) * 64));
        this.blockBytesLen += 64;
      }
    }

    // populate this.blockArray
    for (let i = 0; i < value.length; i += 64) {
      const block = this.blockArray[i / 64];
      // zero out the last block if it's over value.length
      if (i + 64 > value.length) {
        block.fill(0);
      }
      block.set(value.subarray(i, Math.min(i + 64, value.length)));
    }

    // compute hashTreeRoot
    const blockLimit = Math.ceil(value.length / 64);
    merkleizeBlockArray(this.blockArray, blockLimit, this.maxChunkCount, this.mixInLengthBlockBytes, 0);

    // mixInLength
    this.mixInLengthBuffer.writeUIntLE(value.length, 32, 6);
    // one for hashTreeRoot(value), one for length
    const chunkCount = 2;
    merkleizeBlocksBytes(this.mixInLengthBlockBytes, chunkCount, output, offset);
  }

  // Proofs: inherited from BitArrayType

  // JSON: inherited from ByteArrayType

  protected assertValidSize(size: number): void {
    if (size > this.limitBytes) {
      throw Error(`ByteList invalid size ${size} limit ${this.limitBytes}`);
    }
  }
}
