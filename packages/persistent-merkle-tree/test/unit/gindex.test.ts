import {describe, expect, it} from "vitest";
import {
  Bit,
  Gindex,
  bitIndexBigInt,
  concatGindices,
  countToDepth,
  getGindexBits,
  getGindicesAtDepth,
  gindexIterator,
  iterateAtDepth,
} from "../../src/index.js";

describe("countToDepth", () => {
  const testCases = [
    [0, 0],
    [1, 0],
    [2, 1],
    [3, 2],
    [4, 2],
    [5, 3],
    [6, 3],
    [7, 3],
    [8, 3],
    [9, 4],
  ];
  for (const [count, depth] of testCases) {
    it(`should correctly get depth for ${count} elements`, () => {
      const actual = countToDepth(BigInt(count));
      expect(actual).toEqual(depth);
    });
  }
});

describe("bigIndexBigInt", () => {
  const testCases = [
    [0, 0],
    [1, 0],
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 3],
    [9, 3],
  ];
  for (const [gindex, depth] of testCases) {
    it(`should correctly get depth for gindex ${gindex}`, () => {
      const actual = bitIndexBigInt(BigInt(gindex));
      expect(actual).toEqual(depth);
    });
  }
});

describe("iterateAtDepth", () => {
  const testCases: {
    input: [number, bigint, bigint];
    expected: bigint[];
  }[] = [
    {input: [3, BigInt(0), BigInt(0)], expected: []},
    {input: [3, BigInt(0), BigInt(1)], expected: [BigInt(8)]},
    {input: [3, BigInt(1), BigInt(1)], expected: [BigInt(9)]},
    {input: [3, BigInt(1), BigInt(2)], expected: [BigInt(9), BigInt(10)]},
    {
      input: [3, BigInt(0), BigInt(8)],
      expected: [BigInt(8), BigInt(9), BigInt(10), BigInt(11), BigInt(12), BigInt(13), BigInt(14), BigInt(15)],
    },
  ];
  for (const {input, expected} of testCases) {
    it(`should correctly iterate at depth=${input[0]} start=${input[1]} count=${input[2]}`, () => {
      const actual = Array.from(iterateAtDepth(input[0], input[1], input[2]));
      expect(actual).to.deep.equal(expected);
      const gindicesActual = getGindicesAtDepth(input[0], Number(input[1]), Number(input[2]));
      expect(gindicesActual).toEqual(expected);
    });
  }
});

describe("concatGindices", () => {
  const testCases: {
    input: Gindex[];
    expected: Gindex;
  }[] = [
    // cases calculated by hand
    {input: [BigInt(2), BigInt(3)], expected: BigInt(5)},
    {input: [BigInt(31), BigInt(3)], expected: BigInt(63)},
    {input: [BigInt(31), BigInt(6)], expected: BigInt(126)},
  ];
  for (const {input, expected} of testCases) {
    it("should correctly concatenate gindices", () => {
      const actual = concatGindices(input);
      expect(actual).toEqual(expected);
    });
  }
});

describe("gindexIterator", () => {
  const testCases: {
    input: Gindex;
    expected: Bit[];
  }[] = [
    // cases calculated by hand
    {input: BigInt(6), expected: [1, 0]},
    {input: BigInt(16), expected: [0, 0, 0, 0]},
    {input: BigInt(3652), expected: [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0]},
  ];
  for (const {input, expected} of testCases) {
    it("should correctly iterate gindex bits", () => {
      const actual = Array.from(gindexIterator(input));
      expect(actual).to.deep.equal(expected);
      const arrActual = getGindexBits(input);
      expect(arrActual).toEqual(expected);
    });
  }
});
