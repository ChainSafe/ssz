import {itBench, setBenchOpts} from "@dapplion/benchmark";
import * as sha256 from "../../src";
import {byteArrayToHashObject} from "../../src/hashObject";

/**
 * This really depends on cpu, on a test ubuntu node, batch*() is 2x faster than digest64
 * On Mac M1 May 2025:
 * digest64 vs batchHash4UintArray64s vs batchHash4HashObjectInputs
    ✓ digest64 200092 times                                               6.850496 ops/s    145.9748 ms/op        -         66 runs   10.2 s
    ✓ hash 200092 times using batchHash4UintArray64s                      8.454788 ops/s    118.2762 ms/op        -         82 runs   10.2 s
    ✓ hash 200092 times using batchHash4HashObjectInputs                  8.454464 ops/s    118.2807 ms/op        -         82 runs   10.2 s
 */
describe("digest64 vs batchHash4UintArray64s vs batchHash4HashObjectInputs", function () {
  this.timeout(0);

  setBenchOpts({
    minMs: 10_000,
  });

  const input = Buffer.from("gajindergajindergajindergajindergajindergajindergajindergajinder", "utf8");
  // total number of time running hash for 200000 balances
  const iterations = 50023;
  itBench(`digest64 ${iterations * 4} times`, () => {
    for (let j = 0; j < iterations * 4; j++) sha256.digest64(input);
  });

  // batchHash4UintArray64s do 4 sha256 in parallel
  itBench(`hash ${iterations * 4} times using batchHash4UintArray64s`, () => {
    for (let j = 0; j < iterations; j++) {
      sha256.batchHash4UintArray64s([input, input, input, input]);
    }
  });

  const hashObject = byteArrayToHashObject(Buffer.from("gajindergajindergajindergajinder", "utf8"));
  const hashInputs = Array.from({length: 8}, () => hashObject);
  // batchHash4HashObjectInputs do 4 sha256 in parallel
  itBench(`hash ${iterations * 4} times using batchHash4HashObjectInputs`, () => {
    for (let j = 0; j < iterations; j++) {
      sha256.batchHash4HashObjectInputs(hashInputs);
    }
  });
});
