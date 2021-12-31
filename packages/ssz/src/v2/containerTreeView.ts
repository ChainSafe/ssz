import {LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, TreeView, Type, ValueOf} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export type ContainerTypeGeneric<Fields extends Record<string, Type<any>>> = CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>
> & {
  readonly fields: Fields;
  readonly fieldsEntries: {fieldName: keyof Fields; fieldType: Fields[keyof Fields]}[];
};

type ValueOfFields<Fields extends Record<string, Type<any>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

type ViewOfFields<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<any, any>
    ? // If composite, return view. MAY propagate changes updwards
      ReturnType<Fields[K]["getView"]>
    : // If basic, return struct value. Will NOT propagate changes upwards
      Fields[K]["defaultValue"];
};

type ContainerTreeViewType<Fields extends Record<string, Type<any>>> = ViewOfFields<Fields> & TreeView;
type ContainerTreeViewTypeConstructor<Fields extends Record<string, Type<any>>> = {
  new (type: ContainerTypeGeneric<Fields>, tree: Tree, inMutableMode?: boolean): ContainerTreeViewType<Fields>;
};

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

  toMutable(): void {
    this.inMutableMode = true;
  }

  commit(): void {
    if (this.dirtyNodes.size === 0) {
      return;
    }

    // TODO: Use fast setNodes() method
    for (const i of this.dirtyNodes) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(i);
      if (this.type.fieldsEntries[i].fieldType.isBasic) {
        this.tree.setNode(gindex, this.leafNodes[i]);
      } else {
        this.views[i].commit();
        this.tree.setNode(gindex, this.views[i].node);
      }
    }

    this.dirtyNodes.clear();
    this.inMutableMode = false;
  }

  protected serializedSize(): number {
    let totalSize = 0;

    for (let i = 0; i < this.type.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.type.fieldsEntries[i];
      if (fieldType.fixedLen === null) {
        // Offset (4 bytes) + size
        // Re-use the getter logic defined `Object.defineProperty()` below.
        // Will get the cached view if any otherwise create a new view.
        totalSize += 4 + (this as unknown as Record<keyof Fields, TreeView>)[fieldName]["serializedSize"]();
      } else {
        totalSize += fieldType.fixedLen;
      }
    }

    return totalSize;
  }
}

export function getContainerTreeViewClass<Fields extends Record<string, Type<any>>>(
  type: ContainerTypeGeneric<Fields>
): ContainerTreeViewTypeConstructor<Fields> {
  class CustomContainerTreeView extends ContainerTreeView<Fields> {}

  // Dynamically define prototype methods
  for (let i = 0; i < type.fieldsEntries.length; i++) {
    const {fieldName, fieldType} = type.fieldsEntries[i];
    const gindex = type.getGindexBitStringAtChunkIndex(i);

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
          // First walk through the tree to get the root node for that index
          let leafNode = this.leafNodes[i];
          if (leafNode === undefined) {
            const gindex = this.type.getGindexBitStringAtChunkIndex(i);
            leafNode = this.tree.getNode(gindex) as LeafNode;
            this.leafNodes[i] = leafNode;
          }

          return fieldTypeBasic.getValueFromNode(leafNode) as unknown;
        },

        set: function (this: CustomContainerTreeView, value) {
          // TODO, deduplicate with above
          let leafNode = this.leafNodes[i];
          if (this.leafNodes[i] === undefined) {
            leafNode = this.tree.getNode(gindex) as LeafNode;
            this.leafNodes[i] = leafNode;
          }

          // Create new node if current leafNode is not dirty
          if (!this.inMutableMode || !this.dirtyNodes.has(i)) {
            leafNode = new LeafNode(leafNode);
            this.leafNodes[i] = leafNode;
          }

          fieldTypeBasic.setValueToNode(leafNode, value);

          if (this.inMutableMode) {
            // Do not commit to the tree, but update the node in leafNodes
            this.dirtyNodes.add(i);
          } else {
            this.tree.setNode(gindex, leafNode);
          }
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView. The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else {
      const fieldTypeComposite = fieldType as unknown as CompositeType<any, TreeView>;
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        get: function (this: CustomContainerTreeView) {
          let view = this.views[i];
          if (view === undefined) {
            const subtree = this.tree.getSubtree(gindex);
            view = fieldTypeComposite.getView(subtree, this.inMutableMode);
            this.views[i] = view;
          }

          return view;
        },

        set: function (this: CustomContainerTreeView, value: TreeView) {
          this.views[i] = value;

          if (this.inMutableMode) {
            // Do not commit to the tree, but update the node in leafNodes
            this.dirtyNodes.add(i);
          } else {
            // Commit immediately
            this.tree.setNode(gindex, value.node);
          }
        },
      });
    }
  }

  // TODO:
  // Change class name
  // Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

  return CustomContainerTreeView as unknown as ContainerTreeViewTypeConstructor<Fields>;
}
