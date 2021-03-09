import {Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeValue, List} from "../../interface";
import {BasicListType, CompositeListType} from "../../types";
import {BasicArrayTreeValue, CompositeArrayTreeValue} from "./array";
import {ValueOf} from "./interface";
import {isTreeBacked} from "./proxy";

export class BasicListTreeValue<T extends List<unknown>> extends BasicArrayTreeValue<T> {
  type: BasicListType<T>;

  constructor(type: BasicListType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  push(...values: ValueOf<T>[]): number {
    return this.type.tree_push(this.tree, ...values);
  }
  pop(): ValueOf<T> {
    return this.type.tree_pop(this.tree);
  }
}

export class CompositeListTreeValue<T extends List<object>> extends CompositeArrayTreeValue<T> {
  type: CompositeListType<T>;

  constructor(type: CompositeListType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  push(...values: ValueOf<T>[]): number {
    const convertedValues = values.map((value) =>
      isTreeBacked(value)
        ? value.tree
        : this.type.elementType.struct_convertToTree((value as unknown) as CompositeValue)
    );
    return this.type.tree_push(this.tree, ...convertedValues);
  }
  pop(): ValueOf<T> {
    return this.type.tree_pop(this.tree);
  }
}
