import {Tree} from "@chainsafe/persistent-merkle-tree";

/**
 * SSZ Lists (variable-length arrays) include the length of the list in the tree
 * This length is always in the same index in the tree
 * ```
 *   1
 *  / \
 * 2   3 // <-here
 * ```
 */
export const LENGTH_GINDEX = BigInt(3);

export function isTree(value: unknown): value is Tree {
  return Boolean((value as Tree).rootNode && (value as Tree).rootNode.isLeaf);
}

/**
 * n: [0,1,2,3,4,5,6,7,8,9]
 * d: [0,0,1,2,2,3,3,3,3,4]
 */
export function maxChunksToDepth(n: number): number {
  if (n === 0) return 0;
  return Math.ceil(Math.log2(n));
}
