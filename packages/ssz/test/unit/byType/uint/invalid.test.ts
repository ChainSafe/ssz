import {describe, expect, it} from "vitest";
import {ContainerType, UintBigintType, UintNumberType} from "../../../../src/index.ts";
import {UintNumberByteLen, uintBigintByteLens, uintNumberByteLens} from "../../../../src/type/uint.ts";
import {InvalidValue, runTypeTestInvalid} from "../runTypeTestInvalid.ts";

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

const serializedOverMaxSafeInteger = "Invalid serialized number > MAX_SAFE_INTEGER";

runTypeTestInvalid({
  type: new UintNumberType(8),
  values: [
    {id: "Number over Number.MAX_SAFE_INTEGER", json: String(Number.MAX_SAFE_INTEGER * 2)},
    {id: "BigInt over Number.MAX_SAFE_INTEGER", json: BigInt(Number.MAX_SAFE_INTEGER * 2)},
    {id: "Serialized 2^53", serialized: "0x0000000000002000", error: serializedOverMaxSafeInteger},
    {id: "Serialized 2^64-2", serialized: "0xfeffffffffffffff", error: serializedOverMaxSafeInteger},
    {id: "Serialized 2^64-1", serialized: "0xffffffffffffffff", error: serializedOverMaxSafeInteger},
    ...invalidValuesForNumberAndBigint,
  ],
});

runTypeTestInvalid({
  type: new UintNumberType(8, {clipInfinity: true}),
  values: [
    {id: "Serialized 2^53", serialized: "0x0000000000002000", error: serializedOverMaxSafeInteger},
    {id: "Serialized 2^64-2", serialized: "0xfeffffffffffffff", error: serializedOverMaxSafeInteger},
  ],
});

runTypeTestInvalid({
  type: new ContainerType({a: new UintNumberType(8), b: new UintNumberType(8, {clipInfinity: true})}),
  values: [
    {id: "Field a 2^64-2", serialized: "0xfeffffffffffffff0000000000000000", error: serializedOverMaxSafeInteger},
    {id: "Field b 2^64-2", serialized: "0x0000000000000000feffffffffffffff", error: serializedOverMaxSafeInteger},
  ],
});

runTypeTestInvalid({
  type: new UintBigintType(8),
  values: invalidValuesForNumberAndBigint,
});

// Invalid types at constructor time

describe("Invalid UintType at constructor", () => {
  it("UintNumberType odd byteLen", () => {
    expect(() => new UintNumberType(3 as UintNumberByteLen)).toThrow();
  });
  it("UintNumberType byteLen > 8", () => {
    expect(() => new UintNumberType(16 as UintNumberByteLen)).toThrow();
  });
  it("UintBigintType odd byteLen", () => {
    expect(() => new UintBigintType(3 as UintNumberByteLen)).toThrow();
  });
  it("UintBigintType byteLen > 8", () => {
    expect(() => new UintBigintType(64 as UintNumberByteLen)).toThrow();
  });
});

describe("Uint serialize rejects out-of-range values (#572)", () => {
  const u8 = new UintNumberType(1);
  const u64 = new UintNumberType(8);
  const u64Inf = new UintNumberType(8, {clipInfinity: true});
  const ub8 = new UintBigintType(1);

  it("UintNumberType uint8 rejects negative, overflow, float, NaN", () => {
    expect(() => u8.serialize(-1)).toThrow();
    expect(() => u8.serialize(256)).toThrow();
    expect(() => u8.serialize(1.5)).toThrow();
    expect(() => u8.serialize(NaN)).toThrow();
    expect(() => u8.serialize(Infinity)).toThrow();
  });

  it("UintNumberType uint64 rejects above MAX_SAFE_INTEGER and negatives", () => {
    expect(() => u64.serialize(-1)).toThrow();
    expect(() => u64.serialize(Number.MAX_SAFE_INTEGER + 1)).toThrow();
    expect(() => u64.serialize(Infinity)).toThrow();
  });

  it("UintNumberType clipInfinity still allows Infinity", () => {
    expect(Array.from(u64Inf.serialize(Infinity))).toEqual(Array(8).fill(0xff));
  });

  it("UintBigintType rejects negative and overflow", () => {
    expect(() => ub8.serialize(-1n)).toThrow();
    expect(() => ub8.serialize(256n)).toThrow();
  });
});
