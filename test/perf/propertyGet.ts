import {NumberUintType, ContainerType, VectorType, CompositeType} from "../../src";
import {BenchmarkRunner} from "./utils/runner";

const runner = new BenchmarkRunner("SSZ get property");

const Gwei = new NumberUintType({byteLength: 8});
const Vec = new VectorType({elementType: Gwei, length: 1e5});

const testCases: {id: string; type: CompositeType<any>}[] = [
  {
    id: "Container {a,b,vec}",
    type: new ContainerType<{a: number; b: number; vec: number[]}>({
      fields: {a: Gwei, b: Gwei, vec: Vec},
    }),
  },
  // Put a Vector in the middle to test having a bigger tree to traverse
  {
    id: "Container {a,vec,b}",
    type: new ContainerType<{a: number; vec: number[]; b: number}>({
      fields: {a: Gwei, vec: Vec, b: Gwei},
    }),
  },
];

for (const {id, type} of testCases) {
  const stateStruct = type.defaultValue();
  stateStruct.b = 1400;
  const stateTree = type.createTreeBackedFromStruct(stateStruct);

  const runnerGroup = runner.group();
  runnerGroup.run({
    id: `${id} - as struct`,
    run: () => {
      stateStruct.b;
    },
  });

  runnerGroup.run({
    id: `${id} - as tree_backed`,
    run: () => {
      stateTree.b;
    },
  });
}

runner.done();
