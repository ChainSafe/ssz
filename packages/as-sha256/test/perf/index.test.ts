import {itBench, setBenchOpts} from "@dapplion/benchmark";
import * as sha256 from "../../src";

// Feb 2024 Mac M1
// digestTwoHashObjects vs digest64 vs digest
// ✓ digestTwoHashObjects 50023 times                                    29.99585 ops/s    33.33795 ms/op   x0.963       1785 runs   60.0 s
// ✓ digest64 50023 times                                                27.84952 ops/s    35.90727 ms/op   x0.984       1657 runs   60.0 s
// ✓ digest 50023 times                                                  28.20897 ops/s    35.44972 ms/op   x0.967       1678 runs   60.0 s
describe("digestTwoHashObjects vs digest64 vs digest", () => {
  setBenchOpts({
    minMs: 60000,
  });

  const input = Buffer.from("gajindergajindergajindergajindergajindergajindergajindergajinder", "utf8");
  const input1 = "gajindergajindergajindergajinder";
  const input2 = "gajindergajindergajindergajinder";
  const buffer1 = Buffer.from(input1, "utf-8");
  const buffer2 = Buffer.from(input2, "utf-8");
  const obj1 = sha256.byteArrayToHashObject(buffer1);
  const obj2 = sha256.byteArrayToHashObject(buffer2);
  // total number of time running hash for 200000 balances
  const iterations = 50023;
  itBench(`digestTwoHashObjects ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) sha256.digest64HashObjects(obj1, obj2);
  });

  itBench(`digest64 ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) sha256.digest64(input);
  });

  itBench(`digest ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) sha256.digest(input);
  });
});

describe("digest different Buffers", () => {
  const randomBuffer = (length: number): Uint8Array =>
    Buffer.from(Array.from({length}, () => Math.round(Math.random() * 255)));

  for (const length of [32, 64, 128, 256, 512, 1024]) {
    const buffer = randomBuffer(length);
    itBench(`input length ${length}`, () => {
      sha256.digest(buffer);
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

  itBench(`digest ${iterations} times`, () => {
    for (let i = 0; i < iterations; i++) sha256.digest(input);
  });
});

// Aug 10 2021
// utils
// ✓ hashObjectToByteArray 50023 times                                   685.6641 ops/s    1.458440 ms/op        -      41081 runs   60.0 s
// ✓ byteArrayToHashObject 50023 times                                   580.6237 ops/s    1.722286 ms/op        -      34771 runs   60.0 s
describe("utils", () => {
  const input1 = "gajindergajindergajindergajinder";
  const buffer1 = Buffer.from(input1, "utf-8");
  const obj1 = sha256.byteArrayToHashObject(buffer1);

  // total number of time running hash for 200000 balances
  const iterations = 50023;

  itBench(`hashObjectToByteArray ${iterations} times`, () => {
    const byteArr = new Uint8Array(32);
    for (let j = 0; j < iterations; j++) sha256.hashObjectToByteArray(obj1, byteArr, 0);
  });

  itBench(`byteArrayToHashObject ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) sha256.byteArrayToHashObject(buffer1);
  });
});
