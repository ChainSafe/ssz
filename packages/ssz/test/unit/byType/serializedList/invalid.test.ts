import {describe, expect, it} from "vitest";
import {
  ByteListType,
  ByteVectorType,
  ListCompositeType,
  ProgressiveListCompositeType,
  ProgressiveSerializedListType,
  SerializedListType,
  fromHexString,
} from "../../../../src/index.ts";
import {
  SMALL_LIMIT,
  SMALL_LIMIT_BYTES,
  TypePair,
  asComposite,
  getErrorMessage,
  smallLimitPairs,
  transactionsPairs,
  zeroLimitProgressivePair,
} from "./pairs.ts";

type InvalidCase = {id: string; serialized?: string; json?: unknown};

/** Invalid regardless of limits */
const invalidCases: InvalidCase[] = [
  {id: "first offset 0", serialized: "0x00000000"},
  {id: "first offset not multiple of 4", serialized: "0x0500000000"},
  {id: "first offset out of bounds", serialized: "0x08000000"},
  {id: "first offset way out of bounds", serialized: "0xf0ffffff0c0000000102"},
  {id: "offsets decreasing", serialized: "0x0c0000000a0000000c0000000102"},
  {id: "offset out of bounds", serialized: "0x080000001000000001"},
  {id: "data shorter than an offset - 1 byte", serialized: "0x04"},
  {id: "data shorter than an offset - 3 bytes", serialized: "0x040000"},
  {id: "json object", json: {}},
  {id: "json null", json: null},
  {id: "json string", json: "0x00"},
  {id: "json number element", json: [1]},
  {id: "json odd hex element", json: ["0x0"]},
];

/** Invalid for the small limit types: ByteList[SMALL_LIMIT_BYTES], SMALL_LIMIT elements */
const overLimitCases: InvalidCase[] = [
  {
    id: "list length over limit",
    serialized: `0x${"14000000".repeat(SMALL_LIMIT + 1)}`,
    json: Array.from({length: SMALL_LIMIT + 1}, () => "0x"),
  },
  {
    id: "first element over limitBytes",
    serialized: `0x04000000${"00".repeat(SMALL_LIMIT_BYTES + 1)}`,
    json: [`0x${"00".repeat(SMALL_LIMIT_BYTES + 1)}`],
  },
  {
    id: "second element over limitBytes",
    serialized: `0x080000000900000001${"00".repeat(SMALL_LIMIT_BYTES + 1)}`,
    json: ["0x01", `0x${"00".repeat(SMALL_LIMIT_BYTES + 1)}`],
  },
  {
    id: "list length over limit and element over limitBytes",
    serialized: `0x${"14000000".repeat(SMALL_LIMIT)}14000000${"00".repeat(SMALL_LIMIT_BYTES + 1)}`,
  },
];

for (const pair of transactionsPairs) {
  runInvalidCompatTest(pair, invalidCases);
}
for (const pair of smallLimitPairs) {
  runInvalidCompatTest(pair, [...invalidCases, ...overLimitCases]);
}
runInvalidCompatTest(zeroLimitProgressivePair, [
  {id: "1 element over limit 0", serialized: "0x04000000", json: ["0x"]},
]);

/**
 * Both types must reject the same inputs with the same error, for all deserialization paths
 */
function runInvalidCompatTest({id, oldType, newType}: TypePair, cases: InvalidCase[]): void {
  describe(`${id} - ${newType.typeName} invalid same as ${oldType.constructor.name}`, () => {
    const oldComposite = asComposite(oldType);
    const newComposite = asComposite(newType);

    for (const testCase of cases) {
      if (testCase.serialized !== undefined) {
        const serialized = testCase.serialized;

        it(`${testCase.id} - deserialize`, () => {
          expectSameError(
            () => oldType.deserialize(fromHexString(serialized)),
            () => newType.deserialize(fromHexString(serialized))
          );
        });

        it(`${testCase.id} - tree_deserializeFromBytes`, () => {
          const uint8Array = fromHexString(serialized);
          const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
          expectSameError(
            () => oldType.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length),
            () => newType.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length)
          );
        });

        it(`${testCase.id} - deserializeToView / deserializeToViewDU`, () => {
          expectSameError(
            () => oldComposite.deserializeToView(fromHexString(serialized)),
            () => newComposite.deserializeToView(fromHexString(serialized))
          );
          expectSameError(
            () => oldComposite.deserializeToViewDU(fromHexString(serialized)),
            () => newComposite.deserializeToViewDU(fromHexString(serialized))
          );
        });

        it(`${testCase.id} - deserialize within a larger buffer`, () => {
          // Same input at a non-zero, non-aligned offset of a bigger buffer, as when nested in a container
          const inner = fromHexString(serialized);
          const uint8Array = new Uint8Array(inner.length + 7);
          uint8Array.set(inner, 3);
          const dataView = new DataView(uint8Array.buffer);
          expectSameError(
            () => oldType.value_deserializeFromBytes({uint8Array, dataView}, 3, 3 + inner.length),
            () => newType.value_deserializeFromBytes({uint8Array, dataView}, 3, 3 + inner.length)
          );
        });
      }

      if (testCase.json !== undefined) {
        const json = testCase.json;
        it(`${testCase.id} - fromJson`, () => {
          expectSameError(
            () => oldType.fromJson(json),
            () => newType.fromJson(json)
          );
        });
      }
    }
  });
}

function expectSameError(oldFn: () => unknown, newFn: () => unknown): void {
  const oldError = getErrorMessage(oldFn);
  expect(getErrorMessage(newFn)).toBe(oldError);
}

describe("SerializedList types invalid at constructor, same as old types", () => {
  const elementType = smallLimitPairs[0].oldType.elementType;

  it("List limit", () => {
    for (const limit of [0, -1, 1.5]) {
      expect(getErrorMessage(() => new SerializedListType(elementType, limit))).toBe(
        getErrorMessage(() => new ListCompositeType(elementType, limit))
      );
    }
  });

  it("ProgressiveList limit", () => {
    for (const limit of [-1, 1.5]) {
      expect(getErrorMessage(() => new ProgressiveSerializedListType(elementType, {limit}))).toBe(
        getErrorMessage(() => new ProgressiveListCompositeType(elementType, {limit}))
      );
    }
  });

  it("elementType must be ByteListType or ProgressiveByteListType", () => {
    const notByteList = new ByteVectorType(8) as unknown as ByteListType;
    const error = "elementType must be ByteListType or ProgressiveByteListType";
    expect(() => new SerializedListType(notByteList, 2)).toThrow(error);
    expect(() => new ProgressiveSerializedListType(notByteList)).toThrow(error);
  });
});
