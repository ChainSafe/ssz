import {CompositeType, ContainerType, Number64UintType, NumberUintType} from "../../../../src";
import {VariableSizeSimpleObject} from "../../testTypes";
import {runTypeTestTreeViewMutations} from "../testRunners";

const number64UintType = new Number64UintType();
const uint64Type = new NumberUintType({byteLength: 8});
type ContainerAB = {a: number; b: number};

runTypeTestTreeViewMutations<ContainerAB>({
  typeName: "Container({a: Uint64, b: Uint64})",
  // Use Number64UintType and NumberUintType to test they work the same
  type: new ContainerType({fields: {a: uint64Type, b: number64UintType}}),
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

type VarSizeSimpleObject = {a: number; b: number; list: number[]};

runTypeTestTreeViewMutations<VarSizeSimpleObject>({
  typeName: "VariableSizeSimpleObject",
  type: VariableSizeSimpleObject as unknown as CompositeType<VarSizeSimpleObject>,
  mutations: [
    {
      id: "set composite entire list",
      valueBefore: {a: 1, b: 2, list: []},
      valueAfter: {a: 1, b: 2, list: [10, 20]},
      fn: (tv) => {
        tv.list = [10, 20];
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
