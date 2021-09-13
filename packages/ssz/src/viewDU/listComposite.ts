import {ValueOf} from "../type/abstract";
import {CompositeType, CompositeView, CompositeViewDU} from "../type/composite";
import {ArrayCompositeTreeViewDU} from "./arrayComposite";

export class ListCompositeTreeViewDU<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends ArrayCompositeTreeViewDU<ElementType> {
  push(view: CompositeViewDU<ElementType>): void {
    this.dirtyLength = true;
    const index = this._length++;
    this.set(index, view);
  }
}
