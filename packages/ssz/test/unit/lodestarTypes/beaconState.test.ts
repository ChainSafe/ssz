import {expect} from "chai";
import {BeaconState} from "../../lodestarTypes/altair/sszTypes";
import {getRandomState} from "../../utils/generateEth2Objs";
import {ValidatorNodeStruct} from "../../lodestarTypes/phase0/validator";

describe("BeaconState hashTreeRoot", function () {
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

  // BeaconState do the batch every 4 validators
  const modifyTestCases = [32, 33, 34, 35];
  for (const numModified of modifyTestCases) {
    it(`modify ${numModified} validators`, function () {
      const state = BeaconState.toViewDU(getRandomState(100));
      state.hashTreeRoot();
      const state2 = BeaconState.toView(getRandomState(100));
      for (let i = 0; i < numModified; i++) {
        state.validators.get(i).activationEpoch = 2024;
        state2.validators.get(i).activationEpoch = 2024;
      }
      expect(state.hashTreeRoot()).to.be.deep.equal(state2.hashTreeRoot());
      expect(state.serialize()).to.be.deep.equal(state2.serialize());
    });
  }

  const pushTestCases = [5, 6, 7, 8];
  for (const numPush of pushTestCases) {
    it(`push ${numPush} validators`, function () {
      const state = BeaconState.toViewDU(getRandomState(100));
      state.hashTreeRoot();
      const state2 = BeaconState.toView(getRandomState(100));
      for (let i = 0; i < numPush; i++) {
        const validator = {...seedValidator, withdrawableEpoch: seedValidator.withdrawableEpoch + i};
        state.validators.push(ValidatorNodeStruct.toViewDU(validator));
        state2.validators.push(ValidatorNodeStruct.toView(validator));
      }
      expect(state.hashTreeRoot()).to.be.deep.equal(state2.hashTreeRoot());
      expect(state.serialize()).to.be.deep.equal(state2.serialize());
    });
  }
});
