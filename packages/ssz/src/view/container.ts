import {getNodeAtDepth, Gindex, LeafNode, Node, toGindexBitstring, Tree} from "@chainsafe/persistent-merkle-tree";
import {Type, ValueOf} from "../type/abstract.js";
import {isBasicType, BasicType} from "../type/basic.js";
import {isCompositeType, CompositeType} from "../type/composite.js";
import {TreeView} from "./abstract.js";
import {NonOptionalFields} from "../type/optional.js";

export type FieldEntry<Fields extends Record<string, Type<unknown>>> = {
  fieldName: keyof Fields;
  fieldType: Fields[keyof Fields];
  jsonKey: string;
  gindex: Gindex;
};

/** Expected API of this View's type. This interface allows to break a recursive dependency between types and views */
export type BasicContainerTypeGeneric<Fields extends Record<string, Type<unknown>>> = CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  unknown
> & {
  readonly fields: Fields;
  readonly fieldsEntries: (FieldEntry<Fields> | FieldEntry<NonOptionalFields<Fields>>)[];
};

export type ContainerTypeGeneric<Fields extends Record<string, Type<unknown>>> = BasicContainerTypeGeneric<Fields> & {
  readonly fixedEnd: number;
};

export type ValueOfFields<Fields extends Record<string, Type<unknown>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

export type FieldsView<Fields extends Record<string, Type<unknown>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<unknown, infer TV, unknown>
    ? // If composite, return view. MAY propagate changes updwards
      TV
    : // If basic, return struct value. Will NOT propagate changes upwards
    Fields[K] extends BasicType<infer V>
    ? V
    : never;
};

export type ContainerTreeViewType<Fields extends Record<string, Type<unknown>>> = FieldsView<Fields> &
  TreeView<BasicContainerTypeGeneric<Fields>>;
export type ContainerTreeViewTypeConstructor<Fields extends Record<string, Type<unknown>>> = {
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
class ContainerTreeView<Fields extends Record<string, Type<unknown>>> extends TreeView<ContainerTypeGeneric<Fields>> {
  constructor(readonly type: ContainerTypeGeneric<Fields>, readonly tree: Tree) {
    super();
  }

  get node(): Node {
    return this.tree.rootNode;
  }
}

export function getContainerTreeViewClass<Fields extends Record<string, Type<unknown>>>(
  type: ContainerTypeGeneric<Fields>
): ContainerTreeViewTypeConstructor<Fields> {
  class CustomContainerTreeView extends ContainerTreeView<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType} = type.fieldsEntries[index];

    // If the field type is basic, the value to get and set will be the actual 'struct' value (i.e. a JS number).
    // The view must use the tree_getFromNode() and tree_setToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (isBasicType(fieldType)) {
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeView) {
          const leafNode = getNodeAtDepth(this.node, this.type.depth, index) as LeafNode;
          return fieldType.tree_getFromNode(leafNode);
        },

        set: function (this: CustomContainerTreeView, value) {
          const leafNodePrev = getNodeAtDepth(this.node, this.type.depth, index) as LeafNode;
          const leafNode = leafNodePrev.clone();
          fieldType.tree_setToNode(leafNode, value);
          this.tree.setNodeAtDepth(this.type.depth, index, leafNode);
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView. The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else if (isCompositeType(fieldType)) {
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // Returns TreeView of fieldName
        get: function (this: CustomContainerTreeView) {
          const gindex = toGindexBitstring(this.type.depth, index);
          return fieldType.getView(this.tree.getSubtree(gindex));
        },

        // Expects TreeView of fieldName
        set: function (this: CustomContainerTreeView, value: unknown) {
          const node = fieldType.commitView(value);
          this.tree.setNodeAtDepth(this.type.depth, index, node);
        },
      });
    }

    // Should never happen
    else {
      /* istanbul ignore next - unreachable code */
      throw Error(`Unknown fieldType ${fieldType.typeName} for fieldName ${String(fieldName as symbol)}`);
    }
  }

  // Change class name
  Object.defineProperty(CustomContainerTreeView, "name", {value: type.typeName, writable: false});

  return CustomContainerTreeView as unknown as ContainerTreeViewTypeConstructor<Fields>;
}
