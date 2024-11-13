import fs from "fs";
import path from "path";
import {describe, it} from "vitest";
import {isCompositeType, Type} from "../../src";
import {ssz} from "../lodestarTypes";
import {SPEC_TEST_LOCATION} from "../specTestVersioning";
import {replaceUintTypeWithUintBigintType} from "./replaceUintTypeWithUintBigintType";
import {parseSszStaticTestcase} from "./testRunner";
import {runValidSszTest} from "./runValidTest";
import {ForkName} from "../utils/fork";
import {ACTIVE_PRESET} from "../lodestarTypes/params";
import {runProofTestOnAllJsonPaths} from "../unit/byType/runTypeProofTest";

// ssz_static
// | Attestation
//   | case_0
//     | roots.yaml
//     | serialized.ssz_snappy
//     | value.yaml
//
// Docs: https://github.com/ethereum/consensus-specs/blob/master/tests/formats/ssz_static/core.md

/* eslint-disable
  @typescript-eslint/naming-convention,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access,
  no-console
*/

// eslint-disable-next-line
type Types = Record<string, Type<any>>;

export function sszStatic(fork: ForkName): void {
  const rootDir = path.join(SPEC_TEST_LOCATION, `tests/${ACTIVE_PRESET}/${fork}/ssz_static`);
  for (const typeName of fs.readdirSync(rootDir)) {
    const type = (ssz[fork] as Types)[typeName] || (ssz.altair as Types)[typeName] || (ssz.phase0 as Types)[typeName];
    if (!type) {
      throw Error(`No type for ${typeName}`);
    }

    testStatic(typeName, type, fork, ACTIVE_PRESET);
  }
}

function testStatic(typeName: string, sszType: Type<unknown>, forkName: ForkName, preset: string): void {
  const typeDir = path.join(SPEC_TEST_LOCATION, `tests/${preset}/${forkName}/ssz_static/${typeName}`);

  for (const caseName of fs.readdirSync(typeDir)) {
    describe(`${preset}/${forkName}/ssz_static/${typeName}/${caseName}`, () => {
      const sszTypeNoUint = replaceUintTypeWithUintBigintType(sszType);
      const caseDir = path.join(typeDir, caseName);
      for (const testId of fs.readdirSync(caseDir)) {
        const onlyId = process.env.ONLY_ID;
        if (onlyId && !testId.includes(onlyId)) {
          continue;
        }

        it(testId, function () {
          // Mainnet must deal with big full states and hash each one multiple times
          if (preset === "mainnet") {
            this.timeout(30 * 1000);
          }

          const testData = parseSszStaticTestcase(path.join(caseDir, testId));
          const {node, json} = runValidSszTest(sszTypeNoUint, testData);

          // Run auto-generated proof tests only for minimal
          if (isCompositeType(sszTypeNoUint) && preset !== "mainnet") {
            runProofTestOnAllJsonPaths({type: sszTypeNoUint, node, json, rootHex: testData.root});
          }
        });
      }
    });
  }
}
