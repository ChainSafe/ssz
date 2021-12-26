import {expect} from "chai";
import {CompositeType, fromHexString, toHexString, TreeBacked, Type} from "../../../src";

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
  typeName,
  type,
  defaultValue,
  values,
}: {
  typeName: string;
  type: Type<T>;
  defaultValue?: T;
  values: TypeTestValid<T>[];
}): void {
  describe(`${typeName} valid`, () => {
    if (defaultValue !== undefined) {
      it("defaultValue", () => {
        const actual = type.defaultValue();
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
  typeName,
  type,
  values,
}: {
  typeName: string;
  type: Type<T>;
  values: {
    id?: string;
    serialized: string;
    error: string;
  }[];
}): void {
  describe(`${typeName} invalid`, () => {
    for (const testCase of values) {
      const {id, serialized, error} = testCase;

      describe(id ?? serialized, () => {
        it("struct deserialize", () => {
          expect(() => type.deserialize(fromHexString(serialized))).to.throw(error);
        });

        const typeComposite = type as CompositeType<Record<string, any>>;
        if (typeComposite.createTreeBacked !== undefined) {
          it("tree deserialize", () => {
            expect(() => typeComposite.createTreeBackedFromBytes(fromHexString(serialized))).to.throw(error);
          });
        }
      });
    }
  });
}

export type TreeMutation<T> = {
  id: string;
  valueBefore: T;
  valueAfter: T;
  fn: (treeView: TreeBacked<T>) => TreeBacked<T> | void;
};

/**
 * Generate various tests for a given type and and array of mutations to a tree view.
 */
export function runTypeTestTreeViewMutations<T>({
  typeName,
  type,
  mutations: ops,
}: {
  typeName: string;
  type: CompositeType<T>;
  mutations: TreeMutation<T>[];
}): void {
  describe(`${typeName} TreeView mutations`, () => {
    for (const testCase of ops) {
      const {id, valueBefore, valueAfter, fn} = testCase;

      it(id, () => {
        const tvBefore = type.createTreeBackedFromStruct(valueBefore);

        const tvAfter = (fn(tvBefore) as TreeBacked<T> | undefined) ?? tvBefore;

        expect(type.toJson(type.tree_convertToStruct(tvAfter.tree))).to.deep.equal(
          type.toJson(valueAfter),
          "tree after mutation does not equal valueAfter"
        );

        expect(toHexString(tvAfter.hashTreeRoot())).to.deep.equal(
          toHexString(type.hashTreeRoot(valueAfter)),
          "tree after mutation root does not equal valueAfter root"
        );
      });
    }
  });
}
