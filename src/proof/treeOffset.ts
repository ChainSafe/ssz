import { Gindex, GindexBitstring, gindexParent, gindexSibling } from "../gindex";
import { BranchNode, LeafNode, Node } from "../node";

/**
 * Compute both the path and branch indices
 * 
 * Path indices are parent indices upwards toward the root
 * Branch indices are witnesses required for a merkle proof
 */
export function computeProofGindices(gindex: Gindex): {path: Set<Gindex>; branch: Set<Gindex>} {
  const path = new Set<Gindex>();
  const branch = new Set<Gindex>();
  let g = gindex;
  while (g > 1) {
    path.add(g);
    branch.add(gindexSibling(g));
    g = gindexParent(g);
  }
  return {path, branch};
}

/**
 * Sort generalized indices in-order
 */
export function sortInOrder(gindices: Gindex[]): Gindex[] {
  if (!gindices.length) {
    return [];
  }
  const bitLength = gindices.reduce((a, b) => a > b ? a : b).toString(2).length;
  return gindices.map(g => "0b" + g.toString(2).padEnd(bitLength)).sort().map(str => BigInt(str));
}

/**
 * Return the set of generalized indices required for a multiproof
 * This includes all leaves and any necessary witnesses
 * @param gindices leaves to include in proof
 */
export function computeMultiProofGindices(gindices: Gindex[]): Set<Gindex> {
  // Initialize the proof indices with the leaves
  const proof = new Set<Gindex>(gindices);
  const paths = new Set<Gindex>();
  const branches = new Set<Gindex>();

  // Collect all path indices and all branch indices
  for (const gindex of gindices) {
    const {path, branch} = computeProofGindices(gindex);
    path.forEach((g) => paths.add(g));
    branch.forEach((g) => branches.add(g));
  }

  // Remove all branches that are included in the paths
  paths.forEach((g) => branches.delete(g));
  // Add all remaining branches to the leaves
  branches.forEach((g) => proof.add(g));

  return proof;
}

/**
 * Compute offsets and leaves for a tree-offset proof
 * Recursive definition
 */
export function nodeToTreeOffsetProof(node: Node, gindex: GindexBitstring, proofGindices: GindexBitstring[]): [number[], Uint8Array[]] {
  if (!proofGindices.length || !proofGindices[0].startsWith(gindex)) {
    return [[], []];
  } else if (gindex === proofGindices[0]) {
    proofGindices.shift();
    return [[], [node.root]];
  } else {
    const [leftOffsets, leftLeaves] = nodeToTreeOffsetProof(node.left, gindex + "0", proofGindices);
    const [rightOffsets, rightLeaves] = nodeToTreeOffsetProof(node.right, gindex + "1", proofGindices);
    const pivot = leftLeaves.length;
    return [[pivot].concat(leftOffsets, rightOffsets), leftLeaves.concat(rightLeaves)];
  }
}

/**
 * Recreate a `Node` given offsets and leaves of a tree-offset proof
 * Recursive definition
 */
export function treeOffsetProofToNode(offsets: number[], leaves: Uint8Array[]): Node {
  if (!leaves.length) {
    throw new Error("Proof must contain gt 0 leaves");
  } else if (leaves.length === 1) {
    return new LeafNode(leaves[0])
  } else {
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
    sortInOrder(
      Array.from(computeMultiProofGindices(gindices))
    ).map(g => g.toString(2))
  );
}

/**
 * Recreate a `Node` given a tree-offset proof
 */
export function createNodeFromTreeOffsetProof(offsets: number[], leaves: Uint8Array[]): Node {
  // TODO validation
  return treeOffsetProofToNode(offsets, leaves);
}