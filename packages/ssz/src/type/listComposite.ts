import {HashComputationLevel, Node, Tree, merkleizeInto} from "@chainsafe/persistent-merkle-tree";
import {cacheRoot, maxChunksToDepth, symbolCachedPermanentRoot, ValueWithCachedPermanentRoot} from "../util/merkleize";
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
  maxSizeArrayComposite,
  value_getChunkBytesArrayComposite,
} from "./arrayComposite";
import {ArrayCompositeType} from "../view/arrayComposite";
import {ListCompositeTreeView} from "../view/listComposite";
import {ListCompositeTreeViewDU} from "../viewDU/listComposite";
import {ArrayType} from "./array";
import {allocUnsafe} from "@chainsafe/as-sha256";

/* eslint-disable @typescript-eslint/member-ordering */

export interface ListCompositeOpts {
  typeName?: string;
  cachePermanentRootStruct?: boolean;
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
  readonly mixInLengthChunkBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthChunkBytes.buffer,
    this.mixInLengthChunkBytes.byteOffset,
    this.mixInLengthChunkBytes.byteLength
  );
  protected readonly defaultLen = 0;

  constructor(readonly elementType: ElementType, readonly limit: number, opts?: ListCompositeOpts) {
    super(elementType, opts?.cachePermanentRootStruct);

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

  commitViewDU(
    view: ListCompositeTreeViewDU<ElementType>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
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

  tree_chunksNodeOffset(): number {
    // one more level for length, see setChunksNode below
    return 1;
  }

  tree_setChunksNode(
    rootNode: Node,
    chunksNode: Node,
    newLength: number | null,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    return setChunksNode(rootNode, chunksNode, newLength, hcOffset, hcByLevel);
  }

  // Merkleization

  hashTreeRoot(value: ValueOf<ElementType>[]): Uint8Array {
    // Return cached mutable root if any
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        return cachedRoot;
      }
    }

    const root = allocUnsafe(32);
    const safeCache = true;
    this.hashTreeRootInto(value, root, 0, safeCache);

    // hashTreeRootInto will cache the root if cachePermanentRootStruct is true

    return root;
  }

  hashTreeRootInto(value: ValueOf<ElementType>[], output: Uint8Array, offset: number, safeCache = false): void {
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        output.set(cachedRoot, offset);
        return;
      }
    }

    super.hashTreeRootInto(value, this.mixInLengthChunkBytes, 0);
    // mixInLength
    this.mixInLengthBuffer.writeUIntLE(value.length, 32, 6);
    // one for hashTreeRoot(value), one for length
    const chunkCount = 2;
    merkleizeInto(this.mixInLengthChunkBytes, chunkCount, output, offset);

    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
  }

  protected getChunkBytes(value: ValueOf<ElementType>[]): Uint8Array {
    const byteLen = value.length * 32;
    const chunkByteLen = this.chunkBytesBuffer.byteLength;
    if (byteLen > chunkByteLen) {
      this.chunkBytesBuffer = new Uint8Array(Math.ceil(byteLen / 64) * 64);
    }
    return value_getChunkBytesArrayComposite(this.elementType, value.length, value, this.chunkBytesBuffer);
  }

  // JSON: inherited from ArrayType
}
