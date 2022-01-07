import {
  getNodeAtDepth,
  getNodesAtDepth,
  LeafNode,
  Node,
  setNodesAtDepth,
  Tree,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";
import {
  BasicType,
  CompositeType,
  TreeView,
  TreeViewMutable,
  ValueOf,
  CompositeView,
  CompositeViewMutable,
} from "./abstract";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ArrayBasicType<ElementType extends BasicType<any>> = CompositeType<
  ValueOf<ElementType>[],
  ArrayBasicTreeView<ElementType>,
  ArrayBasicTreeViewMutable<ElementType>
> & {
  readonly elementType: ElementType;
  readonly itemsPerChunk: number;
  readonly chunkDepth: number;
  tree_getLength(node: Node): number;
  tree_setLength(tree: Tree, length: number): void;

  // TEMP
  tree_getChunksNode(rootNode: Node): Node;
  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node;
};

export type ArrayCompositeType<
  ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewMutable<ElementType>>
> = CompositeType<
  ValueOf<ElementType>[],
  ArrayCompositeTreeView<ElementType>,
  ArrayCompositeTreeViewMutable<ElementType>
> & {
  readonly elementType: ElementType;
  readonly chunkDepth: number;
  tree_getLength(node: Node): number;
  tree_setLength(tree: Tree, length: number): void;

  // TEMP
  tree_getChunksNode(rootNode: Node): Node;
  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node;
};

export class ArrayBasicTreeView<ElementType extends BasicType<any>> extends TreeView {
  constructor(readonly type: ArrayBasicType<ElementType>, protected tree: Tree) {
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
    // First walk through the tree to get the root node for that index
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const leafNode = this.tree.getNodeAtDepth(this.type.depth, chunkIndex) as LeafNode;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.type.elementType.getValueFromPackedNode(leafNode, index) as ValueOf<ElementType>;
  }

  set(index: number, value: ValueOf<ElementType>): void {
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const leafNodePrev = this.tree.getNodeAtDepth(this.type.depth, chunkIndex) as LeafNode;

    // Create a new node to preserve immutability
    const leafNode = new LeafNode(leafNodePrev);
    this.type.elementType.setValueToPackedNode(leafNodePrev, index, value);

    // Commit immediately
    this.tree.setNodeAtDepth(this.type.depth, chunkIndex, leafNode);
  }

  getAll(): ValueOf<ElementType>[] {
    const chunksNode = this.type.tree_getChunksNode(this.node);
    const chunkCount = Math.ceil(this.length / this.type.itemsPerChunk);
    const leafNodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, chunkCount) as LeafNode[];

    const values: ValueOf<ElementType>[] = [];
    const itemsPerChunk = this.type.itemsPerChunk; // Prevent many access in for loop below
    const lenFullNodes = Math.floor(this.length / itemsPerChunk);
    const remainder = this.length % itemsPerChunk;

    for (let n = 0; n < lenFullNodes; n++) {
      const leafNode = leafNodes[n];
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
      const leafNode = leafNodes[lenFullNodes];
      for (let i = 0; i < remainder; i++) {
        values.push(this.type.elementType.getValueFromPackedNode(leafNode, lenFullNodes * itemsPerChunk + i));
      }
    }

    return values;
  }

  clone(): ArrayBasicTreeView<ElementType> {
    return new ArrayBasicTreeView(this.type, this.tree.clone());
  }
}

type ArrayBasicTreeViewMutableCache = {
  nodes: LeafNode[];
  length: number;
  nodesPopulated: boolean;
};

export class ArrayBasicTreeViewMutable<ElementType extends BasicType<any>> extends TreeViewMutable {
  protected nodes: LeafNode[];
  protected readonly nodesChanged = new Set<number>();
  protected _length: number;
  protected dirtyLength = false;
  private nodesPopulated: boolean;

  constructor(
    readonly type: ArrayBasicType<ElementType>,
    protected _rootNode: Node,
    cache?: ArrayBasicTreeViewMutableCache
  ) {
    super();

    if (cache) {
      this.nodes = cache.nodes;
      this._length = cache.length;
      this.nodesPopulated = cache.nodesPopulated;
    } else {
      this.nodes = [];
      this._length = this.type.tree_getLength(_rootNode);
      this.nodesPopulated = false;
    }
  }

  get length(): number {
    return this._length;
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): ArrayBasicTreeViewMutableCache {
    return {
      nodes: this.nodes,
      length: this._length,
      nodesPopulated: this.nodesPopulated,
    };
  }

  /**
   * Get element at index `i`. Returns the primitive element directly
   */
  get(index: number): ValueOf<ElementType> {
    // First walk through the tree to get the root node for that index
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    let node = this.nodes[chunkIndex];
    if (node === undefined) {
      node = getNodeAtDepth(this._rootNode, this.type.depth, index) as LeafNode;
      this.nodes[chunkIndex] = node;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.type.elementType.getValueFromPackedNode(node, index) as ValueOf<ElementType>;
  }

  set(index: number, value: ValueOf<ElementType>): void {
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);

    // Create new node if current leafNode is not dirty
    let nodeChanged: LeafNode;
    if (this.nodesChanged.has(chunkIndex)) {
      // TODO: This assumes that node has already been populated
      nodeChanged = this.nodes[chunkIndex];
    } else {
      let nodePrev = this.nodes[chunkIndex];
      if (nodePrev === undefined) {
        nodePrev = getNodeAtDepth(this._rootNode, this.type.depth, index) as LeafNode;
        this.nodes[chunkIndex] = nodePrev;
      }

      nodeChanged = new LeafNode(nodePrev);
      this.nodesChanged.add(chunkIndex);
    }

    this.type.elementType.setValueToPackedNode(nodeChanged, index, value);
  }

  getAll(): ValueOf<ElementType>[] {
    if (!this.nodesPopulated) {
      const chunksNode = this.type.tree_getChunksNode(this.node);
      const chunkCount = Math.ceil(this.length / this.type.itemsPerChunk);
      this.nodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, chunkCount) as LeafNode[];
      this.nodesPopulated = true;
    }

    const values: ValueOf<ElementType>[] = [];
    const itemsPerChunk = this.type.itemsPerChunk; // Prevent many access in for loop below
    const lenFullNodes = Math.floor(this.length / itemsPerChunk);
    const remainder = this.length % itemsPerChunk;

    for (let n = 0; n < lenFullNodes; n++) {
      const leafNode = this.nodes[n];
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
      const leafNode = this.nodes[lenFullNodes];
      for (let i = 0; i < remainder; i++) {
        values.push(this.type.elementType.getValueFromPackedNode(leafNode, lenFullNodes * itemsPerChunk + i));
      }
    }

    return values;
  }

  commit(): Node {
    if (this.nodesChanged.size === 0) {
      return this._rootNode;
    }

    const indexes = Array.from(this.nodesChanged.keys()).sort();
    const nodesChangedSorted: LeafNode[] = [];
    for (const index of indexes) {
      nodesChangedSorted.push(this.nodes[index]);
    }

    // TODO: Generalize for Vectors
    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    // TODO: Ensure fast setNodesAtDepth() method is correct
    const newChunksNode = setNodesAtDepth(this.type.chunkDepth, chunksNode, indexes, nodesChangedSorted);

    this._rootNode = this.type.tree_setChunksNode(
      this._rootNode,
      newChunksNode,
      this.dirtyLength ? this._length : undefined
    );

    this.nodesChanged.clear();
    this.dirtyLength = false;

    return this._rootNode;
  }

  clone(dontTransferCache?: boolean): ArrayBasicTreeViewMutable<ElementType> {
    if (dontTransferCache) {
      return new ArrayBasicTreeViewMutable(this.type, this._rootNode);
    } else {
      const cache = this.cache;
      this.nodes = [];
      this.nodesPopulated = false;
      return new ArrayBasicTreeViewMutable(this.type, this._rootNode, cache);
    }
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

      // Commit immediately
      this.tree.setNodeAtDepth(this.type.depth, chunkIndex, leafNode);
    } else {
      // Re-use .set() since no new node is added
      this.set(length, value);
    }

    this.type.tree_setLength(this.tree, length + 1);
  }
}

export class ListBasicTreeViewMutable<
  ElementType extends BasicType<any>
> extends ArrayBasicTreeViewMutable<ElementType> {
  push(value: ValueOf<ElementType>): void {
    const length = this.length;

    const prevChunkIndex = Math.floor((length - 1) / this.type.itemsPerChunk);
    const chunkIndex = Math.floor(length / this.type.itemsPerChunk);
    const inNewNode = prevChunkIndex !== chunkIndex;

    if (inNewNode) {
      // TODO: Optimize, prevent double initialization
      const leafNode = new LeafNode(zeroNode(0));
      this.type.elementType.setValueToPackedNode(leafNode, length, value);

      this.nodesChanged.add(chunkIndex);
    } else {
      // Re-use .set() since no new node is added
      this.set(length, value);
    }

    this._length = length + 1;
    this.dirtyLength = true;
  }
}

export class ArrayCompositeTreeView<
  ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewMutable<ElementType>>
> extends TreeView {
  constructor(readonly type: ArrayCompositeType<ElementType>, protected tree: Tree) {
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
  get(index: number): CompositeView<ElementType> {
    const gindex = this.type.getGindexBitStringAtChunkIndex(index);
    const subtree = this.tree.getSubtree(gindex);
    return this.type.elementType.getView(subtree);
  }

  set(index: number, view: CompositeView<ElementType>): void {
    const node = this.type.elementType.commitView(view);
    this.tree.setNodeAtDepth(this.type.depth, index, node);
  }

  getAll(): CompositeView<ElementType>[] {
    const views: CompositeView<ElementType>[] = [];
    for (let i = 0; i < this.length; i++) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(i);
      const subtree = this.tree.getSubtree(gindex);
      views.push(this.type.elementType.getView(subtree));
    }
    return views;
  }

  clone(): ArrayCompositeTreeView<ElementType> {
    return new ArrayCompositeTreeView(this.type, this.tree.clone());
  }
}

type ArrayCompositeTreeViewMutableCache = {
  nodes: Node[];
  caches: unknown[];
  length: number;
  nodesPopulated: boolean;
};

export class ArrayCompositeTreeViewMutable<
  ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewMutable<ElementType>>
> extends TreeViewMutable {
  protected nodes: Node[];
  protected caches: unknown[];
  protected readonly viewsChanged = new Map<number, CompositeViewMutable<ElementType>>();
  protected _length: number;
  protected dirtyLength = false;
  private nodesPopulated: boolean;

  constructor(
    readonly type: ArrayCompositeType<ElementType>,
    protected _rootNode: Node,
    cache?: ArrayCompositeTreeViewMutableCache
  ) {
    super();

    if (cache) {
      this.nodes = cache.nodes;
      this.caches = cache.caches;
      this._length = cache.length;
      this.nodesPopulated = cache.nodesPopulated;
    } else {
      this.nodes = [];
      this.caches = [];
      this._length = this.type.tree_getLength(_rootNode);
      this.nodesPopulated = false;
    }
  }

  get length(): number {
    return this._length;
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): ArrayCompositeTreeViewMutableCache {
    return {
      nodes: this.nodes,
      caches: this.caches,
      length: this._length,
      nodesPopulated: this.nodesPopulated,
    };
  }

  /**
   * Get element at index `i`. Returns the primitive element directly.
   *
   * NOTE: Assumes that any view created here will change and will call .commit() on it.
   * .get() should be used only for cases when something may mutate. To get all items without
   * triggering a .commit() in all them use .getAllReadOnly().
   */
  get(index: number): CompositeViewMutable<ElementType> {
    const viewChanged = this.viewsChanged.get(index);
    if (viewChanged) {
      return viewChanged;
    }

    let node = this.nodes[index];
    if (node === undefined) {
      node = getNodeAtDepth(this._rootNode, this.type.depth, index);
      this.nodes[index] = node;
    }

    // TODO: To only run .commit() in the child views that actually change, use again
    // the invalidateParent() hook and add indexes to a `this.dirtyChildViews.add(index)`
    const view = this.type.elementType.getViewMutable(node, this.caches[index]);

    this.viewsChanged.set(index, view);
    const viewCache = this.type.elementType.getViewMutableCache(view);
    if (viewCache) {
      this.caches[index] = viewCache;
    }

    return view;
  }

  set(index: number, view: CompositeViewMutable<ElementType>): void {
    // Commit any temp data and transfer cache
    const node = this.type.elementType.commitViewMutable(view);

    // Should transfer cache?
    this.caches[index] = this.type.elementType.getViewMutableCache(view);

    // Do not commit to the tree, but update the node in leafNodes
    this.nodes[index] = node;
    this.viewsChanged.set(index, view);
  }

  getAllReadonly(): CompositeViewMutable<ElementType>[] {
    if (!this.nodesPopulated) {
      this.nodes = getNodesAtDepth(this._rootNode, this.type.depth, 0, this.length);
      this.nodesPopulated = true;
    }

    const views: CompositeViewMutable<ElementType>[] = [];
    for (let i = 0; i < this.length; i++) {
      views[i] = this.type.elementType.getViewMutable(this.nodes[i], this.caches[i]);
    }

    return views;
  }

  commit(): Node {
    if (this.viewsChanged.size === 0) {
      return this._rootNode;
    }

    const indexes = Array.from(this.viewsChanged.keys()).sort();
    const nodesChangedSorted: Node[] = [];
    for (const index of indexes) {
      const view = this.viewsChanged.get(index);
      if (view) {
        nodesChangedSorted.push(this.type.elementType.commitViewMutable(view));
      }
    }

    // TODO: Generalize for Vectors
    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    // TODO: Ensure fast setNodesAtDepth() method is correct
    const newChunksNode = setNodesAtDepth(this.type.chunkDepth, chunksNode, indexes, nodesChangedSorted);

    this._rootNode = this.type.tree_setChunksNode(
      this._rootNode,
      newChunksNode,
      this.dirtyLength ? this._length : undefined
    );

    this.viewsChanged.clear();
    this.dirtyLength = false;

    return this._rootNode;
  }

  clone(dontTransferCache?: boolean): ArrayCompositeTreeViewMutable<ElementType> {
    if (dontTransferCache) {
      return new ArrayCompositeTreeViewMutable(this.type, this.node);
    } else {
      const cache = this.cache;
      this.nodes = [];
      this.caches = [];
      this.nodesPopulated = false;
      return new ArrayCompositeTreeViewMutable(this.type, this.node, cache);
    }
  }
}

export class ListCompositeTreeView<
  ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewMutable<ElementType>>
> extends ArrayCompositeTreeView<ElementType> {
  push(view: CompositeView<ElementType>): void {
    const length = this.length;
    this.type.tree_setLength(this.tree, length + 1);

    const node = this.type.elementType.commitView(view);
    // TODO: Use setNodeAtDepth
    this.tree.setNodeAtDepth(this.type.depth, length, node, true);
  }
}

export class ListCompositeTreeViewMutable<
  ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewMutable<ElementType>>
> extends ArrayCompositeTreeViewMutable<ElementType> {
  push(view: CompositeViewMutable<ElementType>): void {
    this.dirtyLength = true;
    const index = this._length++;
    this.set(index, view);
  }
}
