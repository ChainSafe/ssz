import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, TreeView, Type} from "../abstract";
import {BranchNodeStruct} from "../branchNodeStruct";
import {ContainerTreeViewTypeConstructor, ContainerTypeGeneric, ValueOfFields} from "./container";

/* eslint-disable @typescript-eslint/member-ordering */

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
    if (fieldType.isBasic) {
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeView) {
          return (this.tree.rootNode as BranchNodeStruct<ValueOfFields<Fields>>).value[fieldName] as unknown;
        },

        set: function (this: CustomContainerTreeView, value: unknown) {
          const node = this.tree.rootNode as BranchNodeStruct<ValueOfFields<Fields>>;
          const {value: prevNodeValue} = node;

          // TODO: Should this check for valid field name? Benchmark the cost
          const newNodeValue = {...prevNodeValue, [fieldName]: value} as ValueOfFields<Fields>;
          this.tree.rootNode = new BranchNodeStruct(node["valueToNode"], newNodeValue);
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

        // Returns TreeView of fieldName
        get: function (this: CustomContainerTreeView): unknown {
          const {value} = this.tree.rootNode as BranchNodeStruct<ValueOfFields<Fields>>;
          return fieldTypeComposite.toView(value[fieldName]);
        },

        // Expects TreeView of fieldName
        set: function (this: CustomContainerTreeView, view: unknown) {
          const node = this.tree.rootNode as BranchNodeStruct<ValueOfFields<Fields>>;
          const {value: prevNodeValue} = node;

          // TODO: Should this check for valid field name? Benchmark the cost
          const value = fieldTypeComposite.toValueFromView(view) as unknown;
          const newNodeValue = {...prevNodeValue, [fieldName]: value} as ValueOfFields<Fields>;
          this.tree.rootNode = new BranchNodeStruct(node["valueToNode"], newNodeValue);
        },
      });
    }
  }

  // TODO:
  // Change class name
  // Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

  return CustomContainerTreeView as unknown as ContainerTreeViewTypeConstructor<Fields>;
}
