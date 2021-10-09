import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering */

export class UintType extends BasicType<number> {
  // Immutable characteristics
  readonly byteLength: number;
  readonly itemsPerChunk: number;

  constructor(byteLength: number) {
    super();
    this.byteLength = byteLength;
    this.itemsPerChunk = 32 / this.byteLength;
  }

  get defaultValue(): number {
    return 0;
  }

  /** EXAMPLE of `getValueFromNode` */
  getValueFromPackedNode(leafNode: LeafNode, index: number): number {
    const offsetBytes = this.byteLength * (index % this.itemsPerChunk);
    return leafNode.getUint(this.byteLength, offsetBytes);
  }

  getValueFromNode(leafNode: LeafNode): number {
    if (this.byteLength <= 4) {
      // number equals the h value
      return getLeafNodeH(leafNode, 0);
    } else {
      // TODO
      throw Error("Not supports byteLength > 4");
    }
  }

  /** Mutates node to set value */
  setValueToNode(leafNode: LeafNode, index: number, value: number): void {
    const offsetBytes = this.byteLength * (index % this.itemsPerChunk);

    //////////////////////////////////////
    // BITWISE OR - to set epoch participation
    //////////////////////////////////////

    if (this.byteLength < 4) {
      // number has to be masked from an h value
      const hIndex = Math.floor(offsetBytes / 4);
      const bIndex = 3 - (offsetBytes % 4);
      bitwiseOrLeafNodeH(leafNode, hIndex, value << bIndex);
    } else if (this.byteLength === 4) {
      // number equals the h value
      const hIndex = Math.floor(offsetBytes / 4);
      setLeafNodeH(leafNode, hIndex, value);
    } else {
      // TODO
      throw Error("Not supports byteLength > 4");
    }
  }
}

function getLeafNodeH(leafNode: LeafNode, hIndex: number): number {
  if (hIndex === 0) return leafNode.h0;
  if (hIndex === 1) return leafNode.h1;
  if (hIndex === 2) return leafNode.h2;
  if (hIndex === 3) return leafNode.h3;
  if (hIndex === 4) return leafNode.h4;
  if (hIndex === 5) return leafNode.h5;
  if (hIndex === 6) return leafNode.h6;
  if (hIndex === 7) return leafNode.h7;
  throw Error("hIndex > 7");
}

function setLeafNodeH(leafNode: LeafNode, hIndex: number, value: number): number {
  if (hIndex === 0) leafNode.h0 = value;
  if (hIndex === 1) leafNode.h1 = value;
  if (hIndex === 2) leafNode.h2 = value;
  if (hIndex === 3) leafNode.h3 = value;
  if (hIndex === 4) leafNode.h4 = value;
  if (hIndex === 5) leafNode.h5 = value;
  if (hIndex === 6) leafNode.h6 = value;
  if (hIndex === 7) leafNode.h7 = value;
  throw Error("hIndex > 7");
}

function bitwiseOrLeafNodeH(leafNode: LeafNode, hIndex: number, value: number): number {
  if (hIndex === 0) leafNode.h0 |= value;
  if (hIndex === 1) leafNode.h1 |= value;
  if (hIndex === 2) leafNode.h2 |= value;
  if (hIndex === 3) leafNode.h3 |= value;
  if (hIndex === 4) leafNode.h4 |= value;
  if (hIndex === 5) leafNode.h5 |= value;
  if (hIndex === 6) leafNode.h6 |= value;
  if (hIndex === 7) leafNode.h7 |= value;
  throw Error("hIndex > 7");
}
