import {getNodeAtDepth, getNodesAtDepth, LeafNode, Node, setNodesAtDepth} from "@chainsafe/persistent-merkle-tree";
import {BasicType, TreeViewDU, ValueOf} from "../abstract";
import {ArrayBasicType} from "../view/arrayBasic";

type ArrayBasicTreeViewDUCache = {
  nodes: LeafNode[];
  length: number;
  nodesPopulated: boolean;
};

export class ArrayBasicTreeViewDU<ElementType extends BasicType<unknown>> extends TreeViewDU<
  ArrayBasicType<ElementType>
> {
  protected nodes: LeafNode[];
  protected readonly nodesChanged = new Set<number>();
  protected _length: number;
  protected dirtyLength = false;
  private nodesPopulated: boolean;

  constructor(
    readonly type: ArrayBasicType<ElementType>,
    protected _rootNode: Node,
    cache?: ArrayBasicTreeViewDUCache
  ) {
    super();

    if (cache) {
      this.nodes = cache.nodes;
      this._length = cache.length;
      this.nodesPopulated = cache.nodesPopulated;
    } else {
      this.nodes = [];
      this._length = this.type.tree_getLength(_rootNode);
      this.nodesPopulated = false;
    }
  }

  get length(): number {
    return this._length;
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): ArrayBasicTreeViewDUCache {
    return {
      nodes: this.nodes,
      length: this._length,
      nodesPopulated: this.nodesPopulated,
    };
  }

  /**
   * Get element at index `i`. Returns the primitive element directly
   */
  get(index: number): ValueOf<ElementType> {
    // First walk through the tree to get the root node for that index
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    let node = this.nodes[chunkIndex];
    if (node === undefined) {
      node = getNodeAtDepth(this._rootNode, this.type.depth, index) as LeafNode;
      this.nodes[chunkIndex] = node;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.type.elementType.tree_getFromPackedNode(node, index) as ValueOf<ElementType>;
  }

  set(index: number, value: ValueOf<ElementType>): void {
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);

    // Create new node if current leafNode is not dirty
    let nodeChanged: LeafNode;
    if (this.nodesChanged.has(chunkIndex)) {
      // TODO: This assumes that node has already been populated
      nodeChanged = this.nodes[chunkIndex];
    } else {
      const nodePrev = this.nodes[chunkIndex] ?? (getNodeAtDepth(this._rootNode, this.type.depth, index) as LeafNode);

      nodeChanged = new LeafNode(nodePrev);
      // Store the changed node in the nodes cache
      this.nodes[chunkIndex] = nodeChanged;
      this.nodesChanged.add(chunkIndex);
    }

    this.type.elementType.tree_setToPackedNode(nodeChanged, index, value);
  }

  getAll(): ValueOf<ElementType>[] {
    if (!this.nodesPopulated) {
      const nodesPrev = this.nodes;
      const chunksNode = this.type.tree_getChunksNode(this.node);
      const chunkCount = Math.ceil(this.length / this.type.itemsPerChunk);
      this.nodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, chunkCount) as LeafNode[];

      // Re-apply changed nodes
      for (const index of this.nodesChanged) {
        this.nodes[index] = nodesPrev[index];
      }

      this.nodesPopulated = true;
    }

    const values: ValueOf<ElementType>[] = [];
    const itemsPerChunk = this.type.itemsPerChunk; // Prevent many access in for loop below
    const lenFullNodes = Math.floor(this.length / itemsPerChunk);
    const remainder = this.length % itemsPerChunk;

    for (let n = 0; n < lenFullNodes; n++) {
      const leafNode = this.nodes[n];
      // TODO: Implement add a fast bulk packed element reader in the elementType
      // ```
      // abstract getValuesFromPackedNode(leafNode: LeafNode, output: V[], indexOffset: number): void;
      // ```
      // if performance here is a problem
      for (let i = 0; i < itemsPerChunk; i++) {
        values.push(
          this.type.elementType.tree_getFromPackedNode(leafNode, n * itemsPerChunk + i) as ValueOf<ElementType>
        );
      }
    }

    if (remainder > 0) {
      const leafNode = this.nodes[lenFullNodes];
      for (let i = 0; i < remainder; i++) {
        values.push(
          this.type.elementType.tree_getFromPackedNode(
            leafNode,
            lenFullNodes * itemsPerChunk + i
          ) as ValueOf<ElementType>
        );
      }
    }

    return values;
  }

  commit(): Node {
    if (this.nodesChanged.size === 0) {
      return this._rootNode;
    }

    const indexes = Array.from(this.nodesChanged.keys()).sort();
    const nodesChangedSorted: LeafNode[] = [];
    for (const index of indexes) {
      nodesChangedSorted.push(this.nodes[index]);
    }

    // TODO: Generalize for Vectors
    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    // TODO: Ensure fast setNodesAtDepth() method is correct
    const newChunksNode = setNodesAtDepth(this.type.chunkDepth, chunksNode, indexes, nodesChangedSorted);

    this._rootNode = this.type.tree_setChunksNode(
      this._rootNode,
      newChunksNode,
      this.dirtyLength ? this._length : undefined
    );

    this.nodesChanged.clear();
    this.dirtyLength = false;

    return this._rootNode;
  }

  clone(dontTransferCache?: boolean): ArrayBasicTreeViewDU<ElementType> {
    if (dontTransferCache) {
      return new ArrayBasicTreeViewDU(this.type, this._rootNode);
    } else {
      const cache = this.cache;
      this.nodes = [];
      this.nodesPopulated = false;
      return new ArrayBasicTreeViewDU(this.type, this._rootNode, cache);
    }
  }
}