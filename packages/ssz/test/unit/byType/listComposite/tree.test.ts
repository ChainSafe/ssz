import {ContainerType, ListCompositeType, UintNumberType, ValueOf} from "../../../../src";
import {runViewTestMutation} from "../runViewTestMutation";

const uint64Type = new UintNumberType(8, true);
const containerUintsType = new ContainerType({a: uint64Type, b: uint64Type}, {typeName: "Container(uint64)"});
const listOfContainersType = new ListCompositeType(containerUintsType, 4);

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
