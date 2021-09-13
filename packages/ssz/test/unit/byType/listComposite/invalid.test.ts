import {expect} from "chai";
import {ListCompositeType, UintNumberType, ContainerType, ListBasicType} from "../../../../src";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

const uint16 = new UintNumberType(2);

runTypeTestInvalid({
  type: new ListCompositeType(new ContainerType({a: uint16}), 2),
  values: [
    {
      id: "Length over limit",
      serialized: "0100".repeat(3),
      json: Array(3).fill({a: 1}),
      error: "Invalid list length",
    },
    {id: "Length not multiple of fixed size", serialized: "01", error: "not multiple of"},

    {id: "Object", json: {}},
    {id: "null", json: null},
    {id: "Object stringified", json: JSON.stringify({})},
  ],
});

runTypeTestInvalid({
  type: new ListCompositeType(new ListBasicType(uint16, 2), 2),
  values: [
    {id: "Length over limit", serialized: "0100".repeat(3), json: Array(3).fill([1])},
    {
      id: "Length not multiple of fixed size - end",
      // Correct:  0x080000000c0000000100020003000400
      serialized: "0x080000000c00000001000200030004",
      error: "not multiple of",
    },
    {
      id: "Length not multiple of fixed size - start",
      // Correct:  0x080000000c0000000100020003000400
      serialized: "0x080000000b00000001000203000400",
      error: "not multiple of",
    },
    {
      id: "Offset decreasing",
      // Correct:  0x080000000c0000000100020003000400
      serialized: "0x08000000070000000100020003000400",
      error: "Offsets must be increasing",
    },
    {
      id: "Offset out of bounds",
      // Correct:  0x080000000c0000000100020003000400
      serialized: "0x08000000180000000100020003000400",
      error: "Offset out of bounds",
    },
    {
      id: "Offset data length not multiple of 4",
      // Correct:  0x080000000c0000000100020003000400
      serialized: "0x070000000c0000000100020003000400",
      error: "Offset data length not multiple of 4",
    },
    {
      id: "First offset must be > 0",
      // Correct:  0x080000000c0000000100020003000400
      serialized: "0x000000000c0000000100020003000400",
      error: "First offset must be > 0",
    },
  ],
});

// Invalid types at constructor time

describe("Invalid ListBasicType at constructor", () => {
  const compositeType = new ListBasicType(uint16, 2);

  it("limit must be > 0", () => {
    expect(() => new ListCompositeType(compositeType, 0)).to.throw();
  });

  it("ElementType must be basic", () => {
    expect(() => new ListCompositeType(uint16 as unknown as typeof compositeType, 2)).to.throw();
  });
});
