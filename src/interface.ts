/* eslint-disable @typescript-eslint/interface-name-prefix */

/**
 * These interfaces are consistent across all backings.
 * As long as these interfaces are respected, the backing can be abstracted entirely.
 */

export interface ArrayLike<T> {
  [n: number]: T;
  readonly length: number;
  [Symbol.iterator](): Iterator<T>;
}

export type Vector<T> = ArrayLike<T>;

export interface List<T> extends ArrayLike<T> {
  push(...values: T[]): number;
  pop(): T;
}

export type Container<T extends object> = T;

export type ByteVector = Vector<number>;

export type BitVector = Vector<boolean>;

export type BitList = List<boolean>;

export interface ObjectLike {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [fieldName: string]: any;
}

export type CompositeValue = Record<string, unknown> | ArrayLike<unknown> | {};

/**
 * The Json interface is used for json-serializable input
 */
export type Json = string | number | boolean | null | {[property: string]: Json} | Json[];
