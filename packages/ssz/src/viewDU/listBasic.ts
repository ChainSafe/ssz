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

  /**
   * Returns a new ListBasicTreeViewDU instance with the values from 0 to `index`.
   * To achieve it, rebinds the underlying tree zero-ing all nodes right of `chunkIindex`.
   * Also set all value right of `index` in the same chunk to 0.
   */
  sliceTo(index: number): this {
    if (index < 0) {
      throw new Error(`Does not support sliceTo() with negative index ${index}`);
    }

    // Commit before getting rootNode to ensure all pending data is in the rootNode
    this.commit();

    // All nodes beyond length are already zero
    if (index >= this._length - 1) {
      return this;
    }

    const rootNode = this._rootNode;
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const nodePrev = (this.nodes[chunkIndex] ?? getNodeAtDepth(rootNode, this.type.depth, chunkIndex)) as LeafNode;

    // we can't set remaining items in the same chunk to 0 with tree_setToPackedNode api due to setBitwiseOR in UintNumberType
    // instead, we set the same value in nodePrev up until index
    const nodeChanged = LeafNode.fromZero();
    for (let i = chunkIndex * this.type.itemsPerChunk; i <= index; i++) {
      const prevValue = this.type.elementType.tree_getFromPackedNode(nodePrev, i);
      this.type.elementType.tree_setToPackedNode(nodeChanged, i, prevValue);
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
