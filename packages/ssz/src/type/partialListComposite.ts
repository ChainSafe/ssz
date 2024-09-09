import {fromSnapshot, zeroNode, Snapshot} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, CompositeView, CompositeViewDU} from "./composite";
import {ListCompositeTreeView} from "../view/listComposite";
import {ListCompositeOpts, ListCompositeType} from "./listComposite";
import {PartialListCompositeTreeViewDU} from "../viewDU/partialListComposite";

/**
 * Similar to ListCompositeType, this is mainly used to create a PartialListCompositeTreeViewDU from a snapshot.
 * The ViewDU created is a partial tree created from a snapshot, not a full tree.
 */
export class PartialListCompositeType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends ListCompositeType<ElementType> {
  constructor(readonly elementType: ElementType, readonly limit: number, opts?: ListCompositeOpts) {
    super(elementType, limit, opts);
  }

  snapshotToViewDU(snapshot: Snapshot): PartialListCompositeTreeViewDU<ElementType> {
    const chunksNode = fromSnapshot(snapshot, this.chunkDepth);
    // old root node could be whatever, so leave zeroNode(0) here
    const rootNode = this.tree_setChunksNode(zeroNode(0), chunksNode, snapshot.count);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PartialListCompositeTreeViewDU(this, rootNode, snapshot);
  }

  getView(): ListCompositeTreeView<ElementType> {
    throw new Error("View is not implemented for PartialListCompositeType");
  }

  getViewDU(): PartialListCompositeTreeViewDU<ElementType> {
    throw new Error("Does not support PartialListCompositeType.getViewDU(), use fromSnapshot() instead");
  }

  toViewDU(): PartialListCompositeTreeViewDU<ElementType> {
    throw new Error("Does not support PartialListCompositeType.toViewDU(), use fromSnapshot() instead");
  }
}
