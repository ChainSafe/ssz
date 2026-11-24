import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {describe, expect, it} from "vitest";
import {
  ProgressiveListBasicType,
  ProgressiveListCompositeType,
  UintNumberType,
  progressiveListRootNode,
  toHexString,
  zeroProgressiveListBasicRootNode,
} from "../../../../src/index.ts";

describe("progressive list root helpers", () => {
  const uint64 = new UintNumberType(8);
  const listBasic = new ProgressiveListBasicType(uint64);
  const listComposite = new ProgressiveListCompositeType(new ProgressiveListBasicType(new UintNumberType(1)));

  for (const length of [0, 1, 4, 5, 17, 64]) {
    it(`zeroProgressiveListBasicRootNode matches zero ProgressiveListBasicType length=${length}`, () => {
      const zeros = Array.from({length}, () => 0);
      const expected = listBasic.toView(zeros).node;
      const actual = zeroProgressiveListBasicRootNode(listBasic.itemsPerChunk, length);

      expect(toHexString(actual.root)).to.equal(toHexString(expected.root));
    });
  }

  it("progressiveListRootNode matches ProgressiveListBasicType for packed chunk leaves", () => {
    const values = [1, 2, 3, 4, 5];
    const expected = listBasic.toView(values).node;
    const chunkCount = Math.ceil(values.length / listBasic.itemsPerChunk);
    const chunkLeaves = Array.from({length: chunkCount}, (_, chunkIdx) => {
      const bytes = new Uint8Array(32);
      const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      for (let i = 0; i < listBasic.itemsPerChunk; i++) {
        const valueIdx = chunkIdx * listBasic.itemsPerChunk + i;
        if (valueIdx >= values.length) break;
        uint64.value_serializeToBytes({uint8Array: bytes, dataView}, i * uint64.byteLength, values[valueIdx]);
      }
      return LeafNode.fromRoot(bytes);
    });

    const actual = progressiveListRootNode(chunkLeaves, values.length);
    expect(toHexString(actual.root)).to.equal(toHexString(expected.root));
  });

  it("progressiveListRootNode matches ProgressiveListCompositeType for element roots", () => {
    const values = [[1], [2, 3], [4, 5, 6]];
    const expected = listComposite.toView(values).node;
    const elementRoots = values.map((item) => listComposite.elementType.toView(item).node);
    const actual = progressiveListRootNode(elementRoots, values.length);

    expect(toHexString(actual.root)).to.equal(toHexString(expected.root));
  });

  it("rejects invalid itemsPerChunk and length", () => {
    expect(() => zeroProgressiveListBasicRootNode(0, 1)).to.throw(/itemsPerChunk/);
    expect(() => zeroProgressiveListBasicRootNode(4, -1)).to.throw(/length/);
    expect(() => progressiveListRootNode([], -1)).to.throw(/length/);
  });
});
