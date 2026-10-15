import {describe, expect, it} from "vitest";
import {SerializedList, toHexString} from "../../../../src/index.ts";
import {createRng, randomBytes, randomItems, transactionsPair, transactionsPairs} from "./pairs.ts";

describe("SerializedList value", () => {
  const items = [Uint8Array.from([1, 2, 3]), new Uint8Array(0), Uint8Array.from([4]), randomBytes(createRng(1), 70)];

  it("fromArray builds the canonical serialization", () => {
    const value = SerializedList.fromArray(items);
    expect(toHexString(value.bytes)).toBe(toHexString(transactionsPair.oldType.serialize(items)));
    expect(Array.from(value.offsets)).toEqual([16, 19, 19, 20, 90]);
  });

  it("length, get, getSize, iterator and toArray", () => {
    const value = SerializedList.fromArray(items);
    expect(value.length).toBe(items.length);
    for (let i = 0; i < items.length; i++) {
      expect(value.get(i)).toEqual(items[i]);
      expect(value.getSize(i)).toBe(items[i].length);
    }
    expect([...value]).toEqual(items);
    expect(value.toArray()).toEqual(items);
  });

  it("get returns subarrays of bytes, no copy", () => {
    const value = SerializedList.fromArray(items);
    expect(value.get(0).buffer).toBe(value.bytes.buffer);
    expect(value.toArray()[3].buffer).toBe(value.bytes.buffer);
  });

  it("get / getSize out of range", () => {
    const value = SerializedList.fromArray(items);
    for (const index of [-1, items.length, 1.5, Number.NaN]) {
      expect(() => value.get(index)).toThrow(RangeError);
      expect(() => value.getSize(index)).toThrow(RangeError);
    }
  });

  it("empty", () => {
    const value = SerializedList.empty();
    expect(value.length).toBe(0);
    expect(value.bytes.length).toBe(0);
    expect([...value]).toEqual([]);
    expect(value.toArray()).toEqual([]);
    expect(SerializedList.fromArray([])).toEqual(value);
    // fresh instance, a root may be cached on it
    expect(SerializedList.empty()).not.toBe(value);
  });

  it("fromArray does not keep references to input items", () => {
    const input = [Uint8Array.from([1, 2])];
    const value = SerializedList.fromArray(input);
    input[0][0] = 9;
    expect(value.get(0)).toEqual(Uint8Array.from([1, 2]));
  });
});

describe("SerializedList deserialized value", () => {
  const items = randomItems(createRng(4), 12, "mixed", 2000);

  for (const {oldType, newType} of transactionsPairs) {
    describe(newType.typeName, () => {
      const serialized = oldType.serialize(items);

      // The list at a non-zero offset of a bigger buffer, as when nested in a container
      const prefix = 5;
      const buffer = new Uint8Array(prefix + serialized.length + 3).fill(0xaa);
      buffer.set(serialized, prefix);
      const dataView = new DataView(buffer.buffer);
      const deserialize = (reuseBytes: boolean): SerializedList =>
        newType.value_deserializeFromBytes(
          {uint8Array: buffer, dataView},
          prefix,
          prefix + serialized.length,
          reuseBytes
        );

      it("is deep equal to fromArray() of the same items, with and without reuseBytes", () => {
        // Only bytes and offsets are own enumerable properties, so deep equality is by content
        expect(deserialize(false)).toEqual(SerializedList.fromArray(items));
        expect(deserialize(true)).toEqual(SerializedList.fromArray(items));
        expect(Object.keys(deserialize(false)).sort()).toEqual(["bytes", "offsets"]);
      });

      it("reuseBytes = false copies the input once", () => {
        const value = deserialize(false);
        expect(value.bytes.buffer).not.toBe(buffer.buffer);
        expect(value.bytes.byteOffset).toBe(0);
        expect(value.bytes.buffer.byteLength).toBe(serialized.length);
      });

      it("reuseBytes = true references the input", () => {
        const value = deserialize(true);
        expect(value.bytes.buffer).toBe(buffer.buffer);
        expect(value.bytes.byteOffset).toBe(prefix);
        expect(value.toArray()).toEqual(items);
      });

      it("does not mutate the input", () => {
        const copy = buffer.slice();
        deserialize(false);
        deserialize(true);
        expect(buffer).toEqual(copy);
      });

      it("deserializes from a Buffer, same as the old type", () => {
        const value = newType.deserialize(Buffer.from(serialized));
        // Both keep the Buffer species of the input for elements
        expect(value.toArray()).toEqual(oldType.deserialize(Buffer.from(serialized)));
        expect(newType.equals(value, SerializedList.fromArray(items))).toBe(true);
      });
    });
  }
});
