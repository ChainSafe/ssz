import {getNodeAtDepth, LeafNode, Node, setNodesAtDepth, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, TreeView, TreeViewDU, Type, ValueOf} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export type ContainerTypeGeneric<Fields extends Record<string, Type<any>>> = CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  ContainerTreeViewDUType<Fields>
> & {
  readonly fields: Fields;
  readonly fieldsEntries: {fieldName: keyof Fields; fieldType: Fields[keyof Fields]}[];
};

type ValueOfFields<Fields extends Record<string, Type<any>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

type FieldsView<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<any, unknown, unknown>
    ? // If composite, return view. MAY propagate changes updwards
      ReturnType<Fields[K]["getView"]>
    : // If basic, return struct value. Will NOT propagate changes upwards
      Fields[K]["defaultValue"];
};

type FieldsViewDU<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<any, unknown, unknown>
    ? // If composite, return view. MAY propagate changes updwards
      ReturnType<Fields[K]["getViewDU"]>
    : // If basic, return struct value. Will NOT propagate changes upwards
      Fields[K]["defaultValue"];
};

type ContainerTreeViewType<Fields extends Record<string, Type<any>>> = FieldsView<Fields> & TreeView;
type ContainerTreeViewTypeConstructor<Fields extends Record<string, Type<any>>> = {
  new (type: ContainerTypeGeneric<Fields>, tree: Tree): ContainerTreeViewType<Fields>;
};

type ContainerTreeViewDUType<Fields extends Record<string, Type<any>>> = FieldsViewDU<Fields> & TreeViewDU;
type ContainerTreeViewDUTypeConstructor<Fields extends Record<string, Type<any>>> = {
  new (type: ContainerTypeGeneric<Fields>, node: Node, cache?: unknown): ContainerTreeViewDUType<Fields>;
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

  constructor(readonly type: ContainerTypeGeneric<Fields>, readonly tree: Tree) {
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
          const leafNode = getNodeAtDepth(this.node, this.type.depth, index) as LeafNode;
          return fieldTypeBasic.getValueFromNode(leafNode) as unknown;
        },

        set: function (this: CustomContainerTreeView, value) {
          const leafNodePrev = getNodeAtDepth(this.node, this.type.depth, index) as LeafNode;
          const leafNode = new LeafNode(leafNodePrev);
          fieldTypeBasic.setValueToNode(leafNode, value);
          this.tree.setNodeAtDepth(this.type.depth, index, leafNode);
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView. The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else {
      const fieldTypeComposite = fieldType as unknown as CompositeType<any, unknown, unknown>;
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        get: function (this: CustomContainerTreeView) {
          const gindex = this.type.getGindexBitStringAtChunkIndex(index);
          return fieldTypeComposite.getView(this.tree.getSubtree(gindex));
        },

        set: function (this: CustomContainerTreeView, value: TreeView) {
          const node = fieldTypeComposite.commitView(value);
          this.tree.setNodeAtDepth(this.type.depth, index, node);
        },
      });
    }
  }

  // TODO:
  // Change class name
  // Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

  return CustomContainerTreeView as unknown as ContainerTreeViewTypeConstructor<Fields>;
}

type ContainerTreeViewDUCache = {
  nodes: Node[];
  caches: unknown[];
  nodesPopulated: boolean;
};

class ContainerTreeViewDU<Fields extends Record<string, Type<any>>> extends TreeViewDU {
  protected nodes: Node[] = [];
  protected caches: unknown[];
  protected views: TreeView[] = [];
  protected readonly nodesChanged = new Map<number, Node>();
  protected readonly viewsChanged = new Map<number, unknown>();
  private nodesPopulated: boolean;

  constructor(
    readonly type: ContainerTypeGeneric<Fields>,
    protected _rootNode: Node,
    cache?: ContainerTreeViewDUCache
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

  get cache(): ContainerTreeViewDUCache {
    return {
      nodes: this.nodes,
      caches: this.caches,
      nodesPopulated: this.nodesPopulated,
    };
  }

  commit(): Node {
    if (this.nodesChanged.size === 0) {
      return this._rootNode;
    }

    const nodesChanged: {index: number; node: Node}[] = [];

    for (const [index, view] of this.viewsChanged) {
      nodesChanged.push({
        index,
        node: (
          this.type.fieldsEntries[index].fieldType as unknown as CompositeType<any, unknown, unknown>
        ).commitViewDU(view),
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

    return this._rootNode;
  }
}

export function getContainerTreeViewDUClass<Fields extends Record<string, Type<any>>>(
  type: ContainerTypeGeneric<Fields>
): ContainerTreeViewDUTypeConstructor<Fields> {
  class CustomContainerTreeViewDU extends ContainerTreeViewDU<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType} = type.fieldsEntries[index];

    // If the field type is basic, the value to get and set will be the actual 'struct' value (i.e. a JS number).
    // The view must use the getValueFromNode() and setValueToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (fieldType.isBasic) {
      const fieldTypeBasic = fieldType as unknown as BasicType<any>;
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeViewDU) {
          // First walk through the tree to get the root node for that index
          let node = this.nodes[index];
          if (node === undefined) {
            node = getNodeAtDepth(this._rootNode, this.type.depth, index);
            this.nodes[index] = node;
          }

          return fieldTypeBasic.getValueFromNode(node as LeafNode) as unknown;
        },

        set: function (this: CustomContainerTreeViewDU, value) {
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
      const fieldTypeComposite = fieldType as unknown as CompositeType<any, unknown, unknown>;
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        get: function (this: CustomContainerTreeViewDU) {
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
          const view = fieldTypeComposite.getViewDU(node, this.caches[index]);
          this.viewsChanged.set(index, view);

          const cache = fieldTypeComposite.getViewDUCache(view);
          if (cache) {
            this.caches[index] = cache;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return view;
        },

        set: function (this: CustomContainerTreeViewDU, view: TreeViewDU) {
          // Commit any temp data and transfer cache
          const node = fieldTypeComposite.commitViewDU(view);

          // Should transfer cache?
          this.caches[index] = fieldTypeComposite.getViewDUCache(view);

          // Do not commit to the tree, but update the node in leafNodes
          this.nodes[index] = node;
          this.viewsChanged.set(index, view);
        },
      });
    }
  }

  // TODO:
  // Change class name
  // Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

  return CustomContainerTreeViewDU as unknown as ContainerTreeViewDUTypeConstructor<Fields>;
}
