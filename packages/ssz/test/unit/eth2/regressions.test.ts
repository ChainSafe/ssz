import {expect} from "chai";
import {ssz} from "../../lodestarTypes/index.js";

describe("Various issues and regressions of Eth2 types", () => {
  it("Should push state.validators to ViewDU and update length", () => {
    const validatorValue = ssz.phase0.Validator.defaultValue();
    const validatorViewDU = ssz.phase0.Validator.toViewDU(validatorValue);

    const state = ssz.phase0.BeaconState.defaultViewDU();

    expect(ssz.phase0.Validators.toJson(state.validators.toValue())).to.deep.equal([], "Wrong value before push");

    state.validators.push(validatorViewDU);
    state.validators.push(validatorViewDU);

    expect(state.validators.length).to.equal(2, "Wrong length after push");

    state.commit();

    expect(ssz.phase0.Validators.toJson(state.validators.toValue())).to.deep.equal(
      ssz.phase0.Validators.toJson([validatorValue, validatorValue]),
      "Wrong value after commit"
    );
  });
});
