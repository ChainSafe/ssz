import {CompositeValue} from "../interface";
import {isTreeBacked, ITreeBacked} from "./tree";

export type Path = (string | number)[];

/**
 * A BackedValue is a value that is backed by a non-structural type
 *
 * It is implemented as an ES6 Proxy object that provides
 * - convenient access to the structural properties corresponding to its type
 * - additional methods for backing-specific implementations of ssz operations
 */
export type BackedValue<T extends CompositeValue> = ITreeBacked<T> & T;

export function isBackedValue<T extends CompositeValue>(value: unknown): value is BackedValue<T> {
  return isTreeBacked(value);
}
