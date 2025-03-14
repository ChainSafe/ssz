import fs from "node:fs";
import path from "node:path";
import {describe, expect, it } from "vitest";
import {ethereumConsensusSpecsTests} from "../../specTestVersioning.js";
import {runValidSszTest} from "../runValidTest.js";
import {parseSszGenericInvalidTestcase, parseSszGenericValidTestcase } from "../testRunner.js";
import {getTestType} from "./types.js";

const rootGenericSszPath = path.join(
  ethereumConsensusSpecsTests.outputDir,
  "tests",
  "general",
  "phase0",
  "ssz_generic"
);

for (const testType of fs.readdirSync(rootGenericSszPath)) {
  const testTypePath = path.join(rootGenericSszPath, testType);

  describe(`${testType} invalid`, () => {
    const invalidCasesPath = path.join(testTypePath, "invalid");
    for (const invalidCase of fs.readdirSync(invalidCasesPath)) {
      const onlyId = process.env.ONLY_ID;
      if (onlyId && !invalidCase.includes(onlyId)) {
        continue;
      }

      it(invalidCase, () => {
        // TODO: Strong type errors and assert that the entire it() throws known errors
        if (invalidCase.endsWith("_0")) {
          expect(() => getTestType(testType, invalidCase), "Must throw constructing type").toThrow();
          return;
        }

        const type = getTestType(testType, invalidCase);
        const testData = parseSszGenericInvalidTestcase(path.join(invalidCasesPath, invalidCase));

        
        if (process.env.DEBUG) {
          console.log({serialized: Buffer.from(testData.serialized).toString("hex")});
        }

        // Unlike the valid suite, invalid encodings do not have any value or hash tree root. The serialized data
        // should simply not be decoded without raising an error.
        // Note that for some type declarations in the invalid suite, the type itself may technically be invalid.
        // This is a valid way of detecting invalid data too. E.g. a 0-length basic vector.
        expect(() => type.deserialize(testData.serialized), "Must throw on deserialize").toThrow();
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

      const onlyId = process.env.ONLY_ID;
      if (onlyId && !validCase.includes(onlyId)) {
        continue;
      }

      it(validCase, () => {
        const type = getTestType(testType, validCase);
        const testData = parseSszGenericValidTestcase(path.join(validCasesPath, validCase));
        runValidSszTest(type, {
          root: testData.root,
          serialized: testData.serialized,
          jsonValue: testData.jsonValue,
        });
      });
    }
  });
}
