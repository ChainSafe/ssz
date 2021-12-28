import {HashObject} from "@chainsafe/as-sha256";
import {itBench} from "@dapplion/benchmark";
import {getNodeH, LeafNode} from "../../src/node";

describe("packedRootsBytesToLeafNodes", () => {
  // Number of new nodes created in processAttestations() on average
  const nodesPerSlot = 250_000 / 32;

  const zeroLeafNode = new LeafNode({h0: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0});

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

  // itBench(`new LeafNode() x${nodesPerSlot}`, () => {
  //   for (let i = 0; i < nodesPerSlot; i++) {
  //     new LeafNode(zeroLeafNode);
  //   }
  // });
});
