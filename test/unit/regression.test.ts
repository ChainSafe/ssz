import {expect} from "chai";

import {VectorType, ByteVectorType} from "../../src";

describe("known issues", () => {
  it("default value of composite vector should be correct", () => {
    const Vec = new VectorType({
      elementType: new ByteVectorType({length: 4}),
      length: 4,
    });
    expect(Vec.defaultValue().length).to.equal(Vec.length);
  });
});
