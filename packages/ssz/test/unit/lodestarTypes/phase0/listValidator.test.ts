import { ListCompositeType } from "../../../../src/type/listComposite";
import { ValidatorNodeStruct } from "../../../lodestarTypes/phase0/validator";
import {
  preset,
} from "../../../lodestarTypes/params";
import { ssz } from "../../../lodestarTypes";
import { expect } from "chai";
const {VALIDATOR_REGISTRY_LIMIT} = preset;

describe("ListValidator ssz type", function () {
  const seedValidator = {
    activationEligibilityEpoch: 10,
    activationEpoch: 11,
    exitEpoch: Infinity,
    slashed: false,
    withdrawableEpoch: 13,
    pubkey: Buffer.alloc(48, 100),
    withdrawalCredentials: Buffer.alloc(32, 100),
    effectiveBalance: 32000000000,
  };

  const testCases = [32, 33, 34, 35];
  const oldValidatorsType = new ListCompositeType(ValidatorNodeStruct, VALIDATOR_REGISTRY_LIMIT);
  for (const numValidators of testCases) {
    it (`should commit ${numValidators} validators`, () => {
      const validators = Array.from({length: numValidators}, (_, i) => ({...seedValidator, withdrawableEpoch: seedValidator.withdrawableEpoch + i}));
      const oldViewDU = oldValidatorsType.toViewDU(validators);
      const newViewDU = ssz.phase0.Validators.toViewDU(validators);
      // modify all validators
      for (let i = 0; i < numValidators; i++) {
        oldViewDU.get(i).activationEpoch = 2024;
        newViewDU.get(i).activationEpoch = 2024;
      }
      expect(newViewDU.hashTreeRoot()).to.be.deep.equal(oldViewDU.hashTreeRoot());
      expect(newViewDU.serialize()).to.be.deep.equal(oldViewDU.serialize());
    });
  }
});
