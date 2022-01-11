import {itBench} from "@dapplion/benchmark";
import {
  subtreeFillToContents,
  Tree,
  Node,
  LeafNode,
  getNodesAtDepth,
  getNodesAtDepthIndexes,
  zeroNode,
  BranchNode,
} from "../../../src";

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
  const initialNode = new LeafNode(Buffer.alloc(32, 0xaa));

  before("Get base tree and data", () => {
    const initialNodes: Node[] = [];
    for (let i = 0; i < length; i++) {
      initialNodes.push(initialNode);
    }

    tree = new Tree(subtreeFillToContents(initialNodes, depth));
  });

  itBench({
    id: "tree.getNodesAtDepth - gindexes",
    fn: () => {
      getNodesAtDepth(tree.rootNode, depth, 0, length);
    },
  });

  itBench({
    id: "tree.getNodesAtDepth - indexes",
    // minMs: 999999,
    fn: () => {
      getNodesAtDepthIndexes(tree.rootNode, depth, 0, length);
    },
  });

  itBench({
    id: "tree.getNodesAtDepth - push all nodes",
    // minMs: 999999,
    fn: () => {
      const nodes: Node[] = [];
      for (let i = 0; i < length; i++) {
        nodes.push(initialNode);
      }
    },
  });

  itBench({
    id: "tree.getNodesAtDepth - navigation",
    // minMs: 999999,
    fn: () => {
      const branchNode = new BranchNode(zeroNode(0), zeroNode(0));
      for (let i = 0, count = length * 2; i < count; i++) {
        branchNode.left;
      }
    },
  });

  // after(async function () {
  //   this.timeout(1e5);
  //   await new Promise((r) => setTimeout(r, 1e5));
  // });
});