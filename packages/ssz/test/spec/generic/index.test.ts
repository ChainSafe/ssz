import {expect} from "chai";
import path from "path";
import fs from "fs";
import {CompositeType, toHexString, Type} from "../../../src";
import {SPEC_TEST_LOCATION} from "../../specTestVersioning";
import {parseSszGenericValidTestcase, parseSszGenericInvalidTestcase, ValidTestCaseData} from "../testRunner";

// Test types defined here
import {getTestType} from "./types";
import {Node} from "@chainsafe/persistent-merkle-tree";

const rootGenericSszPath = path.join(SPEC_TEST_LOCATION, "tests", "general", "phase0", "ssz_generic");

for (const testType of fs.readdirSync(rootGenericSszPath)) {
  const testTypePath = path.join(rootGenericSszPath, testType);

  describe(`${testType} invalid`, () => {
    const invalidCasesPath = path.join(testTypePath, "invalid");
    for (const invalidCase of fs.readdirSync(invalidCasesPath)) {
      it(invalidCase, () => {
        // TODO: Strong type errors and assert that the entire it() throws known errors
        if (invalidCase.endsWith("_0")) {
          expect(() => getTestType(testType, invalidCase), "Must throw constructing type").to.throw();
          return;
        }

        const type = getTestType(testType, invalidCase);
        const testData = parseSszGenericInvalidTestcase(path.join(invalidCasesPath, invalidCase));

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

      it(validCase, () => {
        const type = getTestType(testType, validCase);
        const testData = parseSszGenericValidTestcase(path.join(validCasesPath, validCase));
        runValidTest(type, testData);
      });
    }
  });
}

export function runValidTest(type: Type<unknown>, testData: ValidTestCaseData): void {
  const testDataSerialized = toHexString(testData.serialized);
  const testDataRoot = toHexString(testData.root);

  if (process.env.DEBUG) {
    console.log("serialized", Buffer.from(testData.serialized).toString("hex"));
  }

  function assertBytes(bytes: Uint8Array, msg: string): void {
    expect(toHexString(bytes)).to.equal(testDataSerialized, `Wrong serialized - ${msg}`);
  }

  function assertValue(value: unknown, msg: string): void {
    expect(type.toJson(value)).to.deep.equal(testData.jsonValue, `Wrong value - ${msg}`);
  }

  function assertRoot(root: Uint8Array, msg: string): void {
    expect(toHexString(root)).to.equal(testDataRoot, `Wrong root - ${msg}`);
  }

  function assertNode(node: Node, msg: string): void {
    expect(toHexString(node.root)).to.equal(testDataRoot, `Wrong node - ${msg}`);
  }

  // JSON -> value - fromJson()
  const testDataValue = wrapErr(() => type.fromJson(testData.jsonValue), "type.fromJson()");

  // value -> bytes - serialize()
  const serialized = wrapErr(() => type.serialize(testDataValue), "type.serialize()");
  assertBytes(serialized, "type.serialize()");

  {
    // bytes -> value - deserialize()
    const value = wrapErr(() => type.deserialize(copy(testData.serialized)), "type.deserialize()");
    assertValue(value, "type.deserialize()");
  }

  {
    // hashTreeRoot()
    const root = wrapErr(() => type.hashTreeRoot(testDataValue), "type.hashTreeRoot()");
    assertRoot(root, "type.hashTreeRoot()");
  }

  // value -> tree - value_toTree()
  const node = wrapErr(() => type.value_toTree(testDataValue), "type.value_toTree()");
  assertNode(node, "type.value_toTree()");

  {
    // tree -> value -
    const value = wrapErr(() => type.tree_toValue(node), "type.tree_toValue()");
    assertValue(value, "type.tree_toValue()");
  }

  {
    // tree -> bytes
    const output = new Uint8Array(type.tree_serializedSize(node));
    type.tree_serializeToBytes(output, 0, node);
    assertBytes(output, "type.tree_serializeToBytes");
  }

  {
    // bytes -> tree
    const node = type.tree_deserializeFromBytes(copy(testData.serialized), 0, testData.serialized.length);
    assertNode(node, "type.tree_deserializeFromBytes()");
  }

  if (!type.isBasic) {
    const compositeType = type as CompositeType<unknown, unknown, unknown>;

    const view = compositeType.deserializeToView(copy(testData.serialized));
    assertNode(compositeType.commitView(view), "deserializeToView");

    const viewDU = compositeType.deserializeToViewDU(copy(testData.serialized));
    assertNode(compositeType.commitViewDU(viewDU), "deserializeToViewDU");
  }
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
