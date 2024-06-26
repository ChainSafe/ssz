import {concatGindices, Gindex, Node, toGindex, Tree} from "@chainsafe/persistent-merkle-tree";
import {fromHexString, toHexString, byteArrayEquals} from "../util/byteArray";
import {splitIntoRootChunks} from "../util/merkleize";
import {CompositeType, LENGTH_GINDEX} from "./composite";
import {BitArray} from "../value/bitArray";
import {BitArrayTreeView} from "../view/bitArray";
import {BitArrayTreeViewDU} from "../viewDU/bitArray";

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * BitArray: ordered array collection of boolean values
 * - Value: `BitArray`, @see BitArray for a justification of its memory efficiency and performance
 * - View: `BitArrayTreeView`
 * - ViewDU: `BitArrayTreeViewDU`
 */
export abstract class BitArrayType extends CompositeType<BitArray, BitArrayTreeView, BitArrayTreeViewDU> {
  readonly isViewMutable = true;

  getView(tree: Tree): BitArrayTreeView {
    return new BitArrayTreeView(this, tree);
  }

  getViewDU(node: Node): BitArrayTreeViewDU {
    return new BitArrayTreeViewDU(this, node);
  }

  commitView(view: BitArrayTreeView): Node {
    return view.node;
  }

  commitViewDU(view: BitArrayTreeViewDU): Node {
    view.commit();
    return view.node;
  }

  cacheOfViewDU(view: BitArrayTreeViewDU): unknown {
    return view.cache;
  }

  // Merkleization

  protected getRoots(value: BitArray): Uint8Array[] {
    return splitIntoRootChunks(value.uint8Array);
  }

  // Proofs

  getPropertyGindex(): null {
    // Stop navigating below this type. Must only request complete data
    return null;
  }

  getPropertyType(): never {
    /* istanbul ignore next - unreachable code, getPropertyGindex null return prevents this call */
    throw Error("Must only request BitArray complete data");
  }

  getIndexProperty(): never {
    /* istanbul ignore next - unreachable code, getPropertyGindex null return prevents this call */
    throw Error("Must only request BitArray complete data");
  }

  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    return {node, done: true};
  }

  tree_getLeafGindices(rootGindex: bigint, rootNode?: Node): Gindex[] {
    const byteLen = this.tree_getByteLen(rootNode);
    const chunkCount = Math.ceil(byteLen / 32);
    const startIndex = concatGindices([rootGindex, toGindex(this.depth, BigInt(0))]);
    const gindices = new Array<Gindex>(chunkCount);
    for (let i = 0, gindex = startIndex; i < chunkCount; i++, gindex++) {
      gindices[i] = gindex;
    }

    // include the length chunk
    if (this.isList) {
      gindices.push(concatGindices([rootGindex, LENGTH_GINDEX]));
    }

    return gindices;
  }

  abstract tree_getByteLen(node?: Node): number;

  // JSON

  fromJson(json: unknown): BitArray {
    const uint8Array = fromHexString(json as string);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    // value_deserializeFromBytes MUST validate length (limit, or length)
    return this.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  toJson(value: BitArray): unknown {
    return toHexString(this.serialize(value));
  }

  clone(value: BitArray): BitArray {
    return value.clone();
  }

  equals(a: BitArray, b: BitArray): boolean {
    return a.bitLen === b.bitLen && byteArrayEquals(a.uint8Array, b.uint8Array);
  }
}
