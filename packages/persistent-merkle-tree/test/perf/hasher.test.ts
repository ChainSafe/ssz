import {bench, describe} from "@chainsafe/benchmark";
import {hasher as asSha256Hasher} from "../../src/hasher/as-sha256.ts";
import {hasher as hashtreeHasher} from "../../src/hasher/hashtree.ts";
import {HashObject, Hasher, setHasher, uint8ArrayToHashObject} from "../../src/hasher/index.ts";
import {hasher as nobleHasher} from "../../src/hasher/noble.ts";
import {HashComputationLevel, getHashComputations} from "../../src/index.ts";
import {buildComparisonTrees} from "../utils/tree.ts";

const PARALLEL_FACTOR = 16;

describe("hasher", () => {
  const iterations = 500_000;

  const root1 = new Uint8Array(32);
  const root2 = new Uint8Array(32);
  for (let i = 0; i < root1.length; i++) {
    root1[i] = 1;
  }
  for (let i = 0; i < root2.length; i++) {
    root2[i] = 2;
  }

  const batchInput = new Uint8Array(PARALLEL_FACTOR * 64).fill(1);
  const batchOutput = new Uint8Array(PARALLEL_FACTOR * 32);
  const hashers: Hasher[] = [hashtreeHasher, asSha256Hasher, nobleHasher];

  const runsFactor = 10;
  for (const hasher of hashers) {
    describe(hasher.name, () => {
      bench({
        id: `hash 2 32 bytes Uint8Array ${iterations} times - ${hasher.name}`,
        fn: () => {
          const output = new Uint8Array(32);
          for (let i = 0; i < runsFactor; i++) {
            // should not use `hasher.digest64` here because of memory allocation, and it's not comparable
            // to the batch hash test below and `digest64HashObjects`
            for (let j = 0; j < iterations; j++) hasher.digest64Into(root1, root2, output);
          }
        },
        runsFactor,
      });

      // use this test to see how faster batch hash is compared to single hash in `digest64`
      bench({
        id: `batch hash ${PARALLEL_FACTOR} x 64 Uint8Array ${iterations / PARALLEL_FACTOR} times - ${hasher.name}`,
        fn: () => {
          for (let i = 0; i < runsFactor; i++) {
            for (let j = 0; j < iterations / PARALLEL_FACTOR; j++) {
              hasher.hashInto(batchInput, batchOutput);
            }
          }
        },
        runsFactor,
      });

      bench({
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

      // use to compare performance between hashers
      bench({
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

describe("hashtree", () => {
  bench({
    id: "getHashComputations",
    beforeEach: () => {
      const [tree] = buildComparisonTrees(16);
      return tree;
    },
    fn: (tree) => {
      const hcByLevel: HashComputationLevel[] = [];
      getHashComputations(tree, 0, hcByLevel);
    },
  });

  // compare this to "get root" to see how efficient the hash computation is
  bench({
    id: "executeHashComputations",
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

  // the traditional/naive way of getting the root
  bench({
    id: "get root",
    beforeEach: async () => {
      const [tree] = buildComparisonTrees(16);
      setHasher(hashtreeHasher);
      return tree;
    },
    fn: (tree) => {
      tree.root;
    },
  });
});
