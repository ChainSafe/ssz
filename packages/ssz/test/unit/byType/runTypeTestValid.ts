import {expect} from "chai";
import {Type} from "../../../src";
import {runValidSszTest, toJsonOrString} from "../../spec/runValidTest";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export type TypeTestValid = {
  id?: string;
  serialized: string;
  json: unknown;
  root: string | null;
};

/**
 * Generate various tests for a given type and and array of VALID values. Tests:
 * - [x] .clone()
 * - [x] .defaultValue()
 * - [x] .deserialize()
 * - [x] .serialize()
 * - [x] .equals()
 * - [x] .hashTreeRoot()
 * - [x] .fromJson()
 * - [x] .toJson()
 * - [ ] .createProof()
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
export function runTypeTestValid<T>({
  type,
  typeName,
  defaultValue,
  values,
}: {
  type: Type<T>;
  typeName?: string;
  defaultValue?: T;
  values: TypeTestValid[];
}): void {
  describe(`${typeName ?? type.typeName} valid`, () => {
    // Skip tests if ONLY_ID is set
    const onlyId = process.env.ONLY_ID;

    if (defaultValue !== undefined && (onlyId === undefined || onlyId === "defaultValue")) {
      it("defaultValue", () => {
        expect(toJsonOrString(type.toJson(type.defaultValue))).to.deep.equal(toJsonOrString(type.toJson(defaultValue)));
      });
    }

    for (let i = 0; i < values.length; i++) {
      const testCase = values[i];
      const testId = testCase.id ?? testCase.serialized;

      // Skip tests if ONLY_ID is set
      if (onlyId !== undefined && onlyId !== testId) {
        continue;
      }

      it(`${typeName ?? type.typeName} value ${i} - ${testId}`, () => {
        let root: string;
        if (typeof testCase.root === "string") {
          root = testCase.root;
        } else {
          if (type.isBasic) {
            root = testCase.serialized.padEnd(32 * 2 + 2, "0");
          } else {
            throw Error("Must set root");
          }
        }

        runValidSszTest(type, {
          root,
          serialized: testCase.serialized,
          jsonValue: testCase.json,
        });
      });
    }
  });
}
