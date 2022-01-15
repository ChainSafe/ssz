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
} from "../../src";
import {Validator} from "../lodestarTypes/phase0/sszTypes";

describe("SSZ (de)serialize", () => {
  const uint8 = new UintNumberType(1);
  const uint64Number = new UintNumberType(8);
  const Uint64Bigint = new UintBigintType(8);
  const Root = new ByteVectorType(32);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    runTestCase(`List(Validator) ${arrLen}`, new ListCompositeType(Validator, arrLen), () =>
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

    // itBench(`${id} struct -> tree_backed`, () => {
    //   type.toView(struct);
    // });

    // itBench(`${id} tree_backed -> struct`, () => {
    //   view.toValue();
    // });

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
