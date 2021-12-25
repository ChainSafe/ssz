import {LeafNode, Node, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {LENGTH_GINDEX} from "..";
import {CompositeType, ValueOf} from "./abstract";
import {
  getLengthFromRootNode,
  struct_deserializeFromBytesArrayComposite,
  struct_serializedSizeArrayComposite,
  struct_serializeToBytesArrayComposite,
  tree_serializedSizeArrayComposite,
  tree_deserializeFromBytesArrayComposite,
  tree_serializeToBytesArrayComposite,
  struct_getRootsArrayComposite,
  struct_fromJsonArray,
} from "./array";
import {ListCompositeTreeView, ArrayCompositeType} from "./arrayTreeView";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class ListCompositeType<ElementType extends CompositeType<any>>
  extends CompositeType<ValueOf<ElementType>[]>
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
    this.chunkDepth = Math.ceil(Math.log2(this.maxChunkCount));
    this.depth = this.chunkDepth + 1;
    this.maxLen = this.limit * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
  }

  getView(tree: Tree, inMutableMode?: boolean): ListCompositeTreeView<ElementType> {
    return new ListCompositeTreeView(this, tree, inMutableMode);
  }

  // Serialization + deserialization

  struct_serializedSize(value: ValueOf<ElementType>[]): number {
    return struct_serializedSizeArrayComposite(this.elementType, value, this);
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return struct_deserializeFromBytesArrayComposite(this.elementType, data, start, end, this);
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return struct_serializeToBytesArrayComposite(this.elementType, value.length, output, offset, value);
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

  // Merkleization

  protected getRoots(value: ValueOf<ElementType>[]): Uint8Array {
    return struct_getRootsArrayComposite(this.elementType, value.length, value);
  }

  // JSON

  fromJson(data: unknown): ValueOf<ElementType>[] {
    return struct_fromJsonArray(this.elementType, data);
  }
}
