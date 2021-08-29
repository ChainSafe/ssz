import {expect} from "chai";
import {describe, it} from "mocha";
import {
  BigIntUintType,
  booleanType,
  ByteVectorType,
  ContainerType,
  ContainerLeafNodeStructType,
  NumberUintType,
  toHexString,
  TreeBacked,
} from "../../src";

describe("Container with BranchNodeStruct", function () {
  this.timeout(0);

  const Bytes48 = new ByteVectorType({length: 48});
  const Bytes32 = new ByteVectorType({length: 32});
  const Uint64 = new BigIntUintType({byteLength: 8});
  const Number64 = new NumberUintType({byteLength: 8});

  interface Validator {
    pubkey: Uint8Array;
    withdrawalCredentials: Uint8Array;
    effectiveBalance: bigint;
    slashed: boolean;
    activationEligibilityEpoch: number;
    activationEpoch: number;
    exitEpoch: number;
    withdrawableEpoch: number;
  }

  const fields = {
    pubkey: Bytes48,
    withdrawalCredentials: Bytes32,
    effectiveBalance: Uint64,
    slashed: booleanType,
    activationEligibilityEpoch: Number64,
    activationEpoch: Number64,
    exitEpoch: Number64,
    withdrawableEpoch: Number64,
  };

  const ValidatorType = new ContainerType<Validator>({fields});
  const ValidatorLeafNodeStructType = new ContainerLeafNodeStructType<Validator>({fields});

  const validator: Validator = {
    pubkey: Buffer.alloc(48, 0xaa),
    withdrawalCredentials: Buffer.alloc(32, 0xbb),
    effectiveBalance: BigInt(32e9),
    slashed: false,
    activationEligibilityEpoch: 1_000_000,
    activationEpoch: 2_000_000,
    exitEpoch: 3_000_000,
    withdrawableEpoch: 4_000_000,
  };

  const validatorTb = ValidatorType.createTreeBackedFromStruct(validator);
  const validatorTbLeafNodeStruct = ValidatorLeafNodeStructType.createTreeBackedFromStruct(validator);

  const ops: Record<string, (treeBacked: TreeBacked<Validator>, type: ContainerType<Validator>) => unknown> = {
    getExitEpoch: (treeBacked) => treeBacked.exitEpoch,
    getPubkey: (treeBacked) => toHexString(treeBacked.pubkey),
    hashTreeRoot: (treeBacked) => treeBacked.hashTreeRoot(),
    getProof: (treeBacked) => treeBacked.createProof([["exitEpoch"]]),
    serialize: (treeBacked) => treeBacked.serialize(),
  };

  for (const [id, op] of Object.entries(ops)) {
    let res: unknown;
    let resLeafNodeStruct: unknown;

    it(`${id} TreeBacked`, () => {
      res = op(validatorTb, ValidatorType);
    });

    it(`${id} ContainerLeafNodeStructType`, () => {
      resLeafNodeStruct = op(validatorTbLeafNodeStruct, ValidatorLeafNodeStructType);
    });

    it(`${id} must equal`, function () {
      if (res === undefined || resLeafNodeStruct === undefined) this.skip();
      expect(res).to.deep.equal(resLeafNodeStruct);
    });
  }
});
