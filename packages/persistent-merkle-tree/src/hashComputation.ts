import type {Node} from "./node";
// TODO - batch: unit tests

export type HashComputation = {
  src0: Node;
  src1: Node;
  dest: Node;
};

/**
 * Model HashComputation[] at the same level that support reusing the same memory.
 * Before every run, reset() should be called.
 */
export class HashComputationLevel {
  private _length: number;

  constructor(private readonly hashComps: HashComputation[]) {
    this._length = 0;
  }

  get length(): number {
    return this._length;
  }

  /**
   * run before every run
   */
  reset(): void {
    this._length = 0;
  }

  get(index: number): HashComputation {
    return this.hashComps[index];
  }

  push(src0: Node, src1: Node, dest: Node): void {
    if (this._length < this.hashComps.length) {
      const existing = this.hashComps[this._length];
      existing.src0 = src0;
      existing.src1 = src1;
      existing.dest = dest;
    } else {
      this.hashComps.push({src0, src1, dest});
    }

    this._length++;
  }

  /**
   * run after every run
   * hashComps may still refer to the old Nodes, we should release them to avoid memory leak.
   */
  clean(): void {
    for (let i = this._length; i < this.hashComps.length; i++) {
      const hc = this.hashComps[i];
      if (!hc.src0) {
        // we may have already cleaned it in the previous run, return early
        break;
      }
      hc.src0 = null as unknown as Node;
      hc.src1 = null as unknown as Node;
      hc.dest = null as unknown as Node;
    }
  }
}

export class HashComputationGroup {
  constructor(readonly byLevel: HashComputationLevel[]) {}

  reset(): void {
    for (const level of this.byLevel) {
      level.reset();
    }
  }

  push(level: number, src0: Node, src1: Node, dest: Node): void {
    let hashComps = this.byLevel[level];
    if (hashComps === undefined) {
      hashComps = new HashComputationLevel([]);
      this.byLevel[level] = hashComps;
    }

    hashComps.push(src0, src1, dest);
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
    hashCompsByLevel[index] = new HashComputationLevel([]);
  }
  return hashCompsByLevel[index];
}
