import {Tree, Node} from "@chainsafe/persistent-merkle-tree";
import {BitArray} from "../value/bitArray";
import {CompositeType, TreeView} from "../type/composite";

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

    // Upstream changes
    this.tree.rootNode = this.type.value_toTree(this.bitArray);
  }

  intersectValues<T>(values: T[]): {yes: T[]; no: T[]} {
    return this.bitArray.intersectValues(values);
  }

  getSingleTrueBit(): number {
    return this.getSingleTrueBit();
  }
}
