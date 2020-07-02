import { expect } from "chai";
import { describe, it } from "mocha";

import { ArrayObject } from "./objects";

describe.skip("deserialize errors", () => {
  const testCases: {
    value: string;
    type: any;
    error: string;
  }[] = [
    // Correct serialization "04000000020001040003"
    // { v: [{b: 2, a: 1}, {b: 4, a: 3} ]}
    {
      value: "040000000200010400",
      type: ArrayObject,
      error: "Incomplete item",
    },
    { value: "0400000002", type: ArrayObject, error: "Incomplete item" },
  ];
  for (const { type, value, error } of testCases) {
    it(`should correctly deserialize ${type.constructor.name}`, () => {
      expect(() => type.deserialize(Buffer.from(value, "hex"))).to.throw(error);
    });
  }
});
