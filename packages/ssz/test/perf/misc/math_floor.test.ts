import {bench, setBenchOpts, describe} from "@chainsafe/benchmark";

describe("Math.floor hacks", () => {
  setBenchOpts({noThreshold: true});

  const runsFactor = 1e6;

  for (const n of [53, 512]) {
    bench({id: `floor - Math.floor (${n})`, runsFactor}, () => {
      for (let i = 0; i < runsFactor; i++) Math.floor(n / 4);
    });
    bench({id: `floor - << 0 (${n})`, runsFactor}, () => {
      for (let i = 0; i < runsFactor; i++) (n / 4) << 0;
    });
  }
});
