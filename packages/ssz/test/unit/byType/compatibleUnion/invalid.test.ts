import {describe, expect, it} from "vitest";
import {CompatibleUnionType, ProgressiveContainerType, UintNumberType} from "../../../../src/index.ts";

const byte = new UintNumberType(1);
const FieldA = new ProgressiveContainerType({A: byte}, [true]);

describe("Invalid CompatibleUnionType", () => {
  it("rejects empty options", () => {
    expect(() => new CompatibleUnionType({})).toThrow("at least one");
  });

  it("rejects reserved selectors", () => {
    expect(() => new CompatibleUnionType({0: FieldA})).toThrow("1..127");
    expect(() => new CompatibleUnionType({128: FieldA})).toThrow("1..127");
  });

  it("rejects incompatible options", () => {
    const FieldB = new ProgressiveContainerType({B: byte}, [true]);
    expect(() => new CompatibleUnionType({1: FieldA, 2: FieldB})).toThrow("not compatible");
  });

  it("rejects missing and unknown selectors", () => {
    const type = new CompatibleUnionType({1: FieldA});
    expect(() => type.deserialize(Uint8Array.from([]))).toThrow("selector byte");
    expect(() => type.deserialize(Uint8Array.from([2, 0]))).toThrow("Invalid CompatibleUnion selector 2");
  });
});
