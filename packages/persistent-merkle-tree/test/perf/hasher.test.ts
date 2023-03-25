import {itBench} from "@dapplion/benchmark";
import {uint8ArrayToHashObject} from "../../src/hasher";
import {hasher as asShaHasher} from "../../src/hasher/as-sha256";
import {hasher as nobleHasher} from "../../src/hasher/noble";

describe("hasher", () => {
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

  for (const {hasher, name} of [
    {hasher: asShaHasher, name: "as-sha256"},
    {hasher: nobleHasher, name: "noble"},
  ]) {
    itBench(`hash 2 Uint8Array ${iterations} times - ${name}`, () => {
      for (let j = 0; j < iterations; j++) hasher.digest64(root1, root2);
    });

    const obj1 = uint8ArrayToHashObject(root1);
    const obj2 = uint8ArrayToHashObject(root2);
    itBench(`hashTwoObjects ${iterations} times - ${name}`, () => {
      for (let j = 0; j < iterations; j++) hasher.digest64HashObjects(obj1, obj2);
    });
  }
});
