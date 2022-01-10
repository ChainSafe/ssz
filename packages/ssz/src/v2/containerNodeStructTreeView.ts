import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, TreeView, TreeViewDU, Type, ValueOf} from "./abstract";
import {BranchNodeStruct} from "./branchNodeStruct";

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
      const fieldTypeComposite = fieldType as unknown as CompositeType<any, unknown, unknown>;
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        get: function (this: CustomContainerTreeView) {
          const {value} = this.tree.rootNode as BranchNodeStruct<ValueOfFields<Fields>>;
          return fieldTypeComposite.toView(value[fieldName]);
        },

        set: function (this: CustomContainerTreeView, view: TreeView) {
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

class ContainerTreeViewDU<Fields extends Record<string, Type<any>>> extends TreeViewDU {
  protected valueChanged: ValueOfFields<Fields> | null = null;
  protected _rootNode: BranchNodeStruct<ValueOfFields<Fields>>;

  constructor(readonly type: ContainerTypeGeneric<Fields>, node: Node) {
    super();
    this._rootNode = node as BranchNodeStruct<ValueOfFields<Fields>>;
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): void {
    return;
  }

  commit(): Node {
    if (this.valueChanged === null) {
      return this._rootNode;
    }

    const value = this.valueChanged;
    this.valueChanged = null;

    this._rootNode = this.type.value_toTree(value) as BranchNodeStruct<ValueOfFields<Fields>>;

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
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeViewDU) {
          return (this.valueChanged || this._rootNode.value)[fieldName] as unknown;
        },

        set: function (this: CustomContainerTreeViewDU, value: unknown) {
          if (this.valueChanged === null) {
            this.valueChanged = {...this._rootNode.value};
          }

          this.valueChanged[fieldName] = value;
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
          const value = this.valueChanged || this._rootNode.value;
          return fieldTypeComposite.toViewDU(value[fieldName]);
        },

        set: function (this: CustomContainerTreeViewDU, view: TreeViewDU) {
          if (this.valueChanged === null) {
            this.valueChanged = {...this._rootNode.value};
          }

          const value = fieldTypeComposite.toValueFromViewDU(view) as unknown;
          this.valueChanged[fieldName] = value;
        },
      });
    }
  }

  // TODO:
  // Change class name
  // Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

  return CustomContainerTreeViewDU as unknown as ContainerTreeViewDUTypeConstructor<Fields>;
}
