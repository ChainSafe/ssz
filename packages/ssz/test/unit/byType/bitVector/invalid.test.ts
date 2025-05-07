import {describe, expect, it} from "vitest";
import {BitVectorType} from "../../../../src/index.ts";
import {runTypeTestInvalid} from "../runTypeTestInvalid.ts";

runTypeTestInvalid({
  type: new BitVectorType(8 * 8),
  values: [
    {
      id: "Length over length",
      serialized: "00".repeat(9),
      json: "00".repeat(9),
      error: "Invalid BitVector size",
    },
    {
      id: "Length under length",
      serialized: "00".repeat(7),
      json: "00".repeat(7),
      error: "Invalid BitVector size",
    },
  ],
});

describe("BitVectorType constructor errors", () => {
  it("length must be > 0", () => {
    expect(() => new BitVectorType(0)).toThrow();
  });
});
