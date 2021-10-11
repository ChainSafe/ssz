import {LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, ValueOf} from "./abstract";
import {ArrayBasicTreeView} from "./arrayTreeView";
import {
  getLengthFromRootNode,
  struct_deserializeFromBytesArrayBasic,
  struct_serializeToBytesArrayBasic,
  tree_deserializeFromBytesArrayBasic,
  tree_serializeToBytesArrayBasic,
} from "./array";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

/**
 * Basic types are max 32 bytes long so always fit in a single tree node.
 * Basic types are never returned in a wrapper, but their native representation
 */
export class ListBasicType<ElementType extends BasicType<any>> extends CompositeType<ValueOf<ElementType>[]> {
  // Immutable characteristics
  readonly itemsPerChunk: number;
  readonly isBasic = false;
  readonly depth: number;
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
    this.depth = 1 + Math.ceil(Math.log2(this.maxChunkCount));
    this.maxLen = this.limit * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
  }

  getView(tree: Tree, inMutableMode?: boolean): ArrayBasicTreeView<ElementType> {
    return new ArrayBasicTreeView(this, tree, inMutableMode);
  }

  // Serialization + deserialization

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOf<ElementType>[] {
    return struct_deserializeFromBytesArrayBasic(this.elementType, data, start, end, this);
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: ValueOf<ElementType>[]): number {
    return struct_serializeToBytesArrayBasic(this.elementType, value.length, output, offset, value);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return tree_deserializeFromBytesArrayBasic(this.elementType, this.depth, data, start, end, this);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const length = getLengthFromRootNode(node);
    return tree_serializeToBytesArrayBasic(this.elementType, this.depth, length, output, offset, node);
  }

  tree_getLength(tree: Tree): number {
    return (tree.rootNode.right as LeafNode).getUint(4, 0);
  }
}
