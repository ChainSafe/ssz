import {Node} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, TreeViewDU, Type, ValueOf} from "../abstract";
import {BranchNodeStruct} from "../branchNodeStruct";
import {ContainerTypeGeneric, ValueOfFields} from "../view/container";
import {ContainerTreeViewDUTypeConstructor} from "./container";

/* eslint-disable @typescript-eslint/member-ordering */

class ContainerTreeViewDU<Fields extends Record<string, Type<unknown>>> extends TreeViewDU<
  ContainerTypeGeneric<Fields>
> {
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
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeViewDU): ValueOf<Fields[keyof Fields]> {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return (this.valueChanged || this._rootNode.value)[fieldName];
        },

        set: function (this: CustomContainerTreeViewDU, value: ValueOf<Fields[keyof Fields]>) {
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
      const fieldTypeComposite = fieldType as unknown as CompositeType<unknown, unknown, unknown>;
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // Returns TreeViewDU of fieldName
        get: function (this: CustomContainerTreeViewDU): unknown {
          const value = this.valueChanged || this._rootNode.value;
          return fieldTypeComposite.toViewDU(value[fieldName]);
        },

        // Expects TreeViewDU of fieldName
        set: function (this: CustomContainerTreeViewDU, view: unknown) {
          if (this.valueChanged === null) {
            this.valueChanged = {...this._rootNode.value};
          }

          const value = fieldTypeComposite.toValueFromViewDU(view);
          this.valueChanged[fieldName] = value as ValueOf<Fields[keyof Fields]>;
        },
      });
    }
  }

  // TODO:
  // Change class name
  // Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

  return CustomContainerTreeViewDU as unknown as ContainerTreeViewDUTypeConstructor<Fields>;
}
