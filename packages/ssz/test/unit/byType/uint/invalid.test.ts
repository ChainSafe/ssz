import {expect} from "chai";
import {UintNumberType, UintBigintType} from "../../../../src/index.js";
import {UintNumberByteLen, uintNumberByteLens, uintBigintByteLens} from "../../../../src/type/uint.js";
import {runTypeTestInvalid, InvalidValue} from "../runTypeTestInvalid.js";

for (const byteLen of uintNumberByteLens) {
  runTypeTestInvalid({
    type: new UintNumberType(byteLen),
    values: [
      // error is empty because struct and tree throw different errors
      {id: "Empty", serialized: ""},
      {id: "Too long", serialized: "00".repeat(byteLen + 1)},
    ],
  });
}

for (const byteLen of uintBigintByteLens) {
  runTypeTestInvalid({
    type: new UintBigintType(byteLen),
    values: [
      // error is empty because struct and tree throw different errors
      {id: "Empty", serialized: ""},
      {id: "Too long", serialized: "00".repeat(byteLen + 1)},
    ],
  });
}

const invalidValuesForNumberAndBigint: InvalidValue[] = [
  {id: "Object", json: {}},
  {id: "Array", json: []},
  {id: "null", json: null},
  {id: "Object stringified", json: JSON.stringify({})},
];

runTypeTestInvalid({
  type: new UintNumberType(8),
  values: [
    {id: "Number over Number.MAX_SAFE_INTEGER", json: String(Number.MAX_SAFE_INTEGER * 2)},
    {id: "BigInt over Number.MAX_SAFE_INTEGER", json: BigInt(Number.MAX_SAFE_INTEGER * 2)},
    ...invalidValuesForNumberAndBigint,
  ],
});

runTypeTestInvalid({
  type: new UintBigintType(8),
  values: invalidValuesForNumberAndBigint,
});

// Invalid types at constructor time

describe("Invalid UintType at constructor", () => {
  it("UintNumberType odd byteLen", () => {
    expect(() => new UintNumberType(3 as UintNumberByteLen)).to.throw();
  });
  it("UintNumberType byteLen > 8", () => {
    expect(() => new UintNumberType(16 as UintNumberByteLen)).to.throw();
  });
  it("UintBigintType odd byteLen", () => {
    expect(() => new UintBigintType(3 as UintNumberByteLen)).to.throw();
  });
  it("UintBigintType byteLen > 8", () => {
    expect(() => new UintBigintType(64 as UintNumberByteLen)).to.throw();
  });
});
