import {itBench} from "@dapplion/benchmark";
import {BitVectorType, ContainerType, UintBigintType} from "../../src";

describe("cachePermanentRootStruct", () => {
  const uint64 = new UintBigintType(8);
  const TestStruct = new ContainerType({
    a: new BitVectorType(1024),
    b: uint64,
    c: uint64,
    d: uint64,
  });

  const TestStructCache = new ContainerType(
    {
      a: new BitVectorType(1024),
      b: uint64,
      c: uint64,
      d: uint64,
    },
    {cachePermanentRootStruct: true}
  );

  itBench<typeof TestStruct.defaultValue, typeof TestStruct.defaultValue>({
    id: "cachePermanentRootStruct no cache",
    before: () => TestStruct.defaultValue,
    beforeEach: (value) => value,
    fn: (value) => {
      TestStruct.hashTreeRoot(value);
    },
  });

  itBench<typeof TestStruct.defaultValue, typeof TestStruct.defaultValue>({
    id: "cachePermanentRootStruct with cache",
    before: () => TestStructCache.defaultValue,
    beforeEach: (value) => value,
    fn: (value) => {
      TestStructCache.hashTreeRoot(value);
    },
  });
});
