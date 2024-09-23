import {getNodeAtDepth, LeafNode, Node} from "@chainsafe/persistent-merkle-tree";
import {ByteViews, Type} from "../type/abstract";
import {BasicType, isBasicType} from "../type/basic";
import {CompositeType, isCompositeType} from "../type/composite";
import {ContainerTypeGeneric} from "../view/profile";
import {TreeViewDU} from "./abstract";
import {BasicContainerTreeViewDU, ChangedNode} from "./container";
import {OptionalType} from "../type/optional";

/* eslint-disable @typescript-eslint/member-ordering */

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
  TreeViewDU<ContainerTypeGeneric<Fields>>;
export type ContainerTreeViewDUTypeConstructor<Fields extends Record<string, Type<unknown>>> = {
  new (type: ContainerTypeGeneric<Fields>, node: Node, cache?: unknown): ContainerTreeViewDUType<Fields>;
};

type ContainerTreeViewDUCache = {
  nodes: Node[];
  caches: unknown[];
  nodesPopulated: boolean;
};

class ProfileTreeViewDU<Fields extends Record<string, Type<unknown>>> extends BasicContainerTreeViewDU<Fields> {
  constructor(
    readonly type: ContainerTypeGeneric<Fields>,
    protected _rootNode: Node,
    cache?: ContainerTreeViewDUCache
  ) {
    super(type, _rootNode, cache);
  }

  protected parseNodesChanged(nodesArray: ChangedNode[]): {indexes: number[]; nodes: Node[]} {
    const indexes = new Array<number>(nodesArray.length);
    const nodes = new Array<Node>(nodesArray.length);
    for (const [i, change] of nodesArray.entries()) {
      const {index, node} = change;
      const chunkIndex = this.type.fieldsEntries[index].chunkIndex;
      indexes[i] = chunkIndex;
      nodes[i] = node;
    }
    return {indexes, nodes};
  }

  /**
   * Same method to `type/profile.ts` that call ViewDU.serializeToBytes() of internal fields.
   */
  serializeToBytes(output: ByteViews, offset: number): number {
    this.commit();

    let fixedIndex = offset;
    let variableIndex = offset + this.type.fixedEnd;
    for (let index = 0; index < this.type.fieldsEntries.length; index++) {
      const {fieldType, chunkIndex} = this.type.fieldsEntries[index];
      let node = this.nodes[index];
      if (node === undefined) {
        node = getNodeAtDepth(this._rootNode, this.type.depth, chunkIndex);
        this.nodes[index] = node;
      }
      if (fieldType.fixedSize === null) {
        // write offset
        output.dataView.setUint32(fixedIndex, variableIndex - offset, true);
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
  type: ContainerTypeGeneric<Fields>
): ContainerTreeViewDUTypeConstructor<Fields> {
  class CustomContainerTreeViewDU extends ProfileTreeViewDU<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType, chunkIndex} = type.fieldsEntries[index];

    // If the field type is basic, the value to get and set will be the actual 'struct' value (i.e. a JS number).
    // The view must use the tree_getFromNode() and tree_setToNode() methods to persist the struct data to the node,
    // and use the cached views array to store the new node.
    if (isBasicType(fieldType)) {
      Object.defineProperty(CustomContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,

        // TODO: Review the memory cost of this closures
        get: function (this: CustomContainerTreeViewDU) {
          // First walk through the tree to get the root node for that index
          let node = this.nodes[index];
          if (node === undefined) {
            node = getNodeAtDepth(this._rootNode, this.type.depth, chunkIndex);
            this.nodes[index] = node;
          }

          return fieldType.tree_getFromNode(node as LeafNode) as unknown;
        },

        set: function (this: CustomContainerTreeViewDU, value) {
          // Create new node if current leafNode is not dirty
          let nodeChanged: LeafNode;
          if (this.nodesChanged.has(index)) {
            // TODO: This assumes that node has already been populated
            nodeChanged = this.nodes[index] as LeafNode;
          } else {
            const nodePrev = (this.nodes[index] ??
              getNodeAtDepth(this._rootNode, this.type.depth, chunkIndex)) as LeafNode;

            nodeChanged = nodePrev.clone();
            // Store the changed node in the nodes cache
            this.nodes[index] = nodeChanged;
            this.nodesChanged.add(index);
          }

          fieldType.tree_setToNode(nodeChanged, value);
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
          const viewChanged = this.viewsChanged.get(index);
          if (viewChanged) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return viewChanged;
          }

          let node = this.nodes[index];
          if (node === undefined) {
            node = getNodeAtDepth(this._rootNode, this.type.depth, chunkIndex);
            this.nodes[index] = node;
          }

          // Keep a reference to the new view to call .commit on it latter, only if mutable
          const view = fieldType.getViewDU(node, this.caches[index]);
          if (fieldType.isViewMutable) {
            this.viewsChanged.set(index, view);
          }

          // No need to persist the child's view cache since a second get returns this view instance.
          // The cache is only persisted on commit where the viewsChanged map is dropped.

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return view;
        },

        // Expects TreeViewDU of fieldName
        set: function (this: CustomContainerTreeViewDU, view: unknown) {
          // When setting a view:
          // - Not necessary to commit node
          // - Not necessary to persist cache
          // Just keeping a reference to the view in this.viewsChanged ensures consistency
          this.viewsChanged.set(index, view);
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
