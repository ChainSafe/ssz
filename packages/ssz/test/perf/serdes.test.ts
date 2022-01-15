import {itBench} from "@dapplion/benchmark";
import {
  UintBigintType,
  BitListType,
  CompositeType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  VectorCompositeType,
  ValueOf,
  TreeView,
  TreeViewDU,
  BitArray,
  UintNumberType,
  ByteVectorType,
  ContainerNodeStructType,
} from "../../src";
import {Validator} from "../lodestarTypes/phase0/sszTypes";

describe("SSZ (de)serialize", () => {
  const uint8 = new UintNumberType(1);
  const uint64Number = new UintNumberType(8);
  const Uint64Bigint = new UintBigintType(8);
  const Root = new ByteVectorType(32);

  runTestCase("Simple object", new ContainerType({a: Uint64Bigint, b: Uint64Bigint, c: Uint64Bigint}));
  runTestCase(
    "aggregationBits",
    new BitListType(2048),
    () => new BitArray(new Uint8Array(Buffer.alloc(128 / 8, 0xff)), 128)
  );

  for (const arrLen of [100_000]) {
    runTestCase(`List(uint8) ${arrLen}`, new ListBasicType(uint8, arrLen), () => fillArray(arrLen, 7));

    runTestCase(`List(uint64Number) ${arrLen}`, new ListBasicType(uint64Number, arrLen), () =>
      fillArray(arrLen, 31217089836)
    );

    runTestCase(`List(Uint64Bigint) ${arrLen}`, new ListBasicType(Uint64Bigint, arrLen), () =>
      fillArray(arrLen, BigInt(31217089836))
    );

    runTestCase(`Vector(Root) ${arrLen}`, new VectorCompositeType(Root, arrLen), () =>
      fillArray(arrLen, uint8ArrayFill(32, 0xaa))
    );

    // ✓ List(Validator) 100000 binary -> struct                             9.366237 ops/s    106.7665 ms/op   x0.121         12 runs   1.81 s
    // ✓ List(Validator) 100000 binary -> tree_backed                        2.660476 ops/s    375.8727 ms/op   x0.416         38 runs   15.4 s
    // ✓ List(Validator) 100000 struct -> binary                             37.25235 ops/s    26.84394 ms/op   x0.157         17 runs  0.974 s
    // ✓ List(Validator) 100000 tree_backed -> binary                        8.274093 ops/s    120.8592 ms/op   x0.663        204 runs   25.2 s
    //
    //
    // For binary -> struct:
    // - 54% of time is spent on garbage collector.
    //   Removing the ByteVector uint8Array.slice() step, time is reduced by x2 and time in of GC to 32%
    // - 10% spent on slice uint8Array. However it causes a lot of GC so uint8Array.slice accounts for > 60%
    //
    // binary -> tree_backed:
    // - subtreeFillToContents of each object takes most of the time
    //
    // struct -> binary:
    // - ???
    //
    // For tree_backed -> binary:
    // - 25% of the time spent traversing the Validator object with getNodesAtDepth
    const ValidatorContainer = new ContainerType(Validator.fields, Validator.opts);
    runTestCase(`List(Validator) ${arrLen}`, new ListCompositeType(ValidatorContainer, arrLen), () =>
      fillArray(arrLen, {
        pubkey: uint8ArrayFill(48, 0xaa),
        withdrawalCredentials: uint8ArrayFill(32, 0xaa),
        effectiveBalance: 32e9,
        slashed: false,
        activationEligibilityEpoch: 1e6,
        activationEpoch: 2e6,
        exitEpoch: 3e6,
        withdrawableEpoch: 4e6,
      })
    );

    const ValidatorNodeStruct = new ContainerNodeStructType(Validator.fields, Validator.opts);
    runTestCase(`List(Validator-NS) ${arrLen}`, new ListCompositeType(ValidatorNodeStruct, arrLen), () =>
      fillArray(arrLen, {
        pubkey: uint8ArrayFill(48, 0xaa),
        withdrawalCredentials: uint8ArrayFill(32, 0xaa),
        effectiveBalance: 32e9,
        slashed: false,
        activationEligibilityEpoch: 1e6,
        activationEpoch: 2e6,
        exitEpoch: 3e6,
        withdrawableEpoch: 4e6,
      })
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

    // Don't track struct <-> tree_backed conversions since they are not required to be fast
    itBench({id: `${id} struct -> tree_backed`, noThreshold: true}, () => {
      type.toView(struct);
    });
    itBench({id: `${id} tree_backed -> struct`, noThreshold: true}, () => {
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

function fillArray<T>(len: number, value: T): T[] {
  const values: T[] = [];
  for (let i = 0; i < len; i++) {
    values.push(value);
  }
  return values;
}

function uint8ArrayFill(byteLen: number, fill: number): Uint8Array {
  const uint8Array = new Uint8Array(byteLen);
  for (let i = 0; i < byteLen; i++) {
    uint8Array[i] = fill;
  }
  return uint8Array;
}
