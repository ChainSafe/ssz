import {describe, bench} from "@chainsafe/benchmark";
import {UintNumberType, ContainerType, VectorBasicType} from "../../src/index.js";

describe("SSZ get property", () => {
  const Gwei = new UintNumberType(8);
  const Vec = new VectorBasicType(Gwei, 1e5);

  const testCases = [
    {
      id: "Container {a,b,vec}",
      type: new ContainerType({a: Gwei, b: Gwei, vec: Vec}),
    },
    // Put a Vector in the middle to test having a bigger tree to traverse
    {
      id: "Container {a,vec,b}",
      type: new ContainerType({a: Gwei, vec: Vec, b: Gwei}),
    },
  ];

  const times = 100_000;

  for (const {id, type} of testCases) {
    const stateStruct = type.defaultValue();
    stateStruct.b = 1400;
    const stateTree = type.toViewDU(stateStruct);

    bench(`${id} - as struct x${times}`, () => {
      for (let i = 0; i < times; i++) {
        stateStruct.b;
      }
    });

    bench(`${id} - as tree x${times}`, () => {
      for (let i = 0; i < times; i++) {
        stateTree.b;
      }
    });
  }
});
