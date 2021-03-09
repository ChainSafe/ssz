import {Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeValue, ArrayLike} from "../../interface";
import {BasicArrayType, CompositeArrayType} from "../../types";
import {TreeValue} from "./abstract";
import {ValueOf} from "./interface";
import {createTreeBacked, isTreeBacked} from "./proxy";

export class BasicArrayTreeValue<T extends ArrayLike<unknown>> extends TreeValue<T> {
  type: BasicArrayType<T>;

  constructor(type: BasicArrayType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  getProperty<P extends keyof T>(property: P): ValueOf<T, P> {
    return this.type.tree_getProperty(this.tree, property) as ValueOf<T, P>;
  }
  setProperty<P extends keyof T>(property: P, value: ValueOf<T, P>): boolean {
    return this.type.tree_setProperty(this.tree, property as number, value);
  }
  *keys(): IterableIterator<keyof T> {
    const propNames = this.getPropertyNames();
    // pop off "length"
    propNames.pop();
    yield* propNames as (keyof T)[];
  }
  values(): IterableIterator<ValueOf<T>> {
    return this.type.tree_iterateValues(this.tree) as IterableIterator<ValueOf<T>>;
  }
  *entries(): IterableIterator<[keyof T, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.values()) {
      yield [keys[i] as keyof T, value];
      i++;
    }
  }
}

export class CompositeArrayTreeValue<T extends ArrayLike<unknown>> extends TreeValue<T> {
  type: CompositeArrayType<T>;

  constructor(type: CompositeArrayType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  getProperty<P extends keyof T>(property: P): ValueOf<T, P> {
    return createTreeBacked(this.type.elementType, this.type.tree_getProperty(this.tree, property) as Tree) as ValueOf<
      T,
      P
    >;
  }
  setProperty<P extends keyof T>(property: P, value: ValueOf<T, P>): boolean {
    return this.type.tree_setProperty(
      this.tree,
      property as number,
      isTreeBacked(value)
        ? value.tree
        : this.type.elementType.struct_convertToTree((value as unknown) as CompositeValue)
    );
  }
  *keys(): IterableIterator<keyof T> {
    const propNames = this.getPropertyNames();
    // pop off "length"
    propNames.pop();
    yield* propNames as (keyof T)[];
  }
  values(): IterableIterator<ValueOf<T>> {
    return this.type.tree_iterateValues(this.tree) as IterableIterator<ValueOf<T>>;
  }
  *entries(): IterableIterator<[keyof T, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.values()) {
      yield [keys[i] as keyof T, value];
      i++;
    }
  }
}
