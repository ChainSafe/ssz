import {Buffer} from "node:buffer";
import {describe, expect, it, vi} from "vitest";
import {BitArray, BitListType, ByteVectorType, ContainerType, ProgressiveBitListType} from "../../../../src/index.ts";

const types = [new BitListType(16), new ProgressiveBitListType({limit: 16}), new ProgressiveBitListType()];

for (const type of types) {
  for (const inputKind of ["Uint8Array", "Buffer"]) {
    describe(`${type.typeName} reuseBytes with ${inputKind}`, () => {
      function wrap(serialized: Uint8Array): Uint8Array {
        // Use a subarray with nonzero offset and unrelated bytes on both sides.
        const backing =
          inputKind === "Buffer"
            ? Buffer.alloc(serialized.length + 4, 0xa5)
            : new Uint8Array(serialized.length + 4).fill(0xa5);
        backing.set(serialized, 2);
        return backing.subarray(2, serialized.length + 2);
      }

      it.each([1, 7, 9, 15])("preserves the input and repeated decoding at %i bits", (bitLen) => {
        const serialized = type.serialize(BitArray.fromBoolArray(Array<boolean>(bitLen).fill(true)));
        const input = wrap(serialized);
        const backingBefore = Uint8Array.from(new Uint8Array(input.buffer));
        const first = type.deserialize(input, {reuseBytes: true});
        const second = type.deserialize(input, {reuseBytes: true});
        expect(first.bitLen).toBe(bitLen);
        expect(second.bitLen).toBe(bitLen);
        expect(first.toBoolArray()).toEqual(Array<boolean>(bitLen).fill(true));
        expect(second.toBoolArray()).toEqual(first.toBoolArray());
        expect(type.serialize(first)).toEqual(serialized);
        expect(new Uint8Array(input.buffer)).toEqual(backingBefore);
        expect(first.uint8Array.buffer).not.toBe(input.buffer);
      });

      it.each([0, 8, 16])("keeps zero-copy decoding for %i byte-aligned bits", (bitLen) => {
        const input = wrap(type.serialize(BitArray.fromBitLen(bitLen)));
        const before = Uint8Array.from(input);
        const value = type.deserialize(input, {reuseBytes: true});
        expect(value.bitLen).toBe(bitLen);
        expect(value.uint8Array.buffer).toBe(input.buffer);
        expect(Uint8Array.from(input)).toEqual(before);
        expect(type.deserialize(input, {reuseBytes: false}).uint8Array.buffer).not.toBe(input.buffer);
      });

      it("copies the non-aligned bitlist while reusing other container fields", () => {
        const container = new ContainerType({bits: type, bytes: new ByteVectorType(4)});
        const serialized = container.serialize({
          bits: BitArray.fromBoolArray([true]),
          bytes: Uint8Array.of(1, 2, 3, 4),
        });
        const input = wrap(serialized);
        const value = container.deserialize(input, {reuseBytes: true});
        expect(value.bits.bitLen).toBe(1);
        expect(value.bits.uint8Array.buffer).not.toBe(input.buffer);
        expect(value.bytes.buffer).toBe(input.buffer);
        expect(Uint8Array.from(input)).toEqual(serialized);
        expect(container.deserialize(input, {reuseBytes: true})).toEqual(value);
      });
    });
  }
}

for (const type of types.slice(0, 2)) {
  for (const reuseBytes of [false, true]) {
    it(`${type.typeName} rejects oversized input before copying (reuseBytes=${reuseBytes})`, () => {
      const input = Uint8Array.of(0, 0, 2); // 17 bits, limit 16
      const slice = vi.spyOn(Uint8Array.prototype, "slice");
      try {
        expect(() => type.deserialize(input, {reuseBytes})).toThrow("bitLen over limit 17 > 16");
        expect(slice).not.toHaveBeenCalled();
        expect(input).toEqual(Uint8Array.of(0, 0, 2));
        const data = {uint8Array: input, dataView: new DataView(input.buffer)};
        expect(() => type.tree_deserializeFromBytes(data, 0, input.length)).toThrow("bitLen over limit 17 > 16");
        expect(slice).not.toHaveBeenCalled();
      } finally {
        slice.mockRestore();
      }
    });
  }
}
