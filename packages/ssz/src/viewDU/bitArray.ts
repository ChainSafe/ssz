import {HashComputationLevel, Node, getHashComputations} from "@chainsafe/persistent-merkle-tree";
import {CompositeType} from "../type/composite.js";
import {BitArray} from "../value/bitArray.js";
import {TreeViewDU} from "./abstract.js";

/**
 * Thin wrapper around BitArray to upstream changes after `this.commit()`
 */
export class BitArrayTreeViewDU extends TreeViewDU<CompositeType<BitArray, unknown, unknown>> implements BitArray {
  /** Cached BitArray instance computed only on demand */
  private _bitArray: BitArray | null = null;

  constructor(
    readonly type: CompositeType<BitArray, unknown, unknown>,
    protected _rootNode: Node
  ) {
    super();
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): unknown {
    return;
  }

  // Wrapped API from BitArray

  /** @see BitArray.uint8Array */
  get uint8Array(): Uint8Array {
    return this.bitArray.uint8Array;
  }

  /** @see BitArray.bitLen */
  get bitLen(): number {
    return this.bitArray.bitLen;
  }

  /** Lazily computed bitArray instance */
  private get bitArray(): BitArray {
    if (this._bitArray === null) {
      this._bitArray = this.type.tree_toValue(this._rootNode);
    }
    return this._bitArray;
  }

  commit(hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): void {
    if (this._bitArray !== null) {
      this._rootNode = this.type.value_toTree(this._bitArray);
    }

    if (hcByLevel !== null && this._rootNode.h0 === null) {
      getHashComputations(this._rootNode, hcOffset, hcByLevel);
    }
  }

  /** @see BitArray.get */
  get(bitIndex: number): boolean {
    return this.bitArray.get(bitIndex);
  }

  /** @see BitArray.set */
  set(bitIndex: number, bit: boolean): void {
    this.bitArray.set(bitIndex, bit);
  }

  /** @see BitArray.mergeOrWith */
  mergeOrWith(bitArray2: BitArray): void {
    this.bitArray.mergeOrWith(bitArray2);
  }

  /** @see BitArray.intersectValues */
  intersectValues<T>(values: ArrayLike<T>): T[] {
    return this.bitArray.intersectValues(values);
  }

  /** @see BitArray.getTrueBitIndexes */
  getTrueBitIndexes(): number[] {
    return this.bitArray.getTrueBitIndexes();
  }

  /** @see BitArray.getSingleTrueBit */
  getSingleTrueBit(): number | null {
    return this.bitArray.getSingleTrueBit();
  }

  /** @see BitArray.toBoolArray */
  toBoolArray(): boolean[] {
    return this.bitArray.toBoolArray();
  }

  protected clearCache(): void {
    this._bitArray = null;
  }
}
