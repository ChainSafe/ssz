/* eslint-disable @typescript-eslint/interface-name-prefix */

/**
 * These interfaces are consistent across all backings.
 * As long as these interfaces are respected, the backing can be abstracted entirely.
 */

export interface ArrayLike<T> {
  [n: number]: T;
  readonly length: number;
  [Symbol.iterator](): Iterator<T>;
  find(fn: (value: T, index: number, array: this) => boolean): T | undefined;
  findIndex(fn: (value: T, index: number, array: this) => boolean): number;
  forEach(fn: (value: T, index: number, array: this) => void): void;
}

export type CompositeValue = Record<string, unknown> | ArrayLike<unknown>;

export type Vector<T, Index = number> = ArrayLike<T>;

export interface List<T> extends ArrayLike<T> {
  push(...values: T[]): number;
  pop(): T;
}

export type Container<T extends ObjectLike> = T;

export type ByteVector = Vector<number>;

export type BitVector = Vector<boolean>;

export type BitList = List<boolean>;

export type ObjectLike = Record<string, unknown> | {};

/**
 * The Json interface is used for json-serializable input
 */
export type Json = string | number | boolean | null | {[property: string]: Json} | Json[];
