import {itBench} from "@dapplion/benchmark";
import {getNodeH, LeafNode} from "../../src/node";

describe("HashObject LeafNode", () => {
  // Number of new nodes created in processAttestations() on average
  const nodesPerSlot = 250_000 / 32;

  const zeroLeafNode = LeafNode.fromZero();

  itBench(`getNodeH() x${nodesPerSlot} avg hindex`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, i % 8);
    }
  });

  itBench(`getNodeH() x${nodesPerSlot} index 0`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, 0);
    }
  });

  itBench(`getNodeH() x${nodesPerSlot} index 7`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, 7);
    }
  });

  // As fast as previous methods
  const keys: (keyof LeafNode)[] = ["h0", "h1", "h2", "h3", "h4", "h5", "h6", "h7"];

  itBench(`getNodeH() x${nodesPerSlot} index 7 with key array`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      zeroLeafNode[keys[7]];
    }
  });

  itBench(`new LeafNode() x${nodesPerSlot}`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      LeafNode.fromHashObject(zeroLeafNode);
    }
  });
});
