import {describe, expect, it} from "vitest";
import {BooleanType, ListBasicType, ProgressiveListBasicType} from "../../../../src/index.ts";
import {byteType} from "../../../utils/primitiveTypes.ts";
import {runTypeTestInvalid} from "../runTypeTestInvalid.ts";

runTypeTestInvalid({
  type: new ListBasicType(byteType, 2),
  values: [
    {id: "Length over limit", serialized: "01".repeat(3), json: Array(3).fill(1)},

    {id: "Object", json: {}},
    {id: "null", json: null},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});

for (const type of [new ListBasicType(new BooleanType(), 40), new ProgressiveListBasicType(new BooleanType())]) {
  runTypeTestInvalid({
    type,
    values: [
      {id: "Boolean over 1", serialized: "0102", error: "Boolean: invalid value"},
      {id: "Boolean max byte", serialized: "ff00", error: "Boolean: invalid value"},
      {id: "Boolean over 1 in second chunk", serialized: `${"01".repeat(33)}05`, error: "Boolean: invalid value"},
    ],
  });
}

// Invalid types at constructor time

describe("Invalid ListBasicType at constructor", () => {
  it("limit must be > 0", () => {
    expect(() => new ListBasicType(byteType, 0)).toThrow();
  });

  it("ElementType must be basic", () => {
    const compositeType = new ListBasicType(byteType, 2);
    expect(() => new ListBasicType(compositeType as unknown as typeof byteType, 2)).toThrow();
  });
});

describe("ListBasicType limit", () => {
  it("rejects a non-positive or fractional limit", () => {
    for (const limit of [0, -1, 1.5]) {
      expect(() => new ListBasicType(byteType, limit)).toThrow("List limit must be a positive integer");
    }
  });
});
