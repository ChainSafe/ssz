import {describe, bench} from "@chainsafe/benchmark";
import {bitLength} from "../../src/util/merkleize.js";

describe("merkleize / bitLength", () => {
  for (const n of [50, 8000, 250000]) {
    bench(`bitLength(${n})`, () => {
      bitLength(n);
    });

    bench(`bitLengthStr(${n})`, () => {
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
