import {getNodesAtDepth, LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, ValueOf} from "../type/abstract";
import {CompositeType, TreeView, TreeViewDU} from "../type/composite";

export type ArrayBasicType<ElementType extends BasicType<unknown>> = CompositeType<
  ValueOf<ElementType>[],
  TreeView<ArrayBasicType<ElementType>>,
  TreeViewDU<ArrayBasicType<ElementType>>
> & {
  readonly elementType: ElementType;
  readonly itemsPerChunk: number;
  readonly chunkDepth: number;
  tree_getLength(node: Node): number;
  tree_setLength(tree: Tree, length: number): void;

  // TEMP
  tree_getChunksNode(rootNode: Node): Node;
  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node;
};

export class ArrayBasicTreeView<ElementType extends BasicType<unknown>> extends TreeView<ArrayBasicType<ElementType>> {
  constructor(readonly type: ArrayBasicType<ElementType>, protected tree: Tree) {
    super();
  }

  get length(): number {
    return this.type.tree_getLength(this.tree.rootNode);
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  /**
   * Get element at index `i`. Returns the primitive element directly
   */
  get(index: number): ValueOf<ElementType> {
    // First walk through the tree to get the root node for that index
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const leafNode = this.tree.getNodeAtDepth(this.type.depth, chunkIndex) as LeafNode;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.type.elementType.tree_getFromPackedNode(leafNode, index) as ValueOf<ElementType>;
  }

  set(index: number, value: ValueOf<ElementType>): void {
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const leafNodePrev = this.tree.getNodeAtDepth(this.type.depth, chunkIndex) as LeafNode;

    // Create a new node to preserve immutability
    const leafNode = new LeafNode(leafNodePrev);
    this.type.elementType.tree_setToPackedNode(leafNode, index, value);

    // Commit immediately
    this.tree.setNodeAtDepth(this.type.depth, chunkIndex, leafNode);
  }

  getAll(): ValueOf<ElementType>[] {
    const length = this.length;
    const chunksNode = this.type.tree_getChunksNode(this.node);
    const chunkCount = Math.ceil(length / this.type.itemsPerChunk);
    const leafNodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, chunkCount) as LeafNode[];

    const values: ValueOf<ElementType>[] = [];
    const itemsPerChunk = this.type.itemsPerChunk; // Prevent many access in for loop below
    const lenFullNodes = Math.floor(length / itemsPerChunk);
    const remainder = length % itemsPerChunk;

    for (let n = 0; n < lenFullNodes; n++) {
      const leafNode = leafNodes[n];
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
      const leafNode = leafNodes[lenFullNodes];
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
}
