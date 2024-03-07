import {expect} from "chai";
import {
  ByteVectorType,
  ContainerNodeStructType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  NoneType,
  toHexString,
  UnionType,
  ValueOf,
} from "../../../../src";
import {uint64NumInfType, uint64NumType} from "../../../utils/primitiveTypes";
import {runViewTestMutation} from "../runViewTestMutation";

// Test both ContainerType, ContainerNodeStructType only if
// - All fields are immutable

for (const ContainerTypeTest of [ContainerType, ContainerNodeStructType]) {
  runViewTestMutation({
    // Use Number64UintType and NumberUintType to test they work the same
    type: new ContainerTypeTest({a: uint64NumInfType, b: uint64NumInfType}),
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

  const containerUintsType = new ContainerTypeTest({a: uint64NumInfType, b: uint64NumInfType});

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
          tv.b = 21;
          // Change twice on purpose to trigger a branch in set basic
          tv.b = 20;
        },
      },
    ],
  });

  const byte32 = new ByteVectorType(32);
  const containerBytesType = new ContainerTypeTest({a: byte32, b: byte32});
  const rootOf = (i: number): Buffer => Buffer.alloc(32, i);

  runViewTestMutation({
    type: containerBytesType,
    treeViewToStruct: (tv) => ({a: tv.a, b: tv.b}),
    mutations: [
      {
        id: "set all properties",
        valueBefore: {a: rootOf(1), b: rootOf(2)},
        valueAfter: {a: rootOf(3), b: rootOf(4)},
        fn: (tv) => {
          tv.a = rootOf(3);
          tv.b = rootOf(4);
        },
      },
    ],
  });

  const containerUint64 = new ContainerTypeTest({a: uint64NumType});

  describe(`${containerUint64.typeName} drop caches`, () => {
    it("Make some changes then get previous value", () => {
      const view = containerUint64.defaultViewDU();
      const bytesBefore = toHexString(view.serialize());

      // Make changes to view and clone them to new view
      view.a = 1;
      view.clone();

      const bytesAfter = toHexString(view.serialize());
      expect(bytesAfter).to.equal(bytesBefore, "view retained changes");
    });
  });
}

// Test only ContainerType if
// - Some fields are mutable

const list8Uint64NumInfType = new ListBasicType(uint64NumInfType, 8);

runViewTestMutation({
  type: new ContainerType({a: uint64NumInfType, b: uint64NumInfType, list: list8Uint64NumInfType}),
  mutations: [
    {
      id: "set composite entire list",
      valueBefore: {a: 1, b: 2, list: []},
      valueAfter: {a: 1, b: 2, list: [10, 20]},
      fn: (tv) => {
        tv.list = list8Uint64NumInfType.toViewDU([10, 20]);
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

const containerUint64 = new ContainerType({a: uint64NumType});
const listOfContainers = new ListCompositeType(containerUint64, 4);

runViewTestMutation({
  // Ensure mutations of child array are commited
  type: new ContainerType({list: listOfContainers}),
  treeViewToStruct: (tv) => {
    const listArr: ValueOf<typeof listOfContainers> = [];
    for (let i = 0; i < tv.list.length; i++) {
      const item = tv.list.get(i);
      listArr.push({a: item.a});
    }
    return {list: listArr};
  },
  mutations: [
    {
      id: "Push two values",
      valueBefore: {list: []},
      valueAfter: {list: [{a: 1}, {a: 2}]},
      fn: (tv) => {
        tv.list.push(containerUint64.toViewDU({a: 1}));
        tv.list.push(containerUint64.toViewDU({a: 2}));
      },
    },
  ],
});

// to test new the VietDU.serialize() implementation for different types
const mixedContainer = new ContainerType({
  // a basic type
  a: uint64NumType,
  // a list basic type
  b: new ListBasicType(uint64NumType, 10),
  // a list composite type
  c: new ListCompositeType(new ContainerType({a: uint64NumInfType, b: uint64NumInfType}), 10),
  // embedded container type
  d: new ContainerType({a: uint64NumInfType}),
  // a union type, cannot mutate through this test
  e: new UnionType([new NoneType(), uint64NumInfType]),
});

runViewTestMutation({
  type: mixedContainer,
  mutations: [
    {
      id: "increase by 1",
      valueBefore: {a: 10, b: [0, 1], c: [{a: 100, b: 101}], d: {a: 1000}, e: {selector: 1, value: 2000}},
      //  View/ViewDU of Union is a value so we cannot mutate
      valueAfter: {a: 11, b: [1, 2], c: [{a: 101, b: 102}], d: {a: 1001}, e: {selector: 1, value: 2000}},
      fn: (tv) => {
        tv.a += 1;
        const b = tv.b;
        for (let i = 0; i < b.length; i++) {
          b.set(i, b.get(i) + 1);
        }
        const c = tv.c;
        for (let i = 0; i < c.length; i++) {
          const item = c.get(i);
          item.a += 1;
          item.b += 1;
        }
        tv.d.a += 1;
        // does not affect anyway, leaving here to make it explicit
        tv.e = {selector: 1, value: tv.e.value ?? 0 + 1};
      },
    },
  ],
});
