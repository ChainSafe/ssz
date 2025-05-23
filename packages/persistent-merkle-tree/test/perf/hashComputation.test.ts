import {bench, describe} from "@chainsafe/benchmark";
import {HashComputation, HashComputationLevel, LeafNode, zeroHash} from "../../src/index.ts";

/**
 * HashComputationLevel push then loop is faster than HashComputation[] push then loop
 * This is on Mac M1:
 * HashComputationLevel
    ✓ HashComputationLevel.push then loop                                 58.75361 ops/s    17.02023 ms/op        -         19 runs  0.835 s
    ✓ HashComputation[] push then loop                                    36.51973 ops/s    27.38246 ms/op        -        150 runs   4.63 s
 */
describe("HashComputationLevel", () => {
  const src = LeafNode.fromRoot(zeroHash(0));
  const dest = LeafNode.fromRoot(zeroHash(1));
  const hashComp: HashComputation = {src0: src, src1: src, dest, next: null};

  const length = 2_000_000;

  bench({
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
        // biome-ignore lint/correctness/noUnusedVariables: We need to extract values for performance tests
        const {src0, src1, dest} = hc;
      }
    },
  });

  bench({
    id: "HashComputation[] push then loop",
    fn: () => {
      const level: HashComputation[] = [];
      for (let i = 0; i < length; i++) {
        level.push(hashComp);
      }
      for (const hc of level) {
        // biome-ignore lint/correctness/noUnusedVariables: We need to extract values for performance tests
        const {src0, src1, dest} = hc;
      }
    },
  });
});
