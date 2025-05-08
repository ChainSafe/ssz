import {BranchNode, LeafNode, Node} from "./node.ts";

const zeroes: Node[] = [LeafNode.fromZero()];

/**
 * Return the `Node` at a specified height from the merkle tree made of "zero data"
 * ```
 *           ...
 *          /
 *         x           <- height 2
 *      /     \
 *     x       x       <- height 1
 *   /  \      /  \
 * 0x0  0x0  0x0  0x0  <- height 0
 * ```
 */
export function zeroNode(height: number): Node {
  if (height >= zeroes.length) {
    for (let i = zeroes.length; i <= height; i++) {
      zeroes[i] = new BranchNode(zeroes[i - 1], zeroes[i - 1]);
    }

    // make sure hash is precomputed in order not to put zeroNodes to HashComputation
    // otherwise get OOM
    zeroes[height].root;
  }

  return zeroes[height];
}
