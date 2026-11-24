import {describe, expect, it, vi} from "vitest";
import {
  BitArray,
  ByteListType,
  OptionalType,
  ProfileType,
  ProgressiveContainerType,
  StableContainerType,
  UintNumberType,
} from "../../src/index.ts";

const fields = {number: new UintNumberType(4), bytes: new ByteListType(8)};
const optionalFields = {...fields, bytes: new OptionalType(fields.bytes)};

for (const {type, prefixSize, fixedSize} of [
  {type: new ProgressiveContainerType(fields, [true, true]), prefixSize: 0, fixedSize: 8},
  {type: new StableContainerType(fields, 16), prefixSize: 2, fixedSize: 10},
  {type: new ProfileType(fields, BitArray.fromBoolArray([true, true])), prefixSize: 0, fixedSize: 8},
  {type: new ProfileType(optionalFields, BitArray.fromBoolArray([true, true])), prefixSize: 1, fixedSize: 9},
]) {
  describe(`${type.typeName} short input`, () => {
    const value = {number: 42, bytes: new Uint8Array()};
    const serialized = type.serialize(value);

    for (const inputKind of ["Uint8Array", "Buffer"] as const) {
      const createInput = (bytes: Uint8Array): Uint8Array => (inputKind === "Buffer" ? Buffer.from(bytes) : bytes);
      for (const method of ["deserialize", "deserializeToView", "deserializeToViewDU"] as const) {
        it.each([...new Set([0, prefixSize, fixedSize - 1])])(
          `rejects %i bytes before decoding (${inputKind}, ${method})`,
          (size) => {
            const bytes = createInput(serialized.subarray(0, size));
            expect(() => type[method](bytes)).toThrow(`${type.typeName} size ${size} less than`);
          }
        );

        it(`accepts the fixed section with an empty list (${inputKind}, ${method})`, () => {
          const backing = createInput(Uint8Array.from([0xff, ...serialized, 0xff]));
          const bytes = backing.subarray(1, backing.length - 1);
          expect(bytes.length).to.equal(fixedSize);
          if (method === "deserialize") {
            expect(type.deserialize(bytes)).to.deep.equal(value);
          } else {
            expect(type[method](bytes).serialize()).to.deep.equal(serialized);
          }
          expect(Array.from(backing)).to.deep.equal([0xff, ...serialized, 0xff]);
        });
      }
    }

    for (const method of ["value_deserializeFromBytes", "tree_deserializeFromBytes"] as const) {
      it(`rejects a short field within a larger buffer before reading offsets (${method})`, () => {
        const uint8Array = new Uint8Array(32);
        uint8Array.set(serialized, 5);
        const dataView = new DataView(uint8Array.buffer);
        const readOffset = vi.spyOn(dataView, "getUint32");
        try {
          expect(() => type[method]({uint8Array, dataView}, 5, 5 + fixedSize - 1)).toThrow(
            `${type.typeName} size ${fixedSize - 1} less than fixed section size ${fixedSize}`
          );
          expect(readOffset).not.toHaveBeenCalled();
        } finally {
          readOffset.mockRestore();
        }
      });

      if (prefixSize > 0) {
        it(`rejects a truncated bitmap before creating its view (${method})`, () => {
          const uint8Array = new Uint8Array(32);
          uint8Array.set(serialized, 5);
          const dataView = new DataView(uint8Array.buffer);
          const sliceBitmap = vi.spyOn(uint8Array, "subarray");
          try {
            expect(() => type[method]({uint8Array, dataView}, 5, 5 + prefixSize - 1)).toThrow(
              `${type.typeName} size ${prefixSize - 1} less than`
            );
            expect(sliceBitmap).not.toHaveBeenCalled();
          } finally {
            sliceBitmap.mockRestore();
          }
        });
      }
    }
  });
}

const allOptional = Object.fromEntries(
  Array.from({length: 9}, (_, i) => [`field${i}`, new OptionalType(new ByteListType(8))])
);
for (const type of [
  new StableContainerType(allOptional, 16),
  new ProfileType(allOptional, BitArray.fromBoolArray(Array(9).fill(true))),
]) {
  it(`${type.typeName} accepts absent optional fields and rejects a truncated bitmap`, () => {
    const value = Object.fromEntries(Object.keys(allOptional).map((key) => [key, null]));
    const bytes = type.serialize(value);
    expect(Array.from(bytes)).to.deep.equal([0, 0]);
    expect(type.deserialize(bytes)).to.deep.equal(value);
    expect(type.deserializeToView(bytes).serialize()).to.deep.equal(bytes);
    expect(type.deserializeToViewDU(bytes).serialize()).to.deep.equal(bytes);
    expect(() => type.deserialize(bytes.subarray(0, 1))).toThrow(`${type.typeName} size 1 less than`);
  });
}
