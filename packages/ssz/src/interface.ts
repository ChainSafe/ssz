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
  pop(): T | undefined;
}

export type Container<T extends Record<string, unknown>> = T;

export type ByteVector = Vector<number>;
export type ByteList = List<number>;

export type BitVector = Vector<boolean>;
export type BitList = List<boolean>;

export interface ObjectLike {
  [fieldName: string]: any;
}

export interface Union<T> {
  readonly selector: number;
  value: T;
}

export type CompositeValue = Record<string, any> | ArrayLike<unknown> | Union<unknown> | Record<string, never>;

/**
 * The Json interface is used for json-serializable input
 */
export type Json = string | number | boolean | null | {[property: string]: Json} | Json[];
