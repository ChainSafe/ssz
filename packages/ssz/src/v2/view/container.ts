import {getNodeAtDepth, LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, TreeView, TreeViewDU, Type, ValueOf} from "../abstract";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export type ContainerTypeGeneric<Fields extends Record<string, Type<any>>> = CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  TreeViewDU<any>
> & {
  readonly fields: Fields;
  readonly fieldsEntries: {fieldName: keyof Fields; fieldType: Fields[keyof Fields]}[];
};

export type ValueOfFields<Fields extends Record<string, Type<any>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

export type FieldsView<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<unknown, infer TV, unknown>
    ? // If composite, return view. MAY propagate changes updwards
      TV
    : // If basic, return struct value. Will NOT propagate changes upwards
    Fields[K] extends BasicType<infer V>
    ? V
    : never;
};

export type ContainerTreeViewType<Fields extends Record<string, Type<any>>> = FieldsView<Fields> &
  TreeView<ContainerTypeGeneric<Fields>>;
export type ContainerTreeViewTypeConstructor<Fields extends Record<string, Type<any>>> = {
  new (type: ContainerTypeGeneric<Fields>, tree: Tree): ContainerTreeViewType<Fields>;
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
class ContainerTreeView<Fields extends Record<string, Type<any>>> extends TreeView<ContainerTypeGeneric<Fields>> {
  protected readonly views: TreeView<any>[] = [];
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
    // The view must use the tree_getFromNode() and tree_setToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (fieldType.isBasic) {
      const fieldTypeBasic = fieldType as unknown as BasicType<any>;
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeView) {
          const leafNode = getNodeAtDepth(this.node, this.type.depth, index) as LeafNode;
          return fieldTypeBasic.tree_getFromNode(leafNode) as unknown;
        },

        set: function (this: CustomContainerTreeView, value) {
          const leafNodePrev = getNodeAtDepth(this.node, this.type.depth, index) as LeafNode;
          const leafNode = new LeafNode(leafNodePrev);
          fieldTypeBasic.tree_setToNode(leafNode, value);
          this.tree.setNodeAtDepth(this.type.depth, index, leafNode);
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView. The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else {
      const fieldTypeComposite = fieldType as unknown as CompositeType<unknown, unknown, unknown>;
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        get: function (this: CustomContainerTreeView) {
          const gindex = this.type.getGindexBitStringAtChunkIndex(index);
          return fieldTypeComposite.getView(this.tree.getSubtree(gindex));
        },

        set: function (this: CustomContainerTreeView, value: TreeView<any>) {
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
