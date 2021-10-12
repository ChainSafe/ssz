import {BigIntUintType, booleanType, Number64UintType, NumberUintType} from "../../../src";
import {runTypeTest, runTypeValueTest} from "./runTypeTest";

runTypeTest({
  typeName: "boolean",
  type: booleanType,
  defaultValue: false,
  values: [
    {
      id: "false",
      serialized: "0x00",
      json: false,
      root: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "true",
      serialized: "0x01",
      json: true,
      root: "0x0100000000000000000000000000000000000000000000000000000000000000",
    },
  ],
});

runTypeTest({
  typeName: "NumberUint8",
  type: new NumberUintType({byteLength: 1}),
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

runTypeTest({
  typeName: "NumberUint32",
  type: new NumberUintType({byteLength: 4}),
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

runTypeTest({
  typeName: "NumberUint64",
  type: new NumberUintType({byteLength: 8}),
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

runTypeTest({
  typeName: "Number64UintType",
  type: new Number64UintType(),
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

runTypeValueTest({
  typeName: "NumberUintType(2)",
  type: new NumberUintType({byteLength: 2}),
  values: [
    {value: 2 ** 8, serialized: "0x0001"},
    {value: 2 ** 12 - 1, serialized: "0xff0f"},
    {value: 2 ** 12, serialized: "0x0010"},
    {value: 2 ** 16 - 1, serialized: "0xffff"},
  ],
});

runTypeValueTest({
  typeName: "NumberUintType(4)",
  type: new NumberUintType({byteLength: 4}),
  values: [
    {value: 2 ** 16, serialized: "0x00000100"},
    {value: 2 ** 28 - 1, serialized: "0xffffff0f"},
    {value: 2 ** 28, serialized: "0x00000010"},
    {value: 2 ** 32 - 1, serialized: "0xffffffff"},
  ],
});

runTypeValueTest({
  typeName: "NumberUintType(8)",
  type: new NumberUintType({byteLength: 8}),
  values: [
    {value: 2 ** 32, serialized: "0x0000000001000000"},
    {value: 2 ** 52 - 1, serialized: "0xffffffffffff0f00"},
    {value: 2 ** 32, serialized: "0x0000000001000000"},
    {value: 2 ** 52 - 1, serialized: "0xffffffffffff0f00"},
    {value: Infinity, serialized: "0xffffffffffffffff"},
  ],
});

runTypeValueTest({
  typeName: "Number64UintType",
  type: new Number64UintType(),
  values: [
    {value: 2 ** 32, serialized: "0x0000000001000000"},
    {value: 2 ** 52 - 1, serialized: "0xffffffffffff0f00"},
    {value: 2 ** 32, serialized: "0x0000000001000000"},
    {value: 2 ** 52 - 1, serialized: "0xffffffffffff0f00"},
    {value: Infinity, serialized: "0xffffffffffffffff"},
  ],
});

runTypeValueTest({
  typeName: "BigIntUint(8)",
  type: new BigIntUintType({byteLength: 8}),
  values: [
    {value: 0x01n, serialized: "0x0100000000000000"},
    {value: 0xaabbn, serialized: "0xbbaa000000000000"},
    {value: 0x1000000000000000n, serialized: "0x0000000000000010"},
    {value: 0xffffffffffffffffn, serialized: "0xffffffffffffffff"},
  ],
});

runTypeValueTest({
  typeName: "BigIntUint(16)",
  type: new BigIntUintType({byteLength: 16}),
  values: [
    {value: 0x01n, serialized: "0x01000000000000000000000000000000"},
    {value: 0xaabbn, serialized: "0xbbaa0000000000000000000000000000"},
    {value: 0x10000000000000000000000000000000n, serialized: "0x00000000000000000000000000000010"},
    {value: 0xffffffffffffffffffffffffffffffffn, serialized: "0xffffffffffffffffffffffffffffffff"},
  ],
});

runTypeValueTest({
  typeName: "BigIntUint(32)",
  type: new BigIntUintType({byteLength: 32}),
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
