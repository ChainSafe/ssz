import {describe, expect, it} from "vitest";
import {ByteListType} from "../../../../src/index.ts";
import {runTypeTestInvalid} from "../runTypeTestInvalid.ts";

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
    expect(() => new ByteListType(0)).toThrow();
  });
});

describe("ByteListType limit", () => {
  it("rejects a non-positive or fractional limit", () => {
    for (const limit of [0, -1, 1.5]) {
      expect(() => new ByteListType(limit)).toThrow("List limit must be a positive integer");
    }
  });
});
