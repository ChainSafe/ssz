import {
  LeafNode,
  Node,
  getNodeAtDepth,
  setNodesAtDepth,
  treeZeroAfterIndex,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";
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

  sliceTo(index: number): this {
    // Commit before getting rootNode to ensure all pending data is in the rootNode
    this.commit();

    // All nodes beyond length are already zero
    // Array of length 2: [X,X,0,0], for index >= 1 no action needed
    if (index >= this._length - 1) {
      return this;
    }

    const rootNode = this._rootNode;
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const nodePrev = (this.nodes[chunkIndex] ?? getNodeAtDepth(rootNode, this.type.depth, chunkIndex)) as LeafNode;

    const nodeChanged = nodePrev.clone();
    // set remaining items in the same chunk to 0
    for (let i = index + 1; i < (chunkIndex + 1) * this.type.itemsPerChunk; i++) {
      this.type.elementType.tree_setToPackedNode(nodeChanged, i, 0);
    }
    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    let newChunksNode = setNodesAtDepth(chunksNode, this.type.chunkDepth, [chunkIndex], [nodeChanged]);
    // also do the treeZeroAfterIndex operation on the chunks tree
    newChunksNode = treeZeroAfterIndex(newChunksNode, this.type.chunkDepth, chunkIndex);

    // Must set new length and commit to tree to restore the same tree at that index
    const newLength = index + 1;
    const newRootNode = this.type.tree_setChunksNode(rootNode, newChunksNode, newLength);
    return this.type.getViewDU(newRootNode) as this;
  }
}
