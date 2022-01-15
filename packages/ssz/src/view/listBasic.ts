import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType, ValueOf} from "../type/abstract";
import {ArrayBasicTreeView} from "./arrayBasic";

export class ListBasicTreeView<ElementType extends BasicType<unknown>> extends ArrayBasicTreeView<ElementType> {
  push(value: ValueOf<ElementType>): void {
    const length = this.length;
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
