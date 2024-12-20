/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {expect} from "chai";
import crypto from "crypto";
import {byteArrayToHashObject, hashObjectToByteArray} from "../../src/hashObject.js";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getSimdTests(sha256: any, useSimd: boolean): void {
  describe(`Test as-sha256 ${useSimd ? "with SIMD" : "without SIMD"}`, () => {
    before(function () {
      sha256.reinitializeInstance(useSimd);
      expect(sha256.simdEnabled()).to.equal(useSimd);
    });
    it("testHash4UintArray64s", () => {
      const input1 = "gajindergajindergajindergajinder";
      const input2 = "gajindergajindergajindergajinder";
      const input = Buffer.from(input1 + input2, "utf8");
      const outputs = sha256.batchHash4UintArray64s([input, input, input, input]);
      const expectedOutput = new Uint8Array([
        190, 57, 56, 15, 241, 208, 38, 30, 111, 55, 218, 254, 66, 120, 182, 98, 239, 97, 31, 28, 178, 247, 192, 161,
        131, 72, 178, 215, 235, 20, 207, 110,
      ]);
      for (let i = 0; i < 4; i++) {
        expect(outputs[i]).to.be.deep.equal(expectedOutput, "incorrect batchHash4UintArray64s result " + i);
      }
    });

    it("testHash4UintArray64s 1000 times", () => {
      for (let i = 0; i < 1000; i++) {
        const input = crypto.randomBytes(64);
        const outputs = sha256.batchHash4UintArray64s([input, input, input, input]);
        const expectedOutput = sha256.digest64(input);
        expect(outputs[0]).to.be.deep.equal(expectedOutput);
        expect(outputs[1]).to.be.deep.equal(expectedOutput);
        expect(outputs[2]).to.be.deep.equal(expectedOutput);
        expect(outputs[3]).to.be.deep.equal(expectedOutput);
      }
    });

    it("testHash4HashObjectInputs", () => {
      const input1 = "gajindergajindergajindergajinder";
      const inputHashObject = byteArrayToHashObject(Buffer.from(input1, "utf8"), 0);
      const outputs = sha256.batchHash4HashObjectInputs(Array.from({length: 8}, () => inputHashObject));
      const expectedOutput = new Uint8Array([
        190, 57, 56, 15, 241, 208, 38, 30, 111, 55, 218, 254, 66, 120, 182, 98, 239, 97, 31, 28, 178, 247, 192, 161,
        131, 72, 178, 215, 235, 20, 207, 110,
      ]);
      for (let i = 0; i < 4; i++) {
        const output = new Uint8Array(32);
        hashObjectToByteArray(outputs[i], output, 0);
        expect(output).to.be.deep.equal(expectedOutput, "incorrect batchHash4UintArray64s result " + i);
      }
    });

    const numHashes = [4, 5, 6, 7];
    for (const numHash of numHashes) {
      it(`hashInto ${numHash} hashes`, () => {
        const inputs = Array.from({length: numHash}, () => crypto.randomBytes(64));
        const input = new Uint8Array(numHash * 64);
        for (let i = 0; i < numHash; i++) {
          input.set(inputs[i], i * 64);
        }
        const output = new Uint8Array(numHash * 32);

        sha256.hashInto(input, output);

        const expectedOutputs = Array.from({length: numHash}, (_, i) => sha256.digest64(inputs[i]));
        for (let i = 0; i < numHash; i++) {
          expect(output.subarray(i * 32, (i + 1) * 32)).to.be.deep.equal(expectedOutputs[i]);
        }
      });
    }
  });
}
