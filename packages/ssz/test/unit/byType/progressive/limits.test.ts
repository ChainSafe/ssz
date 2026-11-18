import {describe, expect, it} from "vitest";
import {
  BitArray,
  BitListType,
  ProgressiveBitListType,
  ProgressiveByteListType,
  ProgressiveListBasicType,
  ProgressiveListCompositeType,
  UintNumberType,
} from "../../../../src/index.ts";
import {PROGRESSIVE_LIST_MAX_SIZE} from "../../../../src/type/progressive.ts";

describe("bitlist maximum serialized size", () => {
  for (const limit of [1, 7, 8, 9, 15, 16, 17, 31, 32]) {
    for (const type of [new BitListType(limit), new ProgressiveBitListType({limit})]) {
      it(`${type.typeName} with limit ${limit}`, () => {
        const value = BitArray.fromBitLen(limit);
        const bytes = type.serialize(value);

        expect(type.maxSize).to.equal(bytes.length);
        expect(type.deserialize(bytes).bitLen).to.equal(limit);
      });
    }
  }
});

it("uses the same default runtime limit for progressive lists", () => {
  const byteList = new ProgressiveByteListType();

  expect(byteList.limitBytes).to.equal(new ProgressiveListBasicType(new UintNumberType(1)).limit);
  expect(byteList.limitBytes).to.equal(new ProgressiveListCompositeType(new BitListType(8)).limit);
  expect(byteList.limitBytes).to.equal(new ProgressiveBitListType().limitBits);
  expect(byteList.maxSize).to.equal(PROGRESSIVE_LIST_MAX_SIZE);
});
