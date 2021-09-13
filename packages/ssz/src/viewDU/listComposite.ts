import {Node, treeZeroAfterIndex} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract";
import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite";
import {ListCompositeType} from "../view/listComposite";
import {ArrayCompositeTreeViewDU, ArrayCompositeTreeViewDUCache} from "./arrayComposite";

export class ListCompositeTreeViewDU<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends ArrayCompositeTreeViewDU<ElementType> {
  constructor(
    readonly type: ListCompositeType<ElementType>,
    protected _rootNode: Node,
    cache?: ArrayCompositeTreeViewDUCache
  ) {
    super(type, _rootNode, cache);
  }

  /**
   * Adds one value element at the end of the array and adds 1 to the un-commited ViewDU length
   */
  push(view: CompositeViewDU<ElementType>): void {
    if (this._length >= this.type.limit) {
      throw Error("Error pushing over limit");
    }

    this.dirtyLength = true;
    const index = this._length++;
    // No need for pre-initialization like in ListBasic.push since ArrayCompositeTreeViewDU.set() doesn't do a get node
    this.set(index, view);
  }

  /**
   * Returns a new ListCompositeTreeViewDU instance with the values from 0 to `index`.
   * The new list is equivalent to (pseudo-code):
   *
   * ```ts
   * const nodes = getChunkNodes()
   * return listFromChunkNodes(nodes.slice(0, index + 1))
   * ```
   *
   * To achieve it, rebinds the underlying tree zero-ing all nodes right of `index`.
   */
  sliceTo(index: number): this {
    // Commit before getting rootNode to ensure all pending data is in the rootNode
    this.commit();
    const rootNode = this._rootNode;
    const length = this.type.tree_getLength(rootNode);

    // All nodes beyond length are already zero
    // Array of length 2: [X,X,0,0], for index >= 1 no action needed
    if (index >= length - 1) {
      return this;
    }

    // Since this is a List, do the treeZeroAfterIndex operation on the chunks tree
    const chunksNode = this.type.tree_getChunksNode(rootNode);
    const newChunksNode = treeZeroAfterIndex(chunksNode, this.type.chunkDepth, index);

    // Must set new length and commit to tree to restore the same tree at that index
    const newLength = index + 1;
    const newRootNode = this.type.tree_setChunksNode(rootNode, newChunksNode, newLength);

    return this.type.getViewDU(newRootNode) as this;
  }
}
