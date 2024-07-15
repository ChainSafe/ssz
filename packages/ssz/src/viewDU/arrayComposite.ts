import {
  getHashComputations,
  getNodeAtDepth,
  getNodesAtDepth,
  HashComputationGroup,
  Node,
  setNodesAtDepth,
} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract";
import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite";
import {ArrayCompositeType} from "../view/arrayComposite";
import {TreeViewDU} from "./abstract";

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
   * WARNING: Returns all commited changes, if there are any pending changes commit them beforehand
   */
  getAllReadonly(views?: CompositeViewDU<ElementType>[]): CompositeViewDU<ElementType>[] {
    if (views && views.length !== this._length) {
      throw Error(`Expected ${this._length} views, got ${views.length}`);
    }
    this.populateAllNodes();

    views = views ?? new Array<CompositeViewDU<ElementType>>(this._length);
    for (let i = 0; i < this._length; i++) {
      views[i] = this.type.elementType.getViewDU(this.nodes[i], this.caches[i]);
    }
    return views;
  }

  /**
   * WARNING: Returns all commited changes, if there are any pending changes commit them beforehand
   */
  getAllReadonlyValues(values?: ValueOf<ElementType>[]): ValueOf<ElementType>[] {
    if (values && values.length !== this._length) {
      throw Error(`Expected ${this._length} values, got ${values.length}`);
    }
    this.populateAllNodes();

    values = values ?? new Array<ValueOf<ElementType>>(this._length);
    for (let i = 0; i < this._length; i++) {
      values[i] = this.type.elementType.tree_toValue(this.nodes[i]);
    }
    return values;
  }

  /**
   * When we need to compute HashComputations (hashComps != null):
   *   - if old _rootNode is hashed, then only need to put pending changes to HashComputationGroup
   *   - if old _rootNode is not hashed, need to traverse and put to HashComputationGroup
   */
  commit(hashComps: HashComputationGroup | null = null): void {
    const isOldRootHashed = this._rootNode.h0 !== null;
    if (this.viewsChanged.size === 0) {
      if (!isOldRootHashed && hashComps !== null) {
        getHashComputations(this._rootNode, hashComps.offset, hashComps.byLevel);
      }
      return;
    }

    // each view may mutate HashComputationGroup at offset + depth
    const hashCompsView =
      hashComps != null && isOldRootHashed
        ? {
            byLevel: hashComps.byLevel,
            // Depth includes the extra level for the length node
            offset: hashComps.offset + this.type.depth,
          }
        : null;

    const indexesChanged = Array.from(this.viewsChanged.keys()).sort((a, b) => a - b);
    const indexes: number[] = [];
    const nodes: Node[] = [];
    for (const index of indexesChanged) {
      const view = this.viewsChanged.get(index);
      if (!view) {
        // should not happen
        throw Error("View not found in viewsChanged, index=" + index);
      }

      const node = this.type.elementType.commitViewDU(view, hashCompsView);
      // there's a chance the view is not changed, no need to rebind nodes in that case
      if (this.nodes[index] !== node) {
        // Set new node in nodes array to ensure data represented in the tree and fast nodes access is equal
        this.nodes[index] = node;
        // nodesChanged.push({index, node});
        indexes.push(index);
        nodes.push(node);
      }

      // Cache the view's caches to preserve it's data after 'this.viewsChanged.clear()'
      const cache = this.type.elementType.cacheOfViewDU(view);
      if (cache) this.caches[index] = cache;
    }

    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    const hashCompsThis =
      hashComps != null && isOldRootHashed
        ? {
            byLevel: hashComps.byLevel,
            offset: hashComps.offset + this.type.tree_chunksNodeOffset(),
          }
        : null;
    const newChunksNode = setNodesAtDepth(chunksNode, this.type.chunkDepth, indexes, nodes, hashCompsThis);

    this._rootNode = this.type.tree_setChunksNode(
      this._rootNode,
      newChunksNode,
      this.dirtyLength ? this._length : null,
      hashComps
    );

    if (!isOldRootHashed && hashComps !== null) {
      getHashComputations(this._rootNode, hashComps.offset, hashComps.byLevel);
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
}
