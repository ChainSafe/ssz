import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {Tree, subtreeFillToDepth, iterateAtDepth, LeafNode} from "../../src";

describe("Tree", () => {
  setBenchOpts({
    maxMs: 60 * 1000,
    minMs: 1 * 1000,
    runs: 1024,
  });

  for (const depth of [8, 16, 32]) {
    const n = subtreeFillToDepth(new LeafNode(Buffer.alloc(32, 1)), depth);
    const n2 = new LeafNode(Buffer.alloc(32, 2));
    const backing = new Tree(n);
    const gindex = Array.from(iterateAtDepth(depth, BigInt(0), BigInt(1)))[0];

    itBench(`set at depth ${depth}`, () => {
      backing.setNode(gindex, n2);
    });
  }

  for (const depth of [8, 16, 32]) {
    const n = subtreeFillToDepth(new LeafNode(Buffer.alloc(32, 1)), depth);
    const backing = new Tree(n);
    const startIndex = 0;
    const count = Math.min(250_000, 2 ** depth);

    itBench(`iterateNodesAtDepth ${depth}`, () => {
      Array.from(backing.iterateNodesAtDepth(depth, startIndex, count));
    });

    itBench(`getNodesAtDepth ${depth}`, () => {
      backing.getNodesAtDepth(depth, startIndex, count);
    });
  }
});
