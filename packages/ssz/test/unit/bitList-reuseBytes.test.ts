import {describe, expect, it, vi} from "vitest";
import {
  BitArray,
  BitListType,
  BitVectorType,
  ByteListType,
  ContainerType,
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

      it("preserves the container input while reusing other fields", () => {
        const container = new ContainerType({bits: type, payload: new ByteListType(32), flags: new BitVectorType(8)});
        const expected = {
          bits: BitArray.fromBoolArray([true, false, true]),
          payload: Uint8Array.of(0xab, 0xcd),
          flags: BitArray.fromBoolArray([true, false, false, false, false, false, false, false]),
        };
        const serialized = container.serialize(expected);
        const bytes = createInput(Array.from(serialized));
        const value = container.deserialize(bytes, {reuseBytes: true});

        expect(value.bits.toBoolArray()).to.deep.equal(expected.bits.toBoolArray());
        expect(Array.from(value.payload)).to.deep.equal(Array.from(expected.payload));
        expect(value.flags.toBoolArray()).to.deep.equal(expected.flags.toBoolArray());
        expect(value.payload.buffer).to.equal(bytes.buffer);
        expect(value.flags.uint8Array.buffer).to.equal(bytes.buffer);
        expect(Array.from(bytes)).to.deep.equal(Array.from(serialized));
        expect(container.serialize(value)).to.deep.equal(serialized);
      });

      it("preserves the input with the default deserialization options", () => {
        const bytes = createInput([0x00, 0x03]);
        const value = type.deserialize(bytes);

        expect(value.bitLen).to.equal(9);
        expect(Array.from(bytes)).to.deep.equal([0x00, 0x03]);
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

      it.each([0, 1, 7, 8, 9, 15, 16])(
        "round-trips %i bits from a subarray without changing its backing bytes",
        (bitLen) => {
          const expected = BitArray.fromBoolArray(Array.from({length: bitLen}, (_, i) => i % 2 === 0));
          const serialized = type.serialize(expected);
          const backing = createInput([0xff, ...serialized, 0xff]);
          const bytes = backing.subarray(1, backing.length - 1);

          for (let i = 0; i < 2; i++) {
            const value = type.deserialize(bytes, {reuseBytes: true});

            expect(value.toBoolArray()).to.deep.equal(expected.toBoolArray());
            expect(type.serialize(value)).to.deep.equal(serialized);
            expect(type.hashTreeRoot(value)).to.deep.equal(type.hashTreeRoot(expected));
            expect(Array.from(backing)).to.deep.equal([0xff, ...serialized, 0xff]);
          }
        }
      );

      it("preserves the input when the bit length exceeds the limit", () => {
        const bytes = createInput([0x00, 0x00, 0x03]);

        expect(() => type.deserialize(bytes, {reuseBytes: true})).to.throw("bitLen over limit 17 > 16");
        expect(Array.from(bytes)).to.deep.equal([0x00, 0x00, 0x03]);
      });

      for (const bitLen of [17, 24]) {
        it.each(["copy", "reuse", "view", "viewDU"] as const)(
          `rejects ${bitLen} bits before slicing the input (%s)`,
          (mode) => {
            const bytes = createInput(bitLen === 17 ? [0x00, 0x00, 0x02] : [0x00, 0x00, 0x00, 0x01]);
            const copy = vi.spyOn(Uint8Array.prototype, "slice");
            const view = vi.spyOn(Uint8Array.prototype, "subarray");

            try {
              expect(() => {
                if (mode === "view") type.deserializeToView(bytes);
                else if (mode === "viewDU") type.deserializeToViewDU(bytes);
                else type.deserialize(bytes, {reuseBytes: mode === "reuse"});
              }).to.throw(`bitLen over limit ${bitLen} > 16`);
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
