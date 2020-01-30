export type Gindex = bigint | string;

export function bitIndexBigInt(v: bigint): number {
  return v.toString(2).length - 1;
}

export function toGindexBigInt(index: bigint, depth: number): bigint {
  const anchor = 1n << BigInt(depth);
  if (index >= anchor) {
    throw new Error("index to large for depth");
  }
  return anchor | index;
}

export function toGindexBitstring(index: bigint, depth: number): string {
  const str = index ? index.toString(2) : '';
  if (str.length > depth) {
    throw new Error("index to large for depth");
  } else {
    return "1" + str.padStart(depth, "0");
  }
}

// Get the depth (root starting at 0) necessary to cover a subtree of `count` elements.
// (in out): (0 0), (1 0), (2 1), (3 2), (4 2), (5 3), (6 3), (7 3), (8 3), (9 4)
export function countToDepth(count: bigint): number {
  if (count <= 1) {
    return 0;
  }
  return (count-1n).toString(2).length;
  //return bitIndexBigInt(count - 1n) + 1;
}

const ERR_INVALID_GINDEX = "Invalid gindex";

export interface GindexIterator extends Iterable<number> {
  remainingBitLength(): number;
  totalBitLength(): number;
}

export function gindexIterator(gindex: Gindex): GindexIterator {
  let bitstring: string;
  if (typeof gindex === "string") {
    bitstring = gindex;
  } else {
    if (gindex < 1) {
      throw new Error(ERR_INVALID_GINDEX);
    }
    bitstring = gindex.toString(2);
  }
  let i = 1;
  const next = (): IteratorResult<number, undefined> => {
    if (i === bitstring.length) {
      return {done: true, value: undefined};
    }
    const bit = Number(bitstring[i]);
    i++;
    return {done: false, value: bit};
  }
  return {
    [Symbol.iterator]() {
      return {next}
    },
    totalBitLength(): number {
      return bitstring.length;
    },
    remainingBitLength(): number {
      return bitstring.length - i;
    },
  }
}
