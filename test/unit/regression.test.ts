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
    const farFutureEpohc = Number.fromJson(18446744073709551615);
    expect(farFutureEpohc).to.be.equal(Infinity);
  });


});
