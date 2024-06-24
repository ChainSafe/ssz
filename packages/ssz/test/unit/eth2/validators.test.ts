import {expect} from "chai";
import {describe, it} from "mocha";
import {toHexString, ListCompositeType, ValueOf, CompositeViewDU} from "../../../src";
import {ValidatorContainer, ValidatorNodeStruct} from "../../lodestarTypes/phase0/sszTypes";
import {HashComputationGroup} from "@chainsafe/persistent-merkle-tree";

type Validator = ValueOf<typeof ValidatorContainer>;
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

describe("Container with BranchNodeStruct", function () {
  this.timeout(0);

  const validatorViewDU = ValidatorContainer.toViewDU(validator);
  const validatorNodeStructViewDU = ValidatorNodeStruct.toViewDU(validator);

  // ContainerNodeStructType returns proofs for all the data even if only a single property is requested.
  // See ContainerNodeStructType.getPropertyGindex on why
  const validatorFieldNames = Object.keys(validator);
  const validatorProofJsonPaths = validatorFieldNames.map((fieldName) => [fieldName]);

  const ops: Record<
    string,
    (treeBacked: CompositeViewDU<typeof ValidatorContainer>, type: typeof ValidatorContainer) => unknown
  > = {
    getExitEpoch: (treeBacked) => treeBacked.exitEpoch,
    getPubkey: (treeBacked) => toHexString(treeBacked.pubkey),
    hashTreeRoot: (treeBacked) => treeBacked.hashTreeRoot(),
    getProof: (treeBacked) => treeBacked.createProof(validatorProofJsonPaths),
    serialize: (treeBacked) => treeBacked.serialize(),
  };

  for (const [id, op] of Object.entries(ops)) {
    let res: unknown;
    let resLeafNodeStruct: unknown;

    it(`${id} TreeBacked`, () => {
      res = op(validatorViewDU, ValidatorContainer);
    });

    it(`${id} ContainerNodeStructType`, () => {
      resLeafNodeStruct = op(validatorNodeStructViewDU, ValidatorNodeStruct);
    });

    it(`${id} must equal`, function () {
      if (res === undefined || resLeafNodeStruct === undefined) this.skip();
      expect(res).to.deep.equal(resLeafNodeStruct);
    });
  }

  describe("ValidatorNodeStruct in List", () => {
    const VALIDATOR_REGISTRY_LIMIT = 1099511627776;
    const ValidatorsListType = new ListCompositeType(ValidatorNodeStruct, VALIDATOR_REGISTRY_LIMIT);

    it("edit then read", () => {
      const validatorListTB = ValidatorsListType.defaultViewDU();
      for (let i = 0; i < 10; i++) {
        const validator_ = {...validator, withdrawableEpoch: i};
        validatorListTB.push(ValidatorNodeStruct.toViewDU(validator_));
      }

      expect(validatorListTB.get(3).withdrawableEpoch).to.equal(3, "Wrong [3] value before mutating");
      expect(validatorListTB.get(4).withdrawableEpoch).to.equal(4, "Wrong [3] value before mutating");
      validatorListTB.get(3).withdrawableEpoch = 33;
      validatorListTB.get(4).withdrawableEpoch = 44;
      expect(validatorListTB.get(3).withdrawableEpoch).to.equal(33, "Wrong [3] value after mutating");
      expect(validatorListTB.get(4).withdrawableEpoch).to.equal(44, "Wrong [4] value after mutating");
    });

    it("readonlyValuesListOfLeafNodeStruct", () => {
      const validatorListTB = ValidatorsListType.defaultViewDU();
      const validatorsFlat: Validator[] = [];
      for (let i = 0; i < 10; i++) {
        const validator_ = {...validator, withdrawableEpoch: i};
        validatorsFlat.push(validator_);
        validatorListTB.push(ValidatorNodeStruct.toViewDU(validator_));
      }

      // MUST commit to persist the view to nodes before doing a getAllReadonlyValues()
      validatorListTB.commit();

      expect(validatorListTB.getAllReadonlyValues()).to.deep.equal(validatorsFlat);
    });

    it("return each property as struct backed", () => {
      const validatorListTB = ValidatorsListType.defaultViewDU();
      validatorListTB.push(ValidatorNodeStruct.toViewDU(validator));
      for (const key of Object.keys(validator) as (keyof typeof validator)[]) {
        expect(validatorListTB.get(0)[key]).to.deep.equal(validator[key], `wrong ${key} value`);
      }
    });

    it("validator.toValue()", () => {
      const validatorListTB = ValidatorsListType.defaultViewDU();
      validatorListTB.push(ValidatorNodeStruct.toViewDU(validator));
      expect(validatorListTB.get(0).toValue()).to.deep.equal(validator);
    });
  });
});

/**
 * modifying any fields should result in the whole tree being recomputed
 * 0                                                root
 *                               /                                         \
 * 1                        10                                                11
 *                   /                 \                                 /             \
 * 2            20                          21                     22                    23
 *           /       \                  /       \             /       \             /         \
 * 3      pub         with         eff         sla        act         act         exit        with
 *      /     \
 * 4 pub0      pub1
 * This does not suport batch hash
 **/
describe.skip("getHashComputations BranchNodeStruct", function () {
  const testCases: {name: string; fn: (validator: ValueOf<typeof ValidatorNodeStruct>) => void}[] = [
    {name: "modify pubkey", fn: (validator) => (validator.pubkey = Buffer.alloc(48, 0x01))},
    {
      name: "modify withdrawalCredentials",
      fn: (validator) => (validator.withdrawalCredentials = Buffer.alloc(32, 0x01)),
    },
    {name: "modify effectiveBalance", fn: (validator) => (validator.effectiveBalance += 1e9)},
    {name: "modify slashed", fn: (validator) => (validator.slashed = true)},
    {name: "modify activationEligibilityEpoch", fn: (validator) => (validator.activationEligibilityEpoch += 1e6)},
    {name: "modify activationEpoch", fn: (validator) => (validator.activationEpoch += 1e6)},
    {name: "modify exitEpoch", fn: (validator) => (validator.exitEpoch += 1e6)},
    {name: "modify withdrawableEpoch", fn: (validator) => (validator.withdrawableEpoch += 1e6)},
    {
      name: "modify all",
      fn: (validator) => {
        validator.pubkey = Buffer.alloc(48, 0x01);
        validator.withdrawalCredentials = Buffer.alloc(32, 0x01);
        validator.effectiveBalance += 1e9;
        validator.slashed = true;
        validator.activationEligibilityEpoch += 1e6;
        validator.activationEpoch += 1e6;
        validator.exitEpoch += 1e6;
        validator.withdrawableEpoch += 1e6;
      },
    },
  ];

  for (const {name, fn} of testCases) {
    it(name, () => {
      const hashComps: HashComputationGroup = {
        byLevel: [],
        offset: 0,
      };
      const validatorViewDU = ValidatorNodeStruct.toViewDU(validator);
      // cache all roots
      validatorViewDU.hashTreeRoot();
      fn(validatorViewDU);
      validatorViewDU.commit(hashComps);
      expect(hashComps.byLevel.length).to.be.equal(4);
      expect(hashComps.byLevel[0].length).to.be.equal(1);
      expect(hashComps.byLevel[1].length).to.be.equal(2);
      expect(hashComps.byLevel[2].length).to.be.equal(4);
      expect(hashComps.byLevel[3].length).to.be.equal(1);
    });
  }
});
