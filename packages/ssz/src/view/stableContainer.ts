import {
  Gindex,
  LeafNode,
  Node,
  Tree,
  getNodeAtDepth,
  toGindexBitstring,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";
import {Type, ValueOf} from "../type/abstract.js";
import {BasicType, isBasicType} from "../type/basic.js";
import {CompositeType, isCompositeType} from "../type/composite.js";
import {NonOptionalFields, OptionalType} from "../type/optional.js";
import {BitArray} from "../value/bitArray.js";
import {TreeView} from "./abstract.js";

// some code is here to break the circular dependency between type, view, and viewDU

export type FieldEntry<Fields extends Record<string, Type<unknown>>> = {
  fieldName: keyof Fields;
  fieldType: Fields[keyof Fields];
  jsonKey: string;
  gindex: Gindex;
  optional: boolean;
};

/** Expected API of this View's type. This interface allows to break a recursive dependency between types and views */
export type StableContainerTypeGeneric<Fields extends Record<string, Type<unknown>>> = CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  unknown
> & {
  readonly fields: Fields;
  readonly fieldsEntries: FieldEntry<NonOptionalFields<Fields>>[];

  tree_getActiveFields: (node: Node) => BitArray;
  tree_setActiveFields: (node: Node, activeFields: BitArray) => Node;
  tree_getActiveField: (node: Node, fieldIndex: number) => boolean;
  tree_setActiveField: (node: Node, fieldIndex: number, value: boolean) => Node;
};

export type ValueOfFields<Fields extends Record<string, Type<unknown>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

export type ViewType<T extends Type<unknown>> = T extends CompositeType<unknown, infer TV, unknown>
  ? // If composite, return view. MAY propagate changes updwards
    TV
  : // If basic, return struct value. Will NOT propagate changes upwards
    T extends BasicType<infer V>
    ? V
    : never;

export type OptionalViewType<T extends Type<unknown>> = T extends CompositeType<unknown, infer TV, unknown>
  ? // If composite, return view. MAY propagate changes updwards if not nullish
    TV | null | undefined
  : // If basic, return struct value or nullish. Will NOT propagate changes upwards
    T extends BasicType<infer V>
    ? V | null | undefined
    : never;

export type FieldsView<Fields extends Record<string, Type<unknown>>> = {
  [K in keyof Fields]: Fields[K] extends OptionalType<infer U> ? OptionalViewType<U> : ViewType<Fields[K]>;
};

export type ContainerTreeViewType<Fields extends Record<string, Type<unknown>>> = FieldsView<Fields> &
  TreeView<StableContainerTypeGeneric<Fields>>;
export type ContainerTreeViewTypeConstructor<Fields extends Record<string, Type<unknown>>> = {
  new (type: StableContainerTypeGeneric<Fields>, tree: Tree): ContainerTreeViewType<Fields>;
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
class ContainerTreeView<Fields extends Record<string, Type<unknown>>> extends TreeView<
  StableContainerTypeGeneric<Fields>
> {
  constructor(
    readonly type: StableContainerTypeGeneric<Fields>,
    readonly tree: Tree
  ) {
    super();
  }

  get node(): Node {
    return this.tree.rootNode;
  }
}

export function getContainerTreeViewClass<Fields extends Record<string, Type<unknown>>>(
  type: StableContainerTypeGeneric<Fields>
): ContainerTreeViewTypeConstructor<Fields> {
  class CustomContainerTreeView extends ContainerTreeView<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType, optional} = type.fieldsEntries[index];

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
          if (optional && this.type.tree_getActiveField(this.tree.rootNode, index) === false) {
            return null;
          }
          return fieldType.tree_getFromNode(leafNode);
        },

        set: function (this: CustomContainerTreeView, value) {
          if (optional && value == null) {
            this.tree.setNodeAtDepth(this.type.depth, index, zeroNode(0));
            // only update the active field if necessary
            if (this.type.tree_getActiveField(this.tree.rootNode, index)) {
              this.tree.rootNode = this.type.tree_setActiveField(this.tree.rootNode, index, false);
            }
            return;
          }
          const leafNodePrev = getNodeAtDepth(this.node, this.type.depth, index) as LeafNode;
          const leafNode = leafNodePrev.clone();
          fieldType.tree_setToNode(leafNode, value);
          this.tree.setNodeAtDepth(this.type.depth, index, leafNode);
          // only update the active field if necessary
          if (!this.type.tree_getActiveField(this.tree.rootNode, index)) {
            this.tree.rootNode = this.type.tree_setActiveField(this.tree.rootNode, index, true);
          }
        },
      });
    }

    // If the field type is composite, the value to get and set will be another TreeView (if not nullish). The parent TreeView must
    // cache the view itself to retain the caches of the child view. To set a value the view must return a node to
    // set it to the parent tree in the field gindex.
    else if (isCompositeType(fieldType)) {
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // Returns TreeView of fieldName
        get: function (this: CustomContainerTreeView) {
          const gindex = toGindexBitstring(this.type.depth, index);
          const subtree = this.tree.getSubtree(gindex);
          if (optional && this.type.tree_getActiveField(this.tree.rootNode, index) === false) {
            return null;
          }
          return fieldType.getView(subtree);
        },

        // Expects TreeView of fieldName
        set: function (this: CustomContainerTreeView, value: unknown) {
          if (optional && value == null) {
            this.tree.setNodeAtDepth(this.type.depth, index, zeroNode(0));
            // only update the active field if necessary
            if (this.type.tree_getActiveField(this.tree.rootNode, index)) {
              this.tree.rootNode = this.type.tree_setActiveField(this.tree.rootNode, index, false);
            }
            return;
          }
          const node = fieldType.commitView(value);
          this.tree.setNodeAtDepth(this.type.depth, index, node);
          // only update the active field if necessary
          if (!this.type.tree_getActiveField(this.tree.rootNode, index)) {
            this.tree.rootNode = this.type.tree_setActiveField(this.tree.rootNode, index, false);
          }
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

type BytesRange = {start: number; end: number};

/**
 * Precompute fixed and variable offsets position for faster deserialization.
 * @throws when activeFields does not align with non-optional field types
 * @returns Does a single pass over all fields and returns:
 * - isFixedLen: If field index [i] is fixed length
 * - fieldRangesFixedLen: For fields with fixed length, their range of bytes
 * - variableOffsetsPosition: Position of the 4 bytes offset for variable size fields
 * - fixedEnd: End of the fixed size range
 * -
 */
export function computeSerdesData<Fields extends Record<string, Type<unknown>>>(
  activeFields: BitArray,
  fields: FieldEntry<Fields>[]
): {
  isFixedLen: boolean[];
  fieldRangesFixedLen: BytesRange[];
  variableOffsetsPosition: number[];
  fixedEnd: number;
} {
  const isFixedLen: boolean[] = [];
  const fieldRangesFixedLen: BytesRange[] = [];
  const variableOffsetsPosition: number[] = [];
  let pointerFixed = Math.ceil(activeFields.bitLen / 8);

  for (const [i, {fieldName, fieldType, optional}] of fields.entries()) {
    // if the field is inactive
    if (!activeFields.get(i)) {
      if (!optional) {
        throw new Error(`Field "${String(fieldName)}" must be active since it is not optional`);
      }
      continue;
    }

    isFixedLen.push(fieldType.fixedSize !== null);
    if (fieldType.fixedSize === null) {
      // Variable length
      variableOffsetsPosition.push(pointerFixed);
      pointerFixed += 4;
    } else {
      fieldRangesFixedLen.push({start: pointerFixed, end: pointerFixed + fieldType.fixedSize});
      pointerFixed += fieldType.fixedSize;
    }
  }

  return {
    isFixedLen,
    fieldRangesFixedLen,
    variableOffsetsPosition,
    fixedEnd: pointerFixed,
  };
}
