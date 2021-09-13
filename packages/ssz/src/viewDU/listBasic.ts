import {LeafNode, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType, ValueOf} from "../type/abstract";
import {ArrayBasicTreeViewDU} from "./arrayBasic";

export class ListBasicTreeViewDU<ElementType extends BasicType<unknown>> extends ArrayBasicTreeViewDU<ElementType> {
  push(value: ValueOf<ElementType>): void {
    const length = this._length;

    // Mutate length before .set()
    this._length = length + 1;
    this.dirtyLength = true;

    // If in new node..
    if (length % this.type.itemsPerChunk === 0) {
      // Set a zero node to the nodes array to avoid a navigation downwards in .set()
      const chunkIndex = Math.floor(length / this.type.itemsPerChunk);
      this.nodes[chunkIndex] = zeroNode(0) as LeafNode;
    }

    this.set(length, value);
  }
}
