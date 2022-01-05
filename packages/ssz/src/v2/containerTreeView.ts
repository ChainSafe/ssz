import {getNodeAtDepth, LeafNode, Node, setNodesAtDepth, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, TreeView, TreeViewMutable, Type, ValueOf} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export type ContainerTypeGeneric<Fields extends Record<string, Type<any>>> = CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  ContainerTreeViewMutableType<Fields>
> & {
  readonly fields: Fields;
  readonly fieldsEntries: {fieldName: keyof Fields; fieldType: Fields[keyof Fields]}[];
};

type ValueOfFields<Fields extends Record<string, Type<any>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

type FieldsView<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<any, any, any>
    ? // If composite, return view. MAY propagate changes updwards
      ReturnType<Fields[K]["getView"]>
    : // If basic, return struct value. Will NOT propagate changes upwards
      Fields[K]["defaultValue"];
};

type FieldsViewMutable<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<any, any, any>
    ? // If composite, return view. MAY propagate changes updwards
      ReturnType<Fields[K]["getViewMutable"]>
    : // If basic, return struct value. Will NOT propagate changes upwards
      Fields[K]["defaultValue"];
};

type ContainerTreeViewType<Fields extends Record<string, Type<any>>> = FieldsView<Fields> & TreeView;
type ContainerTreeViewTypeConstructor<Fields extends Record<string, Type<any>>> = {
  new (type: ContainerTypeGeneric<Fields>, tree: Tree, inMutableMode?: boolean): ContainerTreeViewType<Fields>;
};

type ContainerTreeViewMutableType<Fields extends Record<string, Type<any>>> = FieldsViewMutable<Fields> &
  TreeViewMutable;
type ContainerTreeViewMutableTypeConstructor<Fields extends Record<string, Type<any>>> = {
  new (type: ContainerTypeGeneric<Fields>, node: Node, cache: unknown): ContainerTreeViewMutableType<Fields>;
};

/**
 * Intented usage:
 *
 * - Get initial BeaconState from disk.
 * - Before applying next block, switch to mutable
 * - Get some field, create a view in mutable mode
 * - Do modifications of the state in the state transition function
 * - When done, commit and apply new root node once to og BeaconState
 * - However, keep all the caches and transfer them to the new BeaconState
 *
 * Questions:
 * - Can the child views created in mutable mode switch to not mutable? If so, it seems that it needs to recursively
 *   iterate the entire data structure and views
 *
 */
class ContainerTreeView<Fields extends Record<string, Type<any>>> extends TreeView {
  protected readonly views: TreeView[] = [];
  protected readonly leafNodes: LeafNode[] = [];
  protected readonly dirtyNodes = new Set<number>();

  constructor(readonly type: ContainerTypeGeneric<Fields>, readonly tree: Tree, protected inMutableMode = false) {
    super();
  }

  get node(): Node {
    return this.tree.rootNode;
  }
}

export function getContainerTreeViewClass<Fields extends Record<string, Type<any>>>(
  type: ContainerTypeGeneric<Fields>
): ContainerTreeViewTypeConstructor<Fields> {
  class CustomContainerTreeView extends ContainerTreeView<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType} = type.fieldsEntries[index];
    const gindex = type.getGindexBitStringAtChunkIndex(index);

    // If the field type is basic, the value to get and set will be the actual 'struct' value (i.e. a JS number).
    // The view must use the getValueFromNode() and setValueToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (fieldType.isBasic) {
      const fieldTypeBasic = fieldType as unknown as BasicType<any>;
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeView) {
          const leafNode = this.tree.getNode(gindex) as LeafNode;
          return fieldTypeBasic.getValueFromNode(leafNode) as unknown;
        },

        set: function (this: CustomContainerTreeView, value) {
          const leafNodePrev = this.tree.getNode(gindex) as LeafNode;
          const leafNode = new LeafNode(leafNodePrev);
          fieldTypeBasic.setValueToNode(leafNode, value);
          this.tree.setNode(gindex, leafNode);
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView. The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else {
      const fieldTypeComposite = fieldType as unknown as CompositeType<any, TreeView, TreeViewMutable>;
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        get: function (this: CustomContainerTreeView) {
          return fieldTypeComposite.getView(this.tree.getSubtree(gindex));
        },

        set: function (this: CustomContainerTreeView, value: TreeView) {
          this.tree.setNode(gindex, value.node);
        },
      });
    }
  }

  // TODO:
  // Change class name
  // Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

  return CustomContainerTreeView as unknown as ContainerTreeViewTypeConstructor<Fields>;
}

type ContainerTreeViewMutableCache = {
  nodes: Node[];
  caches: unknown[];
  nodesPopulated: boolean;
};

class ContainerTreeViewMutable<Fields extends Record<string, Type<any>>> extends TreeViewMutable {
  protected nodes: Node[] = [];
  protected caches: unknown[];
  protected views: TreeView[] = [];
  protected readonly nodesChanged = new Map<number, Node>();
  protected readonly viewsChanged = new Map<number, TreeView>();
  private nodesPopulated: boolean;

  constructor(
    readonly type: ContainerTypeGeneric<Fields>,
    protected _rootNode: Node,
    cache?: ContainerTreeViewMutableCache
  ) {
    super();

    if (cache) {
      this.nodes = cache.nodes;
      this.caches = cache.caches;
      this.nodesPopulated = cache.nodesPopulated;
    } else {
      this.nodes = [];
      this.caches = [];
      this.nodesPopulated = false;
    }
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): ContainerTreeViewMutableCache {
    return {
      nodes: this.nodes,
      caches: this.caches,
      nodesPopulated: this.nodesPopulated,
    };
  }

  commit(): void {
    if (this.nodesChanged.size === 0) {
      return;
    }

    const nodesChanged: {index: number; node: Node}[] = [];

    for (const [index, view] of this.viewsChanged) {
      nodesChanged.push({
        index,
        node: (this.type.fieldsEntries[index].fieldType as unknown as CompositeType<any, any, any>).commitView(view),
      });
    }

    for (const [index, node] of this.nodesChanged) {
      nodesChanged.push({index, node});
    }

    // TODO: Optimize to loop only once
    const nodesChangedSorted = nodesChanged.sort((a, b) => a.index - b.index);
    const indexes = nodesChangedSorted.map((entry) => entry.index);
    const nodes = nodesChangedSorted.map((entry) => entry.node);

    this._rootNode = setNodesAtDepth(this.type.depth, this._rootNode, indexes, nodes);

    this.nodesChanged.clear();
    this.viewsChanged.clear();
  }
}

export function getContainerTreeViewMutableClass<Fields extends Record<string, Type<any>>>(
  type: ContainerTypeGeneric<Fields>
): ContainerTreeViewMutableTypeConstructor<Fields> {
  class CustomContainerTreeViewMutable extends ContainerTreeViewMutable<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType} = type.fieldsEntries[index];

    // If the field type is basic, the value to get and set will be the actual 'struct' value (i.e. a JS number).
    // The view must use the getValueFromNode() and setValueToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (fieldType.isBasic) {
      const fieldTypeBasic = fieldType as unknown as BasicType<any>;
      Object.defineProperty(CustomContainerTreeViewMutable.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeViewMutable) {
          // First walk through the tree to get the root node for that index
          let node = this.nodes[index];
          if (node === undefined) {
            node = getNodeAtDepth(this._rootNode, this.type.depth, index);
            this.nodes[index] = node;
          }

          return fieldTypeBasic.getValueFromNode(node as LeafNode) as unknown;
        },

        set: function (this: CustomContainerTreeViewMutable, value) {
          // Create new node if current leafNode is not dirty
          let nodeChanged = this.nodesChanged.get(index);
          if (!nodeChanged) {
            // TODO, deduplicate with above
            let nodePrev = this.nodes[index];
            if (this.nodes[index] === undefined) {
              nodePrev = getNodeAtDepth(this._rootNode, this.type.depth, index);
              this.nodes[index] = nodePrev;
            }

            nodeChanged = new LeafNode(nodePrev);
            this.nodesChanged.set(index, nodeChanged);
          }

          fieldTypeBasic.setValueToNode(nodeChanged as LeafNode, value);
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView. The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else {
      const fieldTypeComposite = fieldType as unknown as CompositeType<any, TreeView, TreeViewMutable>;
      Object.defineProperty(CustomContainerTreeViewMutable.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        get: function (this: CustomContainerTreeViewMutable) {
          const viewChanged = this.viewsChanged.get(index);
          if (viewChanged) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return viewChanged;
          }

          let node = this.nodes[index];
          if (node === undefined) {
            node = getNodeAtDepth(this._rootNode, this.type.depth, index);
            this.nodes[index] = node;
          }

          // TODO: To only run .commit() in the child views that actually change, use again
          // the invalidateParent() hook and add indexes to a `this.dirtyChildViews.add(index)`
          const view = fieldTypeComposite.getViewMutable(node, this.caches[index]);

          this.viewsChanged.set(index, view);
          const viewCache = (view as TreeViewMutable).cache;
          if (viewCache) {
            this.caches[index] = viewCache;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return view;
        },

        set: function (this: CustomContainerTreeViewMutable, view: TreeView) {
          // Commit any temp data and transfer cache
          (view as TreeViewMutable).commit();
          this.caches[index] = (view as TreeViewMutable).cache;

          // Do not commit to the tree, but update the node in leafNodes
          this.nodes[index] = (view as TreeViewMutable).node;
          this.viewsChanged.set(index, view);
        },
      });
    }
  }

  // TODO:
  // Change class name
  // Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

  return CustomContainerTreeViewMutable as unknown as ContainerTreeViewMutableTypeConstructor<Fields>;
}
