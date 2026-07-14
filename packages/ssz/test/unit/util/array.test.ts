import {describe, expect, it} from "vitest";
import {pushAll} from "../../../src/util/array.ts";

describe("pushAll", () => {
  it("appends all items in order", () => {
    const target = [1, 2];
    pushAll(target, [3, 4, 5]);
    expect(target).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it("is a no-op for an empty source", () => {
    const target = [1];
    pushAll(target, []);
    expect(target).to.deep.equal([1]);
  });

  it("handles large sources that would overflow a `push(...source)` spread (regression: #535)", () => {
    // `target.push(...source)` throws `RangeError: Maximum call stack size exceeded` past ~125k elements on
    // V8's default stack. `pushAll` appends in a loop, so it must handle far larger inputs.
    const n = 300_000;
    const target: number[] = [];
    pushAll(
      target,
      Array.from({length: n}, (_, i) => i)
    );
    expect(target.length).to.equal(n);
    expect(target[0]).to.equal(0);
    expect(target[n - 1]).to.equal(n - 1);
  });
});
