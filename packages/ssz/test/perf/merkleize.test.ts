import {bench, describe } from "@chainsafe/benchmark";
import {merkleizeBlockArray, merkleizeBlocksBytes} from "@chainsafe/persistent-merkle-tree";
import {bitLength, merkleize} from "../../src/util/merkleize.js";

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

    bench(`merkleize ${chunkCount} chunks`, () => {
      merkleize(rootArr, chunkCount);
    });

    bench(`merkleizeBlocksBytes ${chunkCount} chunks`, () => {
      merkleizeBlocksBytes(blocksBytes, chunkCount, result, 0);
    });

    bench(`merkleizeBlockArray ${chunkCount} chunks`, () => {
      merkleizeBlockArray(blockArray, blockArray.length, chunkCount, result, 0);
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
