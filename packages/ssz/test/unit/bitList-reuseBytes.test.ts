import {describe, expect, it, vi} from "vitest";
import {
  BitListType,
  ProgressiveBitListType,
  deserializeUint8ArrayBitListFromBytes,
} from "../../src/index.ts";

for (const type of [new BitListType(16), new ProgressiveBitListType({limit: 16})]) {
  for (const inputKind of ["Uint8Array", "Buffer"] as const) {
    const createInput = (bytes: number[]): Uint8Array =>
      inputKind === "Buffer" ? Buffer.from(bytes) : Uint8Array.from(bytes);

    describe(`${type.typeName} reuseBytes with ${inputKind}`, () => {
      it("preserves the serialized input when removing the padding bit", () => {
        const bytes = createInput([0x00, 0x03]);
        const value = type.deserialize(bytes, {reuseBytes: true});

        expect(value.bitLen).to.equal(9);
        expect(Array.from(value.uint8Array)).to.deep.equal([0x00, 0x01]);
        expect(Array.from(bytes)).to.deep.equal([0x00, 0x03]);
      });

      it("returns the same bit length when decoding the input twice", () => {
        const bytes = createInput([0x00, 0x03]);
        const first = type.deserialize(bytes, {reuseBytes: true});
        const second = type.deserialize(bytes, {reuseBytes: true});

        expect(first.bitLen).to.equal(9);
        expect(second.bitLen).to.equal(9);
      });

      it("reuses byte-aligned data without modifying the input", () => {
        const bytes = createInput([0xab, 0x01]);
        const value = type.deserialize(bytes, {reuseBytes: true});

        expect(value.bitLen).to.equal(8);
        expect(value.uint8Array.buffer).to.equal(bytes.buffer);
        expect(value.uint8Array.byteOffset).to.equal(bytes.byteOffset);
        expect(Array.from(value.uint8Array)).to.deep.equal([0xab]);
        expect(Array.from(bytes)).to.deep.equal([0xab, 0x01]);
      });

      it("preserves the input when the bit length exceeds the limit", () => {
        const bytes = createInput([0x00, 0x00, 0x03]);

        expect(() => type.deserialize(bytes, {reuseBytes: true})).to.throw("bitLen over limit 17 > 16");
        expect(Array.from(bytes)).to.deep.equal([0x00, 0x00, 0x03]);
      });

      for (const bitLen of [17, 24]) {
        it.each(["copy", "reuse"] as const)(
          `rejects ${bitLen} bits before slicing the input (%s)`,
          (mode) => {
            const bytes = createInput(bitLen === 17 ? [0x00, 0x00, 0x02] : [0x00, 0x00, 0x00, 0x01]);
            const copy = vi.spyOn(Uint8Array.prototype, "slice");
            const view = vi.spyOn(Uint8Array.prototype, "subarray");

            try {
              expect(() => type.deserialize(bytes, {reuseBytes: mode === "reuse"})).to.throw(
                `bitLen over limit ${bitLen} > 16`
              );
              expect(copy).not.toHaveBeenCalled();
              expect(view).not.toHaveBeenCalled();
            } finally {
              copy.mockRestore();
              view.mockRestore();
            }
          }
        );
      }
    });
  }
}

it("keeps the shared decoder usable without a limit", () => {
  const bytes = Uint8Array.of(0x00, 0x03);
  const value = deserializeUint8ArrayBitListFromBytes(bytes, 0, bytes.length, true);

  expect(value.bitLen).to.equal(9);
  expect(Array.from(value.uint8Array)).to.deep.equal([0x00, 0x01]);
  expect(Array.from(bytes)).to.deep.equal([0x00, 0x03]);
});

it("accepts only an empty bitlist with a zero progressive limit", () => {
  const type = new ProgressiveBitListType({limit: 0});

  expect(type.deserialize(Uint8Array.of(0x01), {reuseBytes: true}).bitLen).to.equal(0);
  expect(() => type.deserialize(Uint8Array.of(0x02), {reuseBytes: true})).to.throw("bitLen over limit 1 > 0");
});
