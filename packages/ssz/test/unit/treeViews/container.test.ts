import {
  BooleanType,
  ContainerType,
  UintNumberType,
  UintBigintType,
  ListBasicType,
  ByteVectorType,
} from "../../../src/v2";
import {runTreeViewTest} from "./runTreeViewTest";
import {runTreeViewContainerSwapTest} from "./runContainerSwapTest";

describe("Container TreeView", () => {
  const uint64Type = new UintNumberType(8, true);
  const containerUintsType = new ContainerType({
    a: uint64Type,
    b: uint64Type,
  });

  runTreeViewTest({
    typeName: "containerUintsType",
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
  const containerBytesType = new ContainerType({
    a: byte32,
    b: byte32,
  });

  const byte32_value1 = Buffer.alloc(32, 1);
  const byte32_value2 = Buffer.alloc(32, 2);
  const byte32_value5 = Buffer.alloc(32, 5);
  const byte32_value6 = Buffer.alloc(32, 6);

  runTreeViewTest({
    typeName: "containerBytesType",
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

  // Swap properties tests. Because swaping uses the same property names you can write many more tests
  // just by declaring the property type and two values:

  runTreeViewContainerSwapTest(new BooleanType(), true, false);
  runTreeViewContainerSwapTest(uint64Type, 1, 2);
  runTreeViewContainerSwapTest(uint64Type, 1, Infinity);
  runTreeViewContainerSwapTest(new UintBigintType(8), BigInt(1), BigInt(2));
  for (const bytes of [32, 48, 96]) {
    runTreeViewContainerSwapTest(new ByteVectorType(bytes), Buffer.alloc(bytes, 1), Buffer.alloc(bytes, 2));
  }

  // Composite childs
  runTreeViewContainerSwapTest(containerUintsType, {a: 1, b: 2}, {a: 5, b: 6});
  runTreeViewContainerSwapTest(new ListBasicType(uint64Type, 8), [1, 2], [5, 6]);
});
