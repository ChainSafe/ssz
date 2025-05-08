import {beforeAll, bench, describe} from "@chainsafe/benchmark";
import {LeafNode, Node, Tree, setNodesAtDepth, subtreeFillToContents, toGindex} from "../../../src/index.ts";

// Results in Linux Dec 2021
//
// tree / setNodes
// ✓ tree.setNodes - gindexes                                            245.6736 ops/s    4.070442 ms/op        -        528 runs   2.66 s
// ✓ tree.setNodes - gindexes precomputed                                330.1247 ops/s    3.029158 ms/op        -        269 runs   1.32 s
// ✓ tree.setNodesAtDepth - indexes                                      2453.572 ops/s    407.5690 us/op        -       4925 runs   2.50 s

describe("tree / setNodes", () => {
  const depth = 40 - 5;
  const vc = 249_984; // Multiple of 32
  const itemsPerChunk = 32; // 1 byte per item
  const attesterShare = 32;

  // New data to add to tree with setNodes()
  const indexes: number[] = [];
  const nodes: Node[] = [];
  const gindexes: bigint[] = [];

  let tree: Tree;
  const initialNode = LeafNode.fromRoot(Buffer.alloc(32, 0xaa));
  const changedNode = LeafNode.fromRoot(Buffer.alloc(32, 0xbb));

  beforeAll(() => {
    const length = Math.ceil(vc / itemsPerChunk);
    const initialNodes = new Array<Node>(length);
    for (let i = 0; i < length; i++) {
      initialNodes[i] = initialNode;
    }

    tree = new Tree(subtreeFillToContents(initialNodes, depth));

    const indexesSet = new Set<number>();
    for (let i = 0; i < vc; i += Math.floor(2 * attesterShare * Math.random())) {
      indexesSet.add(Math.floor(i / itemsPerChunk));
    }
    for (const index of indexesSet) {
      indexes.push(index);
      nodes.push(changedNode);
      gindexes.push(toGindex(depth, BigInt(index)));
    }
  });

  bench({
    id: "tree.setNodesAtDepth - indexes",
    beforeEach: () => tree.clone(),
    fn: (tree) => {
      setNodesAtDepth(tree.rootNode, depth, indexes, nodes);
    },
  });
});
