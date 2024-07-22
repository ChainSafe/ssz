import type {Node} from "./node";

export type HashComputation = {
  src0: Node;
  src1: Node;
  dest: Node;
  next: HashComputation | null;
};

/**
 * Model HashComputation[] at the same level that support reusing the same memory.
 * Before every run, reset() should be called.
 */
export class HashComputationLevel {
  private _length: number;
  private _totalLength: number;
  // use LinkedList to avoid memory allocation when the list grows
  // always have a fixed head although length is 0
  private head: HashComputation;
  private tail: HashComputation | null;
  private pointer: HashComputation | null;

  constructor() {
    this._length = 0;
    this._totalLength = 0;
    this.head = {
      src0: null as unknown as Node,
      src1: null as unknown as Node,
      dest: null as unknown as Node,
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
    // keep this.head
    this.tail = null;
    this._length = 0;
    // totalLength is not reset
    this.pointer = null;
  }

  push(src0: Node, src1: Node, dest: Node): void {
    if (this.tail !== null) {
      let newTail = this.tail.next;
      if (newTail !== null) {
        newTail.src0 = src0;
        newTail.src1 = src1;
        newTail.dest = dest;
      } else {
        // grow the list
        newTail = {src0, src1, dest, next: null};
        this.tail.next = newTail;
        this._totalLength++;
      }
      this.tail = newTail;
      this._length++;
      return;
    }

    // first item
    this.head.src0 = src0;
    this.head.src1 = src1;
    this.head.dest = dest;
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
    let hc = this.tail?.next ?? null;
    while (hc !== null) {
      if (hc.src0 === null) {
        // we may have already cleaned it in the previous run, return early
        break;
      }
      hc.src0 = null as unknown as Node;
      hc.src1 = null as unknown as Node;
      hc.dest = null as unknown as Node;
      hc = hc.next;
    }
  }

  next(): IteratorResult<HashComputation> {
    if (!this.pointer || this.tail === null) {
      return {done: true, value: undefined};
    }

    // never yield value beyond the tail
    const value = this.pointer;
    const isNull = value.src0 === null;
    this.pointer = this.pointer.next;

    return isNull ? {done: true, value: undefined} : {done: false, value};
  }

  [Symbol.iterator](): IterableIterator<HashComputation> {
    this.pointer = this.head;
    return this;
  }

  /**
   * Not great due to memory allocation.
   * Mainly used for testing.
   */
  toArray(): HashComputation[] {
    const hashComps: HashComputation[] = [];
    for (const hc of this) {
      hashComps.push(hc);
    }
    return hashComps;
  }

  /**
   * For testing.
   */
  dump(): HashComputation[] {
    const hashComps: HashComputation[] = [];
    let hc : HashComputation | null = null;
    for (hc = this.head; hc !== null; hc = hc.next) {
      hashComps.push(hc);
    }
    return hashComps;
  }
}

export class HashComputationGroup {
  readonly byLevel: HashComputationLevel[];
  constructor() {
    this.byLevel = [];
  }

  reset(): void {
    for (const level of this.byLevel) {
      level.reset();
    }
  }

  clean(): void {
    for (const level of this.byLevel) {
      level.clean();
    }
  }
}

/**
 * Get HashComputations from a root node all the way to the leaf nodes.
 */
export function getHashComputations(node: Node, offset: number, hashCompsByLevel: HashComputationLevel[]): void {
  if (node.h0 === null) {
    const hashComputations = levelAtIndex(hashCompsByLevel, offset);
    const {left, right} = node;
    hashComputations.push(left, right, node);
    // leaf nodes should have h0 to stop the recursion
    getHashComputations(left, offset + 1, hashCompsByLevel);
    getHashComputations(right, offset + 1, hashCompsByLevel);
  }

  // else stop the recursion, node is hashed
}

export function levelAtIndex(hashCompsByLevel: HashComputationLevel[], index: number): HashComputationLevel {
  if (hashCompsByLevel[index] === undefined) {
    hashCompsByLevel[index] = new HashComputationLevel();
  }
  return hashCompsByLevel[index];
}
