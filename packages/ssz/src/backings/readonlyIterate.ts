import {CompositeValue} from "../interface";
import {isTreeBacked, ValueOf} from "./tree";

export function readonlyValues<T extends CompositeValue>(obj: T): Iterable<ValueOf<T>> {
  if (isTreeBacked(obj) && obj.readonlyValues) {
    return obj.readonlyValues() as Iterable<ValueOf<T>>;
  } else {
    return Object.values(obj) as Iterable<ValueOf<T>>;
  }
}

export function readonlyEntries<T extends CompositeValue>(obj: T): Iterable<[keyof T, ValueOf<T>]> {
  if (isTreeBacked(obj) && obj.readonlyEntries) {
    return obj.readonlyEntries() as Iterable<[keyof T, ValueOf<T>]>;
  } else {
    return Object.entries(obj) as Iterable<[keyof T, ValueOf<T>]>;
  }
}
