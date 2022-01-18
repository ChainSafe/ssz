import {itBench} from "@dapplion/benchmark";
import {
  BigIntUintType,
  NumberUintType,
  Number64UintType,
  BitListType,
  CompositeType,
  ContainerType,
  BasicListType,
  CompositeListType,
  CompositeVectorType,
  ByteVectorType,
  ContainerLeafNodeStructType,
} from "../../src";
import {Validator} from "../lodestarTypes/phase0/sszTypes";

describe("SSZ (de)serialize", () => {
  const uint8 = new NumberUintType({byteLength: 1});
  const uint64Number = new Number64UintType();
  const Uint64Bigint = new BigIntUintType({byteLength: 8});
  const Root = new ByteVectorType({length: 32});

  runTestCase("Simple object", new ContainerType({fields: {a: Uint64Bigint, b: Uint64Bigint, c: Uint64Bigint}}));
  runTestCase("aggregationBits", new BitListType({limit: 2048}), () => fillArray(128, true));

  for (const arrLen of [100_000]) {
    runTestCase(`List(uint8) ${arrLen}`, new BasicListType({elementType: uint8, limit: arrLen}), () =>
      fillArray(arrLen, 7)
    );

    runTestCase(`List(uint64Number) ${arrLen}`, new BasicListType({elementType: uint64Number, limit: arrLen}), () =>
      fillArray(arrLen, 31217089836)
    );

    runTestCase(`List(Uint64Bigint) ${arrLen}`, new BasicListType({elementType: Uint64Bigint, limit: arrLen}), () =>
      fillArray(arrLen, BigInt(31217089836))
    );

    runTestCase(`Vector(Root) ${arrLen}`, new CompositeVectorType({elementType: Root, length: arrLen}), () =>
      fillArray(arrLen, uint8ArrayFill(32, 0xaa))
    );

    const ValidatorContainer = new ContainerType({fields: Validator.fields});
    runTestCase(
      `List(Validator) ${arrLen}`,
      new CompositeListType({elementType: ValidatorContainer, limit: arrLen}),
      () =>
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

    const ValidatorNodeStruct = new ContainerLeafNodeStructType({fields: Validator.fields});
    runTestCase(
      `List(Validator-NS) ${arrLen}`,
      new CompositeListType({elementType: ValidatorNodeStruct, limit: arrLen}),
      () =>
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

  function runTestCase<T extends CompositeType<any>>(
    id: string,
    type: T,
    getValue?: () => T extends CompositeType<infer V> ? V : never
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const struct = getValue ? getValue() : type.defaultValue();
    const bytes = type.serialize(struct);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const view = type.struct_convertToTree(struct);

    itBench(`${id} binary -> struct`, () => {
      type.deserialize(bytes);
    });

    itBench(`${id} binary -> tree_backed`, () => {
      type.createTreeBackedFromBytes(bytes);
    });

    // Don't track struct <-> tree_backed conversions since they are not required to be fast
    itBench({id: `${id} struct -> tree_backed`, noThreshold: true}, () => {
      type.struct_convertToTree(struct);
    });
    itBench({id: `${id} tree_backed -> struct`, noThreshold: true}, () => {
      type.createTreeBackedFromStruct(struct);
    });

    itBench(`${id} struct -> binary`, () => {
      type.serialize(struct);
    });

    itBench(`${id} tree_backed -> binary`, () => {
      const output = new Uint8Array(type.tree_getSerializedLength(view));
      return type.tree_serializeToBytes(view, output, 0);
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
