import {Type, ValueOf, TreeView, BasicType} from "../../../src/v2/abstract";
import {ContainerType, ListBasicType, ListCompositeType, VectorBasicType, VectorCompositeType} from "../../../src/v2";
import {runTreeViewTest} from "./runTreeViewTest";

const runTreeViewSwapTestFn = function runTreeViewSwapTest<T extends Type<unknown>>(
  propertyType: T,
  value1: ValueOf<T>,
  value2: ValueOf<T>,
  opts?: {only?: boolean; skip?: boolean}
): void {
  const containerUintsType = new ContainerType(
    {a: propertyType, b: propertyType},
    {typeName: `Container(a: ${propertyType.typeName}, b: ${propertyType.typeName})`}
  );

  runTreeViewTest(
    {
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

  const arrayConstructors = propertyType.isBasic
    ? [
        // Comment next lines to solo List or Vector
        ListBasicType,
        VectorBasicType,
      ]
    : [
        // Comment next lines to solo List or Vector
        ListCompositeType,
        VectorCompositeType,
      ];

  for (const ArrayConstructor of arrayConstructors) {
    const arrayType = new (ArrayConstructor as unknown as typeof ListBasicType)(
      propertyType as unknown as BasicType<ValueOf<T>>,
      2
    );

    runTreeViewTest(
      {
        type: arrayType,
        treeViewToStruct: (tv) => {
          const a = tv.get(0);
          const b = tv.get(1);
          return [
            (a instanceof TreeView ? a.toValue() : a) as ValueOf<T>,
            (b instanceof TreeView ? b.toValue() : b) as ValueOf<T>,
          ];
        },
        mutations: [
          {
            id: "Swap properties",
            valueBefore: [value1, value2],
            valueAfter: [value2, value1],
            fn: (tv) => {
              const a = tv.get(0);
              tv.set(0, tv.get(1));
              tv.set(1, a);
            },
          },
        ],
      },
      opts
    );
  }
};

type RunTreeViewSwapTest = typeof runTreeViewSwapTestFn & {
  only: typeof runTreeViewSwapTestFn;
  skip: typeof runTreeViewSwapTestFn;
};

export const runTreeViewSwapTest = runTreeViewSwapTestFn as RunTreeViewSwapTest;

runTreeViewSwapTest.only = function runTreeViewTest(arg1, arg2, arg3, opts = {}): void {
  opts.only = true;
  runTreeViewSwapTestFn(arg1, arg2, arg3, opts);
} as typeof runTreeViewSwapTestFn;

runTreeViewSwapTest.skip = function runTreeViewTest(arg1, arg2, arg3, opts = {}): void {
  opts.skip = true;
  runTreeViewSwapTestFn(arg1, arg2, arg3, opts);
} as typeof runTreeViewSwapTestFn;
