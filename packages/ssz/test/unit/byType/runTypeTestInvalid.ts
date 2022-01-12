import {expect} from "chai";
import {CompositeType, fromHexString, Type} from "../../../src";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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
export function runTypeTestInvalid<T>({
  type,
  values,
}: {
  type: Type<T>;
  values: {
    id?: string;
    serialized: string;
    error: string;
  }[];
}): void {
  describe(`${type.typeName} invalid`, () => {
    for (const testCase of values) {
      const {id, serialized, error} = testCase;

      describe(id ?? serialized, () => {
        it("struct deserialize", () => {
          expect(() => type.deserialize(fromHexString(serialized))).to.throw(error);
        });

        const typeComposite = type as CompositeType<unknown, unknown, unknown>;
        if (!typeComposite.isBasic) {
          it("tree deserialize toView", () => {
            expect(() => typeComposite.deserializeToView(fromHexString(serialized))).to.throw(error);
          });

          it("tree deserialize toViewDU", () => {
            expect(() => typeComposite.deserializeToViewDU(fromHexString(serialized))).to.throw(error);
          });
        }
      });
    }
  });
}
