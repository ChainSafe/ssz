import {expect} from "chai";
import {describe, it} from "mocha";
import {fromHexString, toHexString} from "../../src";

describe("util / byteArray", () => {
  const testCases: string[] = [
    "0x",
    "0x00",
    "0xffffffff",
    "0xe7299fdb3fb238c05e5b57bb8f4380f0d7c4dacc991f3876976e6e46559389ef",
  ];

  for (const hex of testCases) {
    it(hex, () => {
      const bytes = fromHexString(hex);
      const hexRes = toHexString(bytes);
      expect(hexRes).to.equal(hex);
    });
  }
});
