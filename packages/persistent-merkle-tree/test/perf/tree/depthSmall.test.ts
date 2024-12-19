import {itBench} from "@dapplion/benchmark";
import {getNodeAtDepth, getNodesAtDepth, setNodeAtDepth, setNodesAtDepth, zeroNode} from "../../../src/index.js";
import {linspace, fillArray} from "../../utils/misc.js";

describe("Tree opts with low depth", () => {
  const runsFactor = 100_000;

  for (const depth of [0, 1, 2]) {
    const rootNode = zeroNode(depth);
    const nodeChanged = zeroNode(0);
    // Some index roughly in the middle
    const index = Math.floor(2 ** depth / 2);
    // All indexes at this depth
    const maxIndex = 2 ** depth;
    const indexes = linspace(maxIndex);
    const nodesChanged = fillArray(maxIndex, zeroNode(0));

    itBench({
      id: `getNodeAtDepth depth ${depth} x${runsFactor}`,
      fn: () => {
        for (let i = 0; i < runsFactor; i++) {
          getNodeAtDepth(rootNode, depth, index);
        }
      },
    });

    itBench({
      id: `setNodeAtDepth depth ${depth} x${runsFactor}`,
      fn: () => {
        for (let i = 0; i < runsFactor; i++) {
          setNodeAtDepth(rootNode, depth, index, nodeChanged);
        }
      },
    });

    itBench({
      id: `getNodesAtDepth depth ${depth} x${runsFactor}`,
      fn: () => {
        for (let i = 0; i < runsFactor; i++) {
          getNodesAtDepth(rootNode, depth, 0, maxIndex);
        }
      },
    });

    itBench({
      id: `setNodesAtDepth depth ${depth} x${runsFactor}`,
      fn: () => {
        for (let i = 0; i < runsFactor; i++) {
          setNodesAtDepth(rootNode, depth, indexes, nodesChanged);
        }
      },
    });
  }
});
