import {bench, describe} from "@chainsafe/benchmark";
import {BitVectorType, ContainerType, UintBigintType, ValueOf} from "../../src/index.ts";

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

  bench<ValueOf<typeof TestStruct>, ValueOf<typeof TestStruct>>({
    id: "cachePermanentRootStruct no cache",
    before: () => TestStruct.defaultValue(),
    beforeEach: (value) => value,
    fn: (value) => {
      TestStruct.hashTreeRoot(value);
    },
  });

  bench<ValueOf<typeof TestStruct>, ValueOf<typeof TestStruct>>({
    id: "cachePermanentRootStruct with cache",
    before: () => TestStructCache.defaultValue(),
    beforeEach: (value) => value,
    fn: (value) => {
      TestStructCache.hashTreeRoot(value);
    },
  });
});
