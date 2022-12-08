import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {mixInLength, maxChunksToDepth} from "../util/merkleize";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {ValueOf, ByteViews} from "./abstract";
import {CompositeType, CompositeView, CompositeViewDU} from "./composite";
import {addLengthNode, getLengthFromRootNode, setChunksNode} from "./arrayBasic";
import {
  value_deserializeFromBytesArrayComposite,
  value_serializedSizeArrayComposite,
  value_serializeToBytesArrayComposite,
  tree_serializedSizeArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
  value_getRootsArrayComposite,
  maxSizeArrayComposite,
} from "./arrayComposite";
import {ArrayCompositeType} from "../view/arrayComposite";
import {ListCompositeTreeView} from "../view/listComposite";
import {ListCompositeTreeViewDU} from "../viewDU/listComposite";
import {ArrayType} from "./array";

/* eslint-disable @typescript-eslint/member-ordering */

export interface ListCompositeOpts {
  typeName?: string;
}

/**
 * List: ordered variable-length homogeneous collection, limited to N values
 *
 * Array of Composite type:
 * - Composite types always take at least one chunk
 * - Composite types are always returned as views
 */
export class ListCompositeType<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>
  >
  extends ArrayType<ElementType, ListCompositeTreeView<ElementType>, ListCompositeTreeViewDU<ElementType>>
  implements ArrayCompositeType<ElementType>
{
  readonly typeName: string;
  readonly itemsPerChunk = 1;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = true;
  readonly isViewMutable = true;
  protected readonly defaultLen = 0;

  constructor(readonly elementType: ElementType, readonly limit: number, opts?: ListCompositeOpts) {
    super(elementType);

    if (elementType.isBasic) throw Error("elementType must not be basic");
    if (limit === 0) throw Error("List limit must be > 0");

    this.typeName = opts?.typeName ?? `List[${elementType.typeName}, ${limit}]`;
    this.maxChunkCount = this.limit;
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    // Depth includes the extra level for the length node
    this.depth = this.chunkDepth + 1;
    this.minSize = 0;
    this.maxSize = maxSizeArrayComposite(elementType, this.limit);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static named<ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>>(
    elementType: ElementType,
    limit: number,
    opts: Require<ListCompositeOpts, "typeName">
  ): ListCompositeType<ElementType> {
    return new (namedClass(ListCompositeType, opts.typeName))(elementType, limit, opts);
  }

  getView(tree: Tree): ListCompositeTreeView<ElementType> {
    return new ListCompositeTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ListCompositeTreeViewDU<ElementType> {
    // cache type should be validated (if applicate) in the view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ListCompositeTreeViewDU(this, node, cache as any);
  }

  commitView(view: ListCompositeTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(view: ListCompositeTreeViewDU<ElementType>): Node {
    view.commit();
    return view.node;
  }

  cacheOfViewDU(view: ListCompositeTreeViewDU<ElementType>): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(value: ValueOf<ElementType>[]): number {
    return value_serializedSizeArrayComposite(this.elementType, value.length, value);
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayComposite(this.elementType, value.length, output, offset, value);
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayComposite(this.elementType, data, start, end, this);
  }

  tree_serializedSize(node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    return tree_serializedSizeArrayComposite(this.elementType, length, this.chunkDepth, chunksNode);
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    return tree_serializeToBytesArrayComposite(this.elementType, length, this.chunkDepth, chunksNode, output, offset);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayComposite(this.elementType, this.chunkDepth, data, start, end, this);
  }

  // Helpers for TreeView

  tree_getLength(node: Node): number {
    return getLengthFromRootNode(node);
  }

  tree_setLength(tree: Tree, length: number): void {
    tree.rootNode = addLengthNode(tree.rootNode.left, length);
  }

  tree_getChunksNode(node: Node): Node {
    return node.left;
  }

  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node {
    return setChunksNode(rootNode, chunksNode, newLength);
  }

  // Merkleization

  hashTreeRoot(value: ValueOf<ElementType>[]): Uint8Array {
    return mixInLength(super.hashTreeRoot(value), value.length);
  }

  protected getRoots(value: ValueOf<ElementType>[]): Uint8Array[] {
    return value_getRootsArrayComposite(this.elementType, value.length, value);
  }

  // JSON: inherited from ArrayType
}
