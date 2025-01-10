import {bench, describe, setBenchOpts} from "@chainsafe/benchmark";
import {
  digest,
  digest2Bytes32,
  digest64HashObjects,
  byteArrayToHashObject,
  hashObjectToByteArray,
} from "../../src/index.js";

// Feb 2024 Mac M1
// digestTwoHashObjects vs digest64 vs digest
//     ✓ digestTwoHashObjects 50023 times                                    28.82303 ops/s    34.69448 ms/op   x1.002       1715 runs   60.0 s
//     ✓ digest64 50023 times                                                27.30382 ops/s    36.62491 ms/op   x1.003       1625 runs   60.0 s
//     ✓ digest 50023 times                                                  27.31207 ops/s    36.61385 ms/op   x0.999       1624 runs   60.0 s
describe("digestTwoHashObjects vs digest64 vs digest", () => {
  setBenchOpts({
    minMs: 60000,
  });

  const input = Buffer.from("gajindergajindergajindergajindergajindergajindergajindergajinder", "utf8");
  const input1 = "gajindergajindergajindergajinder";
  const input2 = "gajindergajindergajindergajinder";
  const buffer1 = Buffer.from(input1, "utf-8");
  const buffer2 = Buffer.from(input2, "utf-8");
  const obj1 = byteArrayToHashObject(buffer1, 0);
  const obj2 = byteArrayToHashObject(buffer2, 0);
  // total number of time running hash for 200000 balances
  const iterations = 50023;
  bench(`digestTwoHashObjects ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) digest64HashObjects(obj1, obj2);
  });

  bench(`digest2Bytes32 ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) digest2Bytes32(buffer1, buffer2);
  });

  bench(`digest ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) digest(input);
  });
});

describe("digest different Buffers", () => {
  const randomBuffer = (length: number): Uint8Array =>
    Buffer.from(Array.from({length}, () => Math.round(Math.random() * 255)));

  for (const length of [32, 64, 128, 256, 512, 1024]) {
    const buffer = randomBuffer(length);
    bench(`input length ${length}`, () => {
      digest(buffer);
    });
  }
});

/**
 * time java: 2968 336927.2237196765 hashes/sec
 * time apache: 1025 975609.7560975610 hashes/sec
 *
 * Aug 04 2021
 * digest 1000000 times                                               0.8279731 ops/s    1.207769  s/op        -         82 runs    100 s
 * => we are at 8279731 hashes/sec
 */
describe("hash - compare to java", () => {
  // java statistic for same test: https://gist.github.com/scoroberts/a60d61a2cc3afba1e8813b338ecd1501
  const iterations = 1000000;
  const input = Buffer.from("lwkjt23uy45pojsdf;lnwo45y23po5i;lknwe;lknasdflnqw3uo5", "utf8");

  bench(`digest ${iterations} times`, () => {
    for (let i = 0; i < iterations; i++) digest(input);
  });
});

// Aug 10 2021
// utils
// ✓ hashObjectToByteArray 50023 times                                   685.6641 ops/s    1.458440 ms/op        -      41081 runs   60.0 s
// ✓ byteArrayToHashObject 50023 times                                   580.6237 ops/s    1.722286 ms/op        -      34771 runs   60.0 s
describe("utils", () => {
  const input1 = "gajindergajindergajindergajinder";
  const buffer1 = Buffer.from(input1, "utf-8");
  const obj1 = byteArrayToHashObject(buffer1, 0);

  // total number of time running hash for 200000 balances
  const iterations = 50023;

  bench(`hashObjectToByteArray ${iterations} times`, () => {
    const byteArr = new Uint8Array(32);
    for (let j = 0; j < iterations; j++) hashObjectToByteArray(obj1, byteArr, 0);
  });

  bench(`byteArrayToHashObject ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) byteArrayToHashObject(buffer1, 0);
  });
});
