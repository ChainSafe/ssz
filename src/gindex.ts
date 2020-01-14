export type Gindex = bigint;

const fullUint64 = ((1n << 64n) - 1n);
const mask0: Gindex = fullUint64 ^ ((1n << (1n << 0n)) - 1n);
const mask1: Gindex = fullUint64 ^ ((1n << (1n << 1n)) - 1n);
const mask2: Gindex = fullUint64 ^ ((1n << (1n << 2n)) - 1n);
const mask3: Gindex = fullUint64 ^ ((1n << (1n << 3n)) - 1n);
const mask4: Gindex = fullUint64 ^ ((1n << (1n << 4n)) - 1n);
const mask5: Gindex = fullUint64 ^ ((1n << (1n << 5n)) - 1n);

const bit0 = 1 << 0;
const bit1 = 1 << 1;
const bit2 = 1 << 2;
const bit3 = 1 << 3;
const bit4 = 1 << 4;
const bit5 = 1 << 5;

const bit1Bigint = 1n << 1n;
const bit2Bigint = 1n << 2n;
const bit3Bigint = 1n << 3n;
const bit4Bigint = 1n << 4n;
const bit5Bigint = 1n << 5n;
const bit6Bigint = 1n << 6n;


function bitIndex64bit(v: bigint): number {
  // bitmagic: binary search through a uint64 for the first bit.
  let out = 0;
  if ((v&mask5) !== 0n) {
    v >>= bit5Bigint;
    out |= bit5
  }
  if ((v&mask4) !== 0n) {
    v >>= bit4Bigint;
    out |= bit4
  }
  if ((v&mask3) !== 0n) {
    v >>= bit3Bigint;
    out |= bit3
  }
  if ((v&mask2) !== 0n) {
    v >>= bit2Bigint;
    out |= bit2
  }
  if ((v&mask1) !== 0n) {
    v >>= bit1Bigint;
    out |= bit1
  }
  if ((v&mask0) !== 0n) {
    out |= bit0
  }
  return out;
}

function bitIndexBigInt(v: bigint): number {
  if(v < bit6Bigint) {
    return bitIndex64bit(v);
  }
  let n = v;
  let bitIndex = 0;
  while (n > 1) {
    bitIndex++;
    n >>= 1n;
  }
  return bitIndex;
}

export function anchor(index: Gindex): Gindex {
  return 1n << BigInt(bitIndexBigInt(index));
}

export function pivot(index: Gindex): Gindex {
  return anchor(index) >> 1n;
}

export function subIndex(index: Gindex): Gindex {
  const anchorBit = anchor(index);
  const pivotBit = anchorBit >> 1n;
  return (index ^ anchorBit) | pivotBit;
}

export function toGindex(index: bigint, depth: number): Gindex {
  const anchor = 1n << BigInt(depth);
  if (index >= anchor) {
    throw new Error("index to large for depth");
  }
  return anchor | index;
}

// Get the depth (root starting at 0) necessary to cover a subtree of `count` elements.
// (in out): (0 0), (1 0), (2 1), (3 2), (4 2), (5 3), (6 3), (7 3), (8 3), (9 4)
export function countToDepth(count: bigint): number {
  if (count <= 1) {
    return 0;
  }
  return bitIndexBigInt(count - 1n) + 1;
}

export function gindexDepth(index: Gindex): number {
  return bitIndexBigInt(index);
}
