import {ContainerType, ListType, Number64UintType} from "../../../src";
import {runTypeTest} from "./runTypeTest";

const uint64Type = new Number64UintType();

runTypeTest({
  typeName: "Container({a: Uint64, b: Uint64})",
  type: new ContainerType({fields: {a: uint64Type, b: uint64Type}}),
  defaultValue: {a: 0, b: 0},
  values: [
    {
      id: "zero",
      serialized: "0x00000000000000000000000000000000",
      json: {a: "0", b: "0"},
      root: "0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b",
    },
    {
      id: "some value",
      serialized: "0x40e2010000000000f1fb090000000000",
      json: {a: "123456", b: "654321"},
      root: "0x53b38aff7bf2dd1a49903d07a33509b980c6acc9f2235a45aac342b0a9528c22",
    },
  ],
});

runTypeTest({
  typeName: "Container({a: List(Uint64), b: Uint64})",
  type: new ContainerType({fields: {a: new ListType({elementType: uint64Type, limit: 2 ** 7}), b: uint64Type}}),
  defaultValue: {a: [], b: 0},
  values: [
    {
      id: "zero",
      serialized: "0x0c0000000000000000000000",
      json: {a: [], b: "0"},
      root: "0xdc3619cbbc5ef0e0a3b38e3ca5d31c2b16868eacb6e4bcf8b4510963354315f5",
    },
    {
      id: "some value",
      serialized:
        "0x0c000000f1fb09000000000040e2010000000000f1fb09000000000040e2010000000000f1fb09000000000040e2010000000000",
      json: {a: ["123456", "654321", "123456", "654321", "123456"], b: "654321"},
      root: "0x5ff1b92b2fa55eea1a14b26547035b2f5437814b3436172205fa7d6af4091748",
    },
  ],
});
