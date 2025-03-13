import {describe, it, expect, beforeEach} from "vitest";
import {
  CompositeView,
  ContainerNodeStructType,
  ContainerType,
  ListCompositeType,
  toHexString,
  UintNumberType,
  ValueOf,
} from "../../../../src/index.js";
import {ArrayCompositeTreeViewDU} from "../../../../src/viewDU/arrayComposite.js";
import {ssz} from "../../../lodestarTypes/primitive/index.js";
import {runViewTestMutation} from "../runViewTestMutation.js";
import {ListCompositeTreeViewDU} from "../../../../src/viewDU/listComposite.js";

const uint64NumInfType = new UintNumberType(8, {clipInfinity: true});
const containerUintsType = new ContainerType(
  {a: uint64NumInfType, b: uint64NumInfType},
  {typeName: "Container(uint64)"}
);
const listOfContainersType = new ListCompositeType(containerUintsType, 4, {typeName: "ListCompositeType(Container)"});

runViewTestMutation({
  type: listOfContainersType,
  treeViewToStruct: (tv) => {
    const arr: ValueOf<typeof listOfContainersType> = [];
    for (let i = 0; i < tv.length; i++) {
      const item = tv.get(i);
      arr.push({a: item.a, b: item.b});
    }
    return arr;
  },
  mutations: [
    {
      id: "Push two items",
      valueBefore: [],
      valueAfter: [
        {a: 1, b: 1},
        {a: 2, b: 2},
      ],
      assertFn: (tv) => expect(tv.length).equals(2, "Wrong length"),
      fn: (tv) => {
        tv.push(containerUintsType.toViewDU({a: 1, b: 1}));
        tv.push(containerUintsType.toViewDU({a: 2, b: 2}));
      },
    },
    {
      id: "TreeView changes DO NOT propagate after setting an item at a new index",
      skipTreeViewDU: true,
      valueBefore: [
        {a: 1, b: 2},
        {a: 1, b: 2},
      ],
      valueAfter: [
        {a: 10, b: 20},
        {a: 1, b: 2},
      ],
      fn: (tv) => {
        // Test that if the same element is set in two places the changes will NOT propagate to both places
        const i0 = tv.get(0);
        tv.set(1, i0);
        i0.a = 10;
        i0.b = 20;
      },
    },
    {
      id: "TreeViewDU changes DO propagate after setting an item at a new index",
      skipTreeView: true,
      valueBefore: [
        {a: 1, b: 2},
        {a: 1, b: 2},
      ],
      valueAfter: [
        {a: 10, b: 20},
        {a: 10, b: 20},
      ],
      fn: (tv) => {
        // Test that if the same element is set in two places the changes will propagate to both places
        const i0 = tv.get(0);
        tv.set(1, i0);
        i0.a = 10;
        i0.b = 20;
      },
    },
  ],
});

describe("ListCompositeType tree reads", () => {
  function elementToValue(view: CompositeView<typeof containerUintsType>): ValueOf<typeof containerUintsType> {
    return view.toValue();
  }

  for (const [id, {view, elementToView}] of Object.entries({
    view: {
      view: listOfContainersType.defaultView(),
      elementToView: containerUintsType.toView.bind(containerUintsType),
    },
    viewDU: {
      view: listOfContainersType.defaultViewDU(),
      elementToView: containerUintsType.toViewDU.bind(containerUintsType),
    },
  })) {
    it(`listOfContainersType ${id} get fns`, () => {
      const values: ValueOf<typeof containerUintsType>[] = [];

      for (let i = 0; i < listOfContainersType.limit; i++) {
        values[i] = {a: i, b: i};
        view.push(elementToView(values[i]) as any);
      }

      expect(() => view.push(elementToView(values[0]) as any)).toThrow("Error pushing over limit");
      expect(() => view.set(view.type.limit, elementToView(values[0]) as any)).toThrow(
        "Error setting index over length"
      );

      for (let i = 0; i < listOfContainersType.limit; i++) {
        expect(view.get(i).toValue()).deep.equals(values[i], `Wrong get(${i})`);
        expect(view.getReadonly(i).toValue()).deep.equals(values[i], `Wrong getReadonly(${i})`);
      }

      // Only for viewDU
      if (view instanceof ArrayCompositeTreeViewDU) {
        expect(() => view.getAllReadonly()).not.toThrow();
        expect(() => view.getAllReadonlyValues()).toThrow("Must commit changes before reading all nodes");
        view.commit();
      }

      expect(view.getAllReadonly().map(elementToValue)).deep.equals(values, "Wrong getAllReadonly()");
      expect(view.getAllReadonlyValues()).deep.equals(values, "Wrong getAllReadonlyValues()");

      // Only for viewDU
      if (view instanceof ArrayCompositeTreeViewDU) {
        // .get() without viewsChanged but with nodes cache
        view["viewsChanged"].clear();
        for (let i = 0; i < 4; i++) {
          expect(view.get(i).toValue()).deep.equals(values[i], `Wrong getReadonly(${i})`);
        }

        // .get() without viewsChanged and without nodes cache
        view["viewsChanged"].clear();
        view["clearCache"]();
        for (let i = 0; i < 4; i++) {
          expect(view.get(i).toValue()).deep.equals(values[i], `Wrong getReadonly(${i})`);
        }

        // .getReadonly() without viewsChanged but with nodes cache
        view["viewsChanged"].clear();
        for (let i = 0; i < 4; i++) {
          expect(view.getReadonly(i).toValue()).deep.equals(values[i], `Wrong getReadonly(${i})`);
        }

        // .getReadonly() without viewsChanged and without nodes cache
        view["clearCache"]();
        view["viewsChanged"].clear();
        for (let i = 0; i < 4; i++) {
          expect(view.getReadonly(i).toValue()).deep.equals(values[i], `Wrong getReadonly(${i})`);
        }

        // Clear caches to force getAllReadonlyValues to re-populate them
        view["clearCache"]();
        expect(view.getAllReadonlyValues()).deep.equals(values, "Wrong getAllReadonlyValues()");
      }
    });
  }
});

describe("ListCompositeType drop caches", () => {
  it("Make some changes then get previous value", () => {
    const view = listOfContainersType.defaultViewDU();
    const bytesBefore = toHexString(view.serialize());

    // Make changes to view and clone them to new view
    view.push(containerUintsType.toViewDU({a: 1, b: 2}));
    view.clone();

    const bytesAfter = toHexString(view.serialize());
    expect(bytesAfter).to.equal(bytesBefore, "view retained changes");
  });
});

describe("ListCompositeType.sliceTo", () => {
  it("Slice List at multiple length", () => {
    const listType = new ListCompositeType(ssz.Root, 1024);
    const listView = listType.defaultViewDU();
    const listRoots: string[] = [];
    const listSerialized: string[] = [];

    for (let i = -1; i < 16; i++) {
      // Skip first loop to persist empty case
      if (i >= 0) {
        listView.push(Buffer.alloc(32, 0xf + i)); // Avoid 0 case
      }
      // Javascript arrays can handle negative indexes (ok for tests)
      listSerialized[i] = toHexString(listView.serialize());
      listRoots[i] = toHexString(listView.hashTreeRoot());
    }

    // Start at -1 to test the empty case.
    for (let i = -1; i < 16; i++) {
      const listSlice = listView.sliceTo(i);
      expect(listSlice.length).to.equal(i + 1, `Wrong length at .sliceTo(${i})`);
      expect(toHexString(listSlice.serialize())).equals(listSerialized[i], `Wrong serialize at .sliceTo(${i})`);
      expect(toHexString(listSlice.hashTreeRoot())).equals(listRoots[i], `Wrong root at .sliceTo(${i})`);
    }
  });
});

describe("ListCompositeType.sliceFrom", () => {
  const listType = new ListCompositeType(ssz.Root, 1024);
  const listLength = 16;
  const list = Array.from({length: listLength}, (_, i) => Buffer.alloc(32, i));
  let listView: ListCompositeTreeViewDU<typeof ssz.Root>;
  beforeEach(() => {
    listView = listType.toViewDU(list);
  });

  for (let i = -(listLength + 1); i < listLength + 1; i++) {
    it(`Slice List from list length ${listLength}`, () => {
      // compare list.slice(i) to listView.sliceFrom(i), they should be equivalent
      const slicedList = list.slice(i);
      const slicedListView = listView.sliceFrom(i);

      expect(slicedListView.length).to.equal(slicedList.length);
      expect(toHexString(slicedListView.serialize())).to.equal(toHexString(listType.serialize(slicedList)));
      expect(toHexString(slicedListView.hashTreeRoot())).to.equal(toHexString(listType.hashTreeRoot(slicedList)));
    });
  }
});

describe("ListCompositeType batchHashTreeRoot", () => {
  const value = [
    {a: 1, b: 2},
    {a: 3, b: 4},
  ];
  const containerStructUintsType = new ContainerNodeStructType(
    {a: uint64NumInfType, b: uint64NumInfType},
    {typeName: "ContainerNodeStruct(uint64)"}
  );
  const listOfContainersType2 = new ListCompositeType(containerStructUintsType, 4, {
    typeName: "ListCompositeType(ContainerNodeStructType)",
  });

  for (const list of [listOfContainersType, listOfContainersType2]) {
    const typeName = list.typeName;
    const expectedRoot = list.toView(value).hashTreeRoot();

    it(`${typeName} - fresh ViewDU`, () => {
      expect(listOfContainersType.toViewDU(value).batchHashTreeRoot()).toEqual(expectedRoot);
    });

    it(`${typeName} - push then batchHashTreeRoot()`, () => {
      const viewDU = listOfContainersType.defaultViewDU();
      viewDU.push(containerUintsType.toViewDU({a: 1, b: 2}));
      viewDU.push(containerUintsType.toViewDU({a: 3, b: 4}));
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);

      // assign again, commit() then batchHashTreeRoot()
      viewDU.set(0, containerUintsType.toViewDU({a: 1, b: 2}));
      viewDU.set(1, containerUintsType.toViewDU({a: 3, b: 4}));
      viewDU.commit();
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);
    });

    it(`${typeName} - full hash then modify full non-hashed child element`, () => {
      const viewDU = listOfContainersType.defaultViewDU();
      viewDU.push(containerUintsType.toViewDU({a: 1, b: 2}));
      viewDU.push(containerUintsType.toViewDU({a: 33, b: 44}));
      viewDU.batchHashTreeRoot();
      viewDU.set(1, containerUintsType.toViewDU({a: 3, b: 4}));
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);

      // assign the same value again, commit() then batchHashTreeRoot()
      viewDU.set(1, containerUintsType.toViewDU({a: 3, b: 4}));
      viewDU.commit();
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);
    });

    it(`${typeName} - full hash then modify partially hashed child element`, () => {
      const viewDU = listOfContainersType.defaultViewDU();
      viewDU.push(containerUintsType.toViewDU({a: 1, b: 2}));
      viewDU.push(containerUintsType.toViewDU({a: 33, b: 44}));
      viewDU.batchHashTreeRoot();
      const item1 = containerUintsType.toViewDU({a: 3, b: 44});
      item1.batchHashTreeRoot();
      item1.b = 4;
      viewDU.set(1, item1);
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);

      // assign the same value again, commit() then batchHashTreeRoot()
      const item2 = viewDU.get(1);
      item2.a = 3;
      item2.b = 4;
      viewDU.commit();
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);
    });

    it(`${typeName} - full hash then modify full hashed child element`, () => {
      const viewDU = listOfContainersType.defaultViewDU();
      viewDU.push(containerUintsType.toViewDU({a: 1, b: 2}));
      viewDU.push(containerUintsType.toViewDU({a: 33, b: 44}));
      viewDU.batchHashTreeRoot();
      const item1 = containerUintsType.toViewDU({a: 3, b: 4});
      item1.batchHashTreeRoot();
      viewDU.set(1, item1);
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);

      // assign the same value again, commit() then batchHashTreeRoot()
      const newItem = containerUintsType.toViewDU({a: 3, b: 4});
      viewDU.set(1, newItem);
      viewDU.commit();
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);
    });

    it(`${typeName} - full hash then modify partial child element`, () => {
      const viewDU = listOfContainersType.defaultViewDU();
      viewDU.push(containerUintsType.toViewDU({a: 1, b: 2}));
      viewDU.push(containerUintsType.toViewDU({a: 33, b: 44}));
      viewDU.batchHashTreeRoot();
      viewDU.get(1).a = 3;
      viewDU.get(1).b = 4;
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);

      // assign the same value again, commit() then batchHashTreeRoot()
      viewDU.get(1).a = 3;
      viewDU.get(1).b = 4;
      viewDU.commit();
      expect(viewDU.batchHashTreeRoot()).toEqual(expectedRoot);
    });

    // similar to a fresh ViewDU but it's good to test
    it(`${typeName} - sliceTo()`, () => {
      const viewDU = listOfContainersType.defaultViewDU();
      viewDU.push(containerUintsType.toViewDU({a: 1, b: 2}));
      viewDU.push(containerUintsType.toViewDU({a: 3, b: 4}));
      viewDU.push(containerUintsType.toViewDU({a: 5, b: 6}));
      viewDU.batchHashTreeRoot();
      expect(viewDU.sliceTo(1).batchHashTreeRoot()).toEqual(expectedRoot);
    });
  }
});

describe("ListCompositeType", () => {
  it("getAllReadOnly() without commit", () => {
    const listType = new ListCompositeType(ssz.Root, 1024);
    const listLength = 2;
    const list = Array.from({length: listLength}, (_, i) => Buffer.alloc(32, i));
    const listView = listType.toViewDU(list);
    expect(listView.getAllReadonly()).to.deep.equal(list);

    // modify
    listView.set(0, Buffer.alloc(32, 1));
    // push
    listView.push(Buffer.alloc(32, 1));

    // getAllReadOnly() without commit, now all items should be the same
    expect(listView.getAllReadonly()).to.deep.equal(Array.from({length: 3}, () => Buffer.alloc(32, 1)));

    // getAllReadOnlyValues() will throw
    expect(() => listView.getAllReadonlyValues()).toThrow("Must commit changes before reading all nodes");
  });

  it("getReadonlyByRange", () => {
    const listType = new ListCompositeType(ssz.Root, 1024);

    for (const loadNodes of [false, true]) {
      for (const listLength of [5, 10, 15, 20, 21, 22, 23, 24, 25]) {
        const list = Array.from({length: listLength}, (_, i) => Buffer.alloc(32, i));
        const listView = listType.toViewDU(list);

        if (loadNodes) {
          listView.getAllReadonly();
        }

        const total: Buffer[] = [];
        let start = 0;
        const count = 10;
        // this is equivalent to getAllReadonly()
        // but consumer can break in the middle to improve performance
        while (start < listLength) {
          listView.getReadonlyByRange(start, count).forEach((item) => total.push(item as Buffer));
          start += count;
        }

        expect(total.length).to.equal(listLength);
        expect(total).to.deep.equal(list);
      }
    }
  });
});
