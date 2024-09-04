import { Gindex, toGindex } from "@chainsafe/persistent-merkle-tree";

/**
 * A finalized gindex means that the gindex is at the root of a subtree of the tree where there is no ZERO_NODE belong to it.
 * Given a list of depth `depth` and an index `index`, return a list of finalized gindexes.
 */
export function indexToFinalizedGindices(depth: number, index: number): Gindex[] {
  if (index < 0 || depth < 0) {
    throw new Error(`Expect index and depth to be non-negative, got ${index} and ${depth}`);
  }

  // given this tree with depth 3 and index 6
  //        X
  //    X       X
  //  X   X   X   0
  // X X X X X X 0 0
  // we'll extract the root 4 left most nodes, then root node of the next 2 nodes
  // need to track the offset at each level to compute gindex of each root node
  const offsetByDepth = Array.from({length: depth + 1}, () => 0);
  // count starts with 1
  let count = index + 1;

  const result: Gindex[] = [];
  while (count > 0) {
    const prevLog2 = Math.floor(Math.log2(count));
    const prevPowerOf2 = 2 ** prevLog2;
    const depthFromRoot = depth - prevLog2;
    const finalizedGindex = toGindex(depthFromRoot, BigInt(offsetByDepth[depthFromRoot]));
    result.push(finalizedGindex);
    for (let i = 0; i <= prevLog2; i++) {
      offsetByDepth[depthFromRoot + i] += Math.pow(2, i);
    }

    count -= prevPowerOf2;
  }

  return result;
}

