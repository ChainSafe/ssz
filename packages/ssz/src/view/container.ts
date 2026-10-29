import {Gindex, LeafNode, Node, Tree, getNodeAtDepth, toGindexBitstring} from "@chainsafe/persistent-merkle-tree";
import {Type, ValueOf} from "../type/abstract.ts";
import {BasicType, isBasicType} from "../type/basic.ts";
import {CompositeType, isCompositeType} from "../type/composite.ts";
import {NonOptionalFields} from "../type/optional.ts";
import {TreeView} from "./abstract.ts";

export type FieldEntry<Fields extends Record<string, Type<unknown>>> = {
  fieldName: keyof Fields;
  fieldType: Fields[keyof Fields];
  jsonKey: string;
  gindex: Gindex;
};

/**
 * Entry for an ephemeral (non-consensus) field. No `gindex` because ephemeral fields are not part of the merkle tree.
 */
export type EphemeralFieldEntry<EphemeralFields extends Record<string, Type<unknown>>> = {
  fieldName: keyof EphemeralFields;
  fieldType: EphemeralFields[keyof EphemeralFields];
  jsonKey: string;
};

/** Expected API of this View's type. This interface allows to break a recursive dependency between types and views */
export type BasicContainerTypeGeneric<
  Fields extends Record<string, Type<unknown>>,
  EphemeralFields extends Record<string, Type<unknown>> = Record<string, never>,
> = CompositeType<
  ValueOfFields<Fields> & EphemeralValueOfFields<EphemeralFields>,
  ContainerTreeViewType<Fields, EphemeralFields>,
  unknown
> & {
  readonly fields: Fields;
  readonly fieldsEntries: (FieldEntry<Fields> | FieldEntry<NonOptionalFields<Fields>>)[];
  // Optional so that other consumers (ProfileType, StableContainerType) need not provide them.
  // ContainerType always populates both — readers should default to `[]` for the loop.
  readonly ephemeralFields?: EphemeralFields;
  readonly ephemeralFieldsEntries?: EphemeralFieldEntry<EphemeralFields>[];
};

export type ContainerTypeGeneric<
  Fields extends Record<string, Type<unknown>>,
  EphemeralFields extends Record<string, Type<unknown>> = Record<string, never>,
> = BasicContainerTypeGeneric<Fields, EphemeralFields> & {
  readonly fixedEnd: number;
};

export type ValueOfFields<Fields extends Record<string, Type<unknown>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

/**
 * `Partial<ValueOfFields<EphemeralFields>>`, but resolves to `unknown` when EphemeralFields is the unspecified
 * default `Record<string, never>` (its `keyof` is `string`). Without this guard, intersecting with
 * `Partial<{[K in string]: never}>` would force every string key of the consensus value to be `undefined`.
 */
export type EphemeralValueOfFields<EphemeralFields extends Record<string, Type<unknown>>> =
  string extends keyof EphemeralFields ? unknown : Partial<ValueOfFields<EphemeralFields>>;

/**
 * Helper for callers that have populated all ephemeral fields and want them required (non-optional) at the type level.
 */
export type PopulatedValueOfFields<
  Fields extends Record<string, Type<unknown>>,
  EphemeralFields extends Record<string, Type<unknown>>,
> = ValueOfFields<Fields> & ValueOfFields<EphemeralFields>;

export type FieldsView<Fields extends Record<string, Type<unknown>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<unknown, infer TV, unknown>
    ? // If composite, return view. MAY propagate changes updwards
      TV
    : // If basic, return struct value. Will NOT propagate changes upwards
      Fields[K] extends BasicType<infer V>
      ? V
      : never;
};

export type ContainerTreeViewType<
  Fields extends Record<string, Type<unknown>>,
  EphemeralFields extends Record<string, Type<unknown>> = Record<string, never>,
> = FieldsView<Fields> &
  EphemeralValueOfFields<EphemeralFields> &
  TreeView<BasicContainerTypeGeneric<Fields, EphemeralFields>>;
export type ContainerTreeViewTypeConstructor<
  Fields extends Record<string, Type<unknown>>,
  EphemeralFields extends Record<string, Type<unknown>> = Record<string, never>,
> = {
  new (type: ContainerTypeGeneric<Fields, EphemeralFields>, tree: Tree): ContainerTreeViewType<Fields, EphemeralFields>;
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
class ContainerTreeView<
  Fields extends Record<string, Type<unknown>>,
  EphemeralFields extends Record<string, Type<unknown>> = Record<string, never>,
> extends TreeView<ContainerTypeGeneric<Fields, EphemeralFields>> {
  /** Storage for ephemeral (non-consensus) field values. Kept per-instance, not in the tree. */
  protected ephemeralValues: Record<string, unknown> = {};

  constructor(
    readonly type: ContainerTypeGeneric<Fields, EphemeralFields>,
    readonly tree: Tree
  ) {
    super();
  }

  get node(): Node {
    return this.tree.rootNode;
  }
}

export function getContainerTreeViewClass<
  Fields extends Record<string, Type<unknown>>,
  EphemeralFields extends Record<string, Type<unknown>> = Record<string, never>,
>(type: ContainerTypeGeneric<Fields, EphemeralFields>): ContainerTreeViewTypeConstructor<Fields, EphemeralFields> {
  class CustomContainerTreeView extends ContainerTreeView<Fields, EphemeralFields> {}

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

  // Define accessors for ephemeral fields. Backed by per-instance `ephemeralValues`, not the tree.
  // No commit/sub-view machinery: ephemerals are stored as raw values.
  for (const {fieldName} of type.ephemeralFieldsEntries ?? []) {
    const key = fieldName as string;
    Object.defineProperty(CustomContainerTreeView.prototype, fieldName, {
      configurable: false,
      enumerable: true,
      get: function (this: CustomContainerTreeView) {
        return (this as unknown as {ephemeralValues: Record<string, unknown>}).ephemeralValues[key];
      },
      set: function (this: CustomContainerTreeView, value: unknown) {
        (this as unknown as {ephemeralValues: Record<string, unknown>}).ephemeralValues[key] = value;
      },
    });
  }

  // Change class name
  Object.defineProperty(CustomContainerTreeView, "name", {value: type.typeName, writable: false});

  return CustomContainerTreeView as unknown as ContainerTreeViewTypeConstructor<Fields, EphemeralFields>;
}
