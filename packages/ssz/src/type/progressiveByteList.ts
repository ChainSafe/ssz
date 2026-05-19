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
import {addLengthNode, getChunksNodeFromRootNode, getLengthFromRootNode} from "./arrayBasic.ts";
import {ByteArray, ByteArrayType} from "./byteArray.ts";
import {ByteViews} from "./composite.ts";
import {
  PROGRESSIVE_LIST_MAX_SIZE,
  getNodesAtProgressiveDepth,
  merkleizeProgressiveBytes,
  progressiveChunkGindex,
  progressiveSubtreeFillToContents,
} from "./progressive.ts";

export interface ProgressiveByteListOptions {
  typeName?: string;
}

const CHUNKS_GINDEX = BigInt(2);
const LENGTH_GINDEX = BigInt(3);

/**
 * ProgressiveByteList: Immutable alias of ProgressiveList[byte]
 * - Value: `Uint8Array`
 * - View: `Uint8Array`
 * - ViewDU: `Uint8Array`
 *
 * ProgressiveByteList is an immutable value represented by a Uint8Array for memory efficiency and performance.
 * Note: Consumers of this type MUST never mutate the `Uint8Array` representation of a ProgressiveByteList.
 */
export class ProgressiveByteListType extends ByteArrayType {
  readonly typeName: string;
  readonly depth = 1;
  readonly chunkDepth = 0;
  readonly fixedSize = null;
  readonly minSize = 0;
  readonly maxSize = PROGRESSIVE_LIST_MAX_SIZE;
  readonly maxChunkCount = Number.MAX_SAFE_INTEGER;
  readonly isList = true;
  readonly mixInLengthBlockBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthBlockBytes.buffer,
    this.mixInLengthBlockBytes.byteOffset,
    this.mixInLengthBlockBytes.byteLength
  );

  constructor(opts?: ProgressiveByteListOptions) {
    super();
    this.typeName = opts?.typeName ?? "ProgressiveByteList";
  }

  static named(opts: Require<ProgressiveByteListOptions, "typeName">): ProgressiveByteListType {
    return new (namedClass(ProgressiveByteListType, opts.typeName))(opts);
  }

  createFromProof(proof: Proof, root?: Uint8Array): ByteArray {
    const rootNode = Tree.createFromProof(proof).rootNode;
    if (root !== undefined && !byteArrayEquals(rootNode.root, root)) {
      throw new Error("Proof does not match trusted root");
    }
    return this.getView(new Tree(rootNode));
  }

  value_serializedSize(value: Uint8Array): number {
    return value.length;
  }

  tree_serializedSize(node: Node): number {
    return getLengthFromRootNode(node);
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const chunksNode = getChunksNodeFromRootNode(node);
    const byteLen = getLengthFromRootNode(node);
    const chunkLen = Math.ceil(byteLen / 32);
    const nodes = getNodesAtProgressiveDepth(chunksNode, chunkLen);
    packedNodeRootsToBytes(output.dataView, offset, byteLen, nodes);
    return offset + byteLen;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    this.assertValidSize(end - start);
    const nodes = packedRootsBytesToLeafNodes(data.dataView, start, end);
    return addLengthNode(progressiveSubtreeFillToContents(nodes), end - start);
  }

  tree_getByteLen(node?: Node): number {
    if (!node) throw new Error("ProgressiveByteListType requires a node to get leaves");
    return getLengthFromRootNode(node);
  }

  hashTreeRoot(value: ByteArray): Uint8Array {
    const root = allocUnsafe(32);
    this.hashTreeRootInto(value, root, 0);
    return root;
  }

  hashTreeRootInto(value: Uint8Array, output: Uint8Array, offset: number): void {
    const blockBytes = this.getBlocksBytes(value);
    const chunkCount = Math.ceil(value.length / 32);

    merkleizeProgressiveBytes(blockBytes, chunkCount, this.mixInLengthBlockBytes, 0);
    this.mixInLengthBuffer.writeUIntLE(value.length, 32, 6);
    merkleizeBlocksBytes(this.mixInLengthBlockBytes, 2, output, offset);
  }

  fromJson(json: unknown): ByteArray {
    if (!Array.isArray(json)) {
      return super.fromJson(json);
    }

    const value = Uint8Array.from(
      json.map((byte) => {
        const byteNumber =
          typeof byte === "bigint"
            ? Number(byte)
            : typeof byte === "number"
              ? byte
              : typeof byte === "string"
                ? Number(byte)
                : Number.NaN;
        if (
          !Number.isInteger(byteNumber) ||
          byteNumber < 0 ||
          byteNumber > 255 ||
          String(byteNumber) !== String(byte)
        ) {
          throw Error(`Invalid byte value ${byte}`);
        }
        return byteNumber;
      })
    );
    this.assertValidSize(value.length);
    return value;
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

  protected assertValidSize(size: number): void {
    if (size > PROGRESSIVE_LIST_MAX_SIZE) {
      throw Error(`ProgressiveByteList invalid size ${size} max ${PROGRESSIVE_LIST_MAX_SIZE}`);
    }
  }
}
