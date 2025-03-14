import {BasicType, TreeView, Type, ValueOf } from "../../../src/index.js";
import {
  ContainerType,
  ListBasicType,
  ListCompositeType,
  VectorBasicType,
  VectorCompositeType,
} from "../../../src/index.js";
import {runViewTestMutation} from "./runViewTestMutation.js";

const runViewTestCompositeSwapFn = function runViewTestCompositeSwap<T extends Type<unknown>>(
  propertyType: T,
  value1: ValueOf<T>,
  value2: ValueOf<T>,
  opts?: {only?: boolean; skip?: boolean}
): void {
  const containerType = new ContainerType(
    {a: propertyType, b: propertyType},
    {typeName: `Container(a: ${propertyType.typeName}, b: ${propertyType.typeName})`}
  );

  runViewTestMutation(
    {
      type: containerType,
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
          id: `${containerType.typeName} Swap properties`,
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

    runViewTestMutation(
      {
        type: arrayType,
        treeViewToStruct: (tv) => {
          const i0 = tv.get(0);
          const i1 = tv.get(1);
          return [
            (i0 instanceof TreeView ? i0.toValue() : i0) as ValueOf<T>,
            (i1 instanceof TreeView ? i1.toValue() : i1) as ValueOf<T>,
          ];
        },
        mutations: [
          {
            id: `${arrayType.typeName} Swap properties`,
            valueBefore: [value1, value2],
            valueAfter: [value2, value1],
            fn: (tv) => {
              const i0 = tv.get(0);
              tv.set(0, tv.get(1));
              tv.set(1, i0);
            },
          },
        ],
      },
      opts
    );
  }
};

export const runViewTestCompositeSwap = runViewTestCompositeSwapFn as typeof runViewTestCompositeSwapFn & {
  only: typeof runViewTestCompositeSwapFn;
  skip: typeof runViewTestCompositeSwapFn;
};

runViewTestCompositeSwap.only = function runViewTestMutation(arg1, arg2, arg3, opts = {}): void {
  opts.only = true;
  runViewTestCompositeSwapFn(arg1, arg2, arg3, opts);
} as typeof runViewTestCompositeSwapFn;

runViewTestCompositeSwap.skip = function runViewTestMutation(arg1, arg2, arg3, opts = {}): void {
  opts.skip = true;
  runViewTestCompositeSwapFn(arg1, arg2, arg3, opts);
} as typeof runViewTestCompositeSwapFn;
