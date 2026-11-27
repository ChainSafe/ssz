import {describe, expect, it} from "vitest";
import {VectorBasicType} from "../../../../src/index.ts";
import {byteType} from "../../../utils/primitiveTypes.ts";

describe("VectorBasicType serialize length", () => {
  const vector = new VectorBasicType(byteType, 4);

  it("rejects a short value instead of zero-padding", () => {
    expect(() => vector.serialize([1, 2])).toThrow("Incorrect vector length 2 expected 4");
  });

  it("rejects a long value instead of truncating", () => {
    expect(() => vector.serialize([1, 2, 3, 4, 5])).toThrow("Incorrect vector length 5 expected 4");
  });
});
