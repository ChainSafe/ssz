import {expect} from "chai";
import {ListBasicType, toHexString, UintNumberType} from "../../../../src";
import type {TreeMutation} from "../runViewTestMutation";
import {runViewTestMutation} from "../runViewTestMutation";
import {ListUintNum64Type} from "../../../../src/type/listUintNum64";

const limit = 100;
const uint64NumInf = new UintNumberType(8, {clipInfinity: true});
const ListN64Uint64NumberType = new ListBasicType(uint64NumInf, limit);
const ListUintNum64 = new ListUintNum64Type(limit);

for (const listBasicUintType of [
  ListN64Uint64NumberType,
  new ListBasicType(new UintNumberType(8), limit),
  new ListBasicType(new UintNumberType(1), limit),
  ListUintNum64,
]) {
  runViewTestMutation({
    type: listBasicUintType,
    mutations: [
      {
        id: "push basic",
        valueBefore: [],
        valueAfter: [100],
        fn: (tv) => {
          tv.push(100);
        },
      },
      {
        // push 5 times to increase depth and create 2 new nodes (uint64, 4 items per chunk)
        id: "push basic x5",
        valueBefore: [],
        valueAfter: [1, 2, 3, 4, 5],
        assertFn: (tv) => expect(tv.length).equals(5, "Wrong length"),
        fn: (tv) => {
          for (let i = 1; i <= 5; i++) {
            tv.push(i);
          }
        },
      },
      {
        id: "set basic",
        valueBefore: [1, 2],
        valueAfter: [1, 20],
        fn: (tv) => {
          tv.set(1, 20);
        },
      },
      {
        id: "set basic x2",
        valueBefore: [1, 2],
        valueAfter: [10, 20],
        fn: (tv) => {
          tv.set(0, 10);
          tv.set(1, 20);
        },
      },
      {
        id: "swap two indexes",
        valueBefore: [10, 20],
        valueAfter: [20, 10],
        fn: (tv) => {
          const i0 = tv.get(0);
          const i1 = tv.get(1);
          tv.set(0, i1);
          tv.set(1, i0);
        },
      },
    ],
  });
}

runViewTestMutation({
  type: new ListBasicType(new UintNumberType(1, {setBitwiseOR: true}), limit),
  mutations: [
    {
      // push 5 times to increase depth and create 2 new nodes (uint64, 4 items per chunk)
      id: "push basic x5",
      valueBefore: [],
      valueAfter: [1, 2, 3, 4, 5],
      fn: (tv) => {
        for (let i = 1; i <= 5; i++) {
          tv.push(i);
        }
      },
    },
    {
      id: "set basic x2",
      valueBefore: [0b1000, 0b0100],
      valueAfter: [0b1010, 0b0101],
      fn: (tv) => {
        tv.set(0, 0b0010);
        tv.set(1, 0b0001);
      },
    },
  ],
});

const deltaValues = [1_000_000_000_000, 999, 0, -1_000_000];
const initBalance = 31217089836; // Must be greater than the negative delta

for (const listBasicUintType of [ListN64Uint64NumberType, ListUintNum64]) {
  runViewTestMutation({
    type: listBasicUintType,
    mutations: [
      // For each delta test mutating a single item of a List
      ...deltaValues.map((delta): TreeMutation<typeof ListN64Uint64NumberType> => {
        const valueBefore = Array.from({length: limit}, () => initBalance);
        const valueAfter = [...valueBefore];
        const i = Math.floor(limit / 2); // Mutate the middle value
        valueAfter[i] = valueBefore[i] + delta;

        return {
          id: `applyDeltaAtIndex ${delta}`,
          valueBefore,
          valueAfter,
          fn: (tv) => {
            tv.set(i, tv.get(i) + delta);
          },
        };
      }),

      // For each delta test mutating half of the List items in batch
      ...deltaValues.map((delta): TreeMutation<typeof ListN64Uint64NumberType> => {
        const valueBefore = Array.from({length: limit}, () => initBalance);
        const valueAfter = [...valueBefore];

        // same operation for BalancesList64 using tree_applyDeltaInBatch
        const deltaByIndex = new Map<number, number>();
        // `i += 2` to only apply the delta to half the values
        for (let i = 0; i < limit; i += 2) {
          valueAfter[i] += delta;
          deltaByIndex.set(i, delta);
        }

        return {
          id: `applyDeltaInBatch ${delta}`,
          valueBefore,
          valueAfter,
          fn: (tv) => {
            for (const [i, _delta] of deltaByIndex) {
              tv.set(i, tv.get(i) + _delta);
            }
          },
        };
      }),

      // For each delta create a new tree applying half of the List items in batch
      // Since the tree is re-created `fn()` returns a new tree that is used to compare `valueAfter`
      ...deltaValues.map((delta): TreeMutation<typeof ListN64Uint64NumberType> => {
        const valueBefore = Array.from({length: limit}, () => initBalance);
        const valueAfter: number[] = [];
        const deltasByIdx: number[] = [];

        for (let i = 0; i < limit; i++) {
          // `i % 2 === 0` to only apply the delta to half the values
          const d = i % 2 === 0 ? delta : 0;
          valueAfter[i] = valueBefore[i] + d;
          deltasByIdx[i] = d;
        }

        return {
          id: `newTreeFromDeltas ${delta}`,
          valueBefore,
          valueAfter,
          // Skip since the returned viewDU is already committed, can't drop changes
          skipCloneMutabilityViewDU: true,
          fn: (tv) => {
            const values = tv.getAll();
            for (let i = 0; i < values.length; i++) {
              values[i] += deltasByIdx[i];
            }
            return ListN64Uint64NumberType.toViewDU(values as number[]);
          },
        };
      }),
    ],
  });
}

describe("ListBasicType tree reads", () => {
  for (const [id, view] of Object.entries({
    view: ListN64Uint64NumberType.defaultView(),
    viewDU: ListN64Uint64NumberType.defaultViewDU(),
  })) {
    it(`ListN64Uint64NumberType ${id} .getAll`, () => {
      const values: number[] = [];

      for (let i = 0; i < view.type.limit; i++) {
        view.push(i);
        values.push(i);
      }

      expect(() => view.push(0)).to.throw("Error pushing over limit");
      expect(() => view.set(view.type.limit, 0)).to.throw("Error setting index over length");

      for (let i = 0; i < view.type.limit; i++) {
        expect(view.get(i)).equals(values[i], `Wrong get(${i})`);
      }

      expect(view.getAll()).deep.equals(values, "Wrong getAll()");
    });
  }
});

describe("ListBasicType drop caches", () => {
  it("Make some changes then get previous value", () => {
    const view = ListN64Uint64NumberType.defaultViewDU();
    const bytesBefore = toHexString(view.serialize());

    // Make changes to view and clone them to new view
    view.push(1);
    view.clone();

    const bytesAfter = toHexString(view.serialize());
    expect(bytesAfter).to.equal(bytesBefore, "view retained changes");
  });
});

describe("ListBasicType.sliceTo", () => {
  // same to BeaconState inactivityScores and previousEpochParticipation
  for (const elementType of [new UintNumberType(8), new UintNumberType(1, {setBitwiseOR: true})]) {
    it(`Slice list of ${elementType.typeName} at multiple length`, () => {
      const listType = new ListBasicType(elementType, 100);
      const listView = listType.defaultViewDU();
      const listRoots: string[] = [];
      const listSerialized: string[] = [];

      for (let i = 0; i < 16; i++) {
        listView.push(i);
        listSerialized[i] = toHexString(listView.serialize());
        listRoots[i] = toHexString(listView.hashTreeRoot());
      }

      for (let i = 0; i < 16; i++) {
        const listSlice = listView.sliceTo(i);
        expect(listSlice.length).to.equal(i + 1, `Wrong length at .sliceTo(${i})`);
        expect(toHexString(listSlice.serialize())).equals(listSerialized[i], `Wrong serialize at .sliceTo(${i})`);
        expect(toHexString(listSlice.hashTreeRoot())).equals(listRoots[i], `Wrong root at .sliceTo(${i})`);
      }
    });
  }
});

describe("ListBasicType batchHashTreeRoot", function () {
  const value = [1, 2, 3, 4];
  const expectedRoot = ListN64Uint64NumberType.toView(value).hashTreeRoot();

  it("fresh ViewDU", () => {
    expect(ListN64Uint64NumberType.toViewDU(value).batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("push then batchHashTreeRoot()", () => {
    const viewDU = ListN64Uint64NumberType.defaultViewDU();
    viewDU.push(1);
    viewDU.push(2);
    viewDU.push(3);
    viewDU.push(4);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign the same value again, commit() then batchHashTreeRoot()
    viewDU.set(0, 1);
    viewDU.set(1, 2);
    viewDU.set(2, 3);
    viewDU.set(3, 4);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("push then modify then batchHashTreeRoot()", () => {
    const viewDU = ListN64Uint64NumberType.defaultViewDU();
    viewDU.push(1);
    viewDU.push(2);
    viewDU.push(3);
    viewDU.push(44);
    viewDU.set(3, 4);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign the same value again, commit() then batchHashTreeRoot()
    viewDU.set(3, 44);
    viewDU.set(3, 4);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  it("full hash then modify", () => {
    const viewDU = ListN64Uint64NumberType.defaultViewDU();
    viewDU.push(1);
    viewDU.push(2);
    viewDU.push(33);
    viewDU.push(44);
    viewDU.batchHashTreeRoot();
    viewDU.set(2, 3);
    viewDU.set(3, 4);
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);

    // assign the same value again, commit() then batchHashTreeRoot()
    viewDU.set(2, 33);
    viewDU.set(3, 44);
    viewDU.commit();
    viewDU.set(2, 3);
    viewDU.set(3, 4);
    viewDU.commit();
    expect(viewDU.batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });

  // similar to a fresh ViewDU but it's good to test
  it("sliceTo()", () => {
    const viewDU = ListN64Uint64NumberType.defaultViewDU();
    viewDU.push(1);
    viewDU.push(2);
    viewDU.push(3);
    viewDU.push(4);
    viewDU.push(5);
    viewDU.batchHashTreeRoot();
    expect(viewDU.sliceTo(3).batchHashTreeRoot()).to.be.deep.equal(expectedRoot);
  });
});
