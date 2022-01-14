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
  BitArray,
  UintNumberType,
} from "../../src";

describe("SSZ (de)serialize", () => {
  const Gwei = new UintBigintType(8);
  const uint64 = new UintNumberType(8);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runTestCase("Simple object", new ContainerType({a: Gwei, b: Gwei, c: Gwei}));
  runTestCase(
    "aggregationBits",
    new BitListType(2048),
    () => new BitArray(new Uint8Array(Buffer.alloc(128 / 8, 0xff)), 128)
  );

  for (const arrLen of [1e3, 1e4, 1e5]) {
    runTestCase(`List(BigInt) ${arrLen}`, new ListBasicType(Gwei, arrLen), () =>
      Array.from({length: arrLen}, () => BigInt(31217089836))
    );

    runTestCase(`List(Number) ${arrLen}`, new ListBasicType(uint64, arrLen), () =>
      Array.from({length: arrLen}, () => 31217089836)
    );
  }

  function runTestCase<T extends CompositeType<unknown, TreeView<any>, TreeViewDU<any>>>(
    id: string,
    type: T,
    getValue?: () => ValueOf<T>
  ): void {
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
