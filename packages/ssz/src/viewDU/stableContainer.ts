import {HashComputationLevel, LeafNode, Node, getNodeAtDepth, zeroNode } from "@chainsafe/persistent-merkle-tree";
import {ByteViews, Type} from "../type/abstract.js";
import {BasicType, isBasicType} from "../type/basic.js";
import {CompositeType, isCompositeType} from "../type/composite.js";
import {OptionalType} from "../type/optional.js";
import {BitArray} from "../value/bitArray.js";
import {StableContainerTypeGeneric, computeSerdesData } from "../view/stableContainer.js";
import {TreeViewDU} from "./abstract.js";
import {BasicContainerTreeViewDU} from "./container.js";



export type ViewDUValue<T extends Type<unknown>> = T extends CompositeType<unknown, unknown, infer TVDU>
  ? // If composite, return view. MAY propagate changes updwards
    TVDU
  : // If basic, return struct value. Will NOT propagate changes upwards
  T extends BasicType<infer V>
  ? V
  : never;

export type OptionalViewDUValue<T extends Type<unknown>> = T extends CompositeType<unknown, unknown, infer TVDU>
  ? // If composite, return view. MAY propagate changes updwards
    TVDU | null | undefined
  : // If basic, return struct value. Will NOT propagate changes upwards
  T extends BasicType<infer V>
  ? V | null | undefined
  : never;

export type FieldsViewDU<Fields extends Record<string, Type<unknown>>> = {
  [K in keyof Fields]: Fields[K] extends OptionalType<infer U> ? OptionalViewDUValue<U> : ViewDUValue<Fields[K]>;
};

export type ContainerTreeViewDUType<Fields extends Record<string, Type<unknown>>> = FieldsViewDU<Fields> &
  TreeViewDU<StableContainerTypeGeneric<Fields>>;
export type ContainerTreeViewDUTypeConstructor<Fields extends Record<string, Type<unknown>>> = {
  new (type: StableContainerTypeGeneric<Fields>, node: Node, cache?: unknown): ContainerTreeViewDUType<Fields>;
};

type ContainerTreeViewDUCache = {
  activeFields: BitArray;
  nodes: Node[];
  caches: unknown[];
  nodesPopulated: boolean;
};

class StableContainerTreeViewDU<Fields extends Record<string, Type<unknown>>> extends BasicContainerTreeViewDU<Fields> {
  /** pending active fields bitvector */
  protected activeFields: BitArray;

  constructor(
    readonly type: StableContainerTypeGeneric<Fields>,
    protected _rootNode: Node,
    cache?: ContainerTreeViewDUCache
  ) {
    super(type, _rootNode, cache);

    if (cache) {
      this.activeFields = cache.activeFields;
    } else {
      this.activeFields = type.tree_getActiveFields(_rootNode);
    }
  }

  get cache(): ContainerTreeViewDUCache {
    const result = super.cache;
    return {...result, activeFields: this.activeFields};
  }

  commit(hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): void {
    super.commit(hcOffset, hcByLevel);
    this._rootNode = this.type.tree_setActiveFields(this._rootNode, this.activeFields);
    if (hcByLevel !== null) {
      hcByLevel[hcOffset].push(this._rootNode.left, this._rootNode.right, this._rootNode);
    }
  }

  /**
   * Same method to `type/container.ts` that call ViewDU.serializeToBytes() of internal fields.
   */
  serializeToBytes(output: ByteViews, offset: number): number {
    this.commit();

    const activeFields = this.type.tree_getActiveFields(this.node);
    // write active fields bitvector
    output.uint8Array.set(activeFields.uint8Array, offset);

    const {fixedEnd} = computeSerdesData(activeFields, this.type.fieldsEntries);

    const activeFieldsLen = activeFields.uint8Array.length;
    let fixedIndex = offset + activeFieldsLen;
    let variableIndex = offset + fixedEnd;
    for (let index = 0; index < this.type.fieldsEntries.length; index++) {
      const {fieldType, optional} = this.type.fieldsEntries[index];
      if (optional && !activeFields.get(index)) {
        continue;
      }

      let node = this.nodes[index];
      if (node === undefined) {
        node = getNodeAtDepth(this._rootNode, this.type.depth, index);
        this.nodes[index] = node;
      }
      if (fieldType.fixedSize === null) {
        // write offset relative to the start of serialized active fields, after the Bitvector[N]
        output.dataView.setUint32(fixedIndex, variableIndex - offset - activeFieldsLen, true);
        fixedIndex += 4;
        // write serialized element to variable section
        // basic types always have fixedSize
        if (isCompositeType(fieldType)) {
          const view = fieldType.getViewDU(node, this.caches[index]) as TreeViewDU<typeof fieldType>;
          if (view.serializeToBytes !== undefined) {
            variableIndex = view.serializeToBytes(output, variableIndex);
          } else {
            // some types don't define ViewDU as TreeViewDU, like the UnionType, in that case view.serializeToBytes = undefined
            variableIndex = fieldType.tree_serializeToBytes(output, variableIndex, node);
          }
        }
      } else {
        fixedIndex = fieldType.tree_serializeToBytes(output, fixedIndex, node);
      }
    }

    return variableIndex;
  }
}

export function getContainerTreeViewDUClass<Fields extends Record<string, Type<unknown>>>(
  type: StableContainerTypeGeneric<Fields>
): ContainerTreeViewDUTypeConstructor<Fields> {
  class CustomContainerTreeViewDU extends StableContainerTreeViewDU<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType, optional} = type.fieldsEntries[index];

    // If the field type is basic, the value to get and set will be the actual 'struct' value (i.e. a JS number).
    // The view must use the tree_getFromNode() and tree_setToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (isBasicType(fieldType)) {
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeViewDU) {
          if (optional && this.activeFields.get(index) === false) {
            return null;
          }

          // First walk through the tree to get the root node for that index
          let node = this.nodes[index];
          if (node === undefined) {
            node = getNodeAtDepth(this._rootNode, this.type.depth, index);
            this.nodes[index] = node;
          }

          return fieldType.tree_getFromNode(node as LeafNode) as unknown;
        },

        set: function (this: CustomContainerTreeViewDU, value) {
          if (optional && value == null) {
            this.nodes[index] = zeroNode(0);
            this.nodesChanged.add(index);
            this.activeFields.set(index, false);
            return;
          }

          // Create new node if current leafNode is not dirty
          let nodeChanged: LeafNode;
          if (this.nodesChanged.has(index)) {
            // TODO: This assumes that node has already been populated
            nodeChanged = this.nodes[index] as LeafNode;
          } else {
            const nodePrev = (this.nodes[index] ?? getNodeAtDepth(this._rootNode, this.type.depth, index)) as LeafNode;

            nodeChanged = nodePrev.clone();
            // Store the changed node in the nodes cache
            this.nodes[index] = nodeChanged;
            this.nodesChanged.add(index);
          }

          fieldType.tree_setToNode(nodeChanged, value);
          this.activeFields.set(index, true);
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
        get: function (this: CustomContainerTreeViewDU) {
          if (optional && this.activeFields.get(index) === false) {
            return null;
          }

          const viewChanged = this.viewsChanged.get(index);
          if (viewChanged) {
            
            return viewChanged;
          }

          let node = this.nodes[index];
          if (node === undefined) {
            node = getNodeAtDepth(this._rootNode, this.type.depth, index);
            this.nodes[index] = node;
          }

          // Keep a reference to the new view to call .commit on it latter, only if mutable
          const view = fieldType.getViewDU(node, this.caches[index]);
          if (fieldType.isViewMutable) {
            this.viewsChanged.set(index, view);
          }

          // No need to persist the child's view cache since a second get returns this view instance.
          // The cache is only persisted on commit where the viewsChanged map is dropped.

          
          return view;
        },

        // Expects TreeViewDU of fieldName
        set: function (this: CustomContainerTreeViewDU, view: unknown) {
          if (optional && view == null) {
            this.nodes[index] = zeroNode(0);
            this.nodesChanged.add(index);
            this.activeFields.set(index, false);
            return;
          }

          // When setting a view:
          // - Not necessary to commit node
          // - Not necessary to persist cache
          // Just keeping a reference to the view in this.viewsChanged ensures consistency
          this.viewsChanged.set(index, view);
          this.activeFields.set(index, true);
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
  Object.defineProperty(CustomContainerTreeViewDU, "name", {value: type.typeName, writable: false});

  return CustomContainerTreeViewDU as unknown as ContainerTreeViewDUTypeConstructor<Fields>;
}
