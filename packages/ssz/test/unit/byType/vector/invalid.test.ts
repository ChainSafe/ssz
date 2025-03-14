import {describe, expect, it } from "vitest";
import {VectorBasicType, VectorCompositeType} from "../../../../src/index.js";
import {byteType, uint16NumType} from "../../../utils/primitiveTypes.js";
import {runTypeTestInvalid} from "../runTypeTestInvalid.js";

runTypeTestInvalid({
  type: new VectorBasicType(uint16NumType, 2),
  values: [
    {id: "Length over length", serialized: "01".repeat(3), json: Array(3).fill(1)},
    {id: "Length under length", serialized: "01".repeat(1), json: Array(1).fill(1)},
    {id: "Empty", serialized: "", json: []},

    {id: "Object", json: {}},
    {id: "null", json: null},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});

describe("VectorType constructor errors", () => {
  const compositeType = new VectorBasicType(uint16NumType, 2);

  it("length must be > 0", () => {
    expect(() => new VectorBasicType(uint16NumType, 0)).toThrow();
    expect(() => new VectorCompositeType(compositeType, 0)).toThrow();
  });

  it("ElementType must be basic", () => {
    expect(() => new VectorBasicType(compositeType as unknown as typeof byteType, 2)).toThrow();
  });

  it("ElementType must be composite", () => {
    expect(() => new VectorCompositeType(byteType as unknown as typeof compositeType, 2)).toThrow();
  });
});
