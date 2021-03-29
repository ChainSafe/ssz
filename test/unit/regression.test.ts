import {expect} from "chai";

import {VectorType, ByteVectorType, NumberUintType} from "../../src";

describe("known issues", () => {
  it("default value of composite vector should be correct", () => {
    const Vec = new VectorType({
      elementType: new ByteVectorType({length: 4}),
      length: 4,
    });
    expect(Vec.defaultValue().length).to.equal(Vec.length);
  });

  it("far future epoch from json", function () {
    const Number = new NumberUintType({byteLength: 4});
    const maxBigInt = Number.struct_getMaxBigInt();
    const farFutureEpoch = Number.fromJson(maxBigInt.toString());
    expect(farFutureEpoch).to.be.equal(Infinity);
  });

  it("too large number from json", function () {
    const Number = new NumberUintType({byteLength: 4});
    expect(() => Number.fromJson("18446744073709551616")).to.throw;
  });
});
