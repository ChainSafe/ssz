import {ListBasicType, UintNumberType} from "../../../../src";
import {runViewTestMutation, TreeMutation} from "../runViewTestMutation";

const limit = 100;
const ListN64Uint64NumberType = new ListBasicType(new UintNumberType(8, true), limit);

runViewTestMutation({
  type: new ListBasicType(new UintNumberType(8, true), limit),
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
      // push 2 times to increase depth and test the expand functionality
      id: "push basic x2",
      valueBefore: [],
      valueAfter: [1, 2],
      fn: (tv) => {
        tv.push(1);
        tv.push(2);
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

const deltaValues = [1_000_000_000_000, 999, 0, -1_000_000];
const initBalance = 31217089836; // Must be greater than the negative delta

runViewTestMutation({
  type: ListN64Uint64NumberType,
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
        fn: (tv) => {
          const values = tv.getAll();
          for (let i = 0; i < values.length; i++) {
            values[i] += deltasByIdx[i];
          }
          return ListN64Uint64NumberType.toViewDU(values);
        },
      };
    }),
  ],
});
