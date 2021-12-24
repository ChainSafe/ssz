import {itBench} from "@dapplion/benchmark";
import {bitLength, bitLengthStr} from "../../src/util/merkleize";

describe("merkleize / bitLength", () => {
  for (const n of [50, 8000, 250000]) {
    itBench(`bitLength(${n})`, () => {
      bitLength(n);
    });

    itBench(`bitLengthStr(${n})`, () => {
      bitLengthStr(n);
    });
  }
});
