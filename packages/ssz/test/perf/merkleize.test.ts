import {itBench} from "@dapplion/benchmark";
import {bitLength, merkleize} from "../../src/util/merkleize";
import {merkleizeBlocksBytes} from "@chainsafe/persistent-merkle-tree";

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

describe("merkleize vs persistent-merkle-tree merkleizeBlocksBytes", () => {
  const chunkCounts = [4, 8, 16, 32];

  for (const chunkCount of chunkCounts) {
    const rootArr = Array.from({length: chunkCount}, (_, i) => Buffer.alloc(32, i));
    const roots = Buffer.concat(rootArr);
    const result = Buffer.alloc(32);
    itBench(`merkleizeBlocksBytes ${chunkCount} chunks`, () => {
      merkleizeBlocksBytes(roots, chunkCount, result, 0);
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
