import {getNodesAtDepth, Node, packedNodeRootsToBytes, packedRootsBytesToNode} from "@chainsafe/persistent-merkle-tree";
import {mixInLength, maxChunksToDepth} from "../util/merkleize";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {addLengthNode, getChunksNodeFromRootNode, getLengthFromRootNode} from "./arrayBasic";
import {ByteViews} from "./composite";
import {ByteArrayType, ByteArray} from "./byteArray";

/* eslint-disable @typescript-eslint/member-ordering */

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
    return mixInLength(super.hashTreeRoot(value), value.length);
  }

  // Proofs: inherited from BitArrayType

  // JSON: inherited from ByteArrayType

  protected assertValidSize(size: number): void {
    if (size > this.limitBytes) {
      throw Error(`ByteList invalid size ${size} limit ${this.limitBytes}`);
    }
  }
}
