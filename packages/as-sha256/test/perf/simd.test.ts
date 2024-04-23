import { itBench, setBenchOpts } from "@dapplion/benchmark";
import * as sha256 from "../../src";
import {byteArrayToHashObject} from "../../src/hashObject";

/**
 * Mac M1 Apr 2024
 *
  digest64 vs hash4UintArray64s vs hash4HashObjectInputs
    ✓ digest64 200092 times                                               6.816078 ops/s    146.7119 ms/op        -         66 runs   10.3 s
    ✓ hash 200092 times using hash4UintArray64s                               8.093460 ops/s    123.5566 ms/op        -         78 runs   10.2 s
    ✓ hash 200092 times using hash4HashObjectInputs                            8.141334 ops/s    122.8300 ms/op        -         78 runs   10.2 s
 */
describe("digest64 vs hash4UintArray64s vs hash4HashObjectInputs", function () {
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

  // hash4UintArray64s do 4 sha256 in parallel
  itBench(`hash ${iterations * 4} times using hash4UintArray64s`, () => {
    for (let j = 0; j < iterations; j++) {
      sha256.hash4UintArray64s([input, input, input, input]);
    }
  });

  const hashObject = byteArrayToHashObject(Buffer.from("gajindergajindergajindergajinder", "utf8"));
  const hashInputs = Array.from({length: 8}, () => hashObject);
  // hash4HashObjectInputs do 4 sha256 in parallel
  itBench(`hash ${iterations * 4} times using hash4HashObjectInputs`, () => {
    for (let j = 0; j < iterations; j++) {
      sha256.hash4HashObjectInputs(hashInputs);
    }
  });
});
