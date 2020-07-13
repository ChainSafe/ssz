import {expect} from "chai";
import {describe, it} from "mocha";

import {ArrayObject} from "./objects";
import {Type, BitListType, toHexString} from "../../src";

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
    {value: "0400000002", type: ArrayObject, error: "Incomplete item"},
  ];
  for (const {type, value, error} of testCases) {
    it(`should correctly deserialize ${type.constructor.name}`, () => {
      expect(() => type.deserialize(Buffer.from(value, "hex"))).to.throw(error);
    });
  }
});

describe("hashTreeRoot errors", () => {
  const testCases: {
    value: string;
    type: Type<any>;
    hashTreeRoot: string;
  }[] = [
    {
      value: "0xf77affff03",
      type: new BitListType({limit: 2048}),
      hashTreeRoot: "0x499ef8f795abb77b12d2ce58570e6c7660c93575eba6332ad4913f2cd3e21391",
    },
  ];
  for (const {type, value, hashTreeRoot} of testCases) {
    it(`should correctly hashTreeRoot ${type.constructor.name}`, () => {
      const v = type.fromJson(value);
      expect(toHexString(type.hashTreeRoot(v))).to.equal(hashTreeRoot);
    });
  }
});
