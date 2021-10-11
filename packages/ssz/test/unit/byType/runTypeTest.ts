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

export function runTypeTest<T>({
  typeName,
  type,
  defaultValue,
  values,
}: {
  typeName: string;
  type: Type<T>;
  defaultValue: T;
  values: {
    id: string | number;
    serialized: string;
    json: any;
    root: string;
    skipToJsonTest?: boolean;
  }[];
}): void {
  describe(typeName, () => {
    it("defaultValue", () => {
      const actual = type.defaultValue();
      expect(type.equals(actual, defaultValue));
    });

    for (const {id, serialized, json, root, skipToJsonTest} of values) {
      describe(String(id), () => {
        let struct: any;

        before("fromJson", () => {
          struct = type.fromJson(json);
        });

        if (!skipToJsonTest) {
          it("struct toJson", () => {
            expect(type.toJson(struct)).to.deep.equal(json);
          });
        }

        it("struct deserialize", () => {
          if (skipToJsonTest) {
            expect(type.deserialize(fromHexString(serialized))).to.deep.equal(struct);
          } else {
            expect(type.toJson(type.deserialize(fromHexString(serialized)))).to.deep.equal(json);
          }
        });

        it("struct serialize", () => {
          expect(toHexString(type.serialize(struct))).to.equal(serialized);
        });

        it("struct hashTreeRoot", () => {
          expect(toHexString(type.hashTreeRoot(struct))).to.equal(root);
        });

        it("struct clone + equals", () => {
          expect(type.equals(type.clone(struct), struct));
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
