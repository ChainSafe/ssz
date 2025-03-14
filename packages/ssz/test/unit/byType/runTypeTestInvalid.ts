import {describe, it, expect} from "vitest";
import {CompositeType, fromHexString, Type} from "../../../src/index.js";



// For better typesafety outside
export type InvalidValue = InvalidValueMeta &
  ({serialized: string} | {json: unknown} | {serialized: string; json: unknown});
// To be able to access all properties here
type InvalidValueAll = InvalidValueMeta & {serialized?: string; json?: unknown};

type InvalidValueMeta = {id?: string; error?: string};

/**
 * Generate various tests for a given type and and array of INVALID values. Tests:
 * - [x] .deserialize() - struct
 * - [x] .deserialize() - tree
 *
 * Example of a full test:
 * ```ts
 * runTypeTestValid({
 *   typeName: "boolean",
 *   type: booleanType,
 *   defaultValue: false,
 *   values: [{
 *     id: "true",
 *     serialized: "0x01",
 *     json: true,
 *     root: "0x0100000000000000000000000000000000000000000000000000000000000000",
 *   }],
 * });
 * ```
 *
 * Example of a short test:
 * ```ts
 * runTypeTestValid({
 *   typeName: "NumberUintType(2)",
 *   type: new NumberUintType({byteLength: 2}),
 *   values: [
 *     {value: 2 ** 8, serialized: "0x0001"},
 *   ],
 * });
 *
 * ```
 */
export function runTypeTestInvalid<T>({type, values}: {type: Type<T>; values: InvalidValue[]}): void {
  describe(`${type.typeName} invalid`, () => {
    for (const testCase of values) {
      const {serialized, json, error} = testCase as InvalidValueAll;
      let {id} = testCase;

      if (json !== undefined) {
        if (!id) id = String(json);
        it(`${id} - fromJson`, () => {
          expect(() => type.fromJson(json)).toThrow(error);
        });
      }

      if (serialized !== undefined) {
        if (!id) id = serialized;
        const uint8Array = fromHexString(serialized);
        const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);

        it(`${id} - struct deserialize`, () => {
          expect(() => type.deserialize(uint8Array)).toThrow(error);
        });

        it(`${id} - tree deserialize`, () => {
          expect(() => type.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length)).toThrow(error);
        });

        const typeComposite = type as CompositeType<unknown, unknown, unknown>;
        if (!typeComposite.isBasic) {
          it(`${id} - tree deserialize toView`, () => {
            expect(() => typeComposite.deserializeToView(fromHexString(serialized))).toThrow(error);
          });

          it(`${id} - tree deserialize toViewDU`, () => {
            expect(() => typeComposite.deserializeToViewDU(fromHexString(serialized))).toThrow(error);
          });
        }
      }
    }
  });
}
