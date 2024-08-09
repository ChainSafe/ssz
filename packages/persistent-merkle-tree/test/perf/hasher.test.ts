import {itBench} from "@dapplion/benchmark";
import {HashObject, setHasher, uint8ArrayToHashObject} from "../../src/hasher";
import {hasher as asShaHasher} from "../../src/hasher/as-sha256";
import {hasher as nobleHasher} from "../../src/hasher/noble";
import {hasher as hashtreeHasher} from "../../src/hasher/hashtree";
import {buildComparisonTrees} from "../utils/tree";
import {HashComputationLevel, getHashComputations} from "../../src";

describe("hasher", function () {
  this.timeout(0);

  const iterations = 500_000;

  const root1 = new Uint8Array(32);
  const root2 = new Uint8Array(32);
  for (let i = 0; i < root1.length; i++) {
    root1[i] = 1;
  }
  for (let i = 0; i < root2.length; i++) {
    root2[i] = 2;
  }

  const runsFactor = 10;
  for (const hasher of [asShaHasher, nobleHasher, hashtreeHasher]) {
    describe(hasher.name, () => {
      itBench({
        id: `hash 2 Uint8Array ${iterations} times - ${hasher.name}`,
        fn: () => {
          for (let i = 0; i < runsFactor; i++) {
            for (let j = 0; j < iterations; j++) hasher.digest64(root1, root2);
          }
        },
        runsFactor,
      });

      itBench({
        id: `hashTwoObjects ${iterations} times - ${hasher.name}`,
        before: () => ({
          obj1: uint8ArrayToHashObject(root1),
          obj2: uint8ArrayToHashObject(root2),
        }),
        beforeEach: (params) => params,
        fn: ({obj1, obj2}) => {
          const result = {} as HashObject;
          for (let i = 0; i < runsFactor; i++) {
            for (let j = 0; j < iterations; j++) hasher.digest64HashObjects(obj1, obj2, result);
          }
        },
        runsFactor,
      });

      itBench({
        id: `executeHashComputations - ${hasher.name}`,
        beforeEach: () => {
          const [tree] = buildComparisonTrees(16);
          return tree;
        },
        fn: (tree) => {
          const hcByLevel: HashComputationLevel[] = [];
          getHashComputations(tree, 0, hcByLevel);
          hasher.executeHashComputations(hcByLevel);
        },
      });
    });
  }
});

describe.only("hashtree", function () {
  itBench({
    id: `getHashComputations`,
    beforeEach: () => {
      const [tree] = buildComparisonTrees(16);
      return tree;
    },
    fn: (tree) => {
      const hcByLevel: HashComputationLevel[] = [];
      getHashComputations(tree, 0, hcByLevel);
    },
  });

  itBench({
    id: `executeHashComputations - hashtree`,
    beforeEach: () => {
      const [tree] = buildComparisonTrees(16);
      return tree;
    },
    fn: (tree) => {
      const hcByLevel: HashComputationLevel[] = [];
      getHashComputations(tree, 0, hcByLevel);
      hashtreeHasher.executeHashComputations(hcByLevel);
    },
  });

  itBench({
    id: `root - hashtree`,
    beforeEach: () => {
      const [tree] = buildComparisonTrees(16);
      setHasher(hashtreeHasher);
      return tree;
    },
    fn: (tree) => {
     tree.root;
    },
  });
});
