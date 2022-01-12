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

    // TODO: To only run .commit() in the child views that actually change, use again
    // the invalidateParent() hook and add indexes to a `this.dirtyChildViews.add(index)`
    const view = this.type.elementType.getViewDU(node, this.caches[index]);

    this.viewsChanged.set(index, view);
    const viewCache = this.type.elementType.cacheOfViewDU(view);
    if (viewCache) {
      this.caches[index] = viewCache;
    }

    return view;
  }

  set(index: number, view: CompositeViewDU<ElementType>): void {
    // Commit any temp data and transfer cache
    const node = this.type.elementType.commitViewDU(view);

    // Should transfer cache?
    this.caches[index] = this.type.elementType.cacheOfViewDU(view);

    // Do not commit to the tree, but update the node in leafNodes
    this.nodes[index] = node;
    this.viewsChanged.set(index, view);
  }

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

  commit(): Node {
    if (this.viewsChanged.size === 0) {
      return this._rootNode;
    }

    const indexes = Array.from(this.viewsChanged.keys()).sort();
    const nodesChangedSorted: Node[] = [];
    for (const index of indexes) {
      const view = this.viewsChanged.get(index);
      if (view) {
        nodesChangedSorted.push(this.type.elementType.commitViewDU(view));
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

  clone(dontTransferCache?: boolean): ArrayCompositeTreeViewDU<ElementType> {
    if (dontTransferCache) {
      return new ArrayCompositeTreeViewDU(this.type, this.node);
    } else {
      const cache = this.cache;
      this.nodes = [];
      this.caches = [];
      this.nodesPopulated = false;
      return new ArrayCompositeTreeViewDU(this.type, this.node, cache);
    }
  }
}
