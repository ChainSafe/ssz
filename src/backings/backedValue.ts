import {TreeBacked} from "./tree";
import {ByteArrayBacked} from "./byteArray";
import {CompositeValue} from "../interface";

export enum BackingType {
  tree = "tree",
  byteArray = "byteArray",
}

/**
 * A BackedValue is a value that is backed by a non-structural type
 *
 * It is implemented as an ES6 Proxy object that provides
 * - convenient access to the structural properties corresponding to its type
 * - additional methods for backing-specific implementations of ssz operations
 */
export type BackedValue<T extends CompositeValue> = TreeBacked<T> | ByteArrayBacked<T>;

export function isBackedValue<T extends CompositeValue>(value: T): value is BackedValue<T> {
  if (value && (value as BackedValue<T>).backingType) {
    return true;
  } else {
    return false;
  }
}
