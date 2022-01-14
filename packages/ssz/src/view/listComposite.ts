import {ValueOf} from "../type/abstract";
import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite";
import {ArrayCompositeTreeView} from "./arrayComposite";

export class ListCompositeTreeView<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends ArrayCompositeTreeView<ElementType> {
  push(view: CompositeView<ElementType>): void {
    const length = this.length;
    this.type.tree_setLength(this.tree, length + 1);
    // No need for pre-initialization like in ListBasic.push since ArrayCompositeTreeView.set() doesn't do a get node
    this.set(length, view);
  }
}
