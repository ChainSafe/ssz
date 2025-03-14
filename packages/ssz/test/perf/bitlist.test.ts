import {bench, describe} from "@chainsafe/benchmark";
import {BitArray, BitListType} from "../../src/index.js";

// running zipIndexesCommitteeBits() on `bitLen: 2048, bitsSet: 2048` takes 50.904 us/op
// However deserializing a BitList to struct `len 2048, set 2048` takes 560.4670 us/op,
// so it's far more efficient to keep bitlists as Uint8Arrays and also save memory.

describe("BitListType types", () => {
  const maxValidatorsPerCommittee = 2048;
  const CommitteeBits = new BitListType(maxValidatorsPerCommittee);

  const testCases: {bitLen: number; bitsSet: number}[] = [
    // Realistic mainnet case
    {bitLen: 120, bitsSet: 90},
    // Same value as zipIndexesCommitteeBits in lodestar
    {bitLen: 2048, bitsSet: 2048},
  ];

  for (const {bitLen, bitsSet} of testCases) {
    const bitlistStruct = getBitsMany(bitLen, bitsSet);
    const bytes = CommitteeBits.serialize(bitlistStruct);

    bench(`bitlist bytes to struct (${bitLen},${bitsSet})`, () => {
      CommitteeBits.deserialize(bytes);
    });

    bench(`bitlist bytes to tree (${bitLen},${bitsSet})`, () => {
      CommitteeBits.deserializeToView(bytes);
    });
  }
});

function getBitsMany(len: number, bitsSet: number): BitArray {
  const bits = BitArray.fromBitLen(len);
  for (let i = 0; i < bitsSet; i++) {
    bits.set(i, true);
  }
  return bits;
}
