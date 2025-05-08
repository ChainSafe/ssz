import {bench, describe} from "@chainsafe/benchmark";
import {getNodeAtDepth, getNodesAtDepth, setNodeAtDepth, setNodesAtDepth, zeroNode} from "../../../src/index.ts";
import {fillArray, linspace} from "../../utils/misc.ts";

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

    bench({
      id: `getNodeAtDepth depth ${depth} x${runsFactor}`,
      fn: () => {
        for (let i = 0; i < runsFactor; i++) {
          getNodeAtDepth(rootNode, depth, index);
        }
      },
    });

    bench({
      id: `setNodeAtDepth depth ${depth} x${runsFactor}`,
      fn: () => {
        for (let i = 0; i < runsFactor; i++) {
          setNodeAtDepth(rootNode, depth, index, nodeChanged);
        }
      },
    });

    bench({
      id: `getNodesAtDepth depth ${depth} x${runsFactor}`,
      fn: () => {
        for (let i = 0; i < runsFactor; i++) {
          getNodesAtDepth(rootNode, depth, 0, maxIndex);
        }
      },
    });

    bench({
      id: `setNodesAtDepth depth ${depth} x${runsFactor}`,
      fn: () => {
        for (let i = 0; i < runsFactor; i++) {
          setNodesAtDepth(rootNode, depth, indexes, nodesChanged);
        }
      },
    });
  }
});
