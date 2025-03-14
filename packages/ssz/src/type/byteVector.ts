import {getNodesAtDepth, Node, packedNodeRootsToBytes, packedRootsBytesToNode} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/merkleize.js";
import {Require} from "../util/types.js";
import {namedClass} from "../util/named.js";
import {ByteViews} from "./composite.js";
import {ByteArrayType} from "./byteArray.js";

export type ByteVector = Uint8Array;

export interface ByteVectorOptions {
  typeName?: string;
}



/**
 * ByteVector: Immutable alias of Vector[byte, N]
 * - Notation: `ByteVector[N]`
 * - Value: `Uint8Array`
 * - View: `Uint8Array`
 * - ViewDU: `Uint8Array`
 *
 * ByteVector is an immutable value which is represented by a Uint8Array for memory efficiency and performance.
 * Note: Consumers of this type MUST never mutate the `Uint8Array` representation of a ByteVector.
 *
 * For a `ByteVectorType` with mutability, use `VectorBasicType(byteType)`
 */
export class ByteVectorType extends ByteArrayType {
  readonly typeName: string;
  // Immutable characteristics
  readonly depth: number;
  readonly chunkDepth: number;
  readonly fixedSize: number;
  readonly minSize: number;
  readonly maxSize: number;
  readonly maxChunkCount: number;
  readonly isList = false;

  constructor(readonly lengthBytes: number, opts?: ByteVectorOptions) {
    super();

    if (lengthBytes === 0) throw Error("Vector length must be > 0");

    this.typeName = opts?.typeName ?? `ByteVector[${lengthBytes}]`;
    this.maxChunkCount = Math.ceil(this.lengthBytes / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = this.chunkDepth;
    this.fixedSize = this.lengthBytes;
    this.minSize = this.fixedSize;
    this.maxSize = this.fixedSize;
  }

  static named(limitBits: number, opts: Require<ByteVectorOptions, "typeName">): ByteVectorType {
    return new (namedClass(ByteVectorType, opts.typeName))(limitBits, opts);
  }

  // Views: inherited from ByteArrayType

  // Serialization + deserialization

  value_serializedSize(): number {
    return this.fixedSize;
  }

  // value_* inherited from ByteArrayType

  tree_serializedSize(): number {
    return this.fixedSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const nodes = getNodesAtDepth(node, this.chunkDepth, 0, this.maxChunkCount);
    packedNodeRootsToBytes(output.dataView, offset, this.fixedSize, nodes);
    return offset + this.fixedSize;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    this.assertValidSize(end - start);
    return packedRootsBytesToNode(this.chunkDepth, data.dataView, start, end);
  }

  tree_getByteLen(): number {
    return this.lengthBytes;
  }

  // Merkleization: inherited from ByteArrayType

  // Proofs: inherited from BitArrayType

  // JSON: inherited from ByteArrayType

  protected assertValidSize(size: number): void {
    if (size !== this.lengthBytes) {
      throw Error(`ByteVector invalid size ${size} expected ${this.lengthBytes}`);
    }
  }
}
