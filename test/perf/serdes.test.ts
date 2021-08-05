import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {
  BigIntUintType,
  BitListType,
  ByteVectorType,
  CompositeType,
  ContainerType,
  NumberUintType,
  ListType,
} from "../../src";

describe("SSZ (de)serialize", () => {
  setBenchOpts({
    maxMs: 60 * 1000,
    minMs: 1 * 1000,
    runs: 1024,
  });

  const Gwei = new BigIntUintType({byteLength: 8});
  const Pubkey = new ByteVectorType({length: 96});
  const Bytes32 = new ByteVectorType({length: 32});
  const Uint64 = new BigIntUintType({byteLength: 8});
  const Num64 = new NumberUintType({byteLength: 8});

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

  // Raw transformations

  const uint = 123642;

  for (const uint of [15, 150_000, 15_000_000]) {
    itBench(`Uint8 -> bytes ${uint} - writeInt32LE`, () => {
      const buf = Buffer.alloc(32, 0);
      buf.writeInt32LE(uint, 0);
    });

    itBench(`Uint8 -> bytes ${uint} - Num64.serialize`, () => {
      Num64.serialize(uint);
    });
  }

  const testCases: TestCase<any>[] = [
    // {
    //   id: "Simple object",
    //   type: new ContainerType({
    //     fields: {a: Gwei, b: Gwei, c: Gwei},
    //   }),
    // },
    // {
    //   id: "aggregationBits",
    //   type: new BitListType({limit: 2048}),
    //   getValue: () => Array.from({length: 128}, () => true),
    // },
    {
      id: "Validator",
      type: new ContainerType<Validator>({
        fields: {
          pubkey: Pubkey,
          withdrawalCredentials: Bytes32,
          effectiveBalance: Uint64,
          activationEligibilityEpoch: Uint64,
          activationEpoch: Uint64,
          exitEpoch: Uint64,
          withdrawableEpoch: Uint64,
        },
      }),
      getValue: () => ({
        pubkey: Buffer.alloc(96, 8),
        withdrawalCredentials: Buffer.alloc(32, 9),
        effectiveBalance: BigInt(1),
        activationEligibilityEpoch: BigInt(2),
        activationEpoch: BigInt(3),
        exitEpoch: BigInt(4),
        withdrawableEpoch: BigInt(5),
      }),
    },

    // getBigListTestCase(1e3),
    // getBigListTestCase(1e4),
    // getBigListTestCase(1e5),
  ];

  for (const {id, type, getValue} of testCases) {
    const struct = getValue ? getValue() : type.defaultValue();
    const binary = type.serialize(struct);
    const treeBacked = type.createTreeBackedFromStruct(struct);

    // itBench(`${id} binary -> struct`, () => {
    //   type.struct_deserialize(binary);
    // });

    // itBench(`${id} binary -> tree_backed`, () => {
    //   type.tree_deserialize(binary);
    // });

    itBench(`${id} struct -> tree_backed`, () => {
      type.struct_convertToTree(struct);
    });

    itBench(`${id} tree_backed -> struct`, () => {
      type.tree_convertToStruct(treeBacked.tree);
    });

    // itBench(`${id} struct -> binary`, () => {
    //   type.serialize(struct);
    // });

    // itBench(`${id} tree_backed -> binary`, () => {
    //   type.serialize(treeBacked);
    // });
  }
});

interface Validator {
  pubkey: Uint8Array;
  withdrawalCredentials: Uint8Array;
  effectiveBalance: bigint;
  activationEligibilityEpoch: bigint;
  activationEpoch: bigint;
  exitEpoch: bigint;
  withdrawableEpoch: bigint;
}
