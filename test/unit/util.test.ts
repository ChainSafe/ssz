import {expect} from "chai";
import {bigIntPow} from "../../src/util/bigInt";
import {getNumberFromBytesLE, getBytesFromNumberLE} from "../../src/util/numhelper";
import {toBigIntLE, toBufferLE} from "bigint-buffer";

describe("util / bigIntPow", () => {
  it("should throw error on negative exponent", () => {
    expect(() => bigIntPow(BigInt(1), BigInt(-1))).to.throw();
  });
  it("should properly exponentiate", () => {
    for (let x = BigInt(-20); x < 20; x++) {
      for (let y = BigInt(0); y < 50; y++) {
        expect(bigIntPow(x, y), `${x} ** ${y}`).to.equal(x ** y);
      }
    }
  });
  it("numhelper byte serialization checks", () => {
    const output = new Uint8Array(108);
    for (let i = 0; i < 100; i++) {
      const tnum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      getBytesFromNumberLE(tnum, output, (i % 8) + 1, i);
      const mx = getNumberFromBytesLE(output, (i % 8) + 1, i);
      const my = Number(toBigIntLE(toBufferLE(BigInt(tnum), (i % 8) + 1)));
      expect(mx).to.be.equal(my);
    }
  });
});
