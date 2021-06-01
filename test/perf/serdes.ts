import {BigIntUintType, BitListType, CompositeType, ContainerType, ListType} from "../../src";
import {BenchmarkRunner} from "./utils/runner";

const runner = new BenchmarkRunner("SSZ (de)serialize");

const Gwei = new BigIntUintType({byteLength: 8});

type TestCase<T> = {
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

  const runnerGroup = runner.group();
  runnerGroup.run({
    id: `${id} binary -> struct`,
    run: () => {
      type.struct_deserialize(binary);
    },
  });

  runnerGroup.run({
    id: `${id} binary -> tree_backed`,
    run: () => {
      type.tree_deserialize(binary);
    },
  });

  runnerGroup.run({
    id: `${id} struct -> tree_backed`,
    run: () => {
      type.struct_convertToTree(struct);
    },
  });

  runnerGroup.run({
    id: `${id} tree_backed -> struct`,
    run: () => {
      type.tree_convertToStruct(treeBacked.tree);
    },
  });

  runnerGroup.run({
    id: `${id} struct -> binary`,
    run: () => {
      type.serialize(struct);
    },
  });

  runnerGroup.run({
    id: `${id} tree_backed -> binary`,
    run: () => {
      type.serialize(treeBacked);
    },
  });
}
