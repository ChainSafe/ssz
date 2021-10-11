import {MAX_VALIDATORS_PER_COMMITTEE} from "@chainsafe/lodestar-params";
import {itBench} from "@dapplion/benchmark";
import {BitList, BitListType} from "../../src";

// running zipIndexesCommitteeBits() on `bitLen: 2048, bitsSet: 2048` takes 50.904 us/op
// However deserializing a BitList to struct `len 2048, set 2048` takes 560.4670 us/op,
// so it's far more efficient to keep bitlists as Uint8Arrays and also save memory.

describe("BitListType types", () => {
  const CommitteeBits = new BitListType({
    limit: MAX_VALIDATORS_PER_COMMITTEE,
  });

  const testCases: {bitLen: number; bitsSet: number}[] = [
    // Realistic mainnet case
    {bitLen: 120, bitsSet: 90},
    // Same value as zipIndexesCommitteeBits in lodestar
    {bitLen: 2048, bitsSet: 2048},
  ];

  for (const {bitLen, bitsSet} of testCases) {
    const bitlistStruct = getBitsMany(bitLen, bitsSet) as BitList;
    const bytes = CommitteeBits.serialize(bitlistStruct);

    itBench(`bitlist bytes to struct (${bitLen},${bitsSet})`, () => {
      CommitteeBits.deserialize(bytes);
    });

    itBench(`bitlist bytes to tree (${bitLen},${bitsSet})`, () => {
      CommitteeBits.createTreeBackedFromBytes(bytes);
    });
  }
});

function getBitsMany(len: number, bitsSet: number): boolean[] {
  const bits: boolean[] = [];
  for (let i = 0; i < len; i++) {
    bits.push(i <= bitsSet);
  }
  return bits;
}
