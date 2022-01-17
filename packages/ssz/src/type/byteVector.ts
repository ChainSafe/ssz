import {
  getNodesAtDepth,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {fromHexString, toHexString} from "../util/byteArray";
import {maxChunksToDepth} from "../util/merkleize";
import {CompositeType, ByteViews} from "./composite";

export type ByteVector = Uint8Array;

/* eslint-disable @typescript-eslint/member-ordering */

export class ByteVectorType extends CompositeType<ByteVector, ByteVector, ByteVector> {
  readonly typeName: string;
  // Immutable characteristics
  readonly depth: number;
  readonly chunkDepth: number;
  readonly fixedSize: number;
  readonly minSize: number;
  readonly maxSize: number;
  protected readonly maxChunkCount: number;

  constructor(readonly lengthBytes: number) {
    super();

    this.typeName = `ByteVector[${lengthBytes}]`;
    this.maxChunkCount = Math.ceil(this.lengthBytes / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = this.chunkDepth;
    this.fixedSize = this.lengthBytes;
    this.minSize = this.fixedSize;
    this.maxSize = this.fixedSize;
  }

  get defaultValue(): ByteVector {
    return new Uint8Array(this.fixedSize);
  }

  getView(tree: Tree): ByteVector {
    return this.getViewDU(tree.rootNode);
  }

  getViewDU(node: Node): ByteVector {
    return this.tree_toValue(node);
  }

  commitView(view: Uint8Array): Node {
    return this.commitViewDU(view);
  }

  commitViewDU(view: Uint8Array): Node {
    const uint8Array = new Uint8Array(this.fixedSize);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, view);
    return this.tree_deserializeFromBytes({uint8Array, dataView}, 0, this.fixedSize);
  }

  cacheOfViewDU(): unknown {
    return;
  }

  // Serialization + deserialization

  value_serializedSize(): number {
    return this.fixedSize;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ByteVector): number {
    output.uint8Array.set(value, offset);
    return offset + this.fixedSize;
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ByteVector {
    this.validateSize(end - start);
    return data.uint8Array.slice(start, end);
  }

  tree_serializedSize(): number {
    return this.fixedSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const nodes = getNodesAtDepth(node, this.chunkDepth, 0, this.maxChunkCount);
    packedNodeRootsToBytes(output.dataView, offset, this.fixedSize, nodes);
    return offset + this.fixedSize;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    this.validateSize(end - start);
    return packedRootsBytesToNode(this.chunkDepth, data.dataView, start, end);
  }

  // Merkleization

  protected getRoots(value: ByteVector): Uint8Array {
    return value;
  }

  // JSON

  fromJson(json: unknown): ByteVector {
    const value = fromHexString(json as string);
    if (value.length !== this.lengthBytes) {
      throw new Error(`JSON invalid ByteVector length ${value.length} expected ${this.lengthBytes}`);
    }
    return value;
  }

  toJson(value: ByteVector): unknown {
    return toHexString(value);
  }

  private validateSize(size: number): void {
    if (size !== this.lengthBytes) {
      throw Error(`ByteVector invalid size ${size} expected ${this.lengthBytes}`);
    }
  }
}
