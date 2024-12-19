import {
  getHashComputations,
  getNodeAtDepth,
  HashComputationLevel,
  LeafNode,
  Node,
  setNodesAtDepth,
} from "@chainsafe/persistent-merkle-tree";
import {ByteViews, Type} from "../type/abstract.js";
import {BasicType, isBasicType} from "../type/basic.js";
import {CompositeType, isCompositeType, CompositeTypeAny} from "../type/composite.js";
import {BasicContainerTypeGeneric, ContainerTypeGeneric} from "../view/container.js";
import {TreeViewDU} from "./abstract.js";

/* eslint-disable @typescript-eslint/member-ordering */

export type FieldsViewDU<Fields extends Record<string, Type<unknown>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<unknown, unknown, infer TVDU>
    ? // If composite, return view. MAY propagate changes updwards
      TVDU
    : // If basic, return struct value. Will NOT propagate changes upwards
    Fields[K] extends BasicType<infer V>
    ? V
    : never;
};

export type ContainerTreeViewDUType<Fields extends Record<string, Type<unknown>>> = FieldsViewDU<Fields> &
  TreeViewDU<ContainerTypeGeneric<Fields>>;
export type ContainerTreeViewDUTypeConstructor<Fields extends Record<string, Type<unknown>>> = {
  new (type: ContainerTypeGeneric<Fields>, node: Node, cache?: unknown): ContainerTreeViewDUType<Fields>;
};

export type ChangedNode = {index: number; node: Node};

type ContainerTreeViewDUCache = {
  nodes: Node[];
  caches: unknown[];
  nodesPopulated: boolean;
};

export class BasicContainerTreeViewDU<Fields extends Record<string, Type<unknown>>> extends TreeViewDU<
  BasicContainerTypeGeneric<Fields>
> {
  protected nodes: Node[] = [];
  protected caches: unknown[];
  protected readonly nodesChanged = new Set<number>();
  protected readonly viewsChanged = new Map<number, unknown>();
  private nodesPopulated: boolean;

  constructor(
    readonly type: BasicContainerTypeGeneric<Fields>,
    protected _rootNode: Node,
    cache?: ContainerTreeViewDUCache
  ) {
    super();

    if (cache) {
      this.nodes = cache.nodes;
      this.caches = cache.caches;
      this.nodesPopulated = cache.nodesPopulated;
    } else {
      this.nodes = [];
      this.caches = [];
      this.nodesPopulated = false;
    }
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): ContainerTreeViewDUCache {
    return {
      nodes: this.nodes,
      caches: this.caches,
      nodesPopulated: this.nodesPopulated,
    };
  }

  /**
   * When we need to compute HashComputations (hcByLevel != null):
   *   - if old _rootNode is hashed, then only need to put pending changes to hcByLevel
   *   - if old _rootNode is not hashed, need to traverse and put to hcByLevel
   */
  commit(hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): void {
    const isOldRootHashed = this._rootNode.h0 !== null;
    if (this.nodesChanged.size === 0 && this.viewsChanged.size === 0) {
      if (!isOldRootHashed && hcByLevel !== null) {
        getHashComputations(this._rootNode, hcOffset, hcByLevel);
      }
      return;
    }

    // each view may mutate hcByLevel at offset + depth
    const offsetView = hcOffset + this.type.depth;
    // if old root is not hashed, no need to pass hcByLevel to child view bc we need to do full traversal here
    const byLevelView = hcByLevel != null && isOldRootHashed ? hcByLevel : null;

    const nodesChanged: ChangedNode[] = [];

    for (const [index, view] of this.viewsChanged) {
      const fieldType = this.type.fieldsEntries[index].fieldType as unknown as CompositeTypeAny;
      const node = fieldType.commitViewDU(view, offsetView, byLevelView);
      // Set new node in nodes array to ensure data represented in the tree and fast nodes access is equal
      this.nodes[index] = node;
      nodesChanged.push({index, node});

      // Cache the view's caches to preserve it's data after 'this.viewsChanged.clear()'
      const cache = fieldType.cacheOfViewDU(view);
      if (cache) this.caches[index] = cache;
    }

    for (const index of this.nodesChanged) {
      nodesChanged.push({index, node: this.nodes[index]});
    }

    // TODO: Optimize to loop only once, Numerical sort ascending
    const nodesChangedSorted = nodesChanged.sort((a, b) => a.index - b.index);
    const {indexes, nodes} = this.parseNodesChanged(nodesChangedSorted);

    this._rootNode = setNodesAtDepth(
      this._rootNode,
      this.type.depth,
      indexes,
      nodes,
      hcOffset,
      isOldRootHashed ? hcByLevel : null
    );

    // old root is not hashed, need to traverse
    if (!isOldRootHashed && hcByLevel !== null) {
      getHashComputations(this._rootNode, hcOffset, hcByLevel);
    }

    this.nodesChanged.clear();
    this.viewsChanged.clear();
  }

  protected parseNodesChanged(nodes: ChangedNode[]): {indexes: number[]; nodes: Node[]} {
    const indexes = nodes.map((entry) => entry.index);
    const nodesArray = nodes.map((entry) => entry.node);
    return {indexes, nodes: nodesArray};
  }

  protected clearCache(): void {
    this.nodes = [];
    this.caches = [];
    this.nodesPopulated = false;

    // Must clear nodesChanged, otherwise a subsequent commit call will break, because it assumes a node is there
    this.nodesChanged.clear();

    // It's not necessary to clear this.viewsChanged since they have no effect on the cache.
    // However preserving _SOME_ caches results in a very unpredictable experience.
    this.viewsChanged.clear();
  }
}

class ContainerTreeViewDU<Fields extends Record<string, Type<unknown>>> extends BasicContainerTreeViewDU<Fields> {
  constructor(
    readonly type: ContainerTypeGeneric<Fields>,
    protected _rootNode: Node,
    cache?: ContainerTreeViewDUCache
  ) {
    super(type, _rootNode, cache);
  }

  /**
   * Same method to `type/container.ts` that call ViewDU.serializeToBytes() of internal fields.
   */
  serializeToBytes(output: ByteViews, offset: number): number {
    this.commit();

    let fixedIndex = offset;
    let variableIndex = offset + this.type.fixedEnd;
    for (let index = 0; index < this.type.fieldsEntries.length; index++) {
      const {fieldType} = this.type.fieldsEntries[index];
      let node = this.nodes[index];
      if (node === undefined) {
        node = getNodeAtDepth(this._rootNode, this.type.depth, index);
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
  class CustomContainerTreeViewDU extends ContainerTreeViewDU<Fields> {}

  // Dynamically define prototype methods
  for (let index = 0; index < type.fieldsEntries.length; index++) {
    const {fieldName, fieldType} = type.fieldsEntries[index];

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
            node = getNodeAtDepth(this._rootNode, this.type.depth, index);
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
            const nodePrev = (this.nodes[index] ?? getNodeAtDepth(this._rootNode, this.type.depth, index)) as LeafNode;

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
      throw Error(`Unknown fieldType ${fieldType.typeName} for fieldName ${String(fieldName as Symbol)}`);
    }
  }

  // Change class name
  Object.defineProperty(CustomContainerTreeViewDU, "name", {value: type.typeName, writable: false});

  return CustomContainerTreeViewDU as unknown as ContainerTreeViewDUTypeConstructor<Fields>;
}
