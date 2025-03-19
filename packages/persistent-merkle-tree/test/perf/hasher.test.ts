import {bench, describe} from "@chainsafe/benchmark";
import {hasher as asSha256Hasher} from "../../src/hasher/as-sha256.js";
import {hasher as hashtreeHasher} from "../../src/hasher/hashtree.js";
import {HashObject, Hasher, setHasher, uint8ArrayToHashObject} from "../../src/hasher/index.js";
import {hasher as nobleHasher} from "../../src/hasher/noble.js";
import {HashComputationLevel, getHashComputations} from "../../src/index.js";
import {buildComparisonTrees} from "../utils/tree.js";

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

  const hashers: Hasher[] = [hashtreeHasher, asSha256Hasher, nobleHasher];

  const runsFactor = 10;
  for (const hasher of hashers) {
    describe(hasher.name, () => {
      bench({
        id: `hash 2 Uint8Array ${iterations} times - ${hasher.name}`,
        fn: () => {
          for (let i = 0; i < runsFactor; i++) {
            for (let j = 0; j < iterations; j++) hasher.digest64(root1, root2);
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
