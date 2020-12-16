/** @ignore */
export function bitLength(n: number): number {
  const bitstring = n.toString(2);
  if (bitstring === "0") {
    return 0;
  }
  return bitstring.length;
}

/** @ignore */
export function nextPowerOf2(n: number): number {
  return n <= 0 ? 1 : Math.pow(2, bitLength(n - 1));
}

/** @ignore */
export function previousPowerOf2(n: number): number {
  return n === 0 ? 1 : Math.pow(2, bitLength(n) - 1);
}

/**
 * Get the power of 2 for given input, or the closest higher power of 2 if the input is not a power of 2.
 * Commonly used for "how many nodes do I need for a bottom tree layer fitting x elements?"
 * Example: 0->1, 1->1, 2->2, 3->4, 4->4, 5->8, 6->8, 7->8, 8->8, 9->16.
 */
export function getPowerOfTwoCeil(x: number): number {
  if (x <= 1) {
    return 1;
  } else if (x === 2) {
    return 2;
  } else {
    return 2 * getPowerOfTwoCeil(Math.floor((x + 1) / 2));
  }
}

/**
 * Get the power of 2 for given input, or the closest lower power of 2 if the input is not a power of 2.
 * The zero case is a placeholder and not used for math with generalized indices.
 * Commonly used for "what power of two makes up the root bit of the generalized index?"
 * Example: 0->1, 1->1, 2->2, 3->2, 4->4, 5->4, 6->4, 7->4, 8->8, 9->8
 */
export function getPowerOfTwoFloor(x: number): number {
  if (x <= 1) {
    return 1;
  } else if (x == 2) {
    return 2;
  } else {
    return 2 * getPowerOfTwoFloor(Math.floor(x / 2));
  }
}
