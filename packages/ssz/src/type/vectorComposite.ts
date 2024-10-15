import {Node, Tree, HashComputationLevel} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/merkleize.js";
import {Require} from "../util/types.js";
import {namedClass} from "../util/named.js";
import {ValueOf, ByteViews} from "./abstract.js";
import {CompositeType, CompositeView, CompositeViewDU} from "./composite.js";
import {
  value_deserializeFromBytesArrayComposite,
  value_serializedSizeArrayComposite,
  value_serializeToBytesArrayComposite,
  tree_serializedSizeArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
  maxSizeArrayComposite,
  minSizeArrayComposite,
  value_getChunkBytesArrayComposite,
} from "./arrayComposite.js";
import {ArrayCompositeType, ArrayCompositeTreeView} from "../view/arrayComposite.js";
import {ArrayCompositeTreeViewDU} from "../viewDU/arrayComposite.js";
import {ArrayType} from "./array.js";

/* eslint-disable @typescript-eslint/member-ordering */

export type VectorCompositeOpts = {
  typeName?: string;
};

/**
 * Vector: Ordered fixed-length homogeneous collection, with N values
 *
 * Array of Composite type:
 * - Composite types always take at least one chunk
 * - Composite types are always returned as views
 */
export class VectorCompositeType<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>
  >
  extends ArrayType<ElementType, ArrayCompositeTreeView<ElementType>, ArrayCompositeTreeViewDU<ElementType>>
  implements ArrayCompositeType<ElementType>
{
  readonly typeName: string;
  readonly itemsPerChunk = 1;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedSize: number | null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = false;
  readonly isViewMutable = true;
  protected readonly defaultLen: number;

  constructor(readonly elementType: ElementType, readonly length: number, opts?: VectorCompositeOpts) {
    super(elementType);

    if (elementType.isBasic) throw Error("elementType must not be basic");
    if (length === 0) throw Error("Vector length must be > 0");

    this.typeName = opts?.typeName ?? `Vector[${elementType.typeName}, ${length}]`;
    this.maxChunkCount = length;
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = this.chunkDepth;
    this.fixedSize = elementType.fixedSize === null ? null : length * elementType.fixedSize;
    this.minSize = minSizeArrayComposite(elementType, length);
    this.maxSize = maxSizeArrayComposite(elementType, length);
    this.defaultLen = length;
    this.chunkBytesBuffer =
      this.maxChunkCount % 2 === 1
        ? new Uint8Array(this.maxChunkCount * 32 + 32)
        : new Uint8Array(this.maxChunkCount * 32);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static named<ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>>(
    elementType: ElementType,
    limit: number,
    opts: Require<VectorCompositeOpts, "typeName">
  ): VectorCompositeType<ElementType> {
    return new (namedClass(VectorCompositeType, opts.typeName))(elementType, limit, opts);
  }

  getView(tree: Tree): ArrayCompositeTreeView<ElementType> {
    return new ArrayCompositeTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ArrayCompositeTreeViewDU<ElementType> {
    // cache type should be validated (if applicate) in the view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ArrayCompositeTreeViewDU(this, node, cache as any);
  }

  commitView(view: ArrayCompositeTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(
    view: ArrayCompositeTreeViewDU<ElementType>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
    return view.node;
  }

  cacheOfViewDU(view: ArrayCompositeTreeViewDU<ElementType>): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(value: ValueOf<ElementType>[]): number {
    return value_serializedSizeArrayComposite(this.elementType, this.length, value);
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayComposite(this.elementType, this.length, output, offset, value);
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayComposite(this.elementType, data, start, end, this);
  }

  tree_serializedSize(node: Node): number {
    return tree_serializedSizeArrayComposite(this.elementType, this.length, this.depth, node);
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    return tree_serializeToBytesArrayComposite(this.elementType, this.length, this.depth, node, output, offset);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayComposite(this.elementType, this.depth, data, start, end, this);
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

  protected getChunkBytes(value: ValueOf<ElementType>[]): Uint8Array {
    return value_getChunkBytesArrayComposite(this.elementType, this.length, value, this.chunkBytesBuffer);
  }

  // JSON: inherited from ArrayType
}
