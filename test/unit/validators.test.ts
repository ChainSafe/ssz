import {VALIDATOR_REGISTRY_LIMIT} from "@chainsafe/lodestar-params";
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
  ListType,
  readonlyValuesListOfLeafNodeStruct,
  List,
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

  describe("ValidatorLeafNodeStructType in List", () => {
    const ValidtorsListType = new ListType<List<Validator>>({
      elementType: ValidatorLeafNodeStructType,
      limit: VALIDATOR_REGISTRY_LIMIT,
    });

    it("edit then read", () => {
      const validatorListTB = ValidtorsListType.defaultTreeBacked();
      for (let i = 0; i < 10; i++) {
        const validator_ = {...validator, withdrawableEpoch: i};
        validatorListTB.push(validator_);
      }

      expect(validatorListTB[3].withdrawableEpoch).to.equal(3, "Wrong [3] value before mutating");
      expect(validatorListTB[4].withdrawableEpoch).to.equal(4, "Wrong [3] value before mutating");
      validatorListTB[3].withdrawableEpoch = 33;
      validatorListTB[4].withdrawableEpoch = 44;
      expect(validatorListTB[3].withdrawableEpoch).to.equal(33, "Wrong [3] value after mutating");
      expect(validatorListTB[4].withdrawableEpoch).to.equal(44, "Wrong [4] value after mutating");
    });

    it("readonlyValuesListOfLeafNodeStruct", () => {
      const validatorListTB = ValidtorsListType.defaultTreeBacked();
      const validatorsFlat: Validator[] = [];
      for (let i = 0; i < 10; i++) {
        const validator_ = {...validator, withdrawableEpoch: i};
        validatorsFlat.push(validator_);
        validatorListTB.push(validator_);
      }

      expect(readonlyValuesListOfLeafNodeStruct(validatorListTB)).to.deep.equal(validatorsFlat);
    });

    it("return each property as struct backed", () => {
      const validatorListTB = ValidtorsListType.defaultTreeBacked();
      validatorListTB.push(validator);
      for (const key of Object.keys(validator) as (keyof typeof validator)[]) {
        expect(validatorListTB[0][key].valueOf()).to.deep.equal(validator[key], `wrong ${key} value`);
      }
    });
  });
});
