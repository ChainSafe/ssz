import {bench, describe, setBenchOpts} from "@chainsafe/benchmark";
import {byteArrayToHashObject} from "../../src/hashObject.ts";
import {batchHash4HashObjectInputs, batchHash4UintArray64s, digest64, digest64HashObjects} from "../../src/index.ts";

/**
 * This really depends on cpu, on a test ubuntu node, batch*() is 2x faster than digest64
 * On Mac M1 May 2025:
 * digest64 vs batchHash4UintArray64s vs digest64HashObjects vs batchHash4HashObjectInputs
    ✓ digest64 200092 times                                               6.648102 ops/s    150.4189 ms/op        -         64 runs   10.2 s
    ✓ hash 200092 times using batchHash4UintArray64s                      9.120131 ops/s    109.6476 ms/op        -         88 runs   10.2 s
    ✓ digest64HashObjects 200092 times                                    7.095494 ops/s    140.9345 ms/op        -         68 runs   10.2 s
    ✓ hash 200092 times using batchHash4HashObjectInputs                  9.211751 ops/s    108.5570 ms/op        -         88 runs   10.1 s
 */
describe("digest64 vs batchHash4UintArray64s vs digest64HashObjects vs batchHash4HashObjectInputs", () => {
  setBenchOpts({
    minMs: 10_000,
  });

  const input = Buffer.from("gajindergajindergajindergajindergajindergajindergajindergajinder", "utf8");
  // total number of time running hash for 200000 balances
  const iterations = 50023;
  bench(`digest64 ${iterations * 4} times`, () => {
    for (let j = 0; j < iterations * 4; j++) digest64(input);
  });

  // batchHash4UintArray64s do 4 sha256 in parallel
  bench(`hash ${iterations * 4} times using batchHash4UintArray64s`, () => {
    for (let j = 0; j < iterations; j++) {
      batchHash4UintArray64s([input, input, input, input]);
    }
  });

  const hashObject = byteArrayToHashObject(Buffer.from("gajindergajindergajindergajinder", "utf8"), 0);
  bench(`digest64HashObjects ${iterations * 4} times`, () => {
    for (let j = 0; j < iterations * 4; j++) digest64HashObjects(hashObject, hashObject);
  });

  const hashInputs = Array.from({length: 8}, () => hashObject);
  // batchHash4HashObjectInputs do 4 sha256 in parallel
  bench(`hash ${iterations * 4} times using batchHash4HashObjectInputs`, () => {
    for (let j = 0; j < iterations; j++) {
      batchHash4HashObjectInputs(hashInputs);
    }
  });
});
