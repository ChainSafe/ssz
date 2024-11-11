import {describe, it, expect} from "vitest";
import {ContainerNodeStructType, ContainerType, ListBasicType, UintNumberType} from "../../../../src";
import {byteType, uint16NumType} from "../../../utils/primitiveTypes";
import {runTypeTestInvalid} from "../runTypeTestInvalid";

runTypeTestInvalid({
  type: new ContainerType({a: uint16NumType}),
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: ""},
    {serialized: "00"},

    {id: "Not an object", json: "{}"},
    {id: "Null", json: null},
    {id: "Missing key", json: {}},
  ],
});

runTypeTestInvalid({
  type: new ContainerType({a: uint16NumType, list: new ListBasicType(uint16NumType, 100)}),
  values: [
    // error is empty because struct and tree throw different errors
    {serialized: ""},
    {serialized: "00"},
  ],
});

const uint16 = new UintNumberType(2);
const uint16List = new ListBasicType(uint16, 2);

runTypeTestInvalid({
  type: new ContainerType({a: uint16List, b: uint16List}),
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
      id: "First offset less than fixedEnd",
      // Correct:  0x080000000c0000000100020003000400
      serialized: "0x070000000c0000000100020003000400",
      error: "First offset must equal to fixedEnd",
    },
    {
      id: "First offset equals 0",
      // Correct:  0x080000000c0000000100020003000400
      serialized: "0x000000000c0000000100020003000400",
      error: "First offset must equal to fixedEnd",
    },
  ],
});

// Invalid types at constructor time

describe("Invalid ContainerType at constructor", () => {
  it("Must have > 0 fields", () => {
    expect(() => new ContainerType({})).toThrow();
  });

  it("Incomplete casing map", () => {
    expect(
      () =>
        new ContainerType(
          {a: byteType},
          // Set casing map to a value that does not include all fields
          {casingMap: {b: "b"} as unknown as {a: string}}
        )
    ).toThrow();
  });

  it("ContainerNodeStructType of not immutable types", () => {
    expect(() => new ContainerNodeStructType({list: new ListBasicType(byteType, 2)})).toThrow();
  });
});
