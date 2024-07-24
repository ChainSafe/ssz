import type {Node} from "./node";

/**
 * HashComputation to be later used to compute hash of nodes from bottom up.
 * This is also an item of a linked list.
 *     ╔═════════════════════╗             ╔══════════════════════╗
 *     ║       dest          ║             ║      next_dest       ║
 *     ║     /      \        ║  ========>  ║     /       \        ║
 *     ║  src0      src1     ║             ║  next_src0  next_src1║
 *     ╚═════════════════════╝             ╚══════════════════════╝
 */
export type HashComputation = {
  src0: Node;
  src1: Node;
  dest: Node;
  next: HashComputation | null;
};

/**
 * Model HashComputation[] at the same level that support reusing the same memory.
 * Before every run, reset() should be called.
 * After every run, clean() should be called.
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
    // keep this.head object, only release the data
    this.head.src0 = null as unknown as Node;
    this.head.src1 = null as unknown as Node;
    this.head.dest = null as unknown as Node;
    this.tail = null;
    this._length = 0;
    // totalLength is not reset
    this.pointer = null;
  }

  /**
   * Append a new HashComputation to tail.
   * This will overwrite the existing HashComputation if it is not null, or grow the list if needed.
   */
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

  /**
   * Implement Iterator for this class
   */
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

  /**
   * This is convenient method to consume HashComputationLevel with for-of loop
   * See "next" method above for the actual implementation
   */
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
    let hc: HashComputation | null = null;
    for (hc = this.head; hc !== null; hc = hc.next) {
      hashComps.push(hc);
    }
    return hashComps;
  }
}

/**
 * Model HashComputationLevel[] at different levels.
 */
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
export function getHashComputations(node: Node, offset: number, hcByLevel: HashComputationLevel[]): void {
  if (node.h0 === null) {
    const hashComputations = levelAtIndex(hcByLevel, offset);
    const {left, right} = node;
    hashComputations.push(left, right, node);
    // leaf nodes should have h0 to stop the recursion
    getHashComputations(left, offset + 1, hcByLevel);
    getHashComputations(right, offset + 1, hcByLevel);
  }

  // else stop the recursion, node is hashed
}

/**
 * Utility to get HashComputationLevel at a specific index.
 */
export function levelAtIndex(hcByLevel: HashComputationLevel[], index: number): HashComputationLevel {
  if (hcByLevel[index] === undefined) {
    hcByLevel[index] = new HashComputationLevel();
  }
  return hcByLevel[index];
}
