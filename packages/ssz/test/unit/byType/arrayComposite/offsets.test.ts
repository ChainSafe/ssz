import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {afterEach, describe, expect, it, vi} from "vitest";
import {ByteListType, ByteVectorType} from "../../../../src/index.ts";
import {
  tree_deserializeFromBytesArrayComposite,
  value_deserializeFromBytesArrayComposite,
} from "../../../../src/type/arrayComposite.ts";

describe("ArrayComposite terminal offset", () => {
  afterEach(() => vi.restoreAllMocks());

  for (const size of [2 ** 32 - 1, 2 ** 32, 2 ** 32 + 1]) {
    for (const variable of [false, true]) {
      for (const mode of ["value", "tree"] as const) {
        it(`${mode}: preserves end for ${variable ? "variable" : "fixed"} elements at size ${size}`, () => {
          const start = 8;
          const elementType = variable ? new ByteListType(size) : new ByteVectorType(size);
          // Only the offset table is read here. Stub element decoding to check range dispatch without allocating GiB.
          const uint8Array = new Uint8Array(start + 4);
          const data = {uint8Array, dataView: new DataView(uint8Array.buffer)};
          data.dataView.setUint32(start, 4, true);
          const startEl = variable ? start + 4 : start;
          const end = start + size;
          const arrayProps = {isList: true, limit: 1} as const;

          if (mode === "value") {
            const value = new Uint8Array();
            const decode = vi.spyOn(elementType, "value_deserializeFromBytes").mockReturnValue(value);
            expect(value_deserializeFromBytesArrayComposite(elementType, data, start, end, arrayProps)).toEqual([
              value,
            ]);
            expect(decode).toHaveBeenCalledExactlyOnceWith(data, startEl, end, undefined);
          } else {
            const decode = vi.spyOn(elementType, "tree_deserializeFromBytes").mockReturnValue(LeafNode.fromZero());
            tree_deserializeFromBytesArrayComposite(elementType, 0, data, start, end, arrayProps);
            expect(decode).toHaveBeenCalledExactlyOnceWith(data, startEl, end);
          }
        });
      }
    }
  }
});
