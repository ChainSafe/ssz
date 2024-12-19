import {itBench} from "@dapplion/benchmark";
import {bitLength} from "../../src/util/merkleize.js";

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

// Previous implementation, replaced by bitLength
function bitLengthStr(n: number): number {
  const bitstring = n.toString(2);
  if (bitstring === "0") {
    return 0;
  }
  return bitstring.length;
}
