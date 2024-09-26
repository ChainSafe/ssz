import {
  getNodeAtDepth,
  Gindex,
  zeroNode,
  LeafNode,
  Node,
  toGindexBitstring,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {Type, ValueOf} from "../type/abstract";
import {isBasicType, BasicType} from "../type/basic";
import {isCompositeType, CompositeType} from "../type/composite";
import {TreeView} from "./abstract";
import {BitArray} from "../value/bitArray";
import {NonOptionalFields} from "../type/optional";

export type FieldEntry<Fields extends Record<string, Type<unknown>>> = {
  fieldName: keyof Fields;
  fieldType: Fields[keyof Fields];
  jsonKey: string;
  gindex: Gindex;
  // the position within the activeFields
  chunkIndex: number;
  optional: boolean;
};

/** Expected API of this View's type. This interface allows to break a recursive dependency between types and views */
export type ContainerTypeGeneric<Fields extends Record<string, Type<unknown>>> = CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  unknown
> & {
  readonly fields: Fields;
  readonly fieldsEntries: FieldEntry<NonOptionalFields<Fields>>[];
  readonly activeFields: BitArray;
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
  TreeView<ContainerTypeGeneric<Fields>>;
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
    const {fieldName, fieldType, chunkIndex, optional} = type.fieldsEntries[index];

    // If the field type is basic, the value to get and set will be the actual 'struct' value (i.e. a JS number).
    // The view must use the tree_getFromNode() and tree_setToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (isBasicType(fieldType)) {
      Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeView) {
          const leafNode = getNodeAtDepth(this.node, this.type.depth, chunkIndex) as LeafNode;
          if (optional && leafNode === zeroNode(0)) {
            return null;
          }

          return fieldType.tree_getFromNode(leafNode);
        },

        set: function (this: CustomContainerTreeView, value) {
          if (optional && value == null) {
            const leafNode = zeroNode(0);
            this.tree.setNodeAtDepth(this.type.depth, chunkIndex, leafNode);
            return;
          }

          const leafNodePrev = getNodeAtDepth(this.node, this.type.depth, chunkIndex) as LeafNode;
          const leafNode = leafNodePrev.clone();
          fieldType.tree_setToNode(leafNode, value);
          this.tree.setNodeAtDepth(this.type.depth, chunkIndex, leafNode);
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
          const gindex = toGindexBitstring(this.type.depth, chunkIndex);
          const tree = this.tree.getSubtree(gindex);
          if (optional && tree.rootNode === zeroNode(0)) {
            return null;
          }

          return fieldType.getView(tree);
        },

        // Expects TreeView of fieldName
        set: function (this: CustomContainerTreeView, value: unknown) {
          if (optional && value == null) {
            this.tree.setNodeAtDepth(this.type.depth, chunkIndex, zeroNode(0));
          }

          const node = fieldType.commitView(value);
          this.tree.setNodeAtDepth(this.type.depth, chunkIndex, node);
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
  Object.defineProperty(CustomContainerTreeView, "name", {value: type.typeName, writable: false});

  return CustomContainerTreeView as unknown as ContainerTreeViewTypeConstructor<Fields>;
}

// TODO: deduplicate
type BytesRange = {start: number; end: number};

/**
 * Precompute fixed and variable offsets position for faster deserialization.
 * @returns Does a single pass over all fields and returns:
 * - isFixedLen: If field index [i] is fixed length
 * - fieldRangesFixedLen: For fields with fixed length, their range of bytes
 * - variableOffsetsPosition: Position of the 4 bytes offset for variable size fields
 * - fixedEnd: End of the fixed size range
 * - offsets are relative to the start of serialized active fields, after the Bitvector[N] of optional fields
 */
export function computeSerdesData<Fields extends Record<string, Type<unknown>>>(
  optionalFields: BitArray,
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
  // should not be optionalFields.uint8Array.length because offsets are relative to the start of serialized active fields
  let pointerFixed = 0;

  let optionalIndex = 0;
  for (const {optional, fieldType} of fields) {
    if (optional) {
      if (!optionalFields.get(optionalIndex++)) {
        continue;
      }
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
