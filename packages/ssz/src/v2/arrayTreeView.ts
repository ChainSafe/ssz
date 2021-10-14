import {LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, TreeView, ValueOf, ViewOf, ViewOfComposite} from "./abstract";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ArrayBasicType<ElementType extends BasicType<any>> = CompositeType<ValueOf<ElementType>[]> & {
  readonly elementType: ElementType;
  readonly itemsPerChunk: number;
  tree_getLength(node: Node): number;
};

export type ArrayCompositeType<ElementType extends CompositeType<any>> = CompositeType<ValueOf<ElementType>[]> & {
  readonly elementType: ElementType;
  tree_getLength(node: Node): number;
};

export class ArrayBasicTreeView<ElementType extends BasicType<any>> extends TreeView {
  private readonly leafNodes: LeafNode[] = [];
  private readonly dirtyNodes = new Set<number>();
  private allLeafNodesPopulated = false;

  constructor(readonly type: ArrayBasicType<ElementType>, protected tree: Tree, protected inMutableMode = false) {
    super();
  }

  get length(): number {
    return this.type.tree_getLength(this.tree.rootNode);
  }

  get node(): Node {
    return this.tree.rootNode;
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.type.elementType.getValueFromPackedNode(leafNode, index) as ValueOf<ElementType>;
  }

  set(index: number, value: ValueOf<ElementType>): void {
    const itemsPerChunk = this.type.itemsPerChunk;

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

export class ArrayCompositeTreeView<ElementType extends CompositeType<any>> extends TreeView {
  private readonly views: TreeView[] = [];
  private readonly dirtyNodes = new Set<number>();
  private allLeafNodesPopulated = false;

  constructor(readonly type: ArrayCompositeType<ElementType>, protected tree: Tree, protected inMutableMode = false) {
    super();
  }

  get length(): number {
    return this.type.tree_getLength(this.tree.rootNode);
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  /**
   * Get element at index `i`. Returns the primitive element directly
   */
  get(index: number): ViewOfComposite<ElementType> {
    let view = this.views[index];
    if (view === undefined) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      const subtree = this.tree.getSubtree(gindex);
      view = this.type.elementType.getView(subtree, this.inMutableMode) as TreeView;
      this.views[index] = view;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return view as ViewOfComposite<ElementType>;
  }

  set(index: number, value: ViewOf<ElementType>): void {
    this.views[index] = value as TreeView;

    // Commit immediately
    if (this.inMutableMode) {
      // Do not commit to the tree, but update the node in leafNodes
      this.dirtyNodes.add(index);
    } else {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, value.node);
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
      this.tree.setNode(gindex, this.views[index].node);
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
