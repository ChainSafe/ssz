import { itBench, setBenchOpts } from "@dapplion/benchmark";
import { ReusableListIterator } from "../../../src";

class A {
  constructor(private readonly x: number, private readonly y: string, private readonly z: Uint8Array) {}
}

/**
 * ReusableListIterator is 2x slower than using Array in this benchmark, however it does not allocate new array every time.
    ✓ ReusableListIterator 2000000 items                                  70.00170 ops/s    14.28537 ms/op        -        105 runs   2.01 s
    ✓ Array 2000000 items                                                 156.8627 ops/s    6.375003 ms/op        -        114 runs   1.23 s
 */
describe("ReusableListIterator", function () {
  setBenchOpts({
    minRuns: 100
  });

  const pool = Array.from({length: 1024}, (_, i) => new A(i, String(i), Buffer.alloc(32, 1)));

  const length = 2_000_000;
  const list = new ReusableListIterator();
  itBench({
    id: `ReusableListIterator ${length} items`,
    fn: () => {
      // reusable, just reset
      list.reset();
      for (let i = 0; i < length; i++) {
        list.push(pool[i % 1024]);
      }
      for (const a of list) {
        a;
      }
    }
  });

  itBench({
    id: `Array ${length} items`,
    fn: () => {
      // allocate every time
      const arr = new Array<A>(length);
      for (let i = 0; i < length; i++) {
        arr[i] = pool[i % 1024]
      }
      for (const a of arr) {
        a;
      }
    }
  })
});

