import {Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeValue} from "../../interface";
import {ContainerType, isCompositeType} from "../../types";
import {TreeValue} from "./abstract";
import {ValueOf} from "./interface";
import {createTreeBacked, isTreeBacked} from "./proxy";

export class ContainerTreeValue<T extends CompositeValue> extends TreeValue<T> {
  type: ContainerType<T>;

  constructor(type: ContainerType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  getProperty<P extends keyof T>(property: P): ValueOf<T, P> {
    const propType = this.type.getPropertyType(property);
    const propValue = this.type.tree_getProperty(this.tree, property);
    if (isCompositeType(propType)) {
      return (createTreeBacked(propType, propValue as Tree) as unknown) as ValueOf<T, P>;
    } else {
      return propValue as ValueOf<T, P>;
    }
  }
  setProperty<P extends keyof T>(property: P, value: ValueOf<T, P>): boolean {
    const propType = this.type.getPropertyType(property);
    if (isCompositeType(propType)) {
      if (isTreeBacked(value)) {
        return this.type.tree_setProperty(this.tree, property, value.tree);
      } else {
        return this.type.tree_setProperty(
          this.tree,
          property,
          propType.struct_convertToTree((value as unknown) as CompositeValue)
        );
      }
    } else {
      return this.type.tree_setProperty(this.tree, property, value);
    }
  }
  *keys(): IterableIterator<keyof T> {
    yield* this.getPropertyNames() as (keyof T)[];
  }
  *values(): IterableIterator<ValueOf<T>> {
    for (const [_key, value] of this.entries()) {
      yield value;
    }
  }
  *entries(): IterableIterator<[keyof T, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.type.tree_iterateValues(this.tree)) {
      const propName = keys[i] as keyof T;
      const propType = this.type.getPropertyType(propName);
      if (isCompositeType(propType)) {
        yield [propName, (createTreeBacked(propType, value as Tree) as unknown) as T[keyof T]];
      } else {
        yield [propName, value as T[keyof T]];
      }
      i++;
    }
  }
}
