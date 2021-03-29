import { expect } from "chai";
import { CompositeType } from "../../src";
import { BeaconState } from "./objects";

describe("fromStructural", function () {
  it("assign balances to BeaconState", function () {
    this.timeout(0);
    const balances = Array.from({length: 200000}, () => BigInt(31217089836));
    let minTime = Number.MAX_SAFE_INTEGER;
    let maxTime = 0;
    const MAX_TRY = 10000;
    const from = process.hrtime.bigint();
    for (let i = 0; i < MAX_TRY; i++) {
      const state = BeaconState.tree_defaultValue();
      const start = Date.now();
      BeaconState.tree_setProperty(
        state,
        "balances",
        (BeaconState.fields.balances as CompositeType<bigint[]>).struct_convertToTree(balances)
      );
      const duration = Date.now() - start;
      if (duration < minTime) minTime = duration;
      if (duration > maxTime) maxTime = duration;
    }
    const to = process.hrtime.bigint();
    const average = Number((to - from) / BigInt(MAX_TRY) / BigInt(1000000));
    console.log("fromStructural in ms minTime:", minTime, "maxTime:", maxTime, "average:", average, "MAX_TRY:", MAX_TRY);
    expect(minTime).to.be.lt(65, "Minimal balances assignment is not less than 65ms");
    expect(maxTime).to.be.lt(390, "Maximal balances assignment is not less than 390ms");
    expect(average).to.be.lt(81, "Average balances assignment is not less than 81ms");
  });
});
