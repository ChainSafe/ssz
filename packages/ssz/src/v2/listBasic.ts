import {LeafNode, Node, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, ValueOf} from "./abstract";
import {ListBasicTreeView, ArrayBasicType} from "./arrayTreeView";
import {
  getLengthFromRootNode,
  struct_deserializeFromBytesArrayBasic,
  struct_serializeToBytesArrayBasic,
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
} from "./array";
import {LENGTH_GINDEX} from "../types/composite/list";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class ListBasicType<ElementType extends BasicType<any>>
  extends CompositeType<ValueOf<ElementType>[]>
  implements ArrayBasicType<ElementType>
{
  // Immutable characteristics
  readonly itemsPerChunk: number;
  readonly isBasic = false;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedLen = null;
  readonly minLen = 0;
  readonly maxLen: number;

  constructor(readonly elementType: ElementType, readonly limit: number) {
    super();

    if (!elementType.isBasic) {
      throw Error("ListBasicType can only have a basic type as elementType");
    }

    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 32 / elementType.byteLength;
    this.maxChunkCount = Math.ceil((this.limit * elementType.byteLength) / 32);
    // Depth includes the extra level for the length node
    this.chunkDepth = Math.ceil(Math.log2(this.maxChunkCount));
    this.depth = this.chunkDepth + 1;
    this.maxLen = this.limit * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
  }

  getView(tree: Tree, inMutableMode?: boolean): ListBasicTreeView<ElementType> {
    return new ListBasicTreeView(this, tree, inMutableMode);
  }

  // Serialization + deserialization

  struct_serializedSize(value: ValueOf<ElementType>[]): number {
    return value.length * this.elementType.byteLength;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return struct_deserializeFromBytesArrayBasic(this.elementType, data, start, end, this);
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return struct_serializeToBytesArrayBasic(this.elementType, value.length, output, offset, value);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayBasic(this.elementType, this.chunkDepth, data, start, end, this);
  }

  tree_serializedSize(node: Node): number {
    return getLengthFromRootNode(node) * this.elementType.byteLength;
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    return tree_serializeToBytesArrayBasic(this.elementType, length, this.chunkDepth, output, offset, chunksNode);
  }

  // Helpers for TreeView

  tree_getLength(node: Node): number {
    return (node.right as LeafNode).getUint(4, 0);
  }

  tree_setLength(tree: Tree, length: number): void {
    // TODO: Add LeafNode.fromUint()
    const lengthNode = new LeafNode(zeroNode(0));
    lengthNode.setUint(4, 0, length);
    tree.setNode(LENGTH_GINDEX, lengthNode);
  }

  tree_getChunksNode(node: Node): Node {
    return node.left;
  }
}
