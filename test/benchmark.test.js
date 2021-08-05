const {itBench, setBenchOpts} = require("@dapplion/benchmark");
const sha256 = require("../lib/index");

// As of Aug 05 2021
// hash
//     ✓ digestTwoHashObjects 50023 times                                    18.56678 ops/s    53.85965 ms/op        -       1114 runs   60.0 s
//     ✓ digest64 50023 times                                                17.20804 ops/s    58.11236 ms/op        -       1033 runs   60.0 s

describe("hash", () => {
  setBenchOpts({
    maxMs: 100 * 1000,
    minMs: 60 * 1000,
    runs: 512,
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
    for (let j = 0; j < iterations; j++) sha256.default.digestTwoHashObjects(obj1, obj2);
  });

  itBench(`digest64 ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) sha256.default.digest64(input);
  });

});

/**
 * time java: 2968 336927.2237196765 hashes/sec
 * time apache: 1025 975609.7560975610 hashes/sec
 *
 * As of Aug 04 2021
 * digest 1000000 times                                               0.8279731 ops/s    1.207769  s/op        -         82 runs    100 s
 * => we are at 8279731 hashes/sec
 */
describe("hash - compare to java", () => {
  // java statistic for same test: https://gist.github.com/scoroberts/a60d61a2cc3afba1e8813b338ecd1501
  setBenchOpts({
    maxMs: 100 * 1000,
    minMs: 60 * 1000,
    runs: 512,
  });

  const iterations = 1000000;
  const input = Buffer.from("lwkjt23uy45pojsdf;lnwo45y23po5i;lknwe;lknasdflnqw3uo5", "utf8");

  itBench(`digest ${iterations} times`, () => {
    for (let i=0; i<iterations; i++) sha256.default.digest(input);
  })
});
