import {itBench} from "@dapplion/benchmark";
import {
  UintBigintType,
  BitListType,
  CompositeType,
  ContainerType,
  ListBasicType,
  ValueOf,
  TreeView,
  TreeViewDU,
} from "../../src";

describe("SSZ (de)serialize", () => {
  const Gwei = new UintBigintType(8);

  type TestCase<T extends CompositeType<unknown, unknown, unknown>> = {
    id: string;
    type: T;
    getValue?: () => ValueOf<T>;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function getBigListTestCase(arrLen: number) {
    return {
      id: `List(BigInt) ${arrLen}`,
      type: new ListBasicType(Gwei, arrLen),
      getValue: () => Array.from({length: arrLen}, () => BigInt(31217089836)),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testCases: TestCase<CompositeType<unknown, TreeView<any>, TreeViewDU<any>>>[] = [
    {
      id: "Simple object",
      type: new ContainerType({a: Gwei, b: Gwei, c: Gwei}),
    },
    {
      id: "aggregationBits",
      type: new BitListType(2048),
      getValue: () => Array.from({length: 128}, () => true),
    },

    getBigListTestCase(1e3),
    getBigListTestCase(1e4),
    getBigListTestCase(1e5),
  ];

  for (const {id, type, getValue} of testCases) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const struct = getValue ? getValue() : type.defaultValue;
    const bytes = type.serialize(struct);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const view = type.toView(struct);

    itBench(`${id} binary -> struct`, () => {
      type.deserialize(bytes);
    });

    itBench(`${id} binary -> tree_backed`, () => {
      type.deserializeToView(bytes);
    });

    itBench(`${id} struct -> tree_backed`, () => {
      type.toView(struct);
    });

    itBench(`${id} tree_backed -> struct`, () => {
      view.toValue();
    });

    itBench(`${id} struct -> binary`, () => {
      type.serialize(struct);
    });

    itBench(`${id} tree_backed -> binary`, () => {
      view.serialize();
    });
  }
});
