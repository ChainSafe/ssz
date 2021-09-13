import {ContainerType, UintNumberType, ByteVectorType} from "../../../src/v2";
import {runTreeViewTest} from "./runTreeViewTest";

describe("Container TreeView", () => {
  const uint64Type = new UintNumberType(8, true);
  const containerUintsType = new ContainerType({a: uint64Type, b: uint64Type}, {typeName: "Container(uint64)"});

  runTreeViewTest({
    type: containerUintsType,
    treeViewToStruct: (tv) => ({a: tv.a, b: tv.b}),
    mutations: [
      {
        id: "set all properties",
        valueBefore: {a: 1, b: 2},
        valueAfter: {a: 10, b: 20},
        fn: (tv) => {
          tv.a = 10;
          tv.b = 20;
        },
      },
    ],
  });

  const byte32 = new ByteVectorType(32);
  const containerBytesType = new ContainerType({a: byte32, b: byte32}, {typeName: "Container(bytes32)"});

  const byte32_value1 = Buffer.alloc(32, 1);
  const byte32_value2 = Buffer.alloc(32, 2);
  const byte32_value5 = Buffer.alloc(32, 5);
  const byte32_value6 = Buffer.alloc(32, 6);

  runTreeViewTest({
    type: containerBytesType,
    treeViewToStruct: (tv) => ({a: tv.a, b: tv.b}),
    mutations: [
      {
        id: "set all properties",
        valueBefore: {a: byte32_value1, b: byte32_value2},
        valueAfter: {a: byte32_value5, b: byte32_value6},
        fn: (tv) => {
          tv.a = byte32_value5;
          tv.b = byte32_value6;
        },
      },
    ],
  });
});
