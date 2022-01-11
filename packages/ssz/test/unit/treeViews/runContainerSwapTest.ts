import {Type, ValueOf, TreeView} from "../../../src/v2/abstract";
import {ContainerType} from "../../../src/v2";
import {runTreeViewTest} from "./runTreeViewTest";

const runTreeViewContainerSwapTestFn = function runTreeViewContainerSwapTest<T extends Type<unknown>>(
  propertyType: T,
  value1: ValueOf<T>,
  value2: ValueOf<T>,
  opts?: {only?: boolean; skip?: boolean}
): void {
  const containerUintsType = new ContainerType({
    a: propertyType,
    b: propertyType,
  });

  runTreeViewTest(
    {
      typeName: `Container(${propertyType.constructor.name})`,
      type: containerUintsType,
      treeViewToStruct: (tv) => {
        const a = tv.a;
        const b = tv.b;
        return {
          a: (a instanceof TreeView ? a.toValue() : a) as ValueOf<T>,
          b: (b instanceof TreeView ? b.toValue() : b) as ValueOf<T>,
        };
      },
      mutations: [
        {
          id: "Swap properties",
          valueBefore: {a: value1, b: value2},
          valueAfter: {a: value2, b: value1},
          fn: (tv) => {
            const a = tv.a;
            tv.a = tv.b;
            tv.b = a;
          },
        },
      ],
    },
    opts
  );
};

type RunTreeViewContainerSwapTest = typeof runTreeViewContainerSwapTestFn & {
  only: typeof runTreeViewContainerSwapTestFn;
  skip: typeof runTreeViewContainerSwapTestFn;
};

export const runTreeViewContainerSwapTest = runTreeViewContainerSwapTestFn as RunTreeViewContainerSwapTest;

runTreeViewContainerSwapTest.only = function runTreeViewTest(arg1, arg2, arg3, opts = {}): void {
  opts.only = true;
  runTreeViewContainerSwapTestFn(arg1, arg2, arg3, opts);
} as typeof runTreeViewContainerSwapTestFn;

runTreeViewContainerSwapTest.skip = function runTreeViewTest(arg1, arg2, arg3, opts = {}): void {
  opts.skip = true;
  runTreeViewContainerSwapTestFn(arg1, arg2, arg3, opts);
} as typeof runTreeViewContainerSwapTestFn;
