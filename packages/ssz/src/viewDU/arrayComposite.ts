import {getNodeAtDepth, getNodesAtDepth, Node, setNodesAtDepth} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract";
import {CompositeType, TreeViewDU, CompositeView, CompositeViewDU} from "../type/composite";
import {ArrayCompositeType} from "../view/arrayComposite";

type ArrayCompositeTreeViewDUCache = {
  nodes: Node[];
  caches: unknown[];
  length: number;
  nodesPopulated: boolean;
};

export class ArrayCompositeTreeViewDU<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends TreeViewDU<ArrayCompositeType<ElementType>> {
  protected nodes: Node[];
  protected caches: unknown[];
  protected readonly viewsChanged = new Map<number, CompositeViewDU<ElementType>>();
  protected _length: number;
  protected dirtyLength = false;
  private nodesPopulated: boolean;

  constructor(
    readonly type: ArrayCompositeType<ElementType>,
    protected _rootNode: Node,
    cache?: ArrayCompositeTreeViewDUCache
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

  get cache(): ArrayCompositeTreeViewDUCache {
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
  get(index: number): CompositeViewDU<ElementType> {
    const viewChanged = this.viewsChanged.get(index);
    if (viewChanged) {
      return viewChanged;
    }

    let node = this.nodes[index];
    if (node === undefined) {
      node = getNodeAtDepth(this._rootNode, this.type.depth, index);
      this.nodes[index] = node;
    }

    // Keep a reference to the new view to call .commit on it latter
    const view = this.type.elementType.getViewDU(node, this.caches[index]);
    this.viewsChanged.set(index, view);

    // Persist child's view cache if it has any
    const viewCache = this.type.elementType.cacheOfViewDU(view);
    if (viewCache) {
      this.caches[index] = viewCache;
    }

    return view;
  }

  set(index: number, view: CompositeViewDU<ElementType>): void {
    // Is it really necessary to commit the node here now?
    // > I don't know, probably not under normal usage
    this.nodes[index] = this.type.elementType.commitViewDU(view);

    // Is it really necessary to transfer the cache here?
    // > Yes, because there could be some old cache that will persist if changes stop being made
    const viewCache = this.type.elementType.cacheOfViewDU(view);
    if (viewCache) {
      this.caches[index] = viewCache;
    }

    this.viewsChanged.set(index, view);
  }

  /**
   * WARNING: Returns all commited changes, if there are any pending changes commit them beforehand
   */
  getAllReadonly(): CompositeViewDU<ElementType>[] {
    if (!this.nodesPopulated) {
      this.nodes = getNodesAtDepth(this._rootNode, this.type.depth, 0, this.length);
      this.nodesPopulated = true;
    }

    const views: CompositeViewDU<ElementType>[] = [];
    for (let i = 0; i < this.length; i++) {
      views[i] = this.type.elementType.getViewDU(this.nodes[i], this.caches[i]);
    }
    return views;
  }

  /**
   * WARNING: Returns all commited changes, if there are any pending changes commit them beforehand
   */
  getAllReadonlyValues(): ValueOf<ElementType>[] {
    if (!this.nodesPopulated) {
      this.nodes = getNodesAtDepth(this._rootNode, this.type.depth, 0, this.length);
      this.nodesPopulated = true;
    }

    const values: ValueOf<ElementType>[] = [];
    for (let i = 0; i < this.length; i++) {
      values[i] = this.type.elementType.tree_toValue(this.nodes[i]);
    }
    return values;
  }

  commit(): Node {
    if (this.viewsChanged.size === 0) {
      return this._rootNode;
    }

    // Numerical sort ascending
    const indexes = Array.from(this.viewsChanged.keys()).sort((a, b) => a - b);
    const nodesChangedSorted: Node[] = [];
    for (const index of indexes) {
      // TODO: .sort() and get in one single iteration
      const view = this.viewsChanged.get(index);
      if (view) {
        nodesChangedSorted.push(this.type.elementType.commitViewDU(view));
      }
    }

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

  protected clearCache(): void {
    this.nodes = [];
    this.caches = [];
    this.nodesPopulated = false;
    // No need to clear this.viewsChanged since they have no effect on the cache
    if (this.dirtyLength) {
      this._length = this.type.tree_getLength(this._rootNode);
      this.dirtyLength = false;
    }
  }
}
