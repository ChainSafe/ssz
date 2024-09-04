import { expect } from "chai";
import {describe, it} from "mocha";
import { indexToFinalizedGindices } from "../../../src/util/snapshot";

describe("indexToFinalizedGindices", () => {
  // given a tree with depth = 4
  //                                      1
  //                     2                                3
  //         4                   5                 6               7
  //    8        9         10       11        12       13       14      15
  // 16  17   18  19    20   21   22  23    24  25   26  27   28  29  30  31
  const testCases: [number, number, bigint[]][] = [
    [4, 0, [BigInt(16)]],
    [4, 1, [BigInt(8)]],
    [4, 2, [8, 18].map(BigInt)],
    [4, 3, [4].map(BigInt)],
    [4, 4, [4, 20].map(BigInt)],
    [4, 5, [4, 10].map(BigInt)],
    [4, 6, [4, 10, 22].map(BigInt)],
    [4, 7, [2].map(BigInt)],
    [4, 8, [2, 24].map(BigInt)],
    [4, 9, [2, 12].map(BigInt)],
    [4, 10, [2, 12, 26].map(BigInt)],
    [4, 11, [2, 6].map(BigInt)],
    [4, 12, [2, 6, 28].map(BigInt)],
    [4, 13, [2, 6, 14].map(BigInt)],
    [4, 14, [2, 6, 14, 30].map(BigInt)],
    [4, 15, [1].map(BigInt)],
  ];

  for (const [depth, index, finalizeGindices] of testCases) {
    it(`should correctly get finalized gindexes for index ${index} and depth ${depth}`, () => {
      const actual = indexToFinalizedGindices(depth, index);
      expect(actual).to.deep.equal(finalizeGindices);
    });
  }
});
