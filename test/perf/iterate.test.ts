import {itBench, setBenchOpts} from "@dapplion/benchmark";

describe("iterate", () => {
  setBenchOpts({
    maxMs: 30 * 1000,
    minMs: 10 * 1000,
    runs: 1000,
  });

  const N = 5000;
  const arr = Array.from({length: N}, () => ({foo: "bar"}));

  // ✓ Array - for of      100150.2 ops/s    9.985000 us/op        -     971778 runs   10.0 s
  // ✓ Array - for(;;)     166805.7 ops/s    5.995000 us/op        -    1589379 runs   10.1 s

  itBench("Array - for of", () => {
    for (const a of arr) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const x = a.foo;
    }
  });
  itBench("Array - for(;;)", () => {
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const x = a.foo;
    }
  });
});
