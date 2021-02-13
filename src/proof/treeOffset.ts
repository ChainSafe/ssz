import { Gindex, GindexBitstring } from "../gindex";
import { BranchNode, LeafNode, Node } from "../node";
import { computeMultiProofBitstrings } from "./util";

/**
 * Compute offsets and leaves of a tree-offset proof
 * 
 * Recursive function
 * 
 * See https://github.com/protolambda/eth-merkle-trees/blob/master/tree_offsets.md
 * @param node current node in the tree
 * @param gindex current generalized index in the tree
 * @param proofGindices generalized indices to left include in the proof - must be sorted in-order according to the tree
 */
export function nodeToTreeOffsetProof(node: Node, gindex: GindexBitstring, proofGindices: GindexBitstring[]): [number[], Uint8Array[]] {
  if (!proofGindices.length || !proofGindices[0].startsWith(gindex)) {
    // there are no proof indices left OR the current subtree contains no remaining proof indices
    return [[], []];
  } else if (gindex === proofGindices[0]) {
    // the current node is at the next proof index
    proofGindices.shift();
    return [[], [node.root]];
  } else {
    // recursively compute offsets, leaves for the left and right subtree
    const [leftOffsets, leftLeaves] = nodeToTreeOffsetProof(node.left, gindex + "0", proofGindices);
    const [rightOffsets, rightLeaves] = nodeToTreeOffsetProof(node.right, gindex + "1", proofGindices);
    // the offset prepended to the list is # of leaves in the left subtree
    const pivot = leftLeaves.length;
    return [[pivot].concat(leftOffsets, rightOffsets), leftLeaves.concat(rightLeaves)];
  }
}

/**
 * Recreate a `Node` given offsets and leaves of a tree-offset proof
 * 
 * Recursive definition
 * 
 * See https://github.com/protolambda/eth-merkle-trees/blob/master/tree_offsets.md
 */
export function treeOffsetProofToNode(offsets: number[], leaves: Uint8Array[]): Node {
  if (!leaves.length) {
    throw new Error("Proof must contain gt 0 leaves");
  } else if (leaves.length === 1) {
    return new LeafNode(leaves[0])
  } else {
    // the offset popped from the list is the # of leaves in the left subtree
    const pivot = offsets[0];
    return new BranchNode(
      treeOffsetProofToNode(offsets.slice(1, pivot), leaves.slice(0, pivot)),
      treeOffsetProofToNode(offsets.slice(pivot), leaves.slice(pivot))
    );
  }
}

/**
 * Create a tree-offset proof
 * 
 * @param rootNode the root node of the tree
 * @param gindices generalized indices to include in the proof
 */
export function createTreeOffsetProof(rootNode: Node, gindices: Gindex[]): [number[], Uint8Array[]] {
  return nodeToTreeOffsetProof(
    rootNode,
    "1",
    computeMultiProofBitstrings(gindices.map(g => g.toString(2)))
  );
}

/**
 * Recreate a `Node` given a tree-offset proof
 * 
 * @param offsets offsets of a tree-offset proof
 * @param leaves leaves of a tree-offset proof
 */
export function createNodeFromTreeOffsetProof(offsets: number[], leaves: Uint8Array[]): Node {
  // TODO validation
  return treeOffsetProofToNode(offsets, leaves);
}
