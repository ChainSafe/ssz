import {expect} from "chai";
import {bigIntPow} from "../../src/util/bigInt";

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
});
