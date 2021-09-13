import {LeafNode, Node, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract";
import {BasicType} from "../type/basic";
import {ListBasicType} from "../view/listBasic";
import {ArrayBasicTreeViewDU, ArrayBasicTreeViewDUCache} from "./arrayBasic";

export class ListBasicTreeViewDU<ElementType extends BasicType<unknown>> extends ArrayBasicTreeViewDU<ElementType> {
  constructor(readonly type: ListBasicType<ElementType>, protected _rootNode: Node, cache?: ArrayBasicTreeViewDUCache) {
    super(type, _rootNode, cache);
  }

  /**
   * Adds one value element at the end of the array and adds 1 to the un-commited ViewDU length
   */
  push(value: ValueOf<ElementType>): void {
    if (this._length >= this.type.limit) {
      throw Error("Error pushing over limit");
    }

    // Mutate length before .set()
    this.dirtyLength = true;
    const index = this._length++;

    // If in new node..
    if (index % this.type.itemsPerChunk === 0) {
      // Set a zero node to the nodes array to avoid a navigation downwards in .set()
      const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
      this.nodes[chunkIndex] = zeroNode(0) as LeafNode;
    }

    this.set(index, value);
  }
}
