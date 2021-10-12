import {expect} from "chai";
import {CompositeType, fromHexString, toHexString, Type} from "../../../src";

// To test
// - [x] .clone()
// - [x] .defaultValue()
// - [x] .deserialize()
// - [x] .serialize()
// - [x] .equals()
// - [x] .hashTreeRoot()
// - [x] .fromJson()
// - [x] .toJson()
// - [ ] .createProof()

// Generate various types of types

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export function runTypeTest<T>({
  typeName,
  type,
  defaultValue,
  values,
}: {
  typeName: string;
  type: Type<T>;
  defaultValue?: T;
  values: {
    id?: string;
    serialized: string;
    json: any;
    root?: string;
    skipToJsonTest?: boolean;
  }[];
}): void {
  describe(typeName, () => {
    if (defaultValue !== undefined) {
      it("defaultValue", () => {
        const actual = type.defaultValue();
        expect(type.equals(actual, defaultValue));
      });
    }

    for (const testCase of values) {
      const {id, serialized, json, root, skipToJsonTest} = testCase;
      let value: any;

      describe(id ?? serialized, () => {
        before("fromJson", () => {
          value = type.fromJson(json);
        });

        if (!skipToJsonTest) {
          it("struct toJson", () => {
            expect(type.toJson(value)).to.deep.equal(json);
          });
        }

        it("struct deserialize", () => {
          if (skipToJsonTest) {
            expect(type.deserialize(fromHexString(serialized))).to.deep.equal(value);
          } else {
            expect(type.toJson(type.deserialize(fromHexString(serialized)))).to.deep.equal(json);
          }
        });

        it("struct serialize", () => {
          expect(toHexString(type.serialize(value))).to.equal(serialized);
        });

        it("struct hashTreeRoot", () => {
          expect(toHexString(type.hashTreeRoot(value))).to.equal(root);
        });

        it("struct clone + equals", () => {
          expect(type.equals(type.clone(value), value));
        });

        const typeComposite = type as CompositeType<Record<string, any>>;
        if (typeComposite.createTreeBacked !== undefined) {
          it("tree deserialize from bytes", () => {
            const tree = typeComposite.createTreeBackedFromBytes(fromHexString(serialized));
            expect(toHexString(tree.hashTreeRoot())).to.equal(root);
          });

          it("tree deserialize from json", () => {
            const tree = typeComposite.createTreeBackedFromJson(json);
            expect(toHexString(tree.hashTreeRoot())).to.equal(root);
          });
        }
      });
    }
  });
}

/**
 * Shorter version of runTypeTest with only serialized test
 */
export function runTypeValueTest<T>({
  typeName,
  type,
  defaultValue,
  values,
}: {
  typeName: string;
  type: Type<T>;
  defaultValue?: T;
  values: {
    serialized: string;
    value: any;
  }[];
}): void {
  describe(typeName, () => {
    if (defaultValue !== undefined) {
      it("defaultValue", () => {
        const actual = type.defaultValue();
        expect(type.equals(actual, defaultValue));
      });
    }

    for (const testCase of values) {
      const {serialized, value} = testCase;

      describe(serialized, () => {
        it("struct deserialize", () => {
          expect(type.deserialize(fromHexString(serialized))).to.deep.equal(value);
        });

        it("struct serialize", () => {
          expect(toHexString(type.serialize(value))).to.equal(serialized);
        });
      });
    }
  });
}
