import {expect} from "chai";
import {ByteListType} from "../../../../src";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

runTypeTestInvalid({
  type: new ByteListType(8),
  values: [
    {
      id: "Length over limit",
      serialized: "0x00000000000000000010",
      json: "0x00000000000000000010",
      error: "ByteList invalid size",
    },
  ],
});

describe("ByteListType constructor errors", () => {
  it("limit must be > 0", () => {
    expect(() => new ByteListType(0)).to.throw();
  });
});
