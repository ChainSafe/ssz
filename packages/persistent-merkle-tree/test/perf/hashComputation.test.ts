import {itBench} from "@dapplion/benchmark";
import { HashComputation, HashComputationLevel, LeafNode, zeroHash } from "../../src";

describe("HashComputationLevel", function () {
  const src = LeafNode.fromRoot(zeroHash(0));
  const dest = LeafNode.fromRoot(zeroHash(1));
  const hashComp: HashComputation = {src0: src, src1: src, dest, next: null};

  const length = 1_000_000;

  itBench({
    id: "HashComputationLevel.push then loop",
    before: () => new HashComputationLevel(),
    beforeEach: (level) => {
      level.reset();
      return level;
    },
    fn: (level: HashComputationLevel) => {
      for (let i = 0; i < length; i++) {
        level.push(src, src, dest);
      }
      level.clean();
      for (const hc of level) {
        const {src0, src1, dest} = hc;
      }
    }
  });

  itBench({
    id: "HashComputation[] push then loop",
    fn: () => {
      const level: HashComputation[] = [];
      for (let i = 0; i < length; i++) {
        level.push(hashComp);
      }
      for (const hc of level) {
        const {src0, src1, dest} = hc;
      }
    }
  })
});
