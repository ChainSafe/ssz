import {expect} from "chai";
import {describe, it} from "mocha";

import {booleanType, byteType, Type} from "../../src";
import {ArrayObject, bigint16Type, bytes2Type, number16List100Type, UnionObject} from "./objects";

describe("equals", () => {
  const testCases: {
    type: Type<any>;
    value1: any;
    value2: any;
    expected: boolean;
  }[] = [
    {value1: 1, value2: 1, type: byteType, expected: true},
    {value1: 0, value2: 1, type: byteType, expected: false},
    {value1: 0, value2: 1, type: byteType, expected: false},
    {value1: 0, value2: 1, type: byteType, expected: false},
    {value1: Infinity, value2: Infinity, type: byteType, expected: true},
    {value1: 1000n, value2: 1000n, type: bigint16Type, expected: true},
    {value1: true, value2: true, type: booleanType, expected: true},
    {value1: false, value2: false, type: booleanType, expected: true},
    {value1: false, value2: true, type: booleanType, expected: false},
    {value1: Buffer.from("abcd", "hex"), value2: Buffer.from("abcd", "hex"), type: bytes2Type, expected: true},
    {value1: Buffer.from("bbcd", "hex"), value2: Buffer.from("abcd", "hex"), type: bytes2Type, expected: false},
    {
      value1: [0, 1, 2, 3, 4, 5],
      value2: [0, 1, 2, 3, 4, 5],
      type: number16List100Type,
      expected: true,
    },
    {
      value1: [0, 1, 2, 3, 4, 6],
      value2: [0, 1, 2, 3, 4, 5],
      type: number16List100Type,
      expected: false,
    },
    {
      value1: {
        v: [
          {b: 2, a: 1},
          {b: 4, a: 3},
        ],
      },
      value2: {
        v: [
          {b: 2, a: 1},
          {b: 4, a: 3},
        ],
      },
      type: ArrayObject,
      expected: true,
    },
    {
      value1: {
        v: [
          {a: 1, b: 2},
          {b: 4, a: 3},
        ],
      },
      value2: {
        v: [
          {b: 2, a: 1},
          {b: 4, a: 3},
        ],
      },
      type: ArrayObject,
      expected: true,
    },
    {
      value1: {
        v: [
          {b: 4, a: 1},
          {b: 4, a: 3},
        ],
      },
      value2: {
        v: [
          {b: 2, a: 1},
          {b: 4, a: 3},
        ],
      },
      type: ArrayObject,
      expected: false,
    },
    {
      value1: {selector: 0, value: null},
      value2: {selector: 0, value: null},
      type: UnionObject,
      expected: true,
    },
    {
      value1: {selector: 1, value: {a: 1, b: 2}},
      value2: {selector: 1, value: {b: 2, a: 1}},
      type: UnionObject,
      expected: true,
    },
    {
      value1: {selector: 2, value: 1000},
      value2: {selector: 2, value: 1000},
      type: UnionObject,
      expected: true,
    },
  ];
  for (const {type, value1, value2, expected} of testCases) {
    it(`should correctly perform equal for ${type.constructor.name}`, () => {
      const actual = type.equals(value1, value2);
      expect(actual).to.equal(expected);
    });
  }
});
