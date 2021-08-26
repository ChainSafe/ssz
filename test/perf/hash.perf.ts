import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {uint8ArrayToHashObject, hash, hashTwoObjects} from "../../src/hash";

describe("hash", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 10 * 1000,
    runs: 512,
  });

  const root1 = new Uint8Array(32);
  const root2 = new Uint8Array(32);
  for (let i = 0; i < root1.length; i++) {
    root1[i] = 1;
  }
  for (let i = 0; i < root2.length; i++) {
    root2[i] = 2;
  }

  // total number of time running hash for 250_000 validators
  const iterations = 2250026;

  itBench(`hash 2 Uint8Array ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) hash(root1, root2);
  });

  const obj1 = uint8ArrayToHashObject(root1);
  const obj2 = uint8ArrayToHashObject(root2);
  itBench(`hashTwoObjects ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) hashTwoObjects(obj1, obj2);
  });

});
