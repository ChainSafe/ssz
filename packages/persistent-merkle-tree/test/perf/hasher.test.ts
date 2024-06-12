import {itBench} from "@dapplion/benchmark";
import {HashObject, uint8ArrayToHashObject} from "../../src/hasher";
import {hasher as asShaHasher} from "../../src/hasher/as-sha256";
import {hasher as nobleHasher} from "../../src/hasher/noble";
import {hasher as hashtreeHasher} from "../../src/hasher/hashtree";
import {buildComparisonTrees} from "../utils/tree";

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

  const hashObjects: HashObject[] = [];
  for (let i = 0; i < iterations; i++) {
    hashObjects.push(uint8ArrayToHashObject(root1));
    hashObjects.push(uint8ArrayToHashObject(root2));
  }

  for (const hasher of [asShaHasher, nobleHasher, hashtreeHasher]) {
    describe(hasher.name, () => {
      itBench(`hash 2 Uint8Array ${iterations} times - ${hasher.name}`, () => {
        for (let j = 0; j < iterations; j++) hasher.digest64(root1, root2);
      });

      itBench({
        id: `hashTwoObjects ${iterations} times - ${hasher.name}`,
        before: () => ({
          obj1: uint8ArrayToHashObject(root1),
          obj2: uint8ArrayToHashObject(root2),
        }),
        beforeEach: (params) => params,
        fn: ({obj1, obj2}) => {
          for (let j = 0; j < iterations; j++) hasher.digest64HashObjects(obj1, obj2);
        },
      });

      itBench({
        id: `batchHash - ${hasher.name}`,
        fn: () => {
          hasher.batchHashObjects(hashObjects);
        },
      });

      itBench({
        id: `executeHashComputations - ${hasher.name}`,
        beforeEach: () => {
          const [tree] = buildComparisonTrees(16);
          return tree;
        },
        fn: (tree) => {
          hasher.executeHashComputations(tree.hashComputations);
        },
      });
    });
  }
});

// TODO - batch: test more methods
