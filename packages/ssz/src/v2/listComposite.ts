import {BranchNode, LeafNode, Node, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {LENGTH_GINDEX, maxChunksToDepth} from "../util/tree";
import {mixInLength} from "../util/merkleize";
import {CompositeType, CompositeView, CompositeViewDU, ValueOf} from "./abstract";
import {
  getLengthFromRootNode,
  value_deserializeFromBytesArrayComposite,
  value_serializedSizeArrayComposite,
  value_serializeToBytesArrayComposite,
  tree_serializedSizeArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
  value_getRootsArrayComposite,
  value_fromJsonArray,
} from "./array";
import {ListCompositeTreeView, ListCompositeTreeViewDU, ArrayCompositeType} from "./arrayTreeView";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class ListCompositeType<
    ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>
  >
  extends CompositeType<
    ValueOf<ElementType>[],
    ListCompositeTreeView<ElementType>,
    ListCompositeTreeViewDU<ElementType>
  >
  implements ArrayCompositeType<ElementType>
{
  // Immutable characteristics
  readonly itemsPerChunk = 1;
  readonly isBasic = false;
  readonly depth: number;
  readonly chunkDepth: number;
  readonly maxChunkCount: number;
  readonly fixedLen = null;
  readonly minLen = 0;
  readonly maxLen: number;

  constructor(readonly elementType: ElementType, readonly limit: number) {
    super();

    if (elementType.isBasic) {
      throw Error("elementType must not be basic");
    }

    // TODO Check that itemsPerChunk is an integer
    this.maxChunkCount = Math.ceil((this.limit * 1) / 32);
    // Depth includes the extra level for the length node
    this.chunkDepth = maxChunksToDepth(this.maxChunkCount);
    this.depth = this.chunkDepth + 1;
    this.maxLen = this.limit * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
  }

  getView(tree: Tree): ListCompositeTreeView<ElementType> {
    return new ListCompositeTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ListCompositeTreeViewDU<ElementType> {
    return new ListCompositeTreeViewDU(this, node, cache as any);
  }

  commitView(view: ListCompositeTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(view: ListCompositeTreeViewDU<ElementType>): Node {
    return view.commit();
  }

  getViewDUCache(view: ListCompositeTreeViewDU<ElementType>): unknown {
    return view.cache;
  }

  // Serialization + deserialization

  value_serializedSize(value: ValueOf<ElementType>[]): number {
    return value_serializedSizeArrayComposite(this.elementType, value, this);
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayComposite(this.elementType, data, start, end, this);
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayComposite(this.elementType, value.length, output, offset, value);
  }

  tree_serializedSize(node: Node): number {
    const length = getLengthFromRootNode(node);
    return tree_serializedSizeArrayComposite(this.elementType, length, this.chunkDepth, node);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayComposite(this.elementType, this.depth, data, start, end, this);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    return tree_serializeToBytesArrayComposite(this.elementType, length, this.chunkDepth, chunksNode, output, offset);
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

  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node {
    let lengthNode: LeafNode;
    if (newLength !== undefined) {
      lengthNode = new LeafNode(zeroNode(0));
      lengthNode.setUint(4, 0, newLength);
    } else {
      lengthNode = rootNode.right as LeafNode;
    }
    return new BranchNode(chunksNode, lengthNode);
  }

  // Merkleization

  hashTreeRoot(value: ValueOf<ElementType>[]): Uint8Array {
    return mixInLength(super.hashTreeRoot(value), value.length);
  }

  protected getRoots(value: ValueOf<ElementType>[]): Uint8Array {
    return value_getRootsArrayComposite(this.elementType, value.length, value);
  }

  // JSON

  fromJson(data: unknown): ValueOf<ElementType>[] {
    return value_fromJsonArray(this.elementType, data);
  }
}
