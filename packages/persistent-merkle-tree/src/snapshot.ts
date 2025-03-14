import {Gindex, toGindex} from "./gindex.js";
import {LeafNode, Node} from "./node.js";
import {Tree, getNode} from "./tree.js";
import {zeroNode} from "./zeroNode.js";

type Snapshot = {
  finalized: Uint8Array[];
  count: number;
};

/**
 * Given a tree, return a snapshot of the tree with the root, finalized nodes, and count.
 * Tree could be full tree, or partial tree. See https://github.com/ChainSafe/ssz/issues/293
 */
export function toSnapshot(rootNode: Node, depth: number, count: number): Snapshot {
  if (count < 0) {
    throw new Error(`Expect count to be non-negative, got ${count}`);
  }

  const finalizedGindices = count > 0 ? indexToFinalizedGindices(depth, count - 1) : [];
  const finalized = finalizedGindices.map((gindex) => getNode(rootNode, gindex).root);

  return {
    finalized,
    count,
  };
}

/**
 * Given a snapshot, return root node of a tree.
 * See https://github.com/ChainSafe/ssz/issues/293
 */
export function fromSnapshot(snapshot: Snapshot, depth: number): Node {
  const tree = new Tree(zeroNode(depth));
  const {count, finalized} = snapshot;
  if (count < 0) {
    throw new Error(`Expect count to be non-negative, got ${count}`);
  }

  const finalizedGindices = count > 0 ? indexToFinalizedGindices(depth, count - 1) : [];

  if (finalizedGindices.length !== finalized.length) {
    throw new Error(`Expected ${finalizedGindices.length} finalized gindices, got ${finalized.length}`);
  }

  for (const [i, gindex] of finalizedGindices.entries()) {
    const node = LeafNode.fromRoot(finalized[i]);
    tree.setNode(gindex, node);
  }

  return tree.rootNode;
}

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
