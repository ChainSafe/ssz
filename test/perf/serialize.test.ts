import { expect } from "chai";
import { ValidatorBalances as ValidatorBalancesType } from "./objects";

describe("serialize", () => {
  it("should serialize in less than 200ms", function () {
    this.timeout(0);
    const value = Array.from({length: 200000}, () => BigInt(31217089836));
    let minTime = Number.MAX_SAFE_INTEGER;
    let maxTime = 0;
    const MAX_TRY = 10000;
    const from = process.hrtime.bigint();
    for (let i = 0; i < MAX_TRY; i++) {
      const start = Date.now();
      ValidatorBalancesType.serialize(value);
      const duration = Date.now() - start;
      if (duration < minTime) minTime = duration;
      if (duration > maxTime) maxTime = duration;
    }
    const to = process.hrtime.bigint();
    const average = Number((to - from) / BigInt(MAX_TRY) / BigInt(1000000));
    console.log("serialize in ms minTime:", minTime, "maxTime:", maxTime, "average:", average, "MAX_TRY:", MAX_TRY);
    expect(minTime).to.be.lt(90, "Minimal serialization is not less than 90ms");
    expect(maxTime).to.be.lt(480, "Maximal serialization is not less than 480ms");
    expect(average).to.be.lt(100, "Average serialization is not less than 100ms");
  });
});
