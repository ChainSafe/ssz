import {assert, expect} from "chai";
import {describe, it} from "mocha";
import {countToDepth, bitIndexBigInt, iterateAtDepth} from "../src";

describe("countToDepth", () => {
    const testCases = [
        [0, 0], [1, 0], [2, 1], [3, 2], [4, 2], [5, 3], [6, 3], [7, 3], [8, 3], [9, 4],
    ];
    for (const [count, depth] of testCases) {
        it(`should correctly get depth for ${count} elements`, () => {
            const actual = countToDepth(BigInt(count));
            assert.equal(actual, depth);
        });
    }
});

describe("bigIndexBigInt", () => {
    const testCases = [
        [0, 0], [1, 0], [2, 1], [3, 1], [4, 2], [5, 2], [6, 2], [7, 2], [8, 3], [9, 3],
    ];
    for (const [gindex, depth] of testCases) {
        it(`should correctly get depth for gindex ${gindex}`, () => {
            const actual = bitIndexBigInt(BigInt(gindex));
            assert.equal(actual, depth);
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
  ];
  for (const {input, expected} of testCases) {
    it(`should correctly iterate at depth`, () => {
      const actual = Array.from(iterateAtDepth(input[0], input[1], input[2]))
      expect(actual).to.deep.equal(expected);
    });
  }
})
