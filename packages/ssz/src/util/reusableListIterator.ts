import {ListIterator} from "../interface";

class LinkedNode<T> {
  data: T;
  next: LinkedNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

/**
 * A LinkedList that's designed to be reused overtime.
 * Before every run, reset() should be called.
 * After every run, clean() should be called.
 */
export class ReusableListIterator<T> implements ListIterator<T> {
  private head: LinkedNode<T>;
  private tail: LinkedNode<T> | null;
  private _length = 0;
  private _totalLength = 0;
  private pointer: LinkedNode<T> | null;

  constructor() {
    this.head = {
      data: null as unknown as T,
      next: null,
    };
    this.tail = null;
    this.pointer = null;
  }

  get length(): number {
    return this._length;
  }

  get totalLength(): number {
    return this._totalLength;
  }

  /**
   * run before every run
   */
  reset(): void {
    // keep this.head object, only release the data
    this.head.data = null as unknown as T;
    this.tail = null;
    this._length = 0;
    // totalLength is not reset
    this.pointer = null;
  }

  /**
   * Append new data to the tail
   * This will overwrite the existing data if it is not null, or grow the list if needed.
   */
  push(value: T): void {
    if (this.tail !== null) {
      let newTail = this.tail.next;
      if (newTail !== null) {
        newTail.data = value;
      } else {
        // grow the list
        newTail = {data: value, next: null};
        this.tail.next = newTail;
        this._totalLength++;
      }
      this.tail = newTail;
      this._length++;
      return;
    }

    // first item
    this.head.data = value;
    this.tail = this.head;
    this._length = 1;
    if (this._totalLength === 0) {
      this._totalLength = 1;
    }
    // else _totalLength > 0, do not set
  }

  /**
   * run after every run
   * hashComps may still refer to the old Nodes, we should release them to avoid memory leak.
   */
  clean(): void {
    let node = this.tail?.next ?? null;
    while (node !== null && node.data !== null) {
      node.data = null as unknown as T;
      node = node.next;
    }
  }

  /**
   * Implement Iterator for this class
   */
  next(): IteratorResult<T> {
    if (!this.pointer || this.tail === null) {
      return {done: true, value: undefined};
    }

    // never yield value beyond the tail
    const value = this.pointer.data;
    const isNull = value === null;
    this.pointer = this.pointer.next;

    return isNull ? {done: true, value: undefined} : {done: false, value};
  }

  /**
   * This is convenient method to consume HashComputationLevel with for-of loop
   * See "next" method above for the actual implementation
   */
  [Symbol.iterator](): IterableIterator<T> {
    this.pointer = this.head;
    return this;
  }

  toArray(): T[] {
    const result: T[] = [];
    for (const data of this) {
      result.push(data);
    }
    return result;
  }

  /**
   * For testing only
   */
  dump(): T[] {
    const result: T[] = [];
    let node: LinkedNode<T> | null = this.head;
    for (; node !== null; node = node.next) {
      result.push(node.data);
    }
    return result;
  }
}
