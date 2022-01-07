import {expect} from "chai";
import path from "path";
import fs from "fs";
// eslint-disable-next-line no-restricted-imports
import {parseInvalidTestcase, parseValidTestcase} from "@chainsafe/lodestar-spec-test-util/lib/sszGeneric";
import {CompositeType, isCompositeType, toHexString, Type} from "../../../src";
import {Type as TypeV2, CompositeType as CompositeTypeV2} from "../../../src/v2/abstract";
import {SPEC_TEST_LOCATION} from "../../specTestVersioning";

// Test types defined here
import {getTestType as getTestTypeV1} from "./types";
import {getTestType as getTestTypeV2} from "./typesV2";

const rootGenericSszPath = path.join(SPEC_TEST_LOCATION, "tests", "general", "phase0", "ssz_generic");

type TypeVN = {
  deserialize(data: Uint8Array): unknown;
  serialize(value: unknown): Uint8Array;
  hashTreeRoot(value: unknown): Uint8Array;
  equals(value1: unknown, value2: unknown): boolean;
};
type GetTestType = (testType: string, testCase: string) => TypeVN;

const byTypeVersion: [GetTestType, "v1" | "v2"][] = [
  [getTestTypeV1, "v1" as const],
  [getTestTypeV2, "v2" as const],
];

// ssz_generic
// | basic_vector
//   | invalid
//     | vec_bool_0
//       | serialized.ssz_snappy
//   | valid
//     | vec_bool_1_max
//       | meta.yaml
//       | serialized.ssz_snappy
//       | value.yaml
//
// Docs: https://github.com/ethereum/eth2.0-specs/blob/master/tests/formats/ssz_generic/README.md

for (const testType of fs.readdirSync(rootGenericSszPath)) {
  const testTypePath = path.join(rootGenericSszPath, testType);

  describe(`${testType} invalid`, () => {
    const invalidCasesPath = path.join(testTypePath, "invalid");
    for (const invalidCase of fs.readdirSync(invalidCasesPath)) {
      for (const [getTestType, typeV] of byTypeVersion) {
        it(`${invalidCase} - ${typeV}`, () => {
          // TODO: Strong type errors and assert that the entire it() throws known errors
          if (invalidCase.endsWith("_0") && typeV === "v2") {
            expect(() => getTestType(testType, invalidCase), "Must throw constructing type").to.throw();
            return;
          }

          const type = getTestType(testType, invalidCase);
          const testData = parseInvalidTestcase(path.join(invalidCasesPath, invalidCase));

          /* eslint-disable no-console */
          if (process.env.DEBUG) {
            console.log({serialized: Buffer.from(testData.serialized).toString("hex")});
          }

          // Unlike the valid suite, invalid encodings do not have any value or hash tree root. The serialized data
          // should simply not be decoded without raising an error.
          // Note that for some type declarations in the invalid suite, the type itself may technically be invalid.
          // This is a valid way of detecting invalid data too. E.g. a 0-length basic vector.
          expect(() => type.deserialize(testData.serialized), "Must throw on deserialize").to.throw();
        });
      }
    }
  });

  describe(`${testType} valid`, () => {
    const validCasesPath = path.join(testTypePath, "valid");
    for (const validCase of fs.readdirSync(validCasesPath)) {
      // NOTE: ComplexTestStruct tests are not correctly generated.
      // where deserialized .d value is D: '0x00'. However the tests guide mark that field as D: Bytes[256].
      // Those test won't be fixed since most implementations staticly compile types.
      if (validCase.startsWith("ComplexTestStruct")) {
        continue;
      }

      for (const [getTestType, typeV] of byTypeVersion) {
        it(`${validCase} - ${typeV}`, () => {
          const type = getTestType(testType, validCase);

          const testData = parseValidTestcase(path.join(validCasesPath, validCase), type as Type<any>);
          const testDataSerialized = toHexString(testData.serialized);
          const testDataRoot = toHexString(testData.root);

          if (process.env.DEBUG) {
            console.log("serialized", Buffer.from(testData.serialized).toString("hex"));
          }

          const serialized = wrapErr(() => type.serialize(testData.value), "type.serialize()");
          const value = wrapErr(() => type.deserialize(copy(testData.serialized)), "type.deserialize()");
          const root = wrapErr(() => type.hashTreeRoot(testData.value), "type.hashTreeRoot()");
          const valueSerdes = wrapErr(() => type.deserialize(serialized), "type.deserialize(serialized)");

          expect(valueSerdes).to.deep.equal(testData.value, "round trip serdes");
          expect(toHexString(serialized)).to.equal(testDataSerialized, "struct serialize");
          expect(value).to.deep.equal(testData.value, "struct deserialize");
          expect(toHexString(root)).to.equal(testDataRoot, "struct hashTreeRoot");

          // If the type is composite, test tree-backed ops
          if (typeV === "v1") {
            if (!isCompositeType(type as Type<unknown>)) return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const compositeType = type as CompositeType<any>;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const treebackedValue = compositeType.createTreeBackedFromStruct(testData.value);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const treeToStruct = compositeType.tree_convertToStruct(treebackedValue.tree);

            expect(treeToStruct).to.deep.equal(testData.value, "tree-backed to struct");
            expect(type.equals(testData.value, treebackedValue), "struct - tree-backed type.equals()").to.be.true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            expect(toHexString(treebackedValue.serialize())).to.equal(testDataSerialized, "tree-backed serialize");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            expect(toHexString(treebackedValue.hashTreeRoot())).to.equal(testDataRoot, "tree-backed hashTreeRoot");
          }

          // v2
          else if (typeV === "v2") {
            if ((type as TypeV2<unknown>).isBasic) return;

            const compositeType = type as CompositeTypeV2<any, any, any>;

            const node = compositeType.tree_deserializeFromBytes(testData.serialized, 0, testData.serialized.length);
            expect(toHexString(node.root)).to.equal(testDataRoot, "tree-backed hashTreeRoot");

            const treeBytes = new Uint8Array(compositeType.tree_serializedSize(node));
            compositeType.tree_serializeToBytes(treeBytes, 0, node);
            expect(toHexString(treeBytes)).to.equal(testDataSerialized, "tree-backed serialize");
          }
        });
      }
    }
  });
}

function copy(buf: Uint8Array): Uint8Array {
  const copy = new Uint8Array(buf.length);
  copy.set(buf);
  return copy;
}

function wrapErr<T>(fn: () => T, prefix: string): T {
  try {
    return fn();
  } catch (e) {
    (e as Error).message = `${prefix}: ${(e as Error).message}`;
    throw e;
  }
}
