import {describe, it, expect} from "vitest";
import {BitListType} from "../../../../src/index.js";
import {runTypeTestInvalid} from "../runTypeTestInvalid.js";

runTypeTestInvalid({
  type: new BitListType(8 * 8),
  values: [
    {
      id: "Length over limit",
      serialized: "0x00000000000000000010",
      json: "0x00000000000000000010",
      error: "bitLen over limit",
    },
    {
      id: "No padding byte - all zeroes",
      serialized: "0x0000000000",
      json: "0x0000000000",
    },
  ],
});

describe("BitListType constructor errors", () => {
  it("limit must be > 0", () => {
    expect(() => new BitListType(0)).toThrow();
  });
});

describe("Extra error cases", () => {
  it("Wrong range over bytes end", () => {
    const bitListType = new BitListType(8 * 8);
    const uint8Array = new Uint8Array(0);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    expect(() => bitListType.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length + 1)).toThrow();
  });
});
