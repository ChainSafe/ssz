import {expect} from "chai";
import {bitLength, maxChunksToDepth, nextPowerOf2} from "../../src/util/merkleize";

describe("util / merkleize / bitLength", () => {
  const bitLengthByIndex = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4];

  for (let n = 0; n < bitLengthByIndex.length; n++) {
    it(`bitLength(${n})`, () => {
      expect(bitLength(n)).to.equal(bitLengthByIndex[n]);
    });
  }
});

describe("util / merkleize / maxChunksToDepth", () => {
  const results = [0, 0, 1, 2, 2, 3, 3, 3, 3, 4];

  for (let i = 0; i < results.length; i++) {
    it(`maxChunksToDepth(${i})`, () => {
      expect(maxChunksToDepth(i)).to.equal(results[i]);
    });
  }
});

describe("util / merkleize / nextPowerOf2", () => {
  const results = [1, 1, 2, 4, 4, 8, 8, 8, 8, 16];

  for (let i = 0; i < results.length; i++) {
    it(`nextPowerOf2(${i})`, () => {
      expect(nextPowerOf2(i)).to.equal(results[i]);
    });
  }
});
