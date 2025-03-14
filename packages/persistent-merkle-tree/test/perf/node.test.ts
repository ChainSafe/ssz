import {bench, describe} from "@chainsafe/benchmark";
import {countToDepth, getHashComputations, subtreeFillToContents} from "../../src/index.js";
import {BranchNode, LeafNode, getNodeH} from "../../src/node.js";
import {batchHash} from "../utils/batchHash.js";

describe("HashObject LeafNode", () => {
  // Number of new nodes created in processAttestations() on average
  const nodesPerSlot = 250_000 / 32;

  const zeroLeafNode = LeafNode.fromZero();

  bench(`getNodeH() x${nodesPerSlot} avg hindex`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, i % 8);
    }
  });

  bench(`getNodeH() x${nodesPerSlot} index 0`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, 0);
    }
  });

  bench(`getNodeH() x${nodesPerSlot} index 7`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, 7);
    }
  });

  // As fast as previous methods
  const keys: (keyof LeafNode)[] = ["h0", "h1", "h2", "h3", "h4", "h5", "h6", "h7"];

  bench(`getNodeH() x${nodesPerSlot} index 7 with key array`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      zeroLeafNode[keys[7]];
    }
  });

  bench(`new LeafNode() x${nodesPerSlot}`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      LeafNode.fromHashObject(zeroLeafNode);
    }
  });
});

describe("Node batchHash", () => {
  const numNodes = [250_000, 500_000, 1_000_000];

  for (const numNode of numNodes) {
    bench({
      id: `getHashComputations ${numNode} nodes`,
      beforeEach: () => createList(numNode),
      fn: (rootNode: BranchNode) => {
        getHashComputations(rootNode, 0, []);
      },
    });

    bench({
      id: `batchHash ${numNode} nodes`,
      beforeEach: () => createList(numNode),
      fn: (rootNode: BranchNode) => {
        batchHash(rootNode);
      },
    });

    bench({
      id: `get root ${numNode} nodes`,
      beforeEach: () => createList(numNode),
      fn: (rootNode: BranchNode) => {
        rootNode.root;
      },
    });
  }
});

function createList(numNode: number): BranchNode {
  const nodes = Array.from({length: numNode}, (_, i) => newLeafNodeFilled(i));
  // add 1 to countToDepth for mix_in_length spec
  const depth = countToDepth(BigInt(numNode)) + 1;
  const node = subtreeFillToContents(nodes, depth);
  return node as BranchNode;
}

function newLeafNodeFilled(i: number): LeafNode {
  return LeafNode.fromRoot(new Uint8Array(Array.from({length: 32}, () => i % 256)));
}
