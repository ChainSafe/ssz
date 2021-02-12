import { expect } from "chai";
import { describe, it } from "mocha";
import { computeProofGindices, computeProofBitstrings, sortInOrderBitstrings, filterParentBitstrings, computeMultiProofBitstrings } from "../../src/proof/util";

describe("computeProofGindices", () => {
  it("simple implementation should match bitstring implementation", () => {
    const gindices = [
      BigInt(8),
      BigInt(9),
      BigInt(14),
    ];
    for (const gindex of gindices) {
      const simple = computeProofGindices(gindex);
      const bitstring = computeProofBitstrings(gindex.toString(2));
      expect(new Set([...bitstring.branch].map(str => BigInt("0b" + str)))).to.deep.equal(simple.branch);
      expect(new Set([...bitstring.path].map(str => BigInt("0b" + str)))).to.deep.equal(simple.path);
    }
  });

  it("should properly compute known testcases", () => {
    const testCases = [
      {input: BigInt(8), output: {branch: new Set([BigInt(9), BigInt(5), BigInt(3)]), path: new Set([BigInt(8), BigInt(4), BigInt(2)])}},
      {input: BigInt(9), output: {branch: new Set([BigInt(8), BigInt(5), BigInt(3)]), path: new Set([BigInt(9), BigInt(4), BigInt(2)])}},
      {input: BigInt(14), output: {branch: new Set([BigInt(15), BigInt(6), BigInt(2)]), path: new Set([BigInt(14), BigInt(7), BigInt(3)])}},
    ];
    for (const {input, output} of testCases) {
      const actual = computeProofGindices(input);
      expect(actual.branch).to.deep.equal(output.branch);
      expect(actual.path).to.deep.equal(output.path);
    }
  });
});

describe("sortInOrderBitstrings", () => {
  it("should properly compute known testcases", () => {
    const testCases = [
      {gindices: [BigInt(6), BigInt(15), BigInt(8), BigInt(5), BigInt(9), BigInt(14)], bitLength: 4, output: [BigInt(8), BigInt(9), BigInt(5), BigInt(6), BigInt(14), BigInt(15)]}
    ];
    for (const {gindices, bitLength, output} of testCases) {
      const actual = sortInOrderBitstrings(gindices.map(g => g.toString(2)), bitLength).map(str => BigInt("0b" + str));
      expect(actual).to.deep.equal(output);
    }
  });
});

describe("filterParentBitstrings", () => {
  it("should properly compute known testcases", () => {
    const testCases = [
      {input: [BigInt(6), BigInt(15), BigInt(8), BigInt(5), BigInt(9), BigInt(14)], output: [BigInt(6), BigInt(15), BigInt(8), BigInt(5), BigInt(9), BigInt(14)]},
      {input: [BigInt(8), BigInt(4), BigInt(3), BigInt(2)], output: [BigInt(8), BigInt(3)]},
      {input: Array.from({length: 16}, (_, i) => BigInt(i + 1)), output: Array.from({length: 8}, (_, i) => BigInt(i + 8 + 1))}
    ];
    for (const {input, output} of testCases) {
      const actual = filterParentBitstrings(input.map(g => g.toString(2))).map(str => BigInt("0b" + str));
      expect(new Set(actual)).to.deep.equal(new Set(output));
    }
  });
});

describe("computeMultiProofBitstrings", () => {
  it("should properly compute known testcases", () => {
    const testCases = [
      // testcase from https://github.com/ethereum/eth2.0-specs/blob/v1.0.0/ssz/merkle-proofs.md#merkle-multiproofs
      {input: [BigInt(8), BigInt(9), BigInt(14)], output: [BigInt(8), BigInt(9), BigInt(5), BigInt(6), BigInt(14), BigInt(15)]},
      // order, duplicates, parents shouldn't effect the output
      {input: [BigInt(14), BigInt(9), BigInt(3), BigInt(14), BigInt(9), BigInt(8)], output: [BigInt(8), BigInt(9), BigInt(5), BigInt(6), BigInt(14), BigInt(15)]},
    ];
    for (const {input, output} of testCases) {
      const actual = computeMultiProofBitstrings(input.map(g => g.toString(2))).map(str => BigInt("0b" + str));
      expect(actual).to.deep.equal(output);
    }
  });
});

