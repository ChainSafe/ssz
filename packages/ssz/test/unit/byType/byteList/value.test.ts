import {describe, expect, it} from "vitest";
import {ByteListType, ProgressiveByteListType} from "../../../../src/index.ts";

describe("ByteListValue", () => {
  const type = new ByteListType(1024);

  it("should zero out the last sha256 block if it's over value.length", () => {
    const value = Buffer.alloc(65, 1);
    const expectedRoot = type.hashTreeRoot(value);
    // now hash another value which make the cached blocks non zero
    type.hashTreeRoot(Buffer.alloc(1024, 2));
    const actualRoot = type.hashTreeRoot(value);
    expect(actualRoot).to.deep.equal(expectedRoot);
  });

  it("should increase blockArray size if needed", () => {
    const value0 = Buffer.alloc(65, 1);
    const expectedRoot0 = type.hashTreeRoot(value0);
    const value1 = Buffer.alloc(1024, 3);
    const expectedRoot1 = type.hashTreeRoot(value1);
    // now increase block array size
    type.hashTreeRoot(Buffer.alloc(1024, 2));

    // hash again
    expect(type.hashTreeRoot(value0)).to.deep.equal(expectedRoot0);
    expect(type.hashTreeRoot(value1)).to.deep.equal(expectedRoot1);
  });
});

for (const type of [new ByteListType(1024), new ProgressiveByteListType({limit: 1024})]) {
  describe(`${type.constructor.name}.hashTreeRootFromBytesInto`, () => {
    const data = Uint8Array.from({length: 1200}, (_, i) => (i * 7 + 3) & 0xff);

    // [start, end) ranges around 32 bytes chunk and 64 bytes block boundaries, including empty ranges
    const ranges: [number, number][] = [
      [0, 0],
      [5, 5],
      [0, 1],
      [3, 35],
      [1, 64],
      [7, 72],
      [10, 138],
      [100, 1124],
      [176, 1200],
    ];

    for (const [start, end] of ranges) {
      it(`[${start}, ${end})`, () => {
        // value_toTree() does not use hashTreeRootInto(), so it is an independent reference
        const expectedRoot = type.value_toTree(data.slice(start, end)).root;

        const output = new Uint8Array(32 + 16).fill(0xff);
        type.hashTreeRootFromBytesInto(data, start, end, output, 8);
        expect(output.subarray(8, 40)).to.deep.equal(expectedRoot);
        expect(output.subarray(0, 8).every((b) => b === 0xff)).to.equal(true);
        expect(output.subarray(40).every((b) => b === 0xff)).to.equal(true);

        expect(type.hashTreeRoot(data.slice(start, end))).to.deep.equal(expectedRoot);
      });
    }

    it("is not affected by previous longer values", () => {
      const expectedRoot = type.value_toTree(data.slice(10, 75)).root;
      type.hashTreeRootFromBytesInto(data, 0, 1024, new Uint8Array(32), 0);
      const output = new Uint8Array(32);
      type.hashTreeRootFromBytesInto(data, 10, 75, output, 0);
      expect(output).to.deep.equal(expectedRoot);
    });
  });
}
