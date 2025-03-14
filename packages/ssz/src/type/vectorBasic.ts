import {HashComputationLevel, Node, Tree } from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/merkleize.js";
import {namedClass} from "../util/named.js";
import {Require} from "../util/types.js";
import {ArrayBasicTreeView, ArrayBasicType } from "../view/arrayBasic.js";
import {ArrayBasicTreeViewDU} from "../viewDU/arrayBasic.js";
import {ByteViews, ValueOf } from "./abstract.js";
import {ArrayType} from "./array.js";
import {
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
  value_deserializeFromBytesArrayBasic,
  value_serializeToBytesArrayBasic,
} from "./arrayBasic.js";
import {BasicType} from "./basic.js";



export type VectorBasicOpts = {
  typeName?: string;
};

/**
 * Vector: Ordered fixed-length homogeneous collection, with N values
 *
 * Array of Basic type:
 * - Basic types are max 32 bytes long so multiple values may be packed in the same node.
 * - Basic types are never returned in a view wrapper, but their value representation
 */
export class VectorBasicType<ElementType extends BasicType<unknown>>
  extends ArrayType<ElementType, ArrayBasicTreeView<ElementType>, ArrayBasicTreeViewDU<ElementType>>
  implements ArrayBasicType<ElementType>
{
  readonly typeName: string;
  readonly itemsPerChunk: number;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedSize: number;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = false;
  readonly isViewMutable = true;
  protected readonly defaultLen: number;

  constructor(readonly elementType: ElementType, readonly length: number, opts?: VectorBasicOpts) {
    super(elementType);

    if (!elementType.isBasic) throw Error("elementType must be basic");
    if (length === 0) throw Error("Vector length must be > 0");

    this.typeName = opts?.typeName ?? `Vector[${elementType.typeName}, ${length}]`;
    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 32 / elementType.byteLength;
    this.maxChunkCount = Math.ceil((length * elementType.byteLength) / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = this.chunkDepth;
    this.fixedSize = length * elementType.byteLength;
    this.minSize = this.fixedSize;
    this.maxSize = this.fixedSize;
    this.defaultLen = length;
    this.blocksBuffer = new Uint8Array(Math.ceil(this.maxChunkCount / 2) * 64);
  }

  static named<ElementType extends BasicType<unknown>>(
    elementType: ElementType,
    limit: number,
    opts: Require<VectorBasicOpts, "typeName">
  ): VectorBasicType<ElementType> {
    return new (namedClass(VectorBasicType, opts.typeName))(elementType, limit, opts);
  }

  getView(tree: Tree): ArrayBasicTreeView<ElementType> {
    return new ArrayBasicTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ArrayBasicTreeViewDU<ElementType> {
    // cache type should be validated (if applicate) in the view
    
    return new ArrayBasicTreeViewDU(this, node, cache as any);
  }

  commitView(view: ArrayBasicTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(
    view: ArrayBasicTreeViewDU<ElementType>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
    return view.node;
  }

  cacheOfViewDU(view: ArrayBasicTreeViewDU<ElementType>): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(): number {
    return this.fixedSize;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayBasic(this.elementType, this.length, output, offset, value);
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayBasic(this.elementType, data, start, end, this);
  }

  tree_serializedSize(): number {
    return this.fixedSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    return tree_serializeToBytesArrayBasic(this.elementType, this.length, this.depth, output, offset, node);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayBasic(this.elementType, this.depth, data, start, end, this);
  }

  // Helpers for TreeView

  tree_getLength(): number {
    return this.length;
  }

  tree_setLength(): void {
    // Vector's length is immutable, ignore this call
  }

  tree_getChunksNode(node: Node): Node {
    return node;
  }

  tree_chunksNodeOffset(): number {
    return 0;
  }

  tree_setChunksNode(rootNode: Node, chunksNode: Node): Node {
    return chunksNode;
  }

  // Merkleization

  protected getBlocksBytes(value: ValueOf<ElementType>[]): Uint8Array {
    const uint8Array = this.blocksBuffer.subarray(0, this.fixedSize);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    value_serializeToBytesArrayBasic(this.elementType, this.length, {uint8Array, dataView}, 0, value);

    // remaining bytes from this.fixedSize to this.blocksBuffer.length must be zeroed
    return this.blocksBuffer;
  }

  // JSON: inherited from ArrayType
}
