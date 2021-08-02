import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {Tree, subtreeFillToDepth, BranchNode, iterateAtDepth, LeafNode} from "../../src";

describe("set", () => {
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
      backing.setNode2(gindex, n2);
    });
  }
});
