import {expect} from "chai";
import crypto from "crypto";
import {byteArrayToHashObject, hashObjectToByteArray} from "../../src/hashObject";
import * as sha256 from "../../src";

describe("Test SIMD implementation of as-sha256", () => {
  it("testHash4Input64s", () => {
    const input1 = "gajindergajindergajindergajinder";
    const input2 = "gajindergajindergajindergajinder";
    const input = Buffer.from(input1 + input2, "utf8");
    const outputs = sha256.hash4Input64s([input, input, input, input]);
    const expectedOutput = new Uint8Array([
      190, 57, 56, 15, 241, 208, 38, 30, 111, 55, 218, 254, 66, 120, 182, 98, 239, 97, 31, 28, 178, 247, 192, 161,
      131, 72, 178, 215, 235, 20, 207, 110,
    ]);
    for (let i = 0; i < 4; i++) {
      expect(outputs[i]).to.be.deep.equal(expectedOutput, "incorrect hash4Input64s result " + i);
    }
  });

  it("testHash4Input64s 1000 times", () => {
    for (let i = 0; i < 1000; i++) {
      const input = crypto.randomBytes(64);
      const outputs = sha256.hash4Input64s([input, input, input, input]);
      const expectedOutput = sha256.digest64(input);
      expect(outputs[0]).to.be.deep.equal(expectedOutput);
      expect(outputs[1]).to.be.deep.equal(expectedOutput);
      expect(outputs[2]).to.be.deep.equal(expectedOutput);
      expect(outputs[3]).to.be.deep.equal(expectedOutput);
    }
  });

  it("testHash4HashObjects", () => {
    const input1 = "gajindergajindergajindergajinder";
    const inputHashObject = byteArrayToHashObject(Buffer.from(input1, "utf8"));
    const outputs = sha256.hash8HashObjects(Array.from({length: 8}, () => inputHashObject));
    const expectedOutput = new Uint8Array([
      190, 57, 56, 15, 241, 208, 38, 30, 111, 55, 218, 254, 66, 120, 182, 98, 239, 97, 31, 28, 178, 247, 192, 161,
      131, 72, 178, 215, 235, 20, 207, 110,
    ]);
    for (let i = 0; i < 4; i++) {
      const output = new Uint8Array(32);
      hashObjectToByteArray(outputs[i], output, 0);
      expect(output).to.be.deep.equal(expectedOutput, "incorrect hash4Input64s result " + i);
    }
  });
});
