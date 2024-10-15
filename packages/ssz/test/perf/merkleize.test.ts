import {describe, bench} from "@chainsafe/benchmark";
import {merkleizeInto} from "@chainsafe/persistent-merkle-tree";
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

describe("merkleize vs persistent-merkle-tree merkleizeInto", () => {
  const chunkCounts = [4, 8, 16, 32];

  for (const chunkCount of chunkCounts) {
    const rootArr = Array.from({length: chunkCount}, (_, i) => Buffer.alloc(32, i));
    const roots = Buffer.concat(rootArr);
    const result = Buffer.alloc(32);
    itBench(`merkleizeInto ${chunkCount} chunks`, () => {
      merkleizeInto(roots, chunkCount, result, 0);
    });

    itBench(`merkleize ${chunkCount} chunks`, () => {
      merkleize(rootArr, chunkCount);
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
