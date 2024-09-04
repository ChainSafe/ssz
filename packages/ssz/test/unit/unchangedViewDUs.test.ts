import {expect} from "chai";
import * as sszAltair from "../lodestarTypes/altair/sszTypes";
import {getRandomState} from "../utils/generateEth2Objs";

describe("Unchanged ViewDUs", () => {
  const state = sszAltair.BeaconState.toViewDU(getRandomState(100));

  it.skip("should not recompute batchHashTreeRoot() when no fields is changed", () => {
    const root = state.batchHashTreeRoot();
    // this causes viewsChanged inside BeaconState container
    state.validators.length;
    state.balances.length;
    // but we should not recompute root, should get from cache instead
    const root2 = state.batchHashTreeRoot();
    expect(root2).to.equal(root, "should not recompute batchHashTreeRoot() when no fields are changed");
  });

  it("handle childViewDU.batchHashTreeRoot()", () => {
    const state2 = state.clone();
    state2.latestBlockHeader.stateRoot = Buffer.alloc(32, 3);
    const root2 = state2.batchHashTreeRoot();
    const state3 = state.clone();
    state3.latestBlockHeader.stateRoot = Buffer.alloc(32, 3);
    // batchHashTreeRoot() also does the commit()
    state3.latestBlockHeader.commit();
    const root3 = state3.batchHashTreeRoot();
    expect(root3).to.be.deep.equal(root2);
  });
});