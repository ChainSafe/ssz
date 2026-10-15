/**
 * Immutable list of byte strings stored as its canonical SSZ serialization, i.e. a `List[ByteList[N], LIMIT]` or a
 * `ProgressiveList[ProgressiveByteList]`
 * kept as a single `Uint8Array` instead of one `Uint8Array` per element.
 *
 * ```
 * bytes:   [offset 0] [offset 1] ... [offset n-1] [element 0] [element 1] ... [element n-1]
 * offsets: [offset 0, offset 1, ..., offset n-1, bytes.length]
 * ```
 *
 * Elements are returned as subarrays of `bytes` without copying. Consumers MUST NOT mutate `bytes` or any returned
 * element, same contract as `ByteListType` / `ProgressiveByteListType` values.
 *
 * Note: `structuredClone()` and `postMessage()` drop the class prototype, send `bytes` instead and deserialize again.
 */
export class SerializedList {
  /**
   * INTERNAL: `bytes` must be a canonical SSZ serialization and `offsets` its validated element offsets plus a trailing
   * `bytes.length` entry. Use `SerializedList.fromArray()` or deserialize with an SSZ type instead.
   */
  constructor(
    /** Canonical SSZ serialization of the list */
    readonly bytes: Uint8Array,
    /**
     * Start of each element relative to `bytes`, plus a last entry equal to `bytes.length`, so length is n + 1.
     * The extra entry lets element `i` always be `[offsets[i], offsets[i + 1])`, including the last one. List types
     * keep only n offsets and special case the last element instead, see `endEl` in
     * value_deserializeFromBytesArrayComposite(). We need it on every get(), getSize() and hash, not only once.
     */
    readonly offsets: Uint32Array
  ) {}

  static empty(): SerializedList {
    return new SerializedList(new Uint8Array(0), new Uint32Array(1));
  }

  /** Builds the canonical serialization of `items` with one allocation for `bytes` and one for `offsets` */
  static fromArray(items: Uint8Array[]): SerializedList {
    const length = items.length;
    let size = length * 4;
    for (let i = 0; i < length; i++) {
      size += items[i].length;
    }

    const bytes = new Uint8Array(size);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    // n + 1 entries, the last one is the end of the last element, see `offsets`
    const offsets = new Uint32Array(length + 1);
    let offset = length * 4;
    for (let i = 0; i < length; i++) {
      offsets[i] = offset;
      dataView.setUint32(i * 4, offset, true);
      bytes.set(items[i], offset);
      offset += items[i].length;
    }
    offsets[length] = offset;

    return new SerializedList(bytes, offsets);
  }

  /** Number of elements */
  get length(): number {
    return this.offsets.length - 1;
  }

  /** Returns element at `index` as a subarray of `bytes`, no copy */
  get(index: number): Uint8Array {
    this.assertValidIndex(index);
    return this.bytes.subarray(this.offsets[index], this.offsets[index + 1]);
  }

  /** Returns the byte length of element at `index` without allocating */
  getSize(index: number): number {
    this.assertValidIndex(index);
    return this.offsets[index + 1] - this.offsets[index];
  }

  *[Symbol.iterator](): IterableIterator<Uint8Array> {
    const length = this.length;
    for (let i = 0; i < length; i++) {
      yield this.bytes.subarray(this.offsets[i], this.offsets[i + 1]);
    }
  }

  /** Returns all elements as subarrays of `bytes`, allocates one Uint8Array per element */
  toArray(): Uint8Array[] {
    const length = this.length;
    const items = new Array<Uint8Array>(length);
    for (let i = 0; i < length; i++) {
      items[i] = this.bytes.subarray(this.offsets[i], this.offsets[i + 1]);
    }
    return items;
  }

  private assertValidIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.length) {
      throw new RangeError(`Index ${index} out of range, length ${this.length}`);
    }
  }
}
