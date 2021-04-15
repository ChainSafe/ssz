import {PersistentVector} from "./Vector";

/**
 * A mutable reference to a PersistentVector
 */
export class MutableVector<T> implements Iterable<T> {
  private constructor(public vector: PersistentVector<T>) {}

  static empty<T>(): MutableVector<T> {
    return new MutableVector(PersistentVector.empty);
  }

  static from<T>(values: Iterable<T>): MutableVector<T> {
    return new MutableVector(PersistentVector.from(values));
  }

  get length(): number {
    return this.vector.length;
  }

  get(index: number): T | undefined {
    return this.vector.get(index);
  }

  set(index: number, value: T): void {
    this.vector = this.vector.set(index, value);
  }

  update(index: number, value: Partial<T>): T {
    const updated = {
      ...this.vector.get(index),
      ...value,
    } as T;
    this.vector = this.vector.set(index, updated);
    return updated;
  }

  push(value: T): void {
    this.vector = this.vector.push(value);
  }

  pop(): T | undefined {
    const last = this.vector.get(this.vector.length - 1);
    this.vector = this.vector.pop();
    return last ?? undefined;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.vector[Symbol.iterator]();
  }

  forEach(func: (t: T, i: number) => void): void {
    this.vector.forEach(func);
  }

  map<T2>(func: (t: T, i: number) => T2): T2[] {
    return this.vector.map(func);
  }

  clone(): MutableVector<T> {
    return new MutableVector(this.vector);
  }

  toArray(): T[] {
    return this.vector.toArray();
  }
}
