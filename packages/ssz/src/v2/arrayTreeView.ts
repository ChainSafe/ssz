import {getNodesAtDepth, LeafNode, Node, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, TreeView, ValueOf, ViewOf, ViewOfComposite} from "./abstract";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ArrayBasicType<ElementType extends BasicType<any>> = CompositeType<ValueOf<ElementType>[]> & {
  readonly elementType: ElementType;
  readonly itemsPerChunk: number;
  readonly chunkDepth: number;
  tree_getLength(node: Node): number;
  tree_setLength(tree: Tree, length: number): void;
  tree_getChunksNode(node: Node): Node;
};

export type ArrayCompositeType<ElementType extends CompositeType<any>> = CompositeType<ValueOf<ElementType>[]> & {
  readonly elementType: ElementType;
  tree_getLength(node: Node): number;
  tree_setLength(tree: Tree, length: number): void;
};

export class ArrayBasicTreeView<ElementType extends BasicType<any>> extends TreeView {
  protected leafNodes: LeafNode[] = [];
  protected readonly dirtyNodes = new Set<number>();
  protected _length: number;
  protected dirtyLength = false;
  private allLeafNodesPopulated = false;

  constructor(readonly type: ArrayBasicType<ElementType>, protected tree: Tree, protected inMutableMode = false) {
    super();
    this._length = this.type.tree_getLength(tree.rootNode);
  }

  get length(): number {
    return this._length;
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  /**
   * Get element at index `i`. Returns the primitive element directly
   */
  get(index: number): ValueOf<ElementType> {
    // First walk through the tree to get the root node for that index
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
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
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
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
      // Mark to commit to tree later
      this.dirtyNodes.add(chunkIndex);
    } else {
      // Commit immediately
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, leafNode);
    }
  }

  getAll(): ValueOf<ElementType>[] {
    if (!this.allLeafNodesPopulated) {
      const chunksNode = this.type.tree_getChunksNode(this.node);
      this.leafNodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, this.length) as LeafNode[];
      this.allLeafNodesPopulated = true;
    }

    const values: ValueOf<ElementType>[] = [];
    const lenFullNodes = Math.floor(this.length);
    const remainder = this.length % lenFullNodes;
    const itemsPerChunk = this.type.itemsPerChunk; // Prevent many access in for loop below

    for (let n = 0; n < lenFullNodes; n++) {
      const leafNode = this.leafNodes[n];
      // TODO: Implement add a fast bulk packed element reader in the elementType
      // ```
      // abstract getValuesFromPackedNode(leafNode: LeafNode, output: V[], indexOffset: number): void;
      // ```
      // if performance here is a problem
      for (let i = 0; i < itemsPerChunk; i++) {
        values.push(this.type.elementType.getValueFromPackedNode(leafNode, n * itemsPerChunk + i));
      }
    }

    if (remainder > 0) {
      const leafNode = this.leafNodes[lenFullNodes];
      for (let i = 0; i < remainder; i++) {
        values.push(this.type.elementType.getValueFromPackedNode(leafNode, lenFullNodes * itemsPerChunk + i));
      }
    }

    return values;
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

    // Update length if changed
    if (this.dirtyLength) {
      this.type.tree_setLength(this.tree, this._length);
    }

    this.dirtyNodes.clear();
    this.dirtyLength = false;
    this.inMutableMode = false;
  }
}

export class ListBasicTreeView<ElementType extends BasicType<any>> extends ArrayBasicTreeView<ElementType> {
  push(value: ValueOf<ElementType>): void {
    const length = this.length;

    const prevChunkIndex = Math.floor((length - 1) / this.type.itemsPerChunk);
    const chunkIndex = Math.floor(length / this.type.itemsPerChunk);
    const inNewNode = prevChunkIndex !== chunkIndex;

    if (inNewNode) {
      // TODO: Optimize, prevent double initialization
      const leafNode = new LeafNode(zeroNode(0));
      this.type.elementType.setValueToPackedNode(leafNode, length, value);

      this.leafNodes[chunkIndex] = leafNode;
      if (this.inMutableMode) {
        // Mark to commit to tree later
        this.dirtyNodes.add(chunkIndex);
      } else {
        // Commit immediately
        const gindex = this.type.getGindexBitStringAtChunkIndex(chunkIndex);
        this.tree.setNode(gindex, leafNode);
      }
    } else {
      // Re-use .set() since no new node is added
      this.set(length, value);
    }

    this._length = length + 1;
    if (this.inMutableMode) {
      this.dirtyLength = true;
    } else {
      this.type.tree_setLength(this.tree, this._length);
    }
  }
}

export class ArrayCompositeTreeView<ElementType extends CompositeType<any>> extends TreeView {
  protected readonly views: TreeView[] = [];
  protected readonly dirtyNodes = new Set<number>();
  protected _length: number;
  protected dirtyLength = false;

  constructor(readonly type: ArrayCompositeType<ElementType>, protected tree: Tree, protected inMutableMode = false) {
    super();
    this._length = this.type.tree_getLength(tree.rootNode);
  }

  get length(): number {
    return this._length;
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

  set(index: number, view: ViewOf<ElementType>): void {
    this.views[index] = view as TreeView;

    // Commit immediately
    if (this.inMutableMode) {
      // Do not commit to the tree, but update the node in leafNodes
      this.dirtyNodes.add(index);
    } else {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, view.node);
    }
  }

  // TODO: Implement getAll if it's really necessary

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

    // Update length if changed
    if (this.dirtyLength) {
      this.type.tree_setLength(this.tree, this._length);
    }

    this.dirtyNodes.clear();
    this.dirtyLength = false;
    this.inMutableMode = false;
  }
}

export class ListCompositeTreeView<ElementType extends CompositeType<any>> extends ArrayCompositeTreeView<ElementType> {
  push(view: ViewOf<ElementType>): void {
    this.views[this.length] = view as TreeView;

    const length = this.length;

    if (this.inMutableMode) {
      // Mark to commit to tree later
      this.dirtyNodes.add(length);
    } else {
      // Commit immediately
      const gindex = this.type.getGindexBitStringAtChunkIndex(length);
      this.tree.setNode(gindex, view.node, true);
    }

    this._length = length + 1;
    if (this.inMutableMode) {
      this.dirtyLength = true;
    } else {
      this.type.tree_setLength(this.tree, this._length);
    }
  }
}
