// Set the hasher to hashtree
// Used to run benchmarks with with visibility into hashtree performance, useful for Lodestar
import {beforeEach} from "@chainsafe/benchmark";
import {setHasher} from "@chainsafe/persistent-merkle-tree/lib/cjs/hasher/index.js";
import {hasher} from "@chainsafe/persistent-merkle-tree/lib/cjs/hasher/hashtree.js";
setHasher(hasher);

beforeEach(() => {
  console.log("-----------------------------------");
  const memory = process.memoryUsage();
  console.log(
    `HT: ${(memory.heapTotal / 1024 / 1024).toFixed(2)}MB, HU: ${(
      memory.heapUsed /
      1024 /
      1024
    ).toFixed(2)}MB, RSS: ${(memory.rss / 1024 / 1024).toFixed(2)}MB`
  );
});

export {};
