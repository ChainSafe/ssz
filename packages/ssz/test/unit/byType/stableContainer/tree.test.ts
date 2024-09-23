import {expect} from "chai";
import {
  BitArray,
  BitListType,
  BitVectorType,
  BooleanType,
  ByteListType,
  ByteVectorType,
  ContainerNodeStructType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  NoneType,
  OptionalType,
  StableContainerType,
  toHexString,
  UnionType,
  ValueOf,
  VectorBasicType,
  VectorCompositeType,
} from "../../../../src";
import {uint64NumInfType, uint64NumType} from "../../../utils/primitiveTypes";
import {runViewTestMutation} from "../runViewTestMutation";

// Test both ContainerType, ContainerNodeStructType only if
// - All fields are immutable

// TODO: test different number of fields to test the serialization

runViewTestMutation({
  // Use Number64UintType and NumberUintType to test they work the same
  type: new StableContainerType({a: uint64NumInfType, b: uint64NumInfType}, 8),
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

const containerUintsType = new StableContainerType({a: uint64NumInfType, b: uint64NumInfType}, 8);

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
const containerBytesType = new StableContainerType({a: byte32, b: byte32}, 8);
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

const stableContainerUint64 = new StableContainerType({a: uint64NumType}, 8);

describe(`${stableContainerUint64.typeName} drop caches`, () => {
  it("Make some changes then get previous value", () => {
    const view = stableContainerUint64.defaultViewDU();
    const bytesBefore = toHexString(view.serialize());

    // Make changes to view and clone them to new view
    view.a = 1;
    view.clone();

    const bytesAfter = toHexString(view.serialize());
    expect(bytesAfter).to.equal(bytesBefore, "view retained changes");
  });
});

// Test only ContainerType if
// - Some fields are mutable

const list8Uint64NumInfType = new ListBasicType(uint64NumInfType, 8);

runViewTestMutation({
  type: new StableContainerType({a: uint64NumInfType, b: uint64NumInfType, list: list8Uint64NumInfType}, 8),
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

const containerUint64 = new StableContainerType({a: uint64NumType}, 8);
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
const mixedContainer = new StableContainerType(
  {
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
  },
  8
);

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

describe("StableContainerViewDU batchHashTreeRoot", function () {
  const childContainerType = new ContainerType({f0: uint64NumInfType, f1: uint64NumInfType});
  const unionType = new UnionType([new NoneType(), uint64NumType]);
  const listBasicType = new ListBasicType(uint64NumType, 10);
  const vectorBasicType = new VectorBasicType(uint64NumType, 2);
  const listCompositeType = new ListCompositeType(childContainerType, 10);
  const vectorCompositeType = new VectorCompositeType(childContainerType, 1);
  const bitVectorType = new BitVectorType(64);
  const bitListType = new BitListType(4);
  const childContainerStruct = new ContainerNodeStructType({g0: uint64NumInfType, g1: uint64NumInfType});
  const optionalType = new OptionalType(listBasicType);
  const parentContainerType = new StableContainerType(
    {
      a: uint64NumType,
      b: new BooleanType(),
      c: unionType,
      d: new ByteListType(64),
      e: new ByteVectorType(64),
      // a child container type
      f: childContainerType,
      g: childContainerStruct,
      h: listBasicType,
      i: vectorBasicType,
      j: listCompositeType,
      k: vectorCompositeType,
      l: bitVectorType,
      m: bitListType,
      n: optionalType,
    },
    64
  );

  const value: ValueOf<typeof parentContainerType> = {
    a: 10,
    b: true,
    c: {selector: 1, value: 100},
    d: Buffer.alloc(64, 2),
    e: Buffer.alloc(64, 1),
    f: {f0: 100, f1: 101},
    g: {g0: 100, g1: 101},
    h: [1, 2],
    i: [1, 2],
    j: [{f0: 1, f1: 2}],
    k: [{f0: 1, f1: 2}],
    l: BitArray.fromSingleBit(64, 5),
    m: BitArray.fromSingleBit(4, 1),
    n: [1, 2],
  };
  const expectedRoot = parentContainerType.hashTreeRoot(value);

  it("fresh ViewDU", () => {
    expect(parentContainerType.toViewDU(value).batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify Number type", () => {
    const viewDU = parentContainerType.toViewDU({...value, a: 9});
    viewDU.batchHashTreeRoot();
    viewDU.a += 1;
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.a = 10;
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify BooleanType", () => {
    const viewDU = parentContainerType.toViewDU({...value, b: false});
    viewDU.batchHashTreeRoot();
    viewDU.b = true;
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.b = true;
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify UnionType", () => {
    const viewDU = parentContainerType.toViewDU({...value, c: {selector: 1, value: 101}});
    viewDU.batchHashTreeRoot();
    viewDU.c = unionType.toViewDU({selector: 1, value: 100});
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.c = unionType.toViewDU({selector: 1, value: 100});
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify ByteVectorType", () => {
    const viewDU = parentContainerType.toViewDU(value);
    viewDU.batchHashTreeRoot();
    // this takes more than 1 chunk so the resulting node is a branch node
    viewDU.e = viewDU.e.slice();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.e = viewDU.e.slice();
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify ByteListType", () => {
    const viewDU = parentContainerType.toViewDU(value);
    viewDU.batchHashTreeRoot();
    // this takes more than 1 chunk so the resulting node is a branch node
    viewDU.d = viewDU.d.slice();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.d = viewDU.d.slice();
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify full child container", () => {
    const viewDU = parentContainerType.toViewDU({...value, f: {f0: 99, f1: 999}});
    viewDU.batchHashTreeRoot();
    viewDU.f = childContainerType.toViewDU({f0: 100, f1: 101});
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.f = childContainerType.toViewDU({f0: 100, f1: 101});
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify partial child container", () => {
    const viewDU = parentContainerType.toViewDU({...value, f: {f0: 99, f1: 999}});
    viewDU.batchHashTreeRoot();
    viewDU.f.f0 = 100;
    viewDU.f.f1 = 101;
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.f.f0 = 100;
    viewDU.f.f1 = 101;
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify ContainerNodeStructType", () => {
    const viewDU = parentContainerType.toViewDU({...value, g: {g0: 99, g1: 999}});
    viewDU.batchHashTreeRoot();
    viewDU.g = childContainerStruct.toViewDU({g0: 100, g1: 101});
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.g = childContainerStruct.toViewDU({g0: 100, g1: 101});
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify partial ContainerNodeStructType", () => {
    const viewDU = parentContainerType.toViewDU({...value, g: {g0: 99, g1: 999}});
    viewDU.batchHashTreeRoot();
    viewDU.g.g0 = 100;
    viewDU.g.g1 = 101;
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.g.g0 = 100;
    viewDU.g.g1 = 101;
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify ListBasicType", () => {
    const viewDU = parentContainerType.toViewDU({...value, h: []});
    viewDU.batchHashTreeRoot();
    viewDU.h = listBasicType.toViewDU([1, 2]);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.h = listBasicType.toViewDU([1, 2]);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then push 1 item to ListBasicType", () => {
    const viewDU = parentContainerType.toViewDU({...value, h: [1]});
    viewDU.batchHashTreeRoot();
    viewDU.h.push(2);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.h = listBasicType.toViewDU([1, 2]);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify 1 item of ListBasicType", () => {
    const viewDU = parentContainerType.toViewDU({...value, h: [1, 3]});
    viewDU.batchHashTreeRoot();
    viewDU.h.set(1, 2);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.h.set(1, 2);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify VectorBasicType", () => {
    const viewDU = parentContainerType.toViewDU({...value, i: []});
    viewDU.batchHashTreeRoot();
    viewDU.i = vectorBasicType.toViewDU([1, 2]);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.i = vectorBasicType.toViewDU([1, 2]);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify 1 item of VectorBasicType", () => {
    const viewDU = parentContainerType.toViewDU({...value, i: [1, 3]});
    viewDU.batchHashTreeRoot();
    viewDU.i.set(1, 2);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.i.set(1, 2);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify ListCompositeType", () => {
    const viewDU = parentContainerType.toViewDU({...value, j: []});
    viewDU.batchHashTreeRoot();
    viewDU.j = listCompositeType.toViewDU([{f0: 1, f1: 2}]);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.j = listCompositeType.toViewDU([{f0: 1, f1: 2}]);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then push 1 item to ListCompositeType", () => {
    const viewDU = parentContainerType.toViewDU({...value, j: []});
    viewDU.batchHashTreeRoot();
    viewDU.j.push(childContainerType.toViewDU({f0: 1, f1: 2}));
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.j = listCompositeType.toViewDU([{f0: 1, f1: 2}]);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify 1 item of ListCompositeType", () => {
    const viewDU = parentContainerType.toViewDU({...value, j: [{f0: 1, f1: 3}]});
    viewDU.batchHashTreeRoot();
    viewDU.j.set(0, childContainerType.toViewDU({f0: 1, f1: 2}));
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.j.set(0, childContainerType.toViewDU({f0: 1, f1: 2}));
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify 1 field of 1 item of ListCompositeType", () => {
    const viewDU = parentContainerType.toViewDU({...value, j: [{f0: 1, f1: 3}]});
    viewDU.batchHashTreeRoot();
    viewDU.j.get(0).f1 = 2;
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.j.get(0).f1 = 2;
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify VectorCompositeType", () => {
    const viewDU = parentContainerType.toViewDU({...value, k: [{f0: 9, f1: 9}]});
    viewDU.batchHashTreeRoot();
    viewDU.k = vectorCompositeType.toViewDU([{f0: 1, f1: 2}]);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.k = vectorCompositeType.toViewDU([{f0: 1, f1: 2}]);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify 1 item of VectorCompositeType", () => {
    const viewDU = parentContainerType.toViewDU({...value, k: [{f0: 1, f1: 3}]});
    viewDU.batchHashTreeRoot();
    viewDU.k.set(0, childContainerType.toViewDU({f0: 1, f1: 2}));
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.k.set(0, childContainerType.toViewDU({f0: 1, f1: 2}));
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify 1 field 1 item of VectorCompositeType", () => {
    const viewDU = parentContainerType.toViewDU({...value, k: [{f0: 1, f1: 3}]});
    viewDU.batchHashTreeRoot();
    viewDU.k.get(0).f1 = 2;
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.k.get(0).f1 = 2;
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify BitVectorType", () => {
    const viewDU = parentContainerType.toViewDU({...value, l: BitArray.fromSingleBit(64, 4)});
    viewDU.batchHashTreeRoot();
    viewDU.l = bitVectorType.toViewDU(BitArray.fromSingleBit(64, 5));
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.l = bitVectorType.toViewDU(BitArray.fromSingleBit(64, 5));
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify BitVectorType bit", () => {
    const viewDU = parentContainerType.toViewDU({...value, l: BitArray.fromSingleBit(64, 4)});
    viewDU.batchHashTreeRoot();
    viewDU.l.set(4, false);
    viewDU.l.set(5, true);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.l.set(4, false);
    viewDU.l.set(5, true);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify BitListType", () => {
    const viewDU = parentContainerType.toViewDU({...value, m: BitArray.fromSingleBit(4, 0)});
    viewDU.batchHashTreeRoot();
    viewDU.m = bitListType.toViewDU(BitArray.fromSingleBit(4, 1));
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.m = bitListType.toViewDU(BitArray.fromSingleBit(4, 1));
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify BitListType bit", () => {
    const viewDU = parentContainerType.toViewDU({...value, m: BitArray.fromSingleBit(4, 0)});
    viewDU.batchHashTreeRoot();
    viewDU.m.set(0, false);
    viewDU.m.set(1, true);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.m.set(0, false);
    viewDU.m.set(1, true);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify OptionalType", () => {
    const viewDU = parentContainerType.toViewDU({...value, n: null});
    viewDU.batchHashTreeRoot();
    viewDU.n = listBasicType.toViewDU([1, 2]);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign again but commit before batchHashTreeRoot()
    viewDU.n = listBasicType.toViewDU([1, 2]);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });
});

describe("StableContainer backward compatibility", function () {
  it("add 1 optional field", () => {
    const optionalType = new OptionalType(uint64NumType);
    const listBasicType = new ListBasicType(uint64NumType, 10);
    const Type1 = new StableContainerType(
      {
        a: optionalType,
        b: optionalType,
        c: listBasicType,
      },
      8
    );

    // grow the container with type c
    const Type2 = new StableContainerType(
      {
        a: optionalType,
        b: optionalType,
        c: listBasicType,
        d: optionalType,
      },
      8
    );

    const value = {a: null, b: 2, c: [1, 2], d: null};
    const viewDU2 = Type2.toViewDU(value);
    const serialized = viewDU2.serialize();
    const byteView = {
      uint8Array: serialized,
      dataView: new DataView(serialized.buffer, serialized.byteOffset, serialized.byteLength),
    };
    // can deserialize
    const node = Type1.tree_deserializeFromBytes(byteView, 0, serialized.length);
    const viewDU = Type2.getViewDU(node);
    // hashTreeRoot is the same
    expect(viewDU.hashTreeRoot()).to.deep.equal(viewDU2.hashTreeRoot());
  });
});
