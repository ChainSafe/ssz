import type {Tree, Node} from "@chainsafe/persistent-merkle-tree";
import type {BitArray} from "../value/bitArray";
import type {CompositeType} from "../type/composite";
import {TreeView} from "./abstract";

/**
 * Thin wrapper around BitArray to upstream changes to `tree` on every `this.set()`
 */
export class BitArrayTreeView extends TreeView<CompositeType<BitArray, unknown, unknown>> implements BitArray {
  private readonly bitArray: BitArray;

  constructor(readonly type: CompositeType<BitArray, unknown, unknown>, protected tree: Tree) {
    super();

    this.bitArray = type.tree_toValue(tree.rootNode);
  }

  get node(): Node {
    return this.tree.rootNode;
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

  /** @see BitArray.get */
  get(bitIndex: number): boolean {
    return this.bitArray.get(bitIndex);
  }

  /** @see BitArray.set */
  set(bitIndex: number, bit: boolean): void {
    this.bitArray.set(bitIndex, bit);

    // Upstream changes
    this.tree.rootNode = this.type.value_toTree(this.bitArray);
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
}
