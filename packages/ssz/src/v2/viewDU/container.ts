import {getNodeAtDepth, LeafNode, Node, setNodesAtDepth} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, TreeViewDU, Type} from "../abstract";
import {ContainerTypeGeneric} from "../view/container";

/* eslint-disable @typescript-eslint/member-ordering */

export type FieldsViewDU<Fields extends Record<string, Type<unknown>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<unknown, unknown, infer TVDU>
    ? // If composite, return view. MAY propagate changes updwards
      TVDU
    : // If basic, return struct value. Will NOT propagate changes upwards
    Fields[K] extends BasicType<infer V>
    ? V
    : never;
};

export type ContainerTreeViewDUType<Fields extends Record<string, Type<unknown>>> = FieldsViewDU<Fields> &
  TreeViewDU<ContainerTypeGeneric<Fields>>;
export type ContainerTreeViewDUTypeConstructor<Fields extends Record<string, Type<unknown>>> = {
  new (type: ContainerTypeGeneric<Fields>, node: Node, cache?: unknown): ContainerTreeViewDUType<Fields>;
};

type ContainerTreeViewDUCache = {
  nodes: Node[];
  caches: unknown[];
  nodesPopulated: boolean;
};

class ContainerTreeViewDU<Fields extends Record<string, Type<unknown>>> extends TreeViewDU<
  ContainerTypeGeneric<Fields>
> {
  protected nodes: Node[] = [];
  protected caches: unknown[];
  protected views: unknown[] = [];
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
          this.type.fieldsEntries[index].fieldType as unknown as CompositeType<unknown, unknown, unknown>
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

export function getContainerTreeViewDUClass<Fields extends Record<string, Type<unknown>>>(
  type: ContainerTypeGeneric<Fields>
): ContainerTreeViewDUTypeConstructor<Fields> {
  class CustomContainerTreeViewDU extends ContainerTreeViewDU<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType} = type.fieldsEntries[index];

    // If the field type is basic, the value to get and set will be the actual 'struct' value (i.e. a JS number).
    // The view must use the tree_getFromNode() and tree_setToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (fieldType.isBasic) {
      const fieldTypeBasic = fieldType as unknown as BasicType<unknown>;
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

          return fieldTypeBasic.tree_getFromNode(node as LeafNode) as unknown;
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

          fieldTypeBasic.tree_setToNode(nodeChanged as LeafNode, value);
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView. The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else {
      const fieldTypeComposite = fieldType as unknown as CompositeType<unknown, unknown, unknown>;
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // Returns TreeViewDU of fieldName
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

          const cache = fieldTypeComposite.cacheOfViewDU(view);
          if (cache) {
            this.caches[index] = cache;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return view;
        },

        // Expects TreeViewDU of fieldName
        set: function (this: CustomContainerTreeViewDU, view: unknown) {
          // Commit any temp data and transfer cache
          const node = fieldTypeComposite.commitViewDU(view);

          // Should transfer cache?
          this.caches[index] = fieldTypeComposite.cacheOfViewDU(view);

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
