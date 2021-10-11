import {booleanType, Number64UintType, NumberUintType} from "../../../src";
import {runTypeTest} from "./runTypeTest";

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
