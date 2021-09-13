import {UintBigintType, UintNumberType} from "../../../../src/type/uint";
import {runTypeTestValid} from "../runTypeTestValid";

runTypeTestValid({
  type: new UintNumberType(1),
  defaultValue: 0,
  values: [
    {serialized: "0x00", json: 0, root: "0x0000000000000000000000000000000000000000000000000000000000000000"},
    {serialized: "0xff", json: 255, root: "0xff00000000000000000000000000000000000000000000000000000000000000"},
  ],
});

runTypeTestValid({
  type: new UintNumberType(1, {setBitwiseOR: true}),
  defaultValue: 0,
  values: [
    {serialized: "0x00", json: 0, root: "0x0000000000000000000000000000000000000000000000000000000000000000"},
    {serialized: "0xff", json: 255, root: "0xff00000000000000000000000000000000000000000000000000000000000000"},
  ],
});

runTypeTestValid({
  type: new UintNumberType(2),
  values: [
    {json: 2 ** 8, serialized: "0x0001", root: null},
    {json: 2 ** 12 - 1, serialized: "0xff0f", root: null},
    {json: 2 ** 12, serialized: "0x0010", root: null},
    {json: 2 ** 16 - 1, serialized: "0xffff", root: null},
  ],
});

runTypeTestValid({
  type: new UintNumberType(4),
  defaultValue: 0,
  values: [
    {serialized: "0x00000000", json: 0, root: "0x0000000000000000000000000000000000000000000000000000000000000000"},
    {
      serialized: "0xffffffff",
      json: 4294967295,
      root: "0xffffffff00000000000000000000000000000000000000000000000000000000",
    },
    {json: 2 ** 16, serialized: "0x00000100", root: null},
    {json: 2 ** 28 - 1, serialized: "0xffffff0f", root: null},
    {json: 2 ** 28, serialized: "0x00000010", root: null},
  ],
});

runTypeTestValid({
  type: new UintNumberType(8),
  defaultValue: 0,
  values: [
    {
      serialized: "0xa086010000000000",
      json: "100000",
      root: "0xa086010000000000000000000000000000000000000000000000000000000000",
    },
    // To deal with the max number, set clipInfinity = true
    // {
    //   serialized: "0xffffffffffffffff",
    //   json: "18446744073709551615",
    //   root: "0xffffffffffffffff000000000000000000000000000000000000000000000000",
    // },
    {json: 2 ** 32, serialized: "0x0000000001000000", root: null},
    {json: 2 ** 52 - 1, serialized: "0xffffffffffff0f00", root: null},
    {json: BigInt(2 ** 52 - 1), serialized: "0xffffffffffff0f00", root: null},
  ],
});

runTypeTestValid({
  type: new UintNumberType(8, {clipInfinity: true}),
  typeName: "uint64 (clipInfinity)",
  defaultValue: 0,
  values: [
    {
      serialized: "0xa086010000000000",
      json: "100000",
      root: "0xa086010000000000000000000000000000000000000000000000000000000000",
    },
    {
      serialized: "0xffffffffffffffff",
      json: "18446744073709551615",
      root: "0xffffffffffffffff000000000000000000000000000000000000000000000000",
    },
    {json: 2 ** 32, serialized: "0x0000000001000000", root: null},
    {json: 2 ** 52 - 1, serialized: "0xffffffffffff0f00", root: null},
  ],
});

runTypeTestValid({
  type: new UintBigintType(8),
  defaultValue: BigInt(0),
  values: [
    {
      serialized: "0xa086010000000000",
      json: "100000",
      root: "0xa086010000000000000000000000000000000000000000000000000000000000",
    },
    {
      serialized: "0xffffffffffffffff",
      json: "18446744073709551615",
      root: "0xffffffffffffffff000000000000000000000000000000000000000000000000",
    },
    {json: 2 ** 32, serialized: "0x0000000001000000", root: null},
    {json: 2 ** 52 - 1, serialized: "0xffffffffffff0f00", root: null},
    {json: "288782042218268212", serialized: "0x3486eec3bcf50104", root: null},
  ],
});

runTypeTestValid({
  type: new UintBigintType(16),
  defaultValue: BigInt(0),
  values: [
    {json: 0x01n, serialized: "0x01000000000000000000000000000000", root: null},
    {json: 0xaabbn, serialized: "0xbbaa0000000000000000000000000000", root: null},
    {json: 0x10000000000000000000000000000000n, serialized: "0x00000000000000000000000000000010", root: null},
    {json: 0xffffffffffffffffffffffffffffffffn, serialized: "0xffffffffffffffffffffffffffffffff", root: null},
  ],
});

runTypeTestValid({
  type: new UintBigintType(32),
  defaultValue: BigInt(0),
  values: [
    {
      json: 0xaabbn,
      serialized: "0xbbaa000000000000000000000000000000000000000000000000000000000000",
      root: null,
    },
    {
      json: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      serialized: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      root: null,
    },
  ],
});
