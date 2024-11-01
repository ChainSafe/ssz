import {HashComputationLevel, LeafNode, Node, Tree, merkleizeBlocksBytes} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "./abstract";
import {BasicType} from "./basic";
import {ByteViews} from "./composite";
import {
  value_deserializeFromBytesArrayBasic,
  value_serializeToBytesArrayBasic,
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
  addLengthNode,
  setChunksNode,
} from "./arrayBasic";
import {cacheRoot, maxChunksToDepth, symbolCachedPermanentRoot, ValueWithCachedPermanentRoot} from "../util/merkleize";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {ArrayBasicType} from "../view/arrayBasic";
import {ListBasicTreeView} from "../view/listBasic";
import {ListBasicTreeViewDU} from "../viewDU/listBasic";
import {ArrayType} from "./array";
import {allocUnsafe} from "@chainsafe/as-sha256";

/* eslint-disable @typescript-eslint/member-ordering */

export interface ListBasicOpts {
  typeName?: string;
  cachePermanentRootStruct?: boolean;
}

/**
 * List: ordered variable-length homogeneous collection, limited to N values
 *
 * Array of Basic type:
 * - Basic types are max 32 bytes long so multiple values may be packed in the same node.
 * - Basic types are never returned in a view wrapper, but their value representation
 */
export class ListBasicType<ElementType extends BasicType<unknown>>
  extends ArrayType<ElementType, ListBasicTreeView<ElementType>, ListBasicTreeViewDU<ElementType>>
  implements ArrayBasicType<ElementType>
{
  readonly typeName: string;
  readonly itemsPerChunk: number;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = true;
  readonly isViewMutable = true;
  readonly mixInLengthBlockBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthBlockBytes.buffer,
    this.mixInLengthBlockBytes.byteOffset,
    this.mixInLengthBlockBytes.byteLength
  );
  protected readonly defaultLen = 0;

  constructor(readonly elementType: ElementType, readonly limit: number, opts?: ListBasicOpts) {
    super(elementType, opts?.cachePermanentRootStruct);

    if (!elementType.isBasic) throw Error("elementType must be basic");
    if (limit === 0) throw Error("List limit must be > 0");

    this.typeName = opts?.typeName ?? `List[${elementType.typeName}, ${limit}]`;
    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 32 / elementType.byteLength;
    this.maxChunkCount = Math.ceil((this.limit * elementType.byteLength) / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    // Depth includes the extra level for the length node
    this.depth = this.chunkDepth + 1;
    this.minSize = 0;
    this.maxSize = this.limit * elementType.maxSize;
  }

  static named<ElementType extends BasicType<unknown>>(
    elementType: ElementType,
    limit: number,
    opts: Require<ListBasicOpts, "typeName">
  ): ListBasicType<ElementType> {
    return new (namedClass(ListBasicType, opts.typeName))(elementType, limit, opts);
  }

  getView(tree: Tree): ListBasicTreeView<ElementType> {
    return new ListBasicTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ListBasicTreeViewDU<ElementType> {
    // cache type should be validated (if applicate) in the view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new ListBasicTreeViewDU(this, node, cache as any);
  }

  commitView(view: ListBasicTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(
    view: ListBasicTreeViewDU<ElementType>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
    return view.node;
  }

  cacheOfViewDU(view: ListBasicTreeViewDU<ElementType>): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(value: ValueOf<ElementType>[]): number {
    return value.length * this.elementType.byteLength;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayBasic(this.elementType, value.length, output, offset, value);
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayBasic(this.elementType, data, start, end, this);
  }

  tree_serializedSize(node: Node): number {
    return this.tree_getLength(node) * this.elementType.byteLength;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    return tree_serializeToBytesArrayBasic(this.elementType, length, this.chunkDepth, output, offset, chunksNode);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayBasic(this.elementType, this.chunkDepth, data, start, end, this);
  }

  // Helpers for TreeView

  tree_getLength(node: Node): number {
    return (node.right as LeafNode).getUint(4, 0);
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

    super.hashTreeRootInto(value, this.mixInLengthBlockBytes, 0);
    // mixInLength
    this.mixInLengthBuffer.writeUIntLE(value.length, 32, 6);
    // one for hashTreeRoot(value), one for length
    const chunkCount = 2;
    merkleizeBlocksBytes(this.mixInLengthBlockBytes, chunkCount, output, offset);

    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
  }

  protected getBlocksBytes(value: ValueOf<ElementType>[]): Uint8Array {
    const byteLen = this.value_serializedSize(value);
    const blockByteLen = Math.ceil(byteLen / 64) * 64;
    // reallocate this.blocksBuffer if needed
    if (byteLen > this.blocksBuffer.length) {
      // pad 1 chunk if maxChunkCount is not even
      this.blocksBuffer = new Uint8Array(blockByteLen);
    }
    const blockBytes = this.blocksBuffer.subarray(0, blockByteLen);
    const uint8Array = blockBytes.subarray(0, byteLen);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    value_serializeToBytesArrayBasic(this.elementType, value.length, {uint8Array, dataView}, 0, value);

    // all padding bytes must be zero, this is similar to set zeroHash(0)
    this.blocksBuffer.subarray(byteLen, blockByteLen).fill(0);
    return blockBytes;
  }

  // JSON: inherited from ArrayType
}
