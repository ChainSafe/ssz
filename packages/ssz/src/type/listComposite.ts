import {allocUnsafe} from "@chainsafe/as-sha256";
import {
  HashComputationLevel,
  Node,
  Tree,
  merkleizeBlockArray,
  merkleizeBlocksBytes,
} from "@chainsafe/persistent-merkle-tree";
import {
  ValueWithCachedPermanentRoot,
  cacheRoot,
  maxChunksToDepth,
  symbolCachedPermanentRoot,
} from "../util/merkleize.js";
import {namedClass} from "../util/named.js";
import {Require} from "../util/types.js";
import {ArrayCompositeType} from "../view/arrayComposite.js";
import {ListCompositeTreeView} from "../view/listComposite.js";
import {ListCompositeTreeViewDU} from "../viewDU/listComposite.js";
import {ByteViews, ValueOf} from "./abstract.js";
import {ArrayType} from "./array.js";
import {addLengthNode, getLengthFromRootNode, setChunksNode} from "./arrayBasic.js";
import {
  maxSizeArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
  tree_serializedSizeArrayComposite,
  value_deserializeFromBytesArrayComposite,
  value_serializeToBytesArrayComposite,
  value_serializedSizeArrayComposite,
} from "./arrayComposite.js";
import {CompositeType, CompositeView, CompositeViewDU} from "./composite.js";

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
    // biome-ignore lint/suspicious/noExplicitAny: We need to use `any` here explicitly
    ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>,
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
  readonly blockArray: Uint8Array[] = [];
  readonly mixInLengthBlockBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthBlockBytes.buffer,
    this.mixInLengthBlockBytes.byteOffset,
    this.mixInLengthBlockBytes.byteLength
  );
  protected readonly defaultLen = 0;

  constructor(
    readonly elementType: ElementType,
    readonly limit: number,
    opts?: ListCompositeOpts
  ) {
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

  // biome-ignore lint/suspicious/noExplicitAny: We need to use `any` here explicitly
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
    // biome-ignore lint/suspicious/noExplicitAny: We need to use `any` here explicitly
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

    // should not call super.hashTreeRootInto() here
    // use  merkleizeBlockArray() instead of merkleizeBlocksBytes() to avoid big memory allocation
    // reallocate this.blockArray if needed
    if (value.length > this.blockArray.length) {
      const blockDiff = value.length - this.blockArray.length;
      const newBlocksBytes = new Uint8Array(blockDiff * 64);
      for (let i = 0; i < blockDiff; i++) {
        this.blockArray.push(newBlocksBytes.subarray(i * 64, (i + 1) * 64));
      }
    }

    // populate this.blockArray
    for (let i = 0; i < value.length; i++) {
      // 2 values share a block
      const block = this.blockArray[Math.floor(i / 2)];
      const offset = i % 2 === 0 ? 0 : 32;
      this.elementType.hashTreeRootInto(value[i], block, offset);
    }

    const blockLimit = Math.ceil(value.length / 2);
    // zero out the last block if needed
    if (value.length % 2 === 1) {
      this.blockArray[blockLimit - 1].fill(0, 32);
    }

    // compute hashTreeRoot
    merkleizeBlockArray(this.blockArray, blockLimit, this.maxChunkCount, this.mixInLengthBlockBytes, 0);

    // mixInLength
    this.mixInLengthBuffer.writeUIntLE(value.length, 32, 6);
    // one for hashTreeRoot(value), one for length
    const chunkCount = 2;
    merkleizeBlocksBytes(this.mixInLengthBlockBytes, chunkCount, output, offset);

    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
  }

  protected getBlocksBytes(): Uint8Array {
    // we use merkleizeBlockArray for hashTreeRoot() computation
    throw Error("getBlockBytes should not be called for ListCompositeType");
  }

  // JSON: inherited from ArrayType
}
