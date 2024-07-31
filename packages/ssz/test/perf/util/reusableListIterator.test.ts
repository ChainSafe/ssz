import {itBench} from "@dapplion/benchmark";
import {ReusableListIterator} from "../../../src";
import {Validator} from "../../lodestarTypes/phase0";
import {getValidator} from "../../utils/generateEth2Objs";

/**
 * This test create validator object every time intentionally, this mimics an environment where there are a lot of memory allocation.
 * On average, Array is very fast, however it's pretty expensive to allocate a big array and it may cause a spike due to gc randomly.
 * ReusableListIterator is faster in average and it's more stable due to no memory allocation involved.
 *   ReusableListIterator
    ✓ ReusableListIterator 2000000 items                                 0.5724982 ops/s    1.746731  s/op        -         13 runs   24.1 s
    ✓ Array 2000000 items                                                0.4655988 ops/s    2.147772  s/op        -         14 runs   32.0 s
 */
describe("ReusableListIterator", function () {
  const length = 2_000_000;
  const list = new ReusableListIterator<Validator>();
  itBench({
    id: `ReusableListIterator ${length} items`,
    fn: () => {
      // reusable, just reset
      list.reset();
      for (let i = 0; i < length; i++) {
        list.push(getValidator(i));
      }
      for (const a of list) {
        a;
      }
    },
  });

  itBench({
    id: `Array ${length} items`,
    fn: () => {
      // allocate every time
      const arr = new Array<Validator>(length);
      for (let i = 0; i < length; i++) {
        arr[i] = getValidator(i);
      }
      for (const a of arr) {
        a;
      }
    },
  });
});
