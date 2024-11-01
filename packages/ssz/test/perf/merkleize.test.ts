import {itBench} from "@dapplion/benchmark";
import {bitLength, merkleize} from "../../src/util/merkleize";
import {merkleizeBlockArray, merkleizeBlocksBytes} from "@chainsafe/persistent-merkle-tree";

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
  const chunkCounts = [32, 128, 512, 1024];

  for (const chunkCount of chunkCounts) {
    const rootArr = Array.from({length: chunkCount}, (_, i) => Buffer.alloc(32, i));
    const blocksBytes = Buffer.concat(rootArr);
    if (blocksBytes.length % 64 !== 0) {
      throw new Error("blockBytes length must be a multiple of 64");
    }
    const blockArray: Uint8Array[] = [];
    for (let i = 0; i < blocksBytes.length; i += 64) {
      blockArray.push(blocksBytes.slice(i, i + 64));
    }

    const result = Buffer.alloc(32);

    itBench(`merkleize ${chunkCount} chunks`, () => {
      merkleize(rootArr, chunkCount);
    });

    itBench(`merkleizeBlocksBytes ${chunkCount} chunks`, () => {
      merkleizeBlocksBytes(blocksBytes, chunkCount, result, 0);
    });

    itBench(`merkleizeBlockArray ${chunkCount} chunks`, () => {
      merkleizeBlockArray(blockArray, chunkCount, result, 0);
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
