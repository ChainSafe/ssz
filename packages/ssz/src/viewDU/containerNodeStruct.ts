import type {Node, HashComputationLevel} from "@chainsafe/persistent-merkle-tree";
import type {Type, ValueOf} from "../type/abstract";
import {isCompositeType} from "../type/composite";
import type {BranchNodeStruct} from "../branchNodeStruct";
import type {ContainerTypeGeneric, ValueOfFields} from "../view/container";
import type {ContainerTreeViewDUTypeConstructor} from "./container";
import {TreeViewDU} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering */

export class ContainerNodeStructTreeViewDU<Fields extends Record<string, Type<unknown>>> extends TreeViewDU<
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

  get value(): ValueOfFields<Fields> {
    return this.valueChanged ?? this._rootNode.value;
  }

  /**
   * There are 2 cases:
   * - normal commit() or hashTreeRoot(): hcByLevel is null, no need to compute root
   * - batchHashTreeRoot(): hcByLevel is not null, need to compute root because this does not support HashComputation
   */
  commit(_?: number, hcByLevel: HashComputationLevel[] | null = null): void {
    if (this.valueChanged !== null) {
      const value = this.valueChanged;
      this.valueChanged = null;

      this._rootNode = this.type.value_toTree(value) as BranchNodeStruct<ValueOfFields<Fields>>;
    }

    if (this._rootNode.h0 === null && hcByLevel !== null) {
      // consumer is batchHashTreeRoot()
      this._rootNode.rootHashObject;
    }
  }

  protected clearCache(): void {
    this.valueChanged = null;
  }
}

export function getContainerTreeViewDUClass<Fields extends Record<string, Type<unknown>>>(
  type: ContainerTypeGeneric<Fields>
): ContainerTreeViewDUTypeConstructor<Fields> {
  class CustomContainerTreeViewDU extends ContainerNodeStructTreeViewDU<Fields> {}

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
            this.valueChanged = this.type.clone(this._rootNode.value);
          }

          this.valueChanged[fieldName] = value;
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView. The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else if (isCompositeType(fieldType)) {
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // Returns TreeViewDU of fieldName
        get: function (this: CustomContainerTreeViewDU): unknown {
          const value = this.valueChanged || this._rootNode.value;
          return fieldType.toViewDU(value[fieldName]);
        },

        // Expects TreeViewDU of fieldName
        set: function (this: CustomContainerTreeViewDU, view: unknown) {
          if (this.valueChanged === null) {
            this.valueChanged = this.type.clone(this._rootNode.value);
          }

          const value = fieldType.toValueFromViewDU(view);
          this.valueChanged[fieldName] = value as ValueOf<Fields[keyof Fields]>;
        },
      });
    }

    // Should never happen
    else {
      /* istanbul ignore next - unreachable code */
      throw Error(`Unknown fieldType ${fieldType.typeName} for fieldName ${fieldName}`);
    }
  }

  // Change class name
  Object.defineProperty(CustomContainerTreeViewDU, "name", {value: type.typeName, writable: false});

  return CustomContainerTreeViewDU as unknown as ContainerTreeViewDUTypeConstructor<Fields>;
}
