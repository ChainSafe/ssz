import {Node, subtreeFillToContents, treeZeroAfterIndex, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {ByteViews, ValueOf} from "../type/abstract";
import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite";
import {ListCompositeType} from "../view/listComposite";
import {ArrayCompositeTreeViewDU, ArrayCompositeTreeViewDUCache} from "./arrayComposite";
import {tree_serializeToBytesArrayComposite} from "../type/arrayComposite";

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
   *
   * Note: Using index = -1, returns an empty list of length 0.
   */
  sliceTo(index: number): this {
    // it's the responsibility of consumer to call commit() before calling this method
    // if we do the commit() here, it'll lose all HashComputations that we want to batch
    if (this.viewsChanged.size > 0) {
      throw Error(`Must commit changes before sliceTo(${index})`);
    }
    const rootNode = this._rootNode;
    const length = this._length;

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
    const newRootNode = this.type.tree_setChunksNode(rootNode, newChunksNode, newLength, null);

    return this.type.getViewDU(newRootNode) as this;
  }

  /**
   * Returns a new ListCompositeTreeViewDU instance with the values from `index` to the end of list
   *
   * ```ts
   * const nodes = getChunkNodes()
   * return listFromChunkNodes(node.slice(index))
   * ```
   *
   * Note: If index === n, returns an empty list of length 0
   *
   */
  sliceFrom(index: number): this {
    // Commit before getting rootNode to ensure all pending data is in the rootNode
    this.commit();

    // If negative index, try to make it positive long as |index| < length
    if (index < 0) {
      index += this.nodes.length;
    }
    // If slicing from 0 or neg index, no slicing is necesary
    if (index <= 0) {
      return this;
    }

    let newChunksNode;
    let newLength;

    if (index >= this.nodes.length) {
      newChunksNode = zeroNode(this.type.chunkDepth);
      newLength = 0;
    } else {
      const nodes = this.nodes.slice(index);
      newChunksNode = subtreeFillToContents(nodes, this.type.chunkDepth);
      newLength = nodes.length;
    }

    const newRootNode = this.type.tree_setChunksNode(this._rootNode, newChunksNode, newLength, null);

    return this.type.getViewDU(newRootNode) as this;
  }

  /**
   * Same method to `type/listComposite.ts` leveraging cached nodes.
   */
  serializeToBytes(output: ByteViews, offset: number): number {
    // it's the responsibility of consumer to call commit() before calling this method
    // if we do the commit() here, it'll lose all HashComputations that we want to batch
    if (this.viewsChanged.size > 0) {
      throw Error(`Must commit changes before serializeToBytes(Uint8Array(${output.uint8Array.length}, ${offset})`);
    }
    this.populateAllNodes();
    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    return tree_serializeToBytesArrayComposite(
      this.type.elementType,
      this._length,
      this.type.chunkDepth,
      chunksNode,
      output,
      offset,
      this.nodes
    );
  }
}
