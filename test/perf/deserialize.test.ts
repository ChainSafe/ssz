import { expect } from "chai";
import { ValidatorBalances as ValidatorBalancesType } from "./objects";

describe("deserialize", () => {
  it("should deserialize in less than 200ms", function () {
    this.timeout(0);
    const value = Array.from({length: 200000}, () => BigInt(31217089836));
    const buffer = ValidatorBalancesType.serialize(value);
    let minTime = Number.MAX_SAFE_INTEGER;
    let maxTime = 0;
    const MAX_TRY = 10000;
    const from = process.hrtime.bigint();
    for (let i = 0; i < MAX_TRY; i++) {
      const start = Date.now();
      ValidatorBalancesType.deserialize(buffer);
      const duration = Date.now() - start;
      if (duration < minTime) minTime = duration;
      if (duration > maxTime) maxTime = duration;
    }
    const to = process.hrtime.bigint();
    const average = Number((to - from) / BigInt(MAX_TRY) / BigInt(1000000));
    console.log("deserialize in ms minTime:", minTime, "maxTime:", maxTime, "average:", average, "MAX_TRY:", MAX_TRY);
    expect(minTime).to.be.lt(85, "Minimal deserialization is not less than 85ms");
    expect(maxTime).to.be.lt(320, "Maximal deserialization is not less than 320ms");
    expect(average).to.be.lt(100, "Average deserialization is not less than 100ms");
  });
});
