import {beforeAll, bench, describe } from "@chainsafe/benchmark";
import {
  BranchNode,
  LeafNode,
  Node,
  Tree,
  getNodesAtDepth,
  subtreeFillToContents,
  zeroNode,
} from "../../../src/index.js";

// Results in Linux Dec 2021
//
// tree / setNodes
// ✓ tree.setNodes - gindexes                                            245.6736 ops/s    4.070442 ms/op        -        528 runs   2.66 s
// ✓ tree.setNodes - gindexes precomputed                                330.1247 ops/s    3.029158 ms/op        -        269 runs   1.32 s
// ✓ tree.setNodesAtDepth - indexes                                      2453.572 ops/s    407.5690 us/op        -       4925 runs   2.50 s

describe("tree / getNodesAtDepth", () => {
  const depth = 40;
  const vc = 250_000; // Multiple of 32
  const length = vc;

  let tree: Tree;
  const initialNode = LeafNode.fromRoot(Buffer.alloc(32, 0xaa));

  beforeAll(() => {
    const initialNodes = new Array<Node>(length);
    for (let i = 0; i < length; i++) {
      initialNodes[i] = initialNode;
    }

    tree = new Tree(subtreeFillToContents(initialNodes, depth));
  });

  bench({
    id: "tree.getNodesAtDepth - gindexes",
    fn: () => {
      getNodesAtDepth(tree.rootNode, depth, 0, length);
    },
  });

  bench({
    id: "tree.getNodesAtDepth - push all nodes",
    fn: () => {
      const nodes = new Array<Node>(length);
      for (let i = 0; i < length; i++) {
        nodes[i] = initialNode;
      }
    },
  });

  bench({
    id: "tree.getNodesAtDepth - navigation",
    fn: () => {
      const branchNode = new BranchNode(zeroNode(0), zeroNode(0));
      for (let i = 0, count = length * 2; i < count; i++) {
        branchNode.left;
      }
    },
  });
});
