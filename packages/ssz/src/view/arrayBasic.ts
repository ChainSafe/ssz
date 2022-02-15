import {getNodesAtDepth, LeafNode, Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract";
import {BasicType} from "../type/basic";
import {CompositeType} from "../type/composite";
import {TreeViewDU} from "../viewDU/abstract";
import {TreeView} from "./abstract";

/** Expected API of this View's type. This interface allows to break a recursive dependency between types and views */
export type ArrayBasicType<ElementType extends BasicType<unknown>> = CompositeType<
  ValueOf<ElementType>[],
  TreeView<ArrayBasicType<ElementType>>,
  TreeViewDU<ArrayBasicType<ElementType>>
> & {
  readonly elementType: ElementType;
  readonly itemsPerChunk: number;
  readonly chunkDepth: number;

  /** INTERNAL METHOD: Return the length of this type from an Array's root node */
  tree_getLength(node: Node): number;
  /** INTERNAL METHOD: Mutate a tree's rootNode with a new length value */
  tree_setLength(tree: Tree, length: number): void;
  /** INTERNAL METHOD: Return the chunks node from a root node */
  tree_getChunksNode(rootNode: Node): Node;
  /** INTERNAL METHOD: Return a new root node with changed chunks node and length */
  tree_setChunksNode(rootNode: Node, chunksNode: Node, newLength?: number): Node;
};

export class ArrayBasicTreeView<ElementType extends BasicType<unknown>> extends TreeView<ArrayBasicType<ElementType>> {
  constructor(readonly type: ArrayBasicType<ElementType>, protected tree: Tree) {
    super();
  }

  /**
   * Number of elements in the array. Equal to the Uint32 value of the Tree's length node
   */
  get length(): number {
    return this.type.tree_getLength(this.tree.rootNode);
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  /**
   * Get element at `index`. Returns the Basic element type value directly
   */
  get(index: number): ValueOf<ElementType> {
    // First walk through the tree to get the root node for that index
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const leafNode = this.tree.getNodeAtDepth(this.type.depth, chunkIndex) as LeafNode;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.type.elementType.tree_getFromPackedNode(leafNode, index) as ValueOf<ElementType>;
  }

  /**
   * Set Basic element type `value` at `index`
   */
  set(index: number, value: ValueOf<ElementType>): void {
    const length = this.length;
    if (index >= length) {
      throw Error(`Error setting index over length ${index} > ${length}`);
    }

    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const leafNodePrev = this.tree.getNodeAtDepth(this.type.depth, chunkIndex) as LeafNode;

    // Create a new node to preserve immutability
    const leafNode = leafNodePrev.clone();
    this.type.elementType.tree_setToPackedNode(leafNode, index, value);

    // Commit immediately
    this.tree.setNodeAtDepth(this.type.depth, chunkIndex, leafNode);
  }

  /**
   * Get all values of this array as Basic element type values, from index zero to `this.length - 1`
   */
  getAll(): ValueOf<ElementType>[] {
    const length = this.length;
    const chunksNode = this.type.tree_getChunksNode(this.node);
    const chunkCount = Math.ceil(length / this.type.itemsPerChunk);
    const leafNodes = getNodesAtDepth(chunksNode, this.type.chunkDepth, 0, chunkCount) as LeafNode[];

    const values = new Array<ValueOf<ElementType>>(length);
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
        values[n * itemsPerChunk + i] = this.type.elementType.tree_getFromPackedNode(
          leafNode,
          i
        ) as ValueOf<ElementType>;
      }
    }

    if (remainder > 0) {
      const leafNode = leafNodes[lenFullNodes];
      for (let i = 0; i < remainder; i++) {
        values[lenFullNodes * itemsPerChunk + i] = this.type.elementType.tree_getFromPackedNode(
          leafNode,
          i
        ) as ValueOf<ElementType>;
      }
    }

    return values;
  }
}
