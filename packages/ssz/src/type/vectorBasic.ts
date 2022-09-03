import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth, splitIntoRootChunks} from "../util/merkleize";
import {ValueOf, ByteViews} from "./abstract";
import {BasicType} from "./basic";
import {
  value_deserializeFromBytesArrayBasic,
  value_serializeToBytesArrayBasic,
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
} from "./arrayBasic";
import {ArrayBasicType, ArrayBasicTreeView} from "../view/arrayBasic";
import {ArrayBasicTreeViewDU} from "../viewDU/arrayBasic";
import {ArrayType} from "./array";
import {alloc} from "../util/byteArray";

/* eslint-disable @typescript-eslint/member-ordering */

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
  }

  getView(tree: Tree): ArrayBasicTreeView<ElementType> {
    return new ArrayBasicTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ArrayBasicTreeViewDU<ElementType> {
    // cache type should be validated (if applicate) in the view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ArrayBasicTreeViewDU(this, node, cache as any);
  }

  commitView(view: ArrayBasicTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(view: ArrayBasicTreeViewDU<ElementType>): Node {
    view.commit();
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

  tree_setChunksNode(rootNode: Node, chunksNode: Node): Node {
    return chunksNode;
  }

  // Merkleization

  protected getRoots(value: ValueOf<ElementType>[]): Uint8Array[] {
    const uint8Array = alloc(this.fixedSize);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    value_serializeToBytesArrayBasic(this.elementType, this.length, {uint8Array, dataView}, 0, value);
    return splitIntoRootChunks(uint8Array);
  }

  // JSON: inherited from ArrayType
}
