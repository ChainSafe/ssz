import {bench, describe} from "@chainsafe/benchmark";

describe("tree", () => {
  const n = 4264957196;
  const d = Math.ceil(Math.log2(n));

  const runsFactor = 1e6;

  bench({id: "bitstring", runsFactor}, () => {
    for (let j = 0; j < runsFactor; j++) {
      const s = n.toString(2);
      for (let i = 0; i < d; i++) {
        s[i];
      }
    }
  });

  bench({id: "bit mask", runsFactor}, () => {
    for (let j = 0; j < runsFactor; j++) {
      for (let i = 0; i < d; i++) {
        const mask = 1 << i;
        (n & mask) === mask;
      }
    }
  });
});
