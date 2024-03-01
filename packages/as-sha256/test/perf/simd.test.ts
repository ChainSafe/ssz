import { itBench, setBenchOpts } from "@dapplion/benchmark";
import * as sha256 from "../../src";
import {byteArrayToHashObject} from "../../src/hashObject";

describe("digest64 vs hash4Inputs vs hash8HashObjects", function () {
  this.timeout(0);

  setBenchOpts({
    minMs: 10_000,
  });

  const input = Buffer.from("gajindergajindergajindergajindergajindergajindergajindergajinder", "utf8");
  // total number of time running hash for 200000 balances
  const iterations = 50023;
  itBench(`digest64 ${iterations} times`, () => {
    for (let j = 0; j < iterations; j++) sha256.digest64(input);
  });

  // hash4Inputs do 4 sha256 in parallel
  const iterations2 = Math.floor(iterations / 4);
  itBench(`hash ${iterations * 4} times using hash4Inputs`, () => {
    for (let j = 0; j < iterations; j++) sha256.hash4Inputs(input, input, input, input);
  });

  const hashObject = byteArrayToHashObject(Buffer.from("gajindergajindergajindergajinder", "utf8"));
  const hashInputs = Array.from({length: 8}, () => hashObject);
  // hash8HashObjects do 4 sha256 in parallel
  itBench(`hash ${iterations * 4} times using hash8HashObjects`, () => {
    for (let j = 0; j < iterations; j++) sha256.hash8HashObjects(hashInputs);
  });
});