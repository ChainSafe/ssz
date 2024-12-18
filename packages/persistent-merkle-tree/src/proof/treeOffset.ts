import {Gindex, GindexBitstring} from "../gindex.js";
import {BranchNode, LeafNode, Node} from "../node.js";
import {computeMultiProofBitstrings} from "./util.js";

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
export function nodeToTreeOffsetProof(
  node: Node,
  gindex: GindexBitstring,
  proofGindices: GindexBitstring[]
): [number[], Uint8Array[]] {
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
    return LeafNode.fromRoot(leaves[0]);
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
  return nodeToTreeOffsetProof(rootNode, "1", computeMultiProofBitstrings(gindices.map((g) => g.toString(2))));
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

export function computeTreeOffsetProofSerializedLength(offsets: number[], leaves: Uint8Array[]): number {
  // add 1 for # of leaves
  return (offsets.length + 1) * 2 + leaves.length * 32;
}

// Serialized tree offset proof structure:
// # of leaves - 2 bytes
// offsets - 2 bytes each
// leaves - 32 bytes each

export function serializeTreeOffsetProof(
  output: Uint8Array,
  byteOffset: number,
  offsets: number[],
  leaves: Uint8Array[]
): void {
  const writer = new DataView(output.buffer, output.byteOffset, output.byteLength);
  // set # of leaves
  writer.setUint16(byteOffset, leaves.length, true);
  // set offsets
  const offsetsStartIndex = byteOffset + 2;
  for (let i = 0; i < offsets.length; i++) {
    writer.setUint16(i * 2 + offsetsStartIndex, offsets[i], true);
  }
  // set leaves
  const leavesStartIndex = offsetsStartIndex + offsets.length * 2;
  for (let i = 0; i < leaves.length; i++) {
    output.set(leaves[i], i * 32 + leavesStartIndex);
  }
}

export function deserializeTreeOffsetProof(data: Uint8Array, byteOffset: number): [number[], Uint8Array[]] {
  const reader = new DataView(data.buffer, data.byteOffset, data.byteLength);
  // get # of leaves
  const leafCount = reader.getUint16(byteOffset, true);
  if (data.length < (leafCount - 1) * 2 + leafCount * 32) {
    throw new Error("Unable to deserialize tree offset proof: not enough bytes");
  }
  // get offsets
  const offsetsStartIndex = byteOffset + 2;
  const offsets = Array.from({length: leafCount - 1}, (_, i) => reader.getUint16(i * 2 + offsetsStartIndex, true));
  // get leaves
  const leavesStartIndex = offsetsStartIndex + offsets.length * 2;
  const leaves = Array.from({length: leafCount}, (_, i) =>
    data.subarray(i * 32 + leavesStartIndex, (i + 1) * 32 + leavesStartIndex)
  );
  return [offsets, leaves];
}
