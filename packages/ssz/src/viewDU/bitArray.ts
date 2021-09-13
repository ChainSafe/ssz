import {Node} from "@chainsafe/persistent-merkle-tree";
import {BitArray} from "../value/bitArray";
import {CompositeType, TreeViewDU} from "../type/composite";

/**
 * Thin wrapper around BitArray to upstream changes after `this.commit()`
 */
export class BitArrayTreeViewDU extends TreeViewDU<CompositeType<BitArray, unknown, unknown>> implements BitArray {
  private readonly bitArray: BitArray;

  constructor(readonly type: CompositeType<BitArray, unknown, unknown>, protected _rootNode: Node) {
    super();

    this.bitArray = type.tree_toValue(_rootNode);
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): unknown {
    return;
  }

  commit(): Node {
    // Upstream changes
    return this.type.value_toTree(this.bitArray);
  }

  // Wrapped API from BitArray

  get uint8Array(): Uint8Array {
    return this.bitArray.uint8Array;
  }

  get bitLen(): number {
    return this.bitLen;
  }

  get(bitIndex: number): boolean {
    return this.bitArray.get(bitIndex);
  }

  set(bitIndex: number, bit: boolean): void {
    this.bitArray.set(bitIndex, bit);
  }

  intersectValues<T>(values: T[]): {yes: T[]; no: T[]} {
    return this.bitArray.intersectValues(values);
  }

  getSingleTrueBit(): number {
    return this.getSingleTrueBit();
  }
}
