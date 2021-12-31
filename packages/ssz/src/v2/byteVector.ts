import {
  getNodesAtDepth,
  LeafNode,
  Node,
  packedNodeRootsToBytes,
  packedRootsBytesToNode,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {fromHexString} from "../util/byteArray";
import {CompositeType, TreeView} from "./abstract";

export type ByteVector = Uint8Array;

/**
 * TODO
 */
export class ByteVectorTreeView extends TreeView {
  // eslint-disable-next-line
  node = null as any;
  // eslint-disable-next-line
  type = null as any;
  // eslint-disable-next-line
  commit(): void {}
  // eslint-disable-next-line
  toMutable(): void {}
  protected serializedSize(): number {
    return 0;
  }
}

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
export class ByteVectorType extends CompositeType<ByteVector, ByteVectorTreeView> {
  // Immutable characteristics
  protected readonly maxChunkCount: number;
  readonly chunkCount: number;
  readonly depth: number;
  readonly fixedLen: number;
  readonly minLen: number;
  readonly maxLen: number;

  constructor(readonly lengthBytes: number) {
    super();

    this.chunkCount = Math.ceil(this.lengthBytes / 32);
    this.maxChunkCount = this.chunkCount;
    this.depth = Math.ceil(Math.log2(this.chunkCount));
    this.fixedLen = this.lengthBytes;
    this.minLen = this.fixedLen;
    this.maxLen = this.fixedLen;
  }

  get defaultValue(): ByteVector {
    return new Uint8Array(this.fixedLen);
  }

  getView(tree: Tree): ByteVectorTreeView {
    // TODO: Develop BitListTreeView
    const byteLen = this.fixedLen;
    const nodes = getNodesAtDepth(tree.rootNode, this.depth, 0, this.chunkCount);
    const uint8Array = new Uint8Array(byteLen);
    packedNodeRootsToBytes(uint8Array, 0, byteLen, nodes);

    // TODO
    // return uint8Array;
    return new ByteVectorTreeView();
  }

  // Serialization + deserialization

  struct_serializedSize(): number {
    return this.fixedLen;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ByteVector {
    return data.slice(start, end);
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: ByteVector): number {
    output.set(value, offset);
    return offset + this.fixedLen;
  }

  tree_serializedSize(): number {
    return this.fixedLen;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return packedRootsBytesToNode(this.depth, data, start, end);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const nodes = getNodesAtDepth(node, this.depth, 0, this.chunkCount);
    packedNodeRootsToBytes(output, offset, this.fixedLen, nodes);
    return offset + this.fixedLen;
  }

  tree_getLength(node: Node): number {
    return (node.right as LeafNode).getUint(4, 0);
  }

  // Merkleization

  protected getRoots(value: ByteVector): Uint8Array {
    return value;
  }

  // JSON

  fromJson(data: unknown): ByteVector {
    const value = fromHexString(data as string);
    if (value.length !== this.lengthBytes) {
      throw new Error(`JSON invalid ByteVector length ${value.length} expected ${this.lengthBytes}`);
    }
    return value;
  }
}
