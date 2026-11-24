import {describe, expect, it, vi} from "vitest";
import {
  BitListType,
  ByteListType,
  ContainerNodeStructType,
  ContainerType,
  UintNumberType,
} from "../../../../src/index.ts";

for (const Container of [ContainerType, ContainerNodeStructType]) {
  const type = new Container({number: new UintNumberType(4), bytes: new ByteListType(8)});

  describe(`${type.typeName} short input`, () => {
    for (const inputKind of ["Uint8Array", "Buffer"] as const) {
      const createInput = (bytes: Uint8Array): Uint8Array => (inputKind === "Buffer" ? Buffer.from(bytes) : bytes);

      for (const method of ["deserialize", "deserializeToView", "deserializeToViewDU"] as const) {
        it.each([0, 2, 7])(`rejects %i bytes without a DataView RangeError (${inputKind}, ${method})`, (size) => {
          const bytes = createInput(new Uint8Array(size));
          let error: unknown;
          try {
            type[method](bytes);
          } catch (e) {
            error = e;
          }

          expect(error).toBeInstanceOf(Error);
          expect(error).not.toBeInstanceOf(RangeError);
          expect((error as Error).message).to.equal(`${type.typeName} size ${size} less than fixed section size 8`);
        });

        it(`accepts a complete fixed section with an empty list (${inputKind}, ${method})`, () => {
          const value = {number: 42, bytes: new Uint8Array()};
          const serialized = type.serialize(value);
          const backing = createInput(Uint8Array.from([0xff, ...serialized, 0xff]));
          const bytes = backing.subarray(1, backing.length - 1);

          expect(bytes.length).to.equal(type.fixedEnd);
          if (method === "deserialize") {
            expect(type.deserialize(bytes)).to.deep.equal(value);
          } else {
            expect(type[method](bytes).serialize()).to.deep.equal(serialized);
          }
          expect(Array.from(backing)).to.deep.equal([0xff, ...serialized, 0xff]);
        });

        it(`rejects a short nested container (${inputKind}, ${method})`, () => {
          const parent = new ContainerType({child: type, tail: new ByteListType(8)});
          const bytes = createInput(new Uint8Array(18));
          const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          dataView.setUint32(0, 8, true);
          dataView.setUint32(4, 10, true);
          // The child's offset would be read from the following field.
          dataView.setUint32(12, type.fixedEnd, true);

          expect(() => parent[method](bytes)).toThrow(`${type.typeName} size 2 less than fixed section size 8`);
        });
      }
    }

    for (const method of ["value_deserializeFromBytes", "tree_deserializeFromBytes"] as const) {
      it(`rejects a short field before reading outside its range (${method})`, () => {
        const uint8Array = new Uint8Array(32);
        const dataView = new DataView(uint8Array.buffer);
        // The offset is readable in the backing view, but lies outside the field's [8, 10) range.
        dataView.setUint32(12, type.fixedEnd, true);
        const readOffset = vi.spyOn(dataView, "getUint32");

        try {
          expect(() => type[method]({uint8Array, dataView}, 8, 10)).toThrow(
            `${type.typeName} size 2 less than fixed section size 8`
          );
          expect(readOffset).not.toHaveBeenCalled();
        } finally {
          readOffset.mockRestore();
        }
      });
    }

    it("checks the whole fixed section even when the offset itself is readable", () => {
      const reversed = new Container({bytes: new ByteListType(8), number: new UintNumberType(4)});
      const bytes = new Uint8Array(7);
      const dataView = new DataView(bytes.buffer);
      dataView.setUint32(0, 8, true);
      const readOffset = vi.spyOn(dataView, "getUint32");

      try {
        expect(() => reversed.getFieldRanges(dataView, 0, bytes.length)).toThrow(
          `${reversed.typeName} size 7 less than fixed section size 8`
        );
        expect(readOffset).not.toHaveBeenCalled();
      } finally {
        readOffset.mockRestore();
      }
    });
  });
}

it("keeps field validation when the fixed section is complete", () => {
  const type = new ContainerType({bits: new BitListType(8)});
  const bytes = Uint8Array.of(4, 0, 0, 0);

  expect(bytes.length).to.equal(type.fixedEnd);
  expect(bytes.length).to.be.lessThan(type.minSize);
  expect(() => type.deserialize(bytes)).toThrow("BitList requires a padding bit");
  expect(() => type.deserializeToView(bytes)).toThrow("BitList requires a padding bit");
  expect(() => type.deserializeToViewDU(bytes)).toThrow("BitList requires a padding bit");
});
