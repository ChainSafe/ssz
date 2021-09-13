import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite";
import {ArrayCompositeTreeView} from "./arrayComposite";

export class ListCompositeTreeView<
  ElementType extends CompositeType<unknown, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends ArrayCompositeTreeView<ElementType> {
  push(view: CompositeView<ElementType>): void {
    const length = this.length;
    this.type.tree_setLength(this.tree, length + 1);
    this.set(length, view);
  }
}
