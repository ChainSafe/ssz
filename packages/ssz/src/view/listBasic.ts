import {LeafNode, Tree} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract.ts";
import {BasicType} from "../type/basic.ts";
import {ArrayBasicTreeView, ArrayBasicType} from "./arrayBasic.ts";

/** Expected API of this View's type. This interface allows to break a recursive dependency between types and views */
export type ListBasicType<ElementType extends BasicType<unknown>> = ArrayBasicType<ElementType> & {
  readonly limit: number;
};

export class ListBasicTreeView<ElementType extends BasicType<unknown>> extends ArrayBasicTreeView<ElementType> {
  constructor(
    readonly type: ListBasicType<ElementType>,
    protected tree: Tree
  ) {
    super(type, tree);
  }

  /**
   * Adds one value element at the end of the array and adds 1 to the current Tree length.
   */
  push(value: ValueOf<ElementType>): void {
    const length = this.length;
    if (length >= this.type.limit) {
      throw Error("Error pushing over limit");
    }

    this.type.tree_setLength(this.tree, length + 1);

    // If in new node..
    if (length % this.type.itemsPerChunk === 0) {
      // TODO: Optimize: This `inNewNode` could be ommitted but it would cause a full navigation in .set()
      // Benchmark the cost of that navigation vs the extra math here
      // TODO: Optimize: prevent double initialization
      const leafNode = LeafNode.fromZero();
      this.type.elementType.tree_setToPackedNode(leafNode, length, value);

      // Commit immediately
      const chunkIndex = Math.floor(length / this.type.itemsPerChunk);
      this.tree.setNodeAtDepth(this.type.depth, chunkIndex, leafNode);
    } else {
      // Re-use .set() since no new node is added
      this.set(length, value);
    }
  }
}
