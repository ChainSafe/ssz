import {describe, expect, it} from "vitest";
import {
  computeMultiProofBitstrings,
  computeProofBitstrings,
  computeProofGindices,
  filterParentBitstrings,
  sortDecreasingBitstrings,
  sortInOrderBitstrings,
} from "../../../src/proof/util.js";

describe("computeProofGindices", () => {
  it("simple implementation should match bitstring implementation", () => {
    const gindices = [BigInt(8), BigInt(9), BigInt(14)];
    for (const gindex of gindices) {
      const simple = computeProofGindices(gindex);
      const bitstring = computeProofBitstrings(gindex.toString(2));
      expect(new Set([...bitstring.branch].map((str) => BigInt("0b" + str)))).toEqual(simple.branch);
      expect(new Set([...bitstring.path].map((str) => BigInt("0b" + str)))).toEqual(simple.path);
    }
  });

  it("should properly compute known testcases", () => {
    const testCases = [
      {
        input: BigInt(8),
        output: {branch: new Set([BigInt(9), BigInt(5), BigInt(3)]), path: new Set([BigInt(8), BigInt(4), BigInt(2)])},
      },
      {
        input: BigInt(9),
        output: {branch: new Set([BigInt(8), BigInt(5), BigInt(3)]), path: new Set([BigInt(9), BigInt(4), BigInt(2)])},
      },
      {
        input: BigInt(14),
        output: {
          branch: new Set([BigInt(15), BigInt(6), BigInt(2)]),
          path: new Set([BigInt(14), BigInt(7), BigInt(3)]),
        },
      },
    ];
    for (const {input, output} of testCases) {
      const actual = computeProofGindices(input);
      expect(actual.branch).toEqual(output.branch);
      expect(actual.path).toEqual(output.path);
    }
  });
});

describe("sortInOrderBitstrings", () => {
  it("should properly compute known testcases", () => {
    const testCases = [
      {
        gindices: [BigInt(6), BigInt(15), BigInt(8), BigInt(5), BigInt(9), BigInt(14)],
        bitLength: 4,
        output: [BigInt(8), BigInt(9), BigInt(5), BigInt(6), BigInt(14), BigInt(15)],
      },
    ];
    for (const {gindices, bitLength, output} of testCases) {
      const actual = sortInOrderBitstrings(
        gindices.map((g) => g.toString(2)),
        bitLength
      ).map((str) => BigInt("0b" + str));
      expect(actual).toEqual(output);
    }
  });
});

describe("filterParentBitstrings", () => {
  it("should properly compute known testcases", () => {
    const testCases = [
      {
        input: [BigInt(6), BigInt(15), BigInt(8), BigInt(5), BigInt(9), BigInt(14)],
        output: [BigInt(6), BigInt(15), BigInt(8), BigInt(5), BigInt(9), BigInt(14)],
      },
      {input: [BigInt(8), BigInt(4), BigInt(3), BigInt(2)], output: [BigInt(8), BigInt(3)]},
      {
        input: Array.from({length: 16}, (_, i) => BigInt(i + 1)),
        output: Array.from({length: 8}, (_, i) => BigInt(i + 8 + 1)),
      },
    ];
    for (const {input, output} of testCases) {
      const actual = filterParentBitstrings(input.map((g) => g.toString(2))).map((str) => BigInt("0b" + str));
      expect(new Set(actual)).toEqual(new Set(output));
    }
  });
});

describe("computeMultiProofBitstrings", () => {
  it("should properly compute known testcases", () => {
    const testCases = [
      // testcase from https://github.com/ethereum/consensus-specs/blob/v1.1.10/ssz/merkle-proofs.md#merkle-multiproofs
      {
        input: [BigInt(8), BigInt(9), BigInt(14)],
        output: [BigInt(8), BigInt(9), BigInt(5), BigInt(6), BigInt(14), BigInt(15)],
      },
      // order, duplicates, parents shouldn't effect the output
      {
        input: [BigInt(14), BigInt(9), BigInt(3), BigInt(14), BigInt(9), BigInt(8)],
        output: [BigInt(8), BigInt(9), BigInt(5), BigInt(6), BigInt(14), BigInt(15)],
      },
    ];
    for (const {input, output} of testCases) {
      const actual = computeMultiProofBitstrings(input.map((g) => g.toString(2))).map((str) => BigInt("0b" + str));
      expect(actual).toEqual(output);
    }
  });
});

describe("sortDecreasingBitstrings", () => {
  it("should properly compute known testcases", () => {
    const length = 40;
    const testCases = [
      Array.from({length}, (_, i) => i + 1),
      Array.from({length}, (_, i) => length - i + 1),
      Array.from({length}, () => Math.floor(Math.random() * 1000) + 1),
    ];

    const toBitstring = (i: number): string => i.toString(2);

    for (const testCase of testCases) {
      const bitstrings = testCase.map(toBitstring);

      const sorted = testCase.sort((a, b) => (a < b ? 1 : -1));
      const sortedBitstrings = sortDecreasingBitstrings(bitstrings);

      expect(sortedBitstrings).to.be.deep.equal(sorted.map(toBitstring));
    }
  });
});
