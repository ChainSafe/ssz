import {describe, expect, it} from "vitest";
import {ListBasicType} from "../../../../src/index.ts";
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
