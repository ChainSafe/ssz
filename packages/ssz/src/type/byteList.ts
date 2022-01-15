import {
  getNodesAtDepth,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {fromHexString, toHexString} from "../util/byteArray";
import {mixInLength, maxChunksToDepth} from "../util/merkleize";
import {addLengthNode, getChunksNodeFromRootNode, getLengthFromRootNode} from "./arrayBasic";
import {CompositeType, ByteViews} from "./composite";

export type ByteList = Uint8Array;

/* eslint-disable @typescript-eslint/member-ordering */

export class ByteListType extends CompositeType<ByteList, ByteList, ByteList> {
  readonly typeName: string;
  // Immutable characteristics
  readonly depth: number;
  readonly chunkDepth: number;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  protected readonly maxChunkCount: number;

  constructor(readonly limitBytes: number) {
    super();

    this.typeName = `ByteList[${limitBytes}]`;
    this.maxChunkCount = Math.ceil(this.limitBytes / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = 1 + this.chunkDepth;
    this.minSize = 0;
    this.maxSize = this.limitBytes;
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
    const uint8Array = new Uint8Array(this.value_serializedSize(view));
    const dataView = new DataView(uint8Array.buffer);
    this.value_serializeToBytes({uint8Array, dataView}, 0, view);
    return this.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  cacheOfViewDU(): unknown {
    return;
  }

  // Serialization + deserialization

  value_serializedSize(value: Uint8Array): number {
    return value.length;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ByteList): number {
    output.uint8Array.set(value, offset);
    return offset + value.length;
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ByteList {
    this.validateSize(end - start);
    return data.uint8Array.slice(start, end);
  }

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
    this.validateSize(end - start);
    const chunksNode = packedRootsBytesToNode(this.chunkDepth, data.dataView, start, end);
    return addLengthNode(chunksNode, end - start);
  }

  // Merkleization

  hashTreeRoot(value: ByteList): Uint8Array {
    return mixInLength(super.hashTreeRoot(value), value.length);
  }

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

  private validateSize(size: number): void {
    if (size > this.limitBytes) {
      throw Error(`ByteVector invalid size ${size} limit ${this.limitBytes}`);
    }
  }
}
