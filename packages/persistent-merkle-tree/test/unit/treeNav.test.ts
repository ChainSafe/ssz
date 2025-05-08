import {describe, expect, it} from "vitest";

describe("commonDepth", () => {
  const testCases: {from: number; to: number; d: number}[] = [
    {from: 8, to: 1, d: 4},
    {from: 8, to: 2, d: 4},
    {from: 8, to: 3, d: 4},
    {from: 8, to: 4, d: 4},
    {from: 8, to: 5, d: 4},
    {from: 8, to: 6, d: 4},
    {from: 8, to: 7, d: 4},
    {from: 8, to: 8, d: 0},
    {from: 8, to: 9, d: 1},
    {from: 8, to: 10, d: 2},
    {from: 8, to: 11, d: 2},
    {from: 8, to: 12, d: 3},
    {from: 8, to: 13, d: 3},
    {from: 8, to: 14, d: 3},
    {from: 8, to: 15, d: 3},
  ];

  for (const {from, to, d} of testCases) {
    it(`${from} -> ${to}`, () => {
      expect(commonDepth(from, to)).to.equal(d);
    });
  }

  function commonDepth(from: number, to: number): number {
    return Math.ceil(Math.log2(-~(from ^ to)));
  }
});
