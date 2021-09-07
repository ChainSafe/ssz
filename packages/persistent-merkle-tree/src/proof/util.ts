import {Gindex, GindexBitstring, gindexParent, gindexSibling} from "../gindex";

// Not currently in use, but simpler implementation useful for testing
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
 * Compute both the path and branch indices
 *
 * Path indices are parent indices upwards toward the root
 * Branch indices are witnesses required for a merkle proof
 */
export function computeProofBitstrings(gindex: GindexBitstring): {
  path: Set<GindexBitstring>;
  branch: Set<GindexBitstring>;
} {
  const path = new Set<GindexBitstring>();
  const branch = new Set<GindexBitstring>();
  let g = gindex;
  while (g.length > 1) {
    path.add(g);
    const lastBit = g[g.length - 1];
    const parent = g.substring(0, g.length - 1);
    branch.add(parent + (Number(lastBit) ^ 1));
    g = parent;
  }
  return {path, branch};
}

/**
 * Sort generalized indices in-order
 * @param bitLength maximum bit length of generalized indices to sort
 */
export function sortInOrderBitstrings(gindices: GindexBitstring[], bitLength: number): GindexBitstring[] {
  if (!gindices.length) {
    return [];
  }
  return gindices
    .map((g) => g.padEnd(bitLength))
    .sort()
    .map((g) => g.trim());
}

/**
 * Filter out parent generalized indices
 */
export function filterParentBitstrings(gindices: GindexBitstring[]): GindexBitstring[] {
  const sortedBitstrings = gindices.sort((a, b) => a.length - b.length);
  const filtered: GindexBitstring[] = [];
  outer: for (let i = 0; i < sortedBitstrings.length; i++) {
    const bsA = sortedBitstrings[i];
    for (let j = i + 1; j < sortedBitstrings.length; j++) {
      const bsB = sortedBitstrings[j];
      if (bsB.startsWith(bsA)) {
        continue outer;
      }
    }
    filtered.push(bsA);
  }
  return filtered;
}

/**
 * Return the set of generalized indices required for a multiproof
 * This includes all leaves and any necessary witnesses
 * @param gindices leaves to include in proof
 * @returns all generalized indices required for a multiproof (leaves and witnesses), deduplicated and sorted in-order according to the tree
 */
export function computeMultiProofBitstrings(gindices: GindexBitstring[]): GindexBitstring[] {
  // Initialize the proof indices with the leaves
  const proof = new Set<GindexBitstring>(filterParentBitstrings(gindices));
  const paths = new Set<GindexBitstring>();
  const branches = new Set<GindexBitstring>();

  // Collect all path indices and all branch indices
  let maxBitLength = 1;
  for (const gindex of proof) {
    if (gindex.length > maxBitLength) maxBitLength = gindex.length;
    const {path, branch} = computeProofBitstrings(gindex);
    path.forEach((g) => paths.add(g));
    branch.forEach((g) => branches.add(g));
  }

  // Remove all branches that are included in the paths
  paths.forEach((g) => branches.delete(g));
  // Add all remaining branches to the leaves
  branches.forEach((g) => proof.add(g));

  return sortInOrderBitstrings(Array.from(proof), maxBitLength);
}
