import {expect} from "chai";
import {bitLength, bitLengthStr} from "../../src/util/merkleize";

describe("util / merkleize / bitLength", () => {
  const bitLengthByIndex = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4];

  for (let n = 0; n <= 8; n++) {
    it(`bitLength(${n})`, () => {
      expect(bitLength(n)).to.equal(bitLengthByIndex[n]);
    });
  }

  for (let n = 0; n <= 8; n++) {
    it(`bitLengthStr(${n})`, () => {
      expect(bitLengthStr(n)).to.equal(bitLengthByIndex[n]);
    });
  }
});
