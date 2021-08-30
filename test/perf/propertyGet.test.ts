import {itBench} from "@dapplion/benchmark";
import {NumberUintType, ContainerType, VectorType, CompositeType} from "../../src";

describe("SSZ get property", () => {
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

  const times = 100_000;

  for (const {id, type} of testCases) {
    const stateStruct = type.defaultValue();
    stateStruct.b = 1400;
    const stateTree = type.createTreeBackedFromStruct(stateStruct);

    itBench(`${id} - as struct x${times}`, () => {
      for (let i = 0; i < times; i++) {
        stateStruct.b;
      }
    });

    itBench(`${id} - as tree x${times}`, () => {
      for (let i = 0; i < times; i++) {
        stateTree.b;
      }
    });
  }
});
