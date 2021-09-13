import {expect} from "chai";
import {ByteVectorType} from "../../../../src";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

runTypeTestInvalid({
  type: new ByteVectorType(8),
  values: [
    {
      id: "Length over length",
      serialized: "00".repeat(9),
      json: "00".repeat(9),
      error: "ByteVector invalid size",
    },
    {
      id: "Length under length",
      serialized: "00".repeat(7),
      json: "00".repeat(7),
      error: "ByteVector invalid size",
    },
  ],
});

describe("ByteVectorType constructor errors", () => {
  it("length must be > 0", () => {
    expect(() => new ByteVectorType(0)).to.throw();
  });
});
