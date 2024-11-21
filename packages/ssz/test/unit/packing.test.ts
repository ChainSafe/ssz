import {describe, it, expect} from "vitest";
import {UintBigintType, toHexString, VectorBasicType} from "../../src/index.js";

describe("uint packing", () => {
  const uint8 = new UintBigintType(1);
  const uint16 = new UintBigintType(2);
  const uint32 = new UintBigintType(4);
  const uint64 = new UintBigintType(8);
  const uint128 = new UintBigintType(16);
  const uint256 = new UintBigintType(32);

  const uints = {
    uint8,
    uint16,
    uint32,
    uint64,
    uint128,
    uint256,
  };

  const singleUintHashTreeRoot = {
    uint8: "0x0f00000000000000000000000000000000000000000000000000000000000000",
    uint16: "0x0f00000000000000000000000000000000000000000000000000000000000000",
    uint32: "0x0f00000000000000000000000000000000000000000000000000000000000000",
    uint64: "0x0f00000000000000000000000000000000000000000000000000000000000000",
    uint128: "0x0f00000000000000000000000000000000000000000000000000000000000000",
    uint256: "0x0f00000000000000000000000000000000000000000000000000000000000000",
  };

  for (const key of objectKeys(uints)) {
    it(`Single ${key} hashTreeRoot`, () => {
      const uint = uints[key];
      expect(toHexString(uint.hashTreeRoot(BigInt(0xf)))).to.equal(singleUintHashTreeRoot[key]);
    });
  }

  const packedUintHashTreeRoot = {
    uint8: "0x0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f",
    uint16: "0x0f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f00",
    uint32: "0x0f0000000f0000000f0000000f0000000f0000000f0000000f0000000f000000",
    uint64: "0x0f000000000000000f000000000000000f000000000000000f00000000000000",
    uint128: "0x0f0000000000000000000000000000000f000000000000000000000000000000",
    uint256: "0x0f00000000000000000000000000000000000000000000000000000000000000",
  };

  for (const key of objectKeys(uints)) {
    it(`Packed vector ${key} hashTreeRoot`, () => {
      const uint = uints[key];
      const length = Math.ceil(32 / uint.byteLength);

      const vectorType = new VectorBasicType(uint, length);
      const arr: bigint[] = [];
      for (let i = 0; i < length; i++) {
        arr[i] = BigInt(0xf);
      }

      expect(toHexString(vectorType.hashTreeRoot(arr))).to.equal(packedUintHashTreeRoot[key]);
    });
  }
});

function objectKeys<T extends Record<string, unknown>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
