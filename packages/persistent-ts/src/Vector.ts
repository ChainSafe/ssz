const BIT_WIDTH = 5;
const BIT_MASK = 0b11111;
const BRANCH_SIZE = 1 << BIT_WIDTH;
const DEFAULT_LEVEL_SHIFT = 5;

function isFullBranch(length: number): boolean {
  return (
    // initially we initialize Vector with an empty branch (DEFAULT_LEVEL_SHIFT)
    // length === 1 << 5 ||
    length === 1 << 10 || length === 1 << 15 || length === 1 << 20 || length === 1 << 25 || length === 1 << 30
  );
}

interface ILeaf<T> {
  edit: {
    ref: boolean;
  };
  array: T[];
}
interface IBranch<T> {
  edit: {
    ref: boolean;
  };
  // We have explicit undefined because when popping we can set old branches to undefined on purpose.
  array: (INode<T> | undefined)[];
}

type INode<T> = ILeaf<T> | IBranch<T>;

function emptyNode<T>(edit = {ref: false}): INode<T> {
  return {edit, array: Array<INode<T> | undefined>(BRANCH_SIZE).fill(undefined)};
}

function copyNode<T>(node: INode<T>): INode<T> {
  return {edit: node.edit, array: [...node.array] as (INode<T> | undefined)[]};
}

function ensureEditable<T>(node: INode<T>, edit: {ref: boolean}): INode<T> {
  if (node.edit === edit) return node;
  else return {edit, array: [...node.array] as (INode<T> | undefined)[]};
}

/**
 * A PersistentVector is a collection of values indexed by contiguous integers.
 * PersistentVectors support access to items by index in log32N hops.
 */
export class PersistentVector<T> implements Iterable<T> {
  /**
   * The empty vector
   */
  
  static empty: PersistentVector<any> = new PersistentVector<any>(
    emptyNode(),
    DEFAULT_LEVEL_SHIFT,
    Array(BRANCH_SIZE).fill(undefined),
    0
  );

  constructor(
    private readonly root: INode<T>,
    private readonly shift: number,
    private readonly tail: T[],
    readonly length: number
  ) {}

  /**
   * Create a new vector containing certain elements.
   *
   * @param values the values that this vector will contain
   */
  static from<T>(values: Iterable<T>): PersistentVector<T> {
    let acc = PersistentVector.empty.asTransient();
    for (const v of values) acc = acc.push(v);
    return acc.persistent();
  }

  asTransient(): TransientVector<T> {
    return new TransientVector(ensureEditable(this.root, {ref: true}), this.shift, [...this.tail], this.length);
  }

  /**
   * O(log_32(N)) Return the value at a certain index, if it exists.
   *
   * Returns `undefined` if the index is out of the vector's bounds.
   *
   * @param index the index to look up
   */
  get(index: number): T | undefined {
    if (index < 0 || index >= this.length) return undefined;

    let array;
    if (index >= this.getTailOffset()) {
      array = this.tail;
    } else {
      let cursor: INode<T> = this.root;
      for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
        // This cast is fine because we checked the length prior
        cursor = cursor.array[(index >>> level) & BIT_MASK] as INode<T>;
      }
      array = cursor.array;
    }
    return array[index & BIT_MASK] as T;
  }

  /**
   * O(log_32(N)) Return a new vector with an element set to a new value.
   *
   * This will do nothing if the index is negative, or out of the bounds of the vector.
   *
   * @param index the index to set
   * @param value the value to set at that index
   */
  set(index: number, value: T): PersistentVector<T> {
    if (index < 0 || index >= this.length) return this;
    if (index >= this.getTailOffset()) {
      const newTail = [...this.tail];
      newTail[index & BIT_MASK] = value;
      // The element is updated in the tail
      // The root is not changed
      return new PersistentVector(this.root, this.shift, newTail, this.length);
    }
    const base = copyNode(this.root);
    let cursor: INode<T> = base;
    for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
      const subIndex = (index >>> level) & BIT_MASK;
      // This cast is fine because we checked the length prior
      const next: INode<T> = copyNode(cursor.array[subIndex] as INode<T>);
      cursor.array[subIndex] = next;
      cursor = next;
    }
    cursor.array[index & BIT_MASK] = value;
    // tail is not changed
    return new PersistentVector(base, this.shift, this.tail, this.length);
  }

  /**
   * O(log_32(N)) Append a value to the end of this vector.
   *
   * This is useful for building up a vector from values.
   *
   * @param value the value to push to the end of the vector
   */
  push(value: T): PersistentVector<T> {
    if (this.getTailLength() < BRANCH_SIZE) {
      // has space in tail
      const newTail = [...this.tail];
      newTail[this.length % BRANCH_SIZE] = value;
      // The element is added to the tail
      // The root is not changed
      return new PersistentVector(this.root, this.shift, newTail, this.length + 1);
    }
    // There's not enough space in the tail
    let base: INode<T>;
    let levelShift = this.shift;
    if (isFullBranch(this.length - BRANCH_SIZE)) {
      base = emptyNode();
      base.array[0] = this.root;
      levelShift += BIT_WIDTH;
    } else {
      base = copyNode(this.root);
    }
    // getTailOffset is actually the 1st item in tail
    // we now move it to the tree
    const index = this.getTailOffset();
    let cursor: INode<T> = base;
    for (let level = levelShift; level > 0; level -= BIT_WIDTH) {
      const subIndex = (index >>> level) & BIT_MASK;
      let next: INode<T> | undefined = cursor.array[subIndex] as IBranch<T>;
      if (!next) {
        next = emptyNode();
      } else {
        next = copyNode(next);
      }
      cursor.array[subIndex] = next;
      cursor = next;
    }
    // it's safe to update cursor bc "next" is a new instance anyway
    cursor.array = [...this.tail];
    return new PersistentVector<T>(
      base,
      levelShift,
      [value, ...(Array(BRANCH_SIZE - 1).fill(undefined) as T[])],
      this.length + 1
    );
  }

  /**
   * Return a new Vector with the last element removed.
   *
   * This does nothing if the Vector contains no elements.
   */
  pop(): PersistentVector<T> {
    if (this.length === 0) return this;
    // we always have a non-empty tail
    const tailLength = this.getTailLength();
    if (tailLength >= 2) {
      // ignore the last item
      const newTailLength = (this.length - 1) % BRANCH_SIZE;
      const newTail = [
        ...this.tail.slice(0, newTailLength),
        ...(Array(BRANCH_SIZE - newTailLength).fill(undefined) as T[]),
      ];
      return new PersistentVector(this.root, this.shift, newTail, this.length - 1);
    }
    // tail has exactly 1 item, promote the right most leaf node as tail
    const lastItemIndexInTree = this.getTailOffset() - 1;
    // Tree has no item
    if (lastItemIndexInTree < 0) {
      return PersistentVector.empty;
    }
    const base = copyNode(this.root);
    let cursor: INode<T> = base;
    // we always have a parent bc we create an empty branch initially
    let parent: INode<T> | undefined = undefined;
    let subIndex: number;
    for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
      subIndex = (lastItemIndexInTree >>> level) & BIT_MASK;
      // This cast is fine because we checked the length prior
      const next: INode<T> = copyNode(cursor.array[subIndex] as INode<T>);
      cursor.array[subIndex] = next;
      parent = cursor;
      cursor = next;
    }
    const newTail = [...cursor.array] as T[];
    parent!.array[subIndex!] = emptyNode<T>();
    let newLevelShift = this.shift;
    let newRoot: INode<T> = base;
    if (isFullBranch(this.length - 1 - BRANCH_SIZE)) {
      newRoot = base.array[0] as IBranch<T>;
      newLevelShift -= BIT_WIDTH;
    }
    return new PersistentVector<T>(copyNode(newRoot), newLevelShift, newTail, this.length - 1);
  }

  *keys(): IterableIterator<number> {
    yield* Array.from({length: this.length}, (_, i) => i);
  }

  *values(): IterableIterator<T> {
    function* iterateNodeValues(node: INode<T>, level: number): Iterable<T> {
      if (level <= 0) {
        yield* (node as ILeaf<T>).array.filter((i) => i != null);
      } else {
        for (const child of (node as IBranch<T>).array.filter((i) => i != null)) {
          yield* iterateNodeValues(child as INode<T>, level - BIT_WIDTH);
        }
      }
    }
    yield* iterateNodeValues(this.root, this.shift);
    yield* this.tail.slice(0, this.getTailLength());
  }

  /**
   * Implement Iterable interface.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.toArray();
  }

  /**
   */
  forEach(func: (t: T, i: number) => void): void {
    this.toArray().forEach(func);
  }

  /**
   * Map to an array of T2.
   */
  map<T2>(func: (t: T, i: number) => T2): T2[] {
    return this.toArray().map(func);
  }

  /**
   * Convert to regular typescript array
   */
  toArray(): T[] {
    const values: T[] = [];
    iterateNodeValues(this.root, this.shift, values);
    values.push(...this.tail.slice(0, this.getTailLength()));
    return values;
  }

  /**
   * Clone to a new vector.
   */
  clone(): PersistentVector<T> {
    return new PersistentVector(this.root, this.shift, this.tail, this.length);
  }

  private getTailLength(): number {
    return this.length - this.getTailOffset();
  }

  /**
   * Returns the first index of the tail, also the number of the leaf elements in the tree
   */
  private getTailOffset(): number {
    return this.length < BRANCH_SIZE ? 0 : ((this.length - 1) >>> BIT_WIDTH) << BIT_WIDTH;
  }
}

/**
 * A TransientVector is a collection of values indexed by contiguous integers.
 * TransientVectors support access to items by index in log32N hops.
 */
export class TransientVector<T> implements Iterable<T> {
  constructor(private root: INode<T>, private shift: number, private tail: T[], readonly length: number) {}

  /**
   * The empty vector
   */
  
  static empty<T>(): TransientVector<T> {
    return new TransientVector<T>(emptyNode({ref: true}), DEFAULT_LEVEL_SHIFT, Array(BRANCH_SIZE).fill(undefined), 0);
  }

  /**
   * Create a new vector containing certain elements.
   *
   * @param values the values that this vector will contain
   */
  static from<T>(values: Iterable<T>): TransientVector<T> {
    let acc = TransientVector.empty<T>();
    for (const v of values) acc = acc.push(v);
    return acc;
  }

  ensureEditable(): void {
    if (!this.root.edit.ref) {
      throw new Error("Transient used after persistent call");
    }
  }

  persistent(): PersistentVector<T> {
    this.ensureEditable();
    this.root.edit.ref = false;
    const trimmedTail = this.tail.slice(0, this.getTailLength());
    return new PersistentVector(this.root, this.shift, trimmedTail, this.length);
  }

  /**
   * O(log_32(N)) Return the value at a certain index, if it exists.
   *
   * Returns `undefined` if the index is out of the vector's bounds.
   *
   * @param index the index to look up
   */
  get(index: number): T | undefined {
    if (index < 0 || index >= this.length) return undefined;

    let array;
    if (index >= this.getTailOffset()) {
      array = this.tail;
    } else {
      let cursor: INode<T> = this.root;
      for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
        // This cast is fine because we checked the length prior
        cursor = cursor.array[(index >>> level) & BIT_MASK] as INode<T>;
      }
      array = cursor.array;
    }
    return array[index & BIT_MASK] as T;
  }

  /**
   * O(log_32(N)) Return a new vector with an element set to a new value.
   *
   * This will do nothing if the index is negative, or out of the bounds of the vector.
   *
   * @param index the index to set
   * @param value the value to set at that index
   */
  set(index: number, value: T): TransientVector<T> {
    this.ensureEditable();
    if (index < 0 || index >= this.length) return this;
    if (index >= this.getTailOffset()) {
      this.tail[index & BIT_MASK] = value;
      // The element is updated in the tail
      // The root is not changed
      return this;
    }
    let cursor: INode<T> = this.root;
    for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
      const subIndex = (index >>> level) & BIT_MASK;
      // This cast is fine because we checked the length prior
      const next: INode<T> = ensureEditable(cursor.array[subIndex] as INode<T>, this.root.edit);
      cursor.array[subIndex] = next;
      cursor = next;
    }
    cursor.array[index & BIT_MASK] = value;
    // tail is not changed
    return this;
  }

  /**
   * O(log_32(N)) Append a value to the end of this vector.
   *
   * This is useful for building up a vector from values.
   *
   * @param value the value to push to the end of the vector
   */
  push(value: T): TransientVector<T> {
    this.ensureEditable();
    if (this.getTailLength() < BRANCH_SIZE) {
      // has space in tail
      this.tail[this.length % BRANCH_SIZE] = value;
      
      // @ts-ignore
      this.length += 1;
      // The element is added to the tail
      // The root is not changed
      return this;
    }
    // There's not enough space in the tail
    if (isFullBranch(this.length - BRANCH_SIZE)) {
      const base: INode<T> = emptyNode(this.root.edit);
      base.array[0] = this.root;
      this.shift += BIT_WIDTH;
      this.root = base;
    }
    // getTailOffset is actually the 1st item in tail
    // we now move it to the tree
    const index = this.getTailOffset();
    let cursor: INode<T> = this.root;
    for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
      const subIndex = (index >>> level) & BIT_MASK;
      let next: INode<T> | undefined = cursor.array[subIndex] as IBranch<T>;
      if (!next) {
        next = emptyNode(this.root.edit);
      } else {
        next = ensureEditable(next, this.root.edit);
      }
      cursor.array[subIndex] = next;
      cursor = next;
    }
    // it's safe to update cursor bc "next" is a new instance anyway
    cursor.array = this.tail;
    this.tail = [value, ...(Array(BRANCH_SIZE - 1).fill(undefined) as T[])];
    
    // @ts-ignore
    this.length += 1;
    return this;
  }

  /**
   * Return a new Vector with the last element removed.
   *
   * This does nothing if the Vector contains no elements.
   */
  pop(): TransientVector<T> {
    this.ensureEditable();
    if (this.length === 0) return this;
    // we always have a non-empty tail
    const tailLength = this.getTailLength();
    if (tailLength >= 2) {
      delete this.tail[tailLength - 1];
      
      // @ts-ignore
      this.length -= 1;
      return this;
    }
    // tail has exactly 1 item, promote the right most leaf node as tail
    const lastItemIndexInTree = this.getTailOffset() - 1;
    // Tree has no item
    if (lastItemIndexInTree < 0) {
      return TransientVector.empty<T>();
    }
    let cursor: INode<T> = this.root;
    // we always have a parent bc we create an empty branch initially
    let parent: INode<T> | undefined = undefined;
    let subIndex: number;
    for (let level = this.shift; level > 0; level -= BIT_WIDTH) {
      subIndex = (lastItemIndexInTree >>> level) & BIT_MASK;
      // This cast is fine because we checked the length prior
      const next: INode<T> = ensureEditable(cursor.array[subIndex] as INode<T>, this.root.edit);
      cursor.array[subIndex] = next;
      parent = cursor;
      cursor = next;
    }
    this.tail = cursor.array as T[];
    parent!.array[subIndex!] = emptyNode<T>(this.root.edit);

    if (isFullBranch(this.length - 1 - BRANCH_SIZE)) {
      this.root = this.root.array[0] as IBranch<T>;
      this.shift -= BIT_WIDTH;
    }
    
    // @ts-ignore
    this.length -= 1;
    return this;
  }

  *keys(): IterableIterator<number> {
    yield* Array.from({length: this.length}, (_, i) => i);
  }

  *values(): IterableIterator<T> {
    function* iterateNodeValues(node: INode<T>, level: number): Iterable<T> {
      if (level <= 0) {
        yield* (node as ILeaf<T>).array.filter((i) => i != null);
      } else {
        for (const child of (node as IBranch<T>).array.filter((i) => i != null)) {
          yield* iterateNodeValues(child as INode<T>, level - BIT_WIDTH);
        }
      }
    }
    yield* iterateNodeValues(this.root, this.shift);
    yield* this.tail.slice(0, this.getTailLength());
  }

  /**
   * Implement Iterable interface.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.toArray();
  }

  /**
   */
  forEach(func: (t: T, i: number) => void): void {
    this.toArray().forEach(func);
  }

  /**
   * Map to an array of T2.
   */
  map<T2>(func: (t: T, i: number) => T2): T2[] {
    return this.toArray().map(func);
  }

  /**
   * Convert to regular typescript array
   */
  toArray(): T[] {
    const values: T[] = [];
    iterateNodeValues(this.root, this.shift, values);
    values.push(...this.tail.slice(0, this.getTailLength()));
    return values;
  }

  /**
   * Clone to a new vector.
   */
  clone(): TransientVector<T> {
    return new TransientVector(this.root, this.shift, this.tail, this.length);
  }

  private getTailLength(): number {
    return this.length - this.getTailOffset();
  }

  /**
   * Returns the first index of the tail, also the number of the leaf elements in the tree
   */
  private getTailOffset(): number {
    return this.length < BRANCH_SIZE ? 0 : ((this.length - 1) >>> BIT_WIDTH) << BIT_WIDTH;
  }
}

/**
 * Recursively loop through the nodes and push node to values array.
 */
function iterateNodeValues<T>(node: INode<T>, level: number, values: T[]): void {
  if (!node) {
    return;
  }

  if (level <= 0) {
    for (const t of (node as ILeaf<T>).array) {
      if (t != null) {
        values.push(t);
      }
    }
  } else {
    for (const child of (node as IBranch<T>).array) {
      if (child !== null) {
        iterateNodeValues(child as INode<T>, level - BIT_WIDTH, values);
      }
    }
  }
}
