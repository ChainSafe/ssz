import {bench, describe} from "@chainsafe/benchmark";
import {LeafNode, Tree, iterateAtDepth, subtreeFillToDepth} from "../../src/index.ts";

describe("Tree", () => {
  for (const depth of [8, 16, 32]) {
    const n = subtreeFillToDepth(LeafNode.fromRoot(Buffer.alloc(32, 1)), depth);
    const n2 = LeafNode.fromRoot(Buffer.alloc(32, 2));
    const backing = new Tree(n);
    const gindex = Array.from(iterateAtDepth(depth, BigInt(0), BigInt(1)))[0];

    bench(`set at depth ${depth}`, () => {
      backing.setNode(gindex, n2);
    });
  }

  for (const depth of [8, 16, 32, 40]) {
    const n = subtreeFillToDepth(LeafNode.fromRoot(Buffer.alloc(32, 1)), depth);
    const backing = new Tree(n);
    const startIndex = 0;
    const count = Math.min(250_000, 2 ** depth);

    bench(`iterateNodesAtDepth ${depth} ${count}`, () => {
      Array.from(backing.iterateNodesAtDepth(depth, startIndex, count));
    });

    bench(`getNodesAtDepth ${depth} ${count}`, () => {
      backing.getNodesAtDepth(depth, startIndex, count);
    });
  }
});
