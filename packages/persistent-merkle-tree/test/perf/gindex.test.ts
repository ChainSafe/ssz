import {itBench} from "@dapplion/benchmark";
import {getGindexBits, getGindicesAtDepth, gindexIterator, iterateAtDepth} from "../../src/index.js";

describe("gindices at depth", () => {
  const count = 100;
  const depth = 10;
  const startIx = 0;

  // ✓ getGindicesAtDepth       188146.8 ops/s    5.315000 us/op   x0.587    1788863 runs   10.1 s
  // ✓ iterateAtDepth           89047.20 ops/s    11.23000 us/op   x0.977     867266 runs   10.0 s

  itBench("getGindicesAtDepth", () => {
    const gindices = getGindicesAtDepth(depth, startIx, count);
    for (let i = 0; i < gindices.length; i++) {
      //
    }
  });

  itBench("iterateAtDepth", () => {
    for (let gindex of iterateAtDepth(depth, BigInt(startIx), BigInt(count))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      gindex++;
    }
  });
});

describe("gindex bits", () => {
  const gindex = BigInt(43035);

  // ✓ getGindexBits        1381215 ops/s    724.0000 ns/op        -    9967639 runs   10.6 s
  // ✓ gindexIterator       801282.1 ops/s    1.248000 us/op        -    6466357 runs   10.2 s

  itBench("getGindexBits", () => {
    const bits = getGindexBits(gindex);
    for (let i = 0; i < bits.length; i++) {
      !!bits[i];
    }
  });

  itBench("gindexIterator", () => {
    for (const bit of gindexIterator(gindex)) {
      !!bit;
    }
  });
});
