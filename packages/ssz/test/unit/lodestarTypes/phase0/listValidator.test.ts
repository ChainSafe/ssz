import {describe, expect, it} from "vitest";
import {ContainerType} from "../../../../src/type/container.js";
import {ListCompositeType} from "../../../../src/type/listComposite.js";
import {ssz} from "../../../lodestarTypes/index.js";
import {preset} from "../../../lodestarTypes/params.js";
import {Validator} from "../../../lodestarTypes/phase0/index.js";
import {ValidatorType} from "../../../lodestarTypes/phase0/validator.js";
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
  const ValidatorContainer = new ContainerType(ValidatorType, {typeName: "Validator", jsonCase: "eth2"});
  const oldValidatorsType = new ListCompositeType(ValidatorContainer, VALIDATOR_REGISTRY_LIMIT);
  for (const numValidators of testCases) {
    it(`should commit ${numValidators} validators`, () => {
      const validators = Array.from({length: numValidators}, (_, i) => ({
        ...seedValidator,
        withdrawableEpoch: seedValidator.withdrawableEpoch + i,
      }));
      const oldViewDU = oldValidatorsType.toViewDU(validators);
      const newViewDU = ssz.phase0.Validators.toViewDU(validators);
      // modify all validators
      for (let i = 0; i < numValidators; i++) {
        oldViewDU.get(i).activationEpoch = 2024;
        newViewDU.get(i).activationEpoch = 2024;
      }
      expect(newViewDU.batchHashTreeRoot()).to.be.deep.equal(oldViewDU.batchHashTreeRoot());
      expect(newViewDU.serialize()).to.be.deep.equal(oldViewDU.serialize());
    });
  }

  const testCases2 = [[1], [3, 5], [1, 9, 7]];
  const numValidator = 33;
  for (const modifiedIndices of testCases2) {
    it(`should modify ${modifiedIndices.length} validators`, () => {
      const validators = Array.from({length: numValidator}, (_, i) => ({
        ...seedValidator,
        withdrawableEpoch: seedValidator.withdrawableEpoch + i,
      }));
      const oldViewDU = oldValidatorsType.toViewDU(validators);
      const newViewDU = ssz.phase0.Validators.toViewDU(validators);
      for (const index of modifiedIndices) {
        oldViewDU.get(index).activationEpoch = 2024;
        newViewDU.get(index).activationEpoch = 2024;
      }
      expect(newViewDU.batchHashTreeRoot()).to.be.deep.equal(oldViewDU.batchHashTreeRoot());
      expect(newViewDU.serialize()).to.be.deep.equal(oldViewDU.serialize());
    });
  }

  const testCases3 = [1, 3, 5, 7];
  for (const numPush of testCases3) {
    it(`should push ${numPush} validators`, () => {
      const validators = Array.from({length: numValidator}, (_, i) => ({
        ...seedValidator,
        withdrawableEpoch: seedValidator.withdrawableEpoch + i,
      }));
      const oldViewDU = oldValidatorsType.toViewDU(validators);
      const newViewDU = ssz.phase0.Validators.toViewDU(validators);
      const newValidators: Validator[] = [];
      // this ensure the commit() should update nodes array
      newViewDU.getAllReadonlyValues();
      for (let i = 0; i < numPush; i++) {
        const validator = {...seedValidator, withdrawableEpoch: seedValidator.withdrawableEpoch + numValidator + i};
        newValidators.push(validator);
        oldViewDU.push(ValidatorContainer.toViewDU(validator));
        newViewDU.push(ssz.phase0.Validator.toViewDU(validator));
      }
      oldViewDU.commit();
      expect(newViewDU.batchHashTreeRoot()).to.be.deep.equal(oldViewDU.node.root);
      expect(newViewDU.serialize()).to.be.deep.equal(oldViewDU.serialize());
      const allValidators = newViewDU.getAllReadonlyValues();
      for (let i = 0; i < numPush; i++) {
        expect(allValidators[numValidator + i]).to.be.deep.equal(newValidators[i]);
      }
    });
  }
});
