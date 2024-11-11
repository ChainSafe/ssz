import {describe, it, expect} from "vitest";
import {ContainerNodeStructType, ContainerType, UintNumberType, ValueOf, VectorCompositeType} from "../../../../src";
import {runViewTestMutation} from "../runViewTestMutation";

const uint64NumInfType = new UintNumberType(8, {clipInfinity: true});
const containerUintsType = new ContainerType(
  {a: uint64NumInfType, b: uint64NumInfType},
  {typeName: "Container(uint64)"}
);
const vectorOfContainersType = new VectorCompositeType(containerUintsType, 2, {typeName: "VectorComposite(Container)"});

runViewTestMutation({
  type: vectorOfContainersType,
  treeViewToStruct: (tv) => {
    const arr: ValueOf<typeof vectorOfContainersType> = [];
    for (let i = 0; i < tv.length; i++) {
      const item = tv.get(i);
      arr.push({a: item.a, b: item.b});
    }
    return arr;
  },
  mutations: [
    {
      id: "set",
      valueBefore: [
        {a: 1, b: 2},
        {a: 3, b: 4},
      ],
      valueAfter: [
        {a: 5, b: 6},
        {a: 7, b: 8},
      ],
      fn: (tv) => {
        tv.set(0, containerUintsType.toViewDU({a: 5, b: 6}));
        tv.set(1, containerUintsType.toViewDU({a: 7, b: 8}));
      },
    },
    {
      id: "set child properties",
      valueBefore: [
        {a: 1, b: 2},
        {a: 3, b: 4},
      ],
      valueAfter: [
        {a: 5, b: 2},
        {a: 3, b: 8},
      ],
      fn: (tv) => {
        tv.get(0).a = 5;
        tv.get(1).b = 8;
      },
    },
    {
      id: "swap indices",
      valueBefore: [
        {a: 1, b: 2},
        {a: 3, b: 4},
      ],
      valueAfter: [
        {a: 3, b: 4},
        {a: 1, b: 2},
      ],
      fn: (tv) => {
        const item0 = tv.get(0);
        const item1 = tv.get(1);
        tv.set(0, item1);
        tv.set(1, item0);
      },
    },
  ],
});

describe("VectorCompositeType batchHashTreeRoot", () => {
  const value = [
    {a: 1, b: 2},
    {a: 3, b: 4},
  ];
  const containerUintsType = new ContainerNodeStructType(
    {a: uint64NumInfType, b: uint64NumInfType},
    {typeName: "ContainerNodeStruct(uint64)"}
  );
  const vectorOfContainersType2 = new VectorCompositeType(containerUintsType, 2, {
    typeName: "VectorComposite(ContainerNodeStruct)",
  });
  for (const vector of [vectorOfContainersType, vectorOfContainersType2]) {
    const typeName = vector.typeName;
    const expectedRoot = vectorOfContainersType.toView(value).hashTreeRoot();

    it(`${typeName} - fresh ViewDU`, () => {
      expect(vectorOfContainersType.toViewDU(value).batchHashTreeRoot()).toEqual(expectedRoot);
    });

    it(`${typeName} - modify 1 full element`, () => {
      const viewDU = vectorOfContainersType.toViewDU([
        {a: 1, b: 2},
        {a: 0, b: 0},
      ]);
      viewDU.set(1, containerUintsType.toViewDU({a: 3, b: 4}));
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);

      // assign the same value again, commit() then batchHashTreeRoot();
      viewDU.set(1, containerUintsType.toViewDU({a: 3, b: 4}));
      viewDU.commit();
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);
    });

    it(`${typeName} - modify 1 property of 1 element`, () => {
      const viewDU = vectorOfContainersType.toViewDU([
        {a: 1, b: 2},
        {a: 3, b: 0},
      ]);
      viewDU.get(1).b = 4;
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);

      // assign the same value again, commit() then batchHashTreeRoot();
      viewDU.get(1).b = 4;
      viewDU.commit();
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);
    });
  }
});
