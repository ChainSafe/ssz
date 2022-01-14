import {expect} from "chai";
import {describe, it} from "mocha";
import {
  ContainerType,
  ContainerNodeStructType,
  toHexString,
  ListCompositeType,
  ValueOf,
  CompositeViewDU,
} from "../../src";
import {Validator as ValidatorDef} from "../lodestarTypes/phase0/sszTypes";

describe("Container with BranchNodeStruct", function () {
  this.timeout(0);

  type Validator = ValueOf<typeof ValidatorDef>;

  const fields = ValidatorDef.fields;
  const ValidatorType = new ContainerType(fields);
  const ValidatorNodeStructTypeType = new ContainerNodeStructType(fields);

  const validator: Validator = {
    pubkey: Buffer.alloc(48, 0xaa),
    withdrawalCredentials: Buffer.alloc(32, 0xbb),
    effectiveBalance: 32e9,
    slashed: false,
    activationEligibilityEpoch: 1_000_000,
    activationEpoch: 2_000_000,
    exitEpoch: 3_000_000,
    withdrawableEpoch: 4_000_000,
  };

  const validatorViewDU = ValidatorType.toViewDU(validator);
  const validatorNodeStructViewDU = ValidatorNodeStructTypeType.toViewDU(validator);

  const ops: Record<string, (treeBacked: CompositeViewDU<typeof ValidatorDef>, type: typeof ValidatorDef) => unknown> =
    {
      getExitEpoch: (treeBacked) => treeBacked.exitEpoch,
      getPubkey: (treeBacked) => toHexString(treeBacked.pubkey),
      hashTreeRoot: (treeBacked) => treeBacked.hashTreeRoot(),
      // TODO: @wemeetagain
      // getProof: (treeBacked) => treeBacked.createProof([["exitEpoch"]]),
      serialize: (treeBacked) => treeBacked.serialize(),
    };

  for (const [id, op] of Object.entries(ops)) {
    let res: unknown;
    let resLeafNodeStruct: unknown;

    it(`${id} TreeBacked`, () => {
      res = op(validatorViewDU, ValidatorType);
    });

    it(`${id} ContainerLeafNodeStructType`, () => {
      resLeafNodeStruct = op(validatorNodeStructViewDU, ValidatorNodeStructTypeType);
    });

    it(`${id} must equal`, function () {
      if (res === undefined || resLeafNodeStruct === undefined) this.skip();
      expect(res).to.deep.equal(resLeafNodeStruct);
    });
  }

  describe("ValidatorNodeStructTypeType in List", () => {
    const VALIDATOR_REGISTRY_LIMIT = 1099511627776;
    const ValidtorsListType = new ListCompositeType(ValidatorNodeStructTypeType, VALIDATOR_REGISTRY_LIMIT);

    it("edit then read", () => {
      const validatorListTB = ValidtorsListType.toViewDU(ValidtorsListType.defaultValue);
      for (let i = 0; i < 10; i++) {
        const validator_ = {...validator, withdrawableEpoch: i};
        validatorListTB.push(ValidatorNodeStructTypeType.toViewDU(validator_));
      }

      expect(validatorListTB.get(3).withdrawableEpoch).to.equal(3, "Wrong [3] value before mutating");
      expect(validatorListTB.get(4).withdrawableEpoch).to.equal(4, "Wrong [3] value before mutating");
      validatorListTB.get(3).withdrawableEpoch = 33;
      validatorListTB.get(4).withdrawableEpoch = 44;
      expect(validatorListTB.get(3).withdrawableEpoch).to.equal(33, "Wrong [3] value after mutating");
      expect(validatorListTB.get(4).withdrawableEpoch).to.equal(44, "Wrong [4] value after mutating");
    });

    it("readonlyValuesListOfLeafNodeStruct", () => {
      const validatorListTB = ValidtorsListType.toViewDU(ValidtorsListType.defaultValue);
      const validatorsFlat: Validator[] = [];
      for (let i = 0; i < 10; i++) {
        const validator_ = {...validator, withdrawableEpoch: i};
        validatorsFlat.push(validator_);
        validatorListTB.push(ValidatorNodeStructTypeType.toViewDU(validator_));
      }

      // MUST commit to persist the view to nodes before doing a getAllReadonlyValues()
      validatorListTB.commit();

      expect(validatorListTB.getAllReadonlyValues()).to.deep.equal(validatorsFlat);
    });

    it("return each property as struct backed", () => {
      const validatorListTB = ValidtorsListType.toViewDU(ValidtorsListType.defaultValue);
      validatorListTB.push(ValidatorNodeStructTypeType.toViewDU(validator));
      for (const key of Object.keys(validator) as (keyof typeof validator)[]) {
        expect(validatorListTB.get(0)[key].valueOf()).to.deep.equal(validator[key], `wrong ${key} value`);
      }
    });

    it("validator.toValue()", () => {
      const validatorListTB = ValidtorsListType.toViewDU(ValidtorsListType.defaultValue);
      validatorListTB.push(ValidatorNodeStructTypeType.toViewDU(validator));
      expect(validatorListTB.get(0).toValue()).to.deep.equal(validator);
    });
  });
});
