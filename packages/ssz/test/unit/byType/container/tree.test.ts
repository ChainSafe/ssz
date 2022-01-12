import {ByteVectorType, ContainerType, ListBasicType, UintNumberType} from "../../../../src";
import {runViewTestMutation} from "../runViewTestMutation";

const uint64Type = new UintNumberType(8, true);

runViewTestMutation({
  // Use Number64UintType and NumberUintType to test they work the same
  type: new ContainerType({a: uint64Type, b: uint64Type}, {typeName: "Container({a: Uint64, b: Uint64})"}),
  mutations: [
    {
      id: "set basic",
      valueBefore: {a: 1, b: 2},
      valueAfter: {a: 10, b: 2},
      fn: (tv) => {
        tv.a = 10;
      },
    },
    {
      id: "set basic x2",
      valueBefore: {a: 1, b: 2},
      valueAfter: {a: 10, b: 20},
      fn: (tv) => {
        tv.a = 10;
        tv.b = 20;
      },
    },
    // Test that reading a uin64 value that spans two hashObject h values works
    // the same with Number64UintType and NumberUintType
    {
      id: "swap props",
      valueBefore: {a: 0xffffffff + 1, b: 0xffffffff + 2},
      valueAfter: {a: 0xffffffff + 2, b: 0xffffffff + 1},
      fn: (tv) => {
        const a = tv.a;
        const b = tv.b;
        tv.a = b;
        tv.b = a;
      },
    },
  ],
});

const uint64ListType = new ListBasicType(uint64Type, 8);

runViewTestMutation({
  type: new ContainerType(
    {a: uint64Type, b: uint64Type, list: uint64ListType},
    {typeName: "Container({a: Uint64, b: Uint64, list: List(Uint64)})"}
  ),
  mutations: [
    {
      id: "set composite entire list",
      valueBefore: {a: 1, b: 2, list: []},
      valueAfter: {a: 1, b: 2, list: [10, 20]},
      fn: (tv) => {
        tv.list = uint64ListType.toViewDU([10, 20]);
      },
    },
    {
      id: "set composite list with push",
      valueBefore: {a: 1, b: 2, list: []},
      valueAfter: {a: 1, b: 2, list: [10, 20]},
      fn: (tv) => {
        tv.list.push(10);
        tv.list.push(20);
      },
    },
    // Test that keeping a reference to `list` and pushing twice mutates the original tv value
    {
      id: "set composite list with push and reference",
      valueBefore: {a: 1, b: 2, list: []},
      valueAfter: {a: 1, b: 2, list: [10, 20]},
      fn: (tv) => {
        const list = tv.list;
        list.push(10);
        list.push(20);
      },
    },
  ],
});

describe("Container TreeView", () => {
  const uint64Type = new UintNumberType(8, true);
  const containerUintsType = new ContainerType({a: uint64Type, b: uint64Type}, {typeName: "Container(uint64)"});

  runViewTestMutation({
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

  runViewTestMutation({
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
