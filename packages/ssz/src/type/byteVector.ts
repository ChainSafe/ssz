import {
  getNodesAtDepth,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {fromHexString, toHexString} from "../util/byteArray";
import {maxChunksToDepth} from "../util/tree";
import {CompositeType} from "./composite";

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
    const bytes = this.serialize(view);
    return this.tree_deserializeFromBytes(bytes, 0, bytes.length);
  }

  cacheOfViewDU(): unknown {
    return;
  }

  // Serialization + deserialization

  value_serializedSize(): number {
    return this.fixedSize;
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): ByteVector {
    // TODO: Validate length
    return data.slice(start, end);
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: ByteVector): number {
    output.set(value, offset);
    return offset + this.fixedSize;
  }

  tree_serializedSize(): number {
    return this.fixedSize;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return packedRootsBytesToNode(this.chunkDepth, data, start, end);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const nodes = getNodesAtDepth(node, this.chunkDepth, 0, this.maxChunkCount);
    packedNodeRootsToBytes(output, offset, this.fixedSize, nodes);
    return offset + this.fixedSize;
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
}
