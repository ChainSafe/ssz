import { expect } from "chai";
import { BeaconState } from "./objects";

describe("fromStructural", function () {
  it("assign balances to BeaconState", function () {
    this.timeout(0);
    const balances = Array.from({length: 200000}, () => BigInt(31217089836));
    let minTime = Number.MAX_SAFE_INTEGER;
    let maxTime = 0;
    let average = {duration: 0, count: 0};
    const MAX_TRY = 10000;
    for (let i = 0; i < MAX_TRY; i++) {
      const state = BeaconState.tree.defaultValue();
      const start = Date.now();
      state.balances = balances;
      const duration = Date.now() - start;
      const totalDuration = average.duration * average.count + duration;
      const totalCount = average.count + 1;
      average.count = totalCount;
      average.duration = totalDuration / totalCount;
      if (duration < minTime) minTime = duration;
      if (duration > maxTime) maxTime = duration;
    }
    console.log("fromStructural minTime:", minTime, "maxTime:", maxTime, "average:", average.duration, "MAX_TRY:", MAX_TRY);
    expect(minTime).to.be.lt(65, "Minimal balances assignment is not less than 65ms");
    expect(maxTime).to.be.lt(390, "Maximal balances assignment is not less than 390ms");
    expect(average.duration).to.be.lt(81, "Average balances assignment is not less than 81ms");
    expect(average.count).to.be.equal(MAX_TRY);
  });
});
