export type Gindex = bigint;
export type GindexBitstring = string;

export function bitIndexBigInt(v: bigint): number {
  return v.toString(2).length - 1;
}

export function toGindex(depth: number, index: bigint): Gindex {
  const anchor = BigInt(1) << BigInt(depth);
  if (index >= anchor) {
    throw new Error("index too large for depth");
  }
  return anchor | index;
}

export function toGindexBitstring(depth: number, index: number): GindexBitstring {
  const str = index ? Number(index).toString(2) : "";
  if (str.length > depth) {
    throw new Error("index too large for depth");
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
  return (count - BigInt(1)).toString(2).length;
}

/**
 * Iterate through Gindexes at a certain depth
 */
export function iterateAtDepth(depth: number, startIndex: bigint, count: bigint): Iterable<Gindex> {
  const anchor = BigInt(1) << BigInt(depth);
  if (startIndex + count > anchor) {
    throw new Error("Too large for depth");
  }
  let i = toGindex(depth, startIndex);
  const last = i + count;
  return {
    [Symbol.iterator]() {
      return {
        next(): IteratorResult<Gindex, undefined> {
          if (i < last) {
            const value = i;
            i++;
            return {done: false, value};
          } else {
            return {done: true, value: undefined};
          }
        },
      };
    },
  };
}

const ERR_INVALID_GINDEX = "Invalid gindex";

export type Bit = 0 | 1;
export interface GindexIterator extends Iterable<Bit> {
  remainingBitLength(): number;
}

export function gindexIterator(gindex: Gindex | GindexBitstring): GindexIterator {
  let bitstring: string;
  if (typeof gindex === "string") {
    if (!gindex.length) {
      throw new Error(ERR_INVALID_GINDEX);
    }
    bitstring = gindex;
  } else {
    if (gindex < 1) {
      throw new Error(ERR_INVALID_GINDEX);
    }
    bitstring = gindex.toString(2);
  }

  let i = 1;
  const next = (): IteratorResult<Bit, undefined> => {
    if (i === bitstring.length) {
      return {done: true, value: undefined};
    }
    const bit = Number(bitstring[i]) as Bit;
    i++;
    return {done: false, value: bit};
  };

  return {
    [Symbol.iterator]() {
      return {next};
    },
    remainingBitLength(): number {
      return bitstring.length - i;
    },
  };
}

/**
 * Concatenate Generalized Indices
 * Given generalized indices i1 for A -> B, i2 for B -> C .... i_n for Y -> Z, returns
 * the generalized index for A -> Z.
 */
export function concatGindices(gindices: Gindex[]): Gindex {
  return BigInt(gindices.reduce((acc, gindex) => acc + gindex.toString(2).slice(1), "0b1"));
}

export function gindexSibling(gindex: Gindex): Gindex {
  return gindex ^ BigInt(1);
}

export function gindexParent(gindex: Gindex): Gindex {
  return gindex / BigInt(2);
}

export function gindexChild(gindex: Gindex, rightChild: boolean): Gindex {
  return gindex * BigInt(2) + BigInt(rightChild);
}
