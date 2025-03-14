import {Tree} from "@chainsafe/persistent-merkle-tree";
import {ValueOf} from "../type/abstract.js";
import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite.js";
import {ArrayCompositeTreeView, ArrayCompositeType} from "./arrayComposite.js";

/** Expected API of this View's type. This interface allows to break a recursive dependency between types and views */
export type ListCompositeType<
  ElementType extends CompositeType<unknown, CompositeView<ElementType>, CompositeViewDU<ElementType>>,
> = ArrayCompositeType<ElementType> & {
  readonly limit: number;
};

export class ListCompositeTreeView<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>,
> extends ArrayCompositeTreeView<ElementType> {
  constructor(
    readonly type: ListCompositeType<ElementType>,
    protected tree: Tree
  ) {
    super(type, tree);
  }

  /**
   * Adds one view element at the end of the array and adds 1 to the current Tree length.
   */
  push(view: CompositeView<ElementType>): void {
    const length = this.length;
    if (length >= this.type.limit) {
      throw Error("Error pushing over limit");
    }

    this.type.tree_setLength(this.tree, length + 1);
    // No need for pre-initialization like in ListBasic.push since ArrayCompositeTreeView.set() doesn't do a get node
    this.set(length, view);
  }
}
