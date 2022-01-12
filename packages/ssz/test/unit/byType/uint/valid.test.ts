import {UintBigintType, UintNumberType} from "../../../../src";
import {runTypeTestValid} from "../runTypeTestValid";

runTypeTestValid({
  type: new UintNumberType(1),
  defaultValue: 0,
  values: [
    {
      id: "zero",
      serialized: "0x00",
      json: 0,
      root: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "max",
      serialized: "0xff",
      json: 255,
      root: "0xff00000000000000000000000000000000000000000000000000000000000000",
    },
  ],
});

runTypeTestValid({
  type: new UintNumberType(4),
  defaultValue: 0,
  values: [
    {
      id: "zero",
      serialized: "0x00000000",
      json: 0,
      root: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "max",
      serialized: "0xffffffff",
      json: 4294967295,
      root: "0xffffffff00000000000000000000000000000000000000000000000000000000",
    },
  ],
});

runTypeTestValid({
  type: new UintNumberType(8),
  defaultValue: 0,
  values: [
    {
      id: "some value",
      serialized: "0xa086010000000000",
      json: "100000",
      root: "0xa086010000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "max",
      serialized: "0xffffffffffffffff",
      json: "0xffffffffffffffff",
      root: "0xffffffffffffffff000000000000000000000000000000000000000000000000",
      skipToJsonTest: true,
    },
  ],
});

runTypeTestValid({
  type: new UintNumberType(8, true),
  typeName: "uint64 (clipInfinity)",
  defaultValue: 0,
  values: [
    {
      id: "some value",
      serialized: "0xa086010000000000",
      json: "100000",
      root: "0xa086010000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "max",
      serialized: "0xffffffffffffffff",
      json: "0xffffffffffffffff",
      root: "0xffffffffffffffff000000000000000000000000000000000000000000000000",
      skipToJsonTest: true,
    },
  ],
});

// Extra serialize only tests

runTypeTestValid({
  type: new UintNumberType(2),
  values: [
    {value: 2 ** 8, serialized: "0x0001"},
    {value: 2 ** 12 - 1, serialized: "0xff0f"},
    {value: 2 ** 12, serialized: "0x0010"},
    {value: 2 ** 16 - 1, serialized: "0xffff"},
  ],
});

runTypeTestValid({
  type: new UintNumberType(4),
  values: [
    {value: 2 ** 16, serialized: "0x00000100"},
    {value: 2 ** 28 - 1, serialized: "0xffffff0f"},
    {value: 2 ** 28, serialized: "0x00000010"},
    {value: 2 ** 32 - 1, serialized: "0xffffffff"},
  ],
});

runTypeTestValid({
  type: new UintNumberType(8),
  values: [
    {value: 2 ** 32, serialized: "0x0000000001000000"},
    {value: 2 ** 52 - 1, serialized: "0xffffffffffff0f00"},
    {value: 2 ** 32, serialized: "0x0000000001000000"},
    {value: 2 ** 52 - 1, serialized: "0xffffffffffff0f00"},
    {value: Infinity, serialized: "0xffffffffffffffff"},
  ],
});

runTypeTestValid({
  type: new UintNumberType(8, true),
  typeName: "uint64 (clipInfinity)",
  values: [
    {value: 2 ** 32, serialized: "0x0000000001000000"},
    {value: 2 ** 52 - 1, serialized: "0xffffffffffff0f00"},
    {value: 2 ** 32, serialized: "0x0000000001000000"},
    {value: 2 ** 52 - 1, serialized: "0xffffffffffff0f00"},
    {value: Infinity, serialized: "0xffffffffffffffff"},
  ],
});

runTypeTestValid({
  type: new UintBigintType(8),
  values: [
    {value: 0x01n, serialized: "0x0100000000000000"},
    {value: 0xaabbn, serialized: "0xbbaa000000000000"},
    {value: 0x1000000000000000n, serialized: "0x0000000000000010"},
    {value: 0xffffffffffffffffn, serialized: "0xffffffffffffffff"},
  ],
});

runTypeTestValid({
  type: new UintBigintType(16),
  values: [
    {value: 0x01n, serialized: "0x01000000000000000000000000000000"},
    {value: 0xaabbn, serialized: "0xbbaa0000000000000000000000000000"},
    {value: 0x10000000000000000000000000000000n, serialized: "0x00000000000000000000000000000010"},
    {value: 0xffffffffffffffffffffffffffffffffn, serialized: "0xffffffffffffffffffffffffffffffff"},
  ],
});

runTypeTestValid({
  type: new UintBigintType(32),
  values: [
    {
      value: 0xaabbn,
      serialized: "0xbbaa000000000000000000000000000000000000000000000000000000000000",
    },
    {
      value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      serialized: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    },
  ],
});
