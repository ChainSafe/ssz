import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {BigIntUintType, BitListType, CompositeType, CompositeValue, ContainerType, ListType} from "../../src";

describe("SSZ (de)serialize", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 10 * 1000,
    runs: 1000,
  });

  const Gwei = new BigIntUintType({byteLength: 8});

  type TestCase<T extends CompositeValue> = {
    id: string;
    type: CompositeType<T>;
    getValue?: () => T;
  };

  function getBigListTestCase(arrLen: number): TestCase<bigint[]> {
    return {
      id: `List(BigInt) ${arrLen}`,
      type: new ListType({elementType: Gwei, limit: arrLen}),
      getValue: () => Array.from({length: arrLen}, () => BigInt(31217089836)),
    };
  }

  const testCases: TestCase<any>[] = [
    {
      id: "Simple object",
      type: new ContainerType({
        fields: {a: Gwei, b: Gwei, c: Gwei},
      }),
    },
    {
      id: "aggregationBits",
      type: new BitListType({limit: 2048}),
      getValue: () => Array.from({length: 128}, () => true),
    },

    getBigListTestCase(1e3),
    getBigListTestCase(1e4),
    getBigListTestCase(1e5),
  ];

  for (const {id, type, getValue} of testCases) {
    const struct = getValue ? getValue() : type.defaultValue();
    const binary = type.serialize(struct);
    const treeBacked = type.createTreeBackedFromStruct(struct);

    itBench(`${id} binary -> struct`, () => {
      type.struct_deserialize(binary);
    });

    itBench(`${id} binary -> tree_backed`, () => {
      type.tree_deserialize(binary);
    });

    itBench(`${id} struct -> tree_backed`, () => {
      type.struct_convertToTree(struct);
    });

    itBench(`${id} tree_backed -> struct`, () => {
      type.tree_convertToStruct(treeBacked.tree);
    });

    itBench(`${id} struct -> binary`, () => {
      type.serialize(struct);
    });

    itBench(`${id} tree_backed -> binary`, () => {
      type.serialize(treeBacked);
    });
  }
});
