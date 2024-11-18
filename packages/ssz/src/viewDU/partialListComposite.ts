import type {Node} from "@chainsafe/persistent-merkle-tree";
import {zeroNode, subtreeFillToContents, getNodesAtDepth} from "@chainsafe/persistent-merkle-tree";
import type {ValueOf} from "../type/abstract";
import type {CompositeType, CompositeView, CompositeViewDU} from "../type/composite";
import type {ArrayCompositeTreeViewDUCache} from "./arrayComposite";
import {ListCompositeTreeViewDU} from "./listComposite";
import type {PartialListCompositeType} from "../type/partialListComposite";
import type {Snapshot} from "../util/types";
import {zeroSnapshot} from "../util/snapshot";

/**
 * Similar to ListCompositeTreeViewDU but this is created from a snapshot so some methods are not supported
 * for some specific index ranges.
 * Note that the backed tree is not a full tree, but a partial tree created from a snapshot.
 */
export class PartialListCompositeTreeViewDU<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends ListCompositeTreeViewDU<ElementType> {
  private snapshot: Snapshot;

  constructor(
    readonly type: PartialListCompositeType<ElementType>,
    protected _rootNode: Node,
    snapshot: Snapshot,
    cache?: ArrayCompositeTreeViewDUCache
  ) {
    super(type, _rootNode, cache);
    this.snapshot = snapshot;
  }

  /**
   * Create snapshot from the first `count` elements of the list.
   */
  toSnapshot(count: number): Snapshot {
    if (count < this.snapshot.count) {
      throw new Error(
        `Cannot create snapshot with count ${count} less than existing snapshot count ${this.snapshot.count}`
      );
    }

    return super.toSnapshot(count);
  }

  /** Methods in ArrayCompositeTreeViewDU */

  get(index: number): CompositeViewDU<ElementType> {
    if (index < this.snapshot.count) {
      throw new Error(`Cannot get index ${index} less than existing snapshot count ${this.snapshot.count}`);
    }

    return super.get(index);
  }

  getReadonly(index: number): CompositeViewDU<ElementType> {
    if (index < this.snapshot.count) {
      throw new Error(`Cannot get index ${index} less than existing snapshot count ${this.snapshot.count}`);
    }

    return super.getReadonly(index);
  }

  set(index: number, view: CompositeViewDU<ElementType>): void {
    if (index < this.snapshot.count) {
      throw new Error(`Cannot set index ${index} less than existing snapshot count ${this.snapshot.count}`);
    }

    return super.set(index, view);
  }

  getAllReadonly(): CompositeViewDU<ElementType>[] {
    throw new Error("getAllReadonly() is not supported for PartialListCompositeTreeViewDU");
  }

  getAllReadonlyValues(): ValueOf<ElementType>[] {
    throw new Error("getAllReadonlyValues() is not supported for PartialListCompositeTreeViewDU");
  }

  // commit() is inherited from ArrayCompositeTreeViewDU

  /** Methods in ListCompositeTreeViewDU */

  // push() is inherited from ListCompositeTreeViewDU

  /**
   * Similar to ListCompositeTreeViewDU.sliceTo() but:
   * - throw error if index < snapshot.count - 1
   * - special handle for index === snapshot.count - 1, we restore from snapshot
   */
  sliceTo(index: number): this {
    if (index < this.snapshot.count - 1) {
      throw new Error(
        `Cannot slice to index ${index} less than existing snapshot count - 1 ${this.snapshot.count - 1}`
      );
    }

    this.commit();

    if (index === this.snapshot.count - 1) {
      // super.sliceTo() uses treeZeroAfterIndex() which does not work well in this case
      // this is because treeZeroAfterIndex() requires navigating the tree to index first which we don't have in this case
      return this.type.toPartialViewDU(this.snapshot) as this;
    }

    return super.sliceTo(index);
  }

  /**
   * Similar to ListCompositeTreeViewDU.sliceFrom() but here we cannot call `populateAllNodes()` to get all nodes
   * Use getNodesAtDepth() instead
   */
  sliceFrom(index: number): this {
    if (index < this.snapshot.count - 1) {
      throw new Error(`Cannot slice to index ${index} less than existing snapshot count ${this.snapshot.count - 1}`);
    }

    // Commit before getting rootNode to ensure all pending data is in the rootNode
    this.commit();

    let newChunksNode;
    let newLength;

    if (index >= this.length) {
      newChunksNode = zeroNode(this.type.chunkDepth);
      newLength = 0;
    } else {
      const nodeCount = this.length - index;
      const nodes = getNodesAtDepth(this._rootNode, this.type.depth, index, nodeCount);
      newChunksNode = subtreeFillToContents(nodes, this.type.chunkDepth);
      newLength = nodes.length;
    }

    const newRootNode = this.type.tree_setChunksNode(this._rootNode, newChunksNode, newLength);

    // Use zeroSnapshot because this is equivalent to a full tree
    return new PartialListCompositeTreeViewDU(this.type, newRootNode, zeroSnapshot(this.type.chunkDepth)) as this;
  }

  serializeToBytes(): number {
    throw new Error("serializeToBytes() is not supported for PartialListCompositeTreeViewDU");
  }

  /** Methods in TreeViewDU */

  // hashTreeRoot() is inherited from TreeViewDU
  // batchHashTreeRoot() is inherited from TreeViewDU

  /**
   * Does not support serialize and deserialize, it works through snapshot.
   */
  serialize(): Uint8Array {
    throw new Error("serialize() is not supported for PartialListCompositeTreeViewDU");
  }

  /**
   * Clone using rootNodeToViewDU() instead of getViewDU().
   */
  clone(dontTransferCache?: boolean): this {
    if (dontTransferCache) {
      return this.rootNodeToViewDU(this.node) as this;
    } else {
      const cache = this.cache;
      this.clearCache();
      return this.rootNodeToViewDU(this.node, cache) as this;
    }
  }

  /**
   * Mainly used for testing, to ensure the snapshot is correct.
   * Set undefined values for items 0 to snapshot.count - 1
   */
  toValue(): ValueOf<ElementType>[] {
    const values = new Array<ValueOf<ElementType>>(this.length);

    const snapshotCount = this.snapshot.count;
    const allNodes = getNodesAtDepth(this._rootNode, this.type.depth, snapshotCount, this.length - snapshotCount);
    const type = this.type.elementType;
    // value of 0 to snapshot.count - 1 is from snapshot, and they are undefined
    for (let i = snapshotCount; i < this.length; i++) {
      values[i] = type.toValueFromViewDU(type.getViewDU(allNodes[i - snapshotCount]));
    }

    return values;
  }

  /**
   * Throw error because we only have partial tree in this case.
   */
  protected populateAllNodes(): void {
    throw new Error("populateAllNodes() is not supported for PartialListCompositeTreeViewDU");
  }

  /**
   * Since this.type.getViewDU() is not supported for this type, create a new PartialListCompositeTreeViewDU instead.
   */
  protected rootNodeToViewDU(rootNode: Node, cache?: ArrayCompositeTreeViewDUCache): this {
    return new PartialListCompositeTreeViewDU(this.type, rootNode, this.snapshot, cache) as this;
  }
}
