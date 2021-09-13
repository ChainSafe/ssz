import {LeafNode, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType, ValueOf} from "../type/abstract";
import {ArrayBasicTreeView} from "./arrayBasic";

export class ListBasicTreeView<ElementType extends BasicType<unknown>> extends ArrayBasicTreeView<ElementType> {
  push(value: ValueOf<ElementType>): void {
    const length = this.length;

    const prevChunkIndex = Math.floor((length - 1) / this.type.itemsPerChunk);
    const chunkIndex = Math.floor(length / this.type.itemsPerChunk);
    const inNewNode = prevChunkIndex !== chunkIndex;

    if (inNewNode) {
      // TODO: Optimize, prevent double initialization
      const leafNode = new LeafNode(zeroNode(0));
      this.type.elementType.tree_setToPackedNode(leafNode, length, value);

      // Commit immediately
      this.tree.setNodeAtDepth(this.type.depth, chunkIndex, leafNode);
    } else {
      // Re-use .set() since no new node is added
      this.set(length, value);
    }

    this.type.tree_setLength(this.tree, length + 1);
  }
}
