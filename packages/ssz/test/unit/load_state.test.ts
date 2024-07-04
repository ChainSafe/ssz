import fs from "fs";
import {BeaconState} from "../lodestarTypes/deneb/sszTypes";
import {toHexString} from "../../src/util/byteArray";

describe.skip("load holesky state", function () {
  this.timeout(0);
  const stateFilePath = "/Users/tuyennguyen/Downloads/holesky_finalized_state.ssz";
  it("should load state from file", function () {
    const stateBytes = fs.readFileSync(stateFilePath);
    console.log("@@@ stateBytes", stateBytes.length);
    const now = Date.now();
    const wsState = BeaconState.deserializeToViewDU(stateBytes);
    console.log("@@@ got wsState slot", wsState.slot, "in", Date.now() - now, "ms");
    wsState.node.root;
    // now = Date.now();
    console.log("@@@ hashTreeRoot", toHexString(wsState.hashTreeRoot()), "in", Date.now() - now, "ms");
  });
});
