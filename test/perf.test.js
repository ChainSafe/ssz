const sha256 = require("../src");
const {expect} = require("chai");

describe("sha256", function () {
  it('hash 50000 times', function () {
    this.timeout(0);
    const input = Buffer.from("lwkjt23uy45pojsdf;lnwo45y23po5i;lknwe;lknasdflnqw3uo5", "utf8");
    // total number of time running hash for 200000 balances
    const iterations = 50023;
    const begin = process.hrtime.bigint();
    let minTime = Number.MAX_SAFE_INTEGER;
    let maxTime = 0;
    const MAX_TRY = 10000;
    for (let i = 0; i < MAX_TRY; i++) {
      const start = Date.now();
      for (let j = 0; j < iterations; j++) sha256.default.digest(input);
      const duration = Date.now() - start;
      if (duration < minTime) minTime = duration;
      if (duration > maxTime) maxTime = duration;
    }
    const duration = process.hrtime.bigint() - begin;
    const average = Number(duration / BigInt(MAX_TRY) / BigInt(1000000));
    console.log("hash minTime:", minTime, "maxTime:", maxTime, "average:", average, "MAX_TRY:", MAX_TRY);
    const expectedMinTime = 61;
    const expectedMaxTime = 480;
    const expectedAveTime = 82;
    expect(minTime).to.be.lte(expectedMinTime, `Minimal hash() ${iterations} times takes more than ${expectedMinTime}ms`);
    expect(maxTime).to.be.lte(expectedMaxTime, `Maximal hash() ${iterations} times takes more than ${expectedMaxTime}ms`);
    expect(average).to.be.lte(expectedAveTime, `Average hash() ${iterations} times takes more than ${expectedAveTime}ms`);
  });

  it("calculate number of operations per second", function () {
    // java statistic for same test: https://gist.github.com/scoroberts/a60d61a2cc3afba1e8813b338ecd1501
    const iterations = 1000000
    const input = Buffer.from("lwkjt23uy45pojsdf;lnwo45y23po5i;lknwe;lknasdflnqw3uo5", "utf8");
    const begin = process.hrtime.bigint();
    for (let i=0; i<iterations; i++) sha256.default.digest(input);
    const durationMs = Number((process.hrtime.bigint() - begin) / BigInt(1000000));
    const hashesPerSec = iterations * 1000 / durationMs;
    console.log("Finished in", durationMs, "hashesPerSec", hashesPerSec);
    expect(hashesPerSec).to.be.lt(740000, "Number of hash per sec should be at least 740000");
  });
});
