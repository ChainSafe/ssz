import {
  getHashComputations,
  getNodeAtDepth,
  getNodesAtDepth,
  HashComputationLevel,
  Node,
  setNodesAtDepth,
} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract.js";
import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite.js";
import {ArrayCompositeType} from "../view/arrayComposite.js";
import {TreeViewDU} from "./abstract.js";

export type ArrayCompositeTreeViewDUCache = {
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
  // TODO: Consider these properties are not accessible in the cache object persisted in the parent's cache.
  // nodes, caches, _length, and nodesPopulated are mutated. Consider having them in a _cache object such that
  // mutations affect the cache already found in the parent object
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
      // If there are exactly 0 nodes, nodesPopulated = true because 0 / 0 are in the nodes array
      this.nodesPopulated = this._length === 0;
    }
  }

  /**
   * Number of elements in the array. Equal to un-commited length of the array
   */
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
   * Get element at `index`. Returns a view of the Composite element type.
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

    // Keep a reference to the new view to call .commit on it latter, only if mutable
    const view = this.type.elementType.getViewDU(node, this.caches[index]);
    if (this.type.elementType.isViewMutable) {
      this.viewsChanged.set(index, view);
    }

    // No need to persist the child's view cache since a second get returns this view instance.
    // The cache is only persisted on commit where the viewsChanged map is dropped.

    return view;
  }

  /**
   * Get element at `index`. Returns a view of the Composite element type.
   * DOES NOT PROPAGATE CHANGES: use only for reads and to skip parent references.
   */
  getReadonly(index: number): CompositeViewDU<ElementType> {
    const viewChanged = this.viewsChanged.get(index);
    if (viewChanged) {
      return viewChanged;
    }

    let node = this.nodes[index];
    if (node === undefined) {
      node = getNodeAtDepth(this._rootNode, this.type.depth, index);
      this.nodes[index] = node;
    }

    return this.type.elementType.getViewDU(node, this.caches[index]);
  }

  // Did not implemented
  // `getReadonlyValue(index: number): ValueOf<ElementType>`
  // because it can break in unexpected ways if there are pending changes in this.viewsChanged.
  // This function could first check if `this.viewsChanged` has a view for `index` and commit it,
  // but that would be pretty slow, and the same result can be achieved with
  // `this.getReadonly(index).toValue()`

  /**
   * Set Composite element type `view` at `index`
   */
  set(index: number, view: CompositeViewDU<ElementType>): void {
    if (index >= this._length) {
      throw Error(`Error setting index over length ${index} > ${this._length}`);
    }

    // When setting a view:
    // - Not necessary to commit node
    // - Not necessary to persist cache
    // Just keeping a reference to the view in this.viewsChanged ensures consistency
    this.viewsChanged.set(index, view);
  }

  /**
   * Returns all elements at every index, if an index is modified it will return the modified view.
   * No need to commit() before calling this function.
   */
  getAllReadonly(): CompositeViewDU<ElementType>[] {
    this.populateAllOldNodes();

    const views = new Array<CompositeViewDU<ElementType>>(this._length);
    for (let i = 0; i < this._length; i++) {
      // this will get pending change first, if not it will get from the `this.nodes` array
      views[i] = this.getReadonly(i);
    }
    return views;
  }

  /**
   * WARNING: Returns all commited changes, if there are any pending changes commit them beforehand
   */
  getAllReadonlyValues(): ValueOf<ElementType>[] {
    this.populateAllNodes();

    const values = new Array<ValueOf<ElementType>>(this._length);
    for (let i = 0; i < this._length; i++) {
      values[i] = this.type.elementType.tree_toValue(this.nodes[i]);
    }
    return values;
  }

  /**
   * When we need to compute HashComputations (hcByLevel != null):
   *   - if old _rootNode is hashed, then only need to put pending changes to hcByLevel
   *   - if old _rootNode is not hashed, need to traverse and put to hcByLevel
   */
  commit(hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): void {
    const isOldRootHashed = this._rootNode.h0 !== null;
    if (this.viewsChanged.size === 0) {
      if (!isOldRootHashed && hcByLevel !== null) {
        getHashComputations(this._rootNode, hcOffset, hcByLevel);
      }
      return;
    }

    // each view may mutate hcByLevel at offset + depth
    const offsetView = hcOffset + this.type.depth;
    // Depth includes the extra level for the length node
    const byLevelView = hcByLevel != null && isOldRootHashed ? hcByLevel : null;

    const nodesChanged: {index: number; node: Node}[] = [];

    for (const [index, view] of this.viewsChanged) {
      const node = this.type.elementType.commitViewDU(view, offsetView, byLevelView);
      // there's a chance the view is not changed, no need to rebind nodes in that case
      if (this.nodes[index] !== node) {
        // Set new node in nodes array to ensure data represented in the tree and fast nodes access is equal
        this.nodes[index] = node;
        nodesChanged.push({index, node});
      }

      // Cache the view's caches to preserve it's data after 'this.viewsChanged.clear()'
      const cache = this.type.elementType.cacheOfViewDU(view);
      if (cache) this.caches[index] = cache;
    }

    // TODO: Optimize to loop only once, Numerical sort ascending
    const nodesChangedSorted = nodesChanged.sort((a, b) => a.index - b.index);
    const indexes = nodesChangedSorted.map((entry) => entry.index);
    const nodes = nodesChangedSorted.map((entry) => entry.node);

    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    const offsetThis = hcOffset + this.type.tree_chunksNodeOffset();
    const byLevelThis = hcByLevel != null && isOldRootHashed ? hcByLevel : null;
    const newChunksNode = setNodesAtDepth(chunksNode, this.type.chunkDepth, indexes, nodes, offsetThis, byLevelThis);

    this._rootNode = this.type.tree_setChunksNode(
      this._rootNode,
      newChunksNode,
      this.dirtyLength ? this._length : null,
      hcOffset,
      hcByLevel
    );

    if (!isOldRootHashed && hcByLevel !== null) {
      getHashComputations(this._rootNode, hcOffset, hcByLevel);
    }

    this.viewsChanged.clear();
    this.dirtyLength = false;
  }

  protected clearCache(): void {
    this.nodes = [];
    this.caches = [];
    this.nodesPopulated = false;

    // It's not necessary to clear this.viewsChanged since they have no effect on the cache.
    // However preserving _SOME_ caches results in a very unpredictable experience.
    this.viewsChanged.clear();

    // Reset cached length only if it has been mutated
    if (this.dirtyLength) {
      this._length = this.type.tree_getLength(this._rootNode);
      this.dirtyLength = false;
    }
  }

  protected populateAllNodes(): void {
    // If there's uncommited changes it may break.
    // this.length can be increased but this._rootNode doesn't have that item
    if (this.viewsChanged.size > 0) {
      throw Error("Must commit changes before reading all nodes");
    }

    if (!this.nodesPopulated) {
      this.nodes = getNodesAtDepth(this._rootNode, this.type.depth, 0, this.length);
      this.nodesPopulated = true;
    }
  }

  /**
   * Similar to `populateAllNodes` but this does not require a commit() before reading all nodes.
   * If there are pendingChanges, they will NOT be included in the `nodes` array.
   */
  protected populateAllOldNodes(): void {
    if (!this.nodesPopulated) {
      const originalLength = this.dirtyLength ? this.type.tree_getLength(this._rootNode) : this._length;
      this.nodes = getNodesAtDepth(this._rootNode, this.type.depth, 0, originalLength);
      this.nodesPopulated = true;
    }
  }
}
