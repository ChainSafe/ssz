import type {Node} from "./node";

export type HashComputation = {
  src0: Node;
  src1: Node;
  dest: Node;
};

export type HashComputationGroup = {
  // global array
  byLevel: HashComputation[][];
  // offset from top
  offset: number;
};

/**
 * Get HashComputations from a root node all the way to the leaf nodes.
 */
export function getHashComputations(node: Node, offset: number, hashCompsByLevel: HashComputation[][]): void {
  if (node.h0 === null) {
    const hashComputations = arrayAtIndex(hashCompsByLevel, offset);
    const {left, right} = node;
    hashComputations.push({src0: left, src1: right, dest: node});
    // leaf nodes should have h0 to stop the recursion
    getHashComputations(left, offset + 1, hashCompsByLevel);
    getHashComputations(right, offset + 1, hashCompsByLevel);
  }

  // else stop the recursion, node is hashed
}

export function arrayAtIndex<T>(twoDArray: T[][], index: number): T[] {
  if (twoDArray[index] === undefined) {
    twoDArray[index] = [];
  }
  return twoDArray[index];
}

