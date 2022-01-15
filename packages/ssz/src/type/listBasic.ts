import {LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, ValueOf} from "./abstract";
import {CompositeType, ByteViews} from "./composite";
import {
  value_deserializeFromBytesArrayBasic,
  value_fromJsonArray,
  value_toJsonArray,
  value_serializeToBytesArrayBasic,
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
  addLengthNode,
  setChunksNode,
} from "./arrayBasic";
import {mixInLength, maxChunksToDepth} from "../util/merkleize";
import {ArrayBasicType} from "../view/arrayBasic";
import {ListBasicTreeView} from "../view/listBasic";
import {ListBasicTreeViewDU} from "../viewDU/listBasic";

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class ListBasicType<ElementType extends BasicType<unknown>>
  extends CompositeType<ValueOf<ElementType>[], ListBasicTreeView<ElementType>, ListBasicTreeViewDU<ElementType>>
  implements ArrayBasicType<ElementType>
{
  readonly typeName: string;
  // Immutable characteristics
  readonly itemsPerChunk: number;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedSize = null;
  readonly minSize = 0;
  readonly maxSize: number;

  constructor(readonly elementType: ElementType, readonly limit: number) {
    super();

    if (!elementType.isBasic) {
      throw Error("elementType must be basic");
    }

    this.typeName = `List[${elementType.typeName}, ${limit}]`;
    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 32 / elementType.byteLength;
    this.maxChunkCount = Math.ceil((this.limit * elementType.byteLength) / 32);
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    // Depth includes the extra level for the length node
    this.depth = this.chunkDepth + 1;
    this.maxSize = this.limit * elementType.maxSize;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
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

  commitViewDU(view: ListBasicTreeViewDU<ElementType>): Node {
    return view.commit();
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

  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node {
    return setChunksNode(rootNode, chunksNode, newLength);
  }

  // Merkleization

  hashTreeRoot(value: ValueOf<ElementType>[]): Uint8Array {
    return mixInLength(super.hashTreeRoot(value), value.length);
  }

  protected getRoots(value: ValueOf<ElementType>[]): Uint8Array {
    const uint8Array = new Uint8Array(this.value_serializedSize(value));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    value_serializeToBytesArrayBasic(this.elementType, value.length, {uint8Array, dataView}, 0, value);
    return uint8Array;
  }

  // JSON

  fromJson(json: unknown): ValueOf<ElementType>[] {
    return value_fromJsonArray(this.elementType, json);
  }

  toJson(value: ValueOf<ElementType>[]): unknown {
    return value_toJsonArray(this.elementType, value);
  }
}
