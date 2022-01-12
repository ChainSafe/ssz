import {expect} from "chai";
import {CompositeType, fromHexString, toHexString, Type} from "../../../src";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export type TypeTestValid<T> = {
  id?: string;
  serialized: string;
  json?: any;
  value?: T;
  root?: string;
  skipToJsonTest?: boolean;
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
  values: TypeTestValid<T>[];
}): void {
  describe(`${typeName ?? type.typeName} valid`, () => {
    if (defaultValue !== undefined) {
      it("defaultValue", () => {
        const actual = type.defaultValue;
        expect(type.equals(actual, defaultValue));
      });
    }

    for (const testCase of values) {
      const {id, serialized, json, root, skipToJsonTest, value: _value} = testCase;
      let value: any;

      describe(id ?? serialized, () => {
        before("Parse value", () => {
          value = json !== undefined ? type.fromJson(json) : _value;
        });

        if (!skipToJsonTest && json !== undefined) {
          it("struct toJson", () => {
            expect(type.toJson(value)).to.deep.equal(json);
          });
        }

        it("struct deserialize", () => {
          if (skipToJsonTest || json === undefined) {
            expect(type.deserialize(fromHexString(serialized))).to.deep.equal(value);
          } else {
            expect(type.toJson(type.deserialize(fromHexString(serialized)))).to.deep.equal(json);
          }
        });

        it("struct serialize", () => {
          expect(toHexString(type.serialize(value))).to.equal(serialized);
        });

        if (root !== undefined) {
          it("struct hashTreeRoot", () => {
            expect(toHexString(type.hashTreeRoot(value))).to.equal(root);
          });
        }

        const typeComposite = type as CompositeType<unknown, unknown, unknown>;
        if (!typeComposite.isBasic) {
          it("tree deserialize to view", () => {
            const view = typeComposite.deserializeToView(fromHexString(serialized));
            const node = typeComposite.commitView(view);
            expect(toHexString(node.root)).to.equal(root);
          });

          it("tree deserialize to viewDU", () => {
            const viewDU = typeComposite.deserializeToViewDU(fromHexString(serialized));
            const node = typeComposite.commitViewDU(viewDU);
            expect(toHexString(node.root)).to.equal(root);
          });
        }
      });
    }
  });
}
