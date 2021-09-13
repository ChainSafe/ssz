import {itBench, setBenchOpts} from "@dapplion/benchmark";

describe("Math.floor hacks", () => {
  setBenchOpts({noThreshold: true});

  const runsFactor = 1e6;

  for (const n of [53, 512]) {
    itBench({id: `floor - Math.floor (${n})`, runsFactor}, () => {
      for (let i = 0; i < runsFactor; i++) Math.floor(n / 4);
    });
    itBench({id: `floor - << 0 (${n})`, runsFactor}, () => {
      for (let i = 0; i < runsFactor; i++) (n / 4) << 0;
    });
  }
});
