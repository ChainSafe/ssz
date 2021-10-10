import {LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {LENGTH_GINDEX} from "../types/composite";
import {BasicType, CompositeType, TreeView, ValueOf} from "./abstract";
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
    // TODO: Review math
    this.depth = 1 + Math.ceil(Math.log2(this.maxChunkCount));
    this.maxLen = this.limit * elementType.maxLen;
  }

  get defaultValue(): ValueOf<ElementType>[] {
    return [];
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
    return (tree.getNode(LENGTH_GINDEX) as LeafNode).getUint(4, 0);
  }

  getView(node: Node): ListBasicTreeView<ElementType> {
    return new ListBasicTreeView(this, new Tree(node));
  }
}

export class ListBasicTreeView<ElementType extends BasicType<unknown>> implements TreeView {
  private readonly leafNodes: LeafNode[] = [];
  private readonly dirtyNodes = new Set<number>();
  private inMutableMode = false;
  private allLeafNodesPopulated = false;

  constructor(protected type: ListBasicType<ElementType>, protected tree: Tree) {}

  get length(): number {
    return this.type.tree_getLength(this.tree);
  }

  /**
   * Get element at index `i`. Returns the primitive element directly
   */
  get(index: number): ValueOf<ElementType> {
    // TODO
    const itemsPerChunk = this.type.itemsPerChunk;

    // First walk through the tree to get the root node for that index
    const chunkIndex = Math.floor(index / itemsPerChunk);
    let leafNode = this.leafNodes[chunkIndex];
    if (leafNode === undefined) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(chunkIndex);
      leafNode = this.tree.getNode(gindex) as LeafNode;
      this.leafNodes[chunkIndex] = leafNode;
    }

    return this.type.elementType.getValueFromPackedNode(leafNode, index) as ValueOf<ElementType>;
  }

  set(index: number, value: ValueOf<ElementType>): void {
    const itemsPerChunk = this.type.elementType.itemsPerChunk;

    const chunkIndex = Math.floor(index / itemsPerChunk);

    // TODO, deduplicate with above
    let leafNode = this.leafNodes[chunkIndex];
    if (this.leafNodes[chunkIndex] === undefined) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(chunkIndex);
      leafNode = this.tree.getNode(gindex) as LeafNode;
      this.leafNodes[chunkIndex] = leafNode;
    }

    // Create new node if current leafNode is not dirty
    if (!this.inMutableMode || !this.dirtyNodes.has(chunkIndex)) {
      leafNode = new LeafNode(leafNode);
      this.leafNodes[chunkIndex] = leafNode;
    }

    this.type.elementType.setValueToPackedNode(leafNode, index, value);

    if (this.inMutableMode) {
      // Do not commit to the tree, but update the node in leafNodes
      this.dirtyNodes.add(chunkIndex);
    } else {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, leafNode);
    }
  }

  toMutable(): void {
    this.inMutableMode = true;
  }

  commit(): void {
    if (this.dirtyNodes.size === 0) {
      return;
    }

    // TODO: Use fast setNodes() method
    for (const index of this.dirtyNodes) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, this.leafNodes[index]);
    }

    this.dirtyNodes.clear();
    this.inMutableMode = false;
  }

  // push(value: T): void {
  //   this.type.tree_push(this.tree, value);
  // }

  // getAll(): T[] {
  //   if (this.allElementViewsPopulated) {
  //     return this.elementViews;
  //   } else {
  //     const values = this.type.tree_getValues(this.tree);
  //   }
  // }
}
