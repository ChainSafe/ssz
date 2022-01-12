import {
  getNodesAtDepth,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {fromHexString, toHexString} from "../util/byteArray";
import {maxChunksToDepth} from "../util/tree";
import {addLengthNode, getChunksNodeFromRootNode, getLengthFromRootNode} from "./arrayBasic";
import {CompositeType} from "./composite";

export type ByteList = Uint8Array;

/* eslint-disable @typescript-eslint/member-ordering */

export class ByteListType extends CompositeType<ByteList, ByteList, ByteList> {
  readonly typeName: string;
  // Immutable characteristics
  readonly depth: number;
  readonly chunkDepth: number;
  readonly fixedLen = null;
  readonly minLen: number;
  readonly maxLen: number;
  protected readonly maxChunkCount: number;

  constructor(readonly limitBytes: number) {
    super();

    this.typeName = `ByteList[${limitBytes}]`;
    this.maxChunkCount = Math.ceil(this.limitBytes / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = 1 + this.chunkDepth;
    this.minLen = 0;
    this.maxLen = this.limitBytes;
  }

  get defaultValue(): ByteList {
    return new Uint8Array(0);
  }

  getView(tree: Tree): ByteList {
    return this.getViewDU(tree.rootNode);
  }

  getViewDU(node: Node): ByteList {
    return this.tree_toValue(node);
  }

  commitView(view: Uint8Array): Node {
    return this.commitViewDU(view);
  }

  commitViewDU(view: Uint8Array): Node {
    const bytes = this.serialize(view);
    return this.tree_deserializeFromBytes(bytes, 0, bytes.length);
  }

  cacheOfViewDU(): unknown {
    return;
  }

  // Serialization + deserialization

  value_serializedSize(value: Uint8Array): number {
    return value.length;
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): ByteList {
    // TODO: Validate length
    return data.slice(start, end);
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: ByteList): number {
    output.set(value, offset);
    return offset + value.length;
  }

  tree_serializedSize(node: Node): number {
    return getLengthFromRootNode(node);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const chunksNode = packedRootsBytesToNode(this.chunkDepth, data, start, end);
    return addLengthNode(chunksNode, end - start);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const chunksNode = getChunksNodeFromRootNode(node);
    const byteLen = getLengthFromRootNode(node);
    const chunkLen = Math.ceil(byteLen / 32);
    const nodes = getNodesAtDepth(chunksNode, this.chunkDepth, 0, chunkLen);
    packedNodeRootsToBytes(output, offset, byteLen, nodes);
    return offset + byteLen;
  }

  // Merkleization

  protected getRoots(value: ByteList): Uint8Array {
    return value;
  }

  // JSON

  fromJson(json: unknown): ByteList {
    const value = fromHexString(json as string);
    if (value.length > this.limitBytes) {
      throw new Error(`JSON invalid ByteList length ${value.length} gt ${this.limitBytes}`);
    }
    return value;
  }

  toJson(value: ByteList): unknown {
    return toHexString(value);
  }
}
