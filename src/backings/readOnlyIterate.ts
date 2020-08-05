import {ArrayLike, ObjectLike} from "../interface";

export type ForEachFn<T> = (value: T, index: number) => void;
export type MapFn<T, U> = (value: T, index: number) => U;

export type ReadOnlyIterable<T> = {
  readOnlyForEach(fn: ForEachFn<T>): void;
  readOnlyMap<U>(fn: MapFn<T, U>): U[];
};

export type ReadOnlyObjectIterable<T> = {
  readOnlyEntries(): [string, T[keyof T]][];
};

export function readOnlyForEach<T>(value: ArrayLike<T> | ReadOnlyIterable<T>, fn: ForEachFn<T>): void {
  if ((value as ReadOnlyIterable<T>).readOnlyForEach) {
    (value as ReadOnlyIterable<T>).readOnlyForEach(fn);
  } else {
    (value as ArrayLike<T>).forEach(fn);
  }
}

export function readOnlyMap<T, U>(value: ArrayLike<T> | ReadOnlyIterable<T>, fn: MapFn<T, U>): U[] {
  if ((value as ReadOnlyIterable<T>).readOnlyMap) {
    return (value as ReadOnlyIterable<T>).readOnlyMap(fn);
  } else {
    const result: U[] = [];
    (value as ArrayLike<T>).forEach((v: T, index: number): void => {
      result.push(fn(v, index));
    });
    return result;
  }
}

export function readOnlyEntries<T>(value: ObjectLike | ReadOnlyObjectIterable<T>): [string, T[keyof T]][] {
  if ((value as ReadOnlyObjectIterable<T>).readOnlyEntries) {
    return (value as ReadOnlyObjectIterable<T>).readOnlyEntries();
  } else {
    return Object.entries(value as ObjectLike);
  }
}
