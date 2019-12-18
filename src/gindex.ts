export type Gindex = bigint;

export function bitLength(index: Gindex): bigint {
  let n = index;
  let length = 0n;
  while (n > 0) {
    length++;
    n >>= 1n;
  }
  return length;
}

export function anchor(index: Gindex): Gindex {
  return 1n << bitLength(index) - 1n;
}

export function pivot(index: Gindex): Gindex {
  return anchor(index) >> 1n;
}

export function toGindex(index: bigint, depth: number): Gindex {
  const anchor = 1n << BigInt(depth);
  if (index >= anchor) {
    throw new Error("index to large for depth");
  }
  return anchor | index;
}

export function getDepth(count: bigint): number {
  return Number(bitLength(count - 1n));
}
