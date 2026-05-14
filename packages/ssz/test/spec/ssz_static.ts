import fs from "node:fs";
import path from "node:path";
import {describe, it} from "vitest";
import {Type, isCompositeType} from "../../src/index.ts";
import {ssz} from "../lodestarTypes/index.ts";
import {ACTIVE_PRESET} from "../lodestarTypes/params.ts";
import {ethereumConsensusSpecsTests} from "../specTestVersioning.ts";
import {runProofTestOnAllJsonPaths} from "../unit/byType/runTypeProofTest.ts";
import {ForkName} from "../utils/fork.ts";
import {replaceUintTypeWithUintBigintType} from "./replaceUintTypeWithUintBigintType.ts";
import {runValidSszTest} from "./runValidTest.ts";
import {parseSszStaticTestcase} from "./testRunner.ts";

// ssz_static
// | Attestation
//   | case_0
//     | roots.yaml
//     | serialized.ssz_snappy
//     | value.yaml
//
// Docs: https://github.com/ethereum/consensus-specs/blob/master/tests/formats/ssz_static/core.md

type Types = Record<string, Type<any>>;

export function sszStatic(fork: ForkName): void {
  const rootDir = path.join(ethereumConsensusSpecsTests.outputDir, `tests/${ACTIVE_PRESET}/${fork}/ssz_static`);
  for (const typeName of fs.readdirSync(rootDir)) {
    const type = (ssz[fork] as Types)[typeName] || (ssz.altair as Types)[typeName] || (ssz.phase0 as Types)[typeName];
    if (!type) {
      throw Error(`No type for ${typeName}`);
    }

    testStatic(typeName, type, fork, ACTIVE_PRESET);
  }
}

function testStatic(typeName: string, sszType: Type<unknown>, forkName: ForkName, preset: string): void {
  const typeDir = path.join(
    ethereumConsensusSpecsTests.outputDir,
    `tests/${preset}/${forkName}/ssz_static/${typeName}`
  );

  for (const caseName of fs.readdirSync(typeDir)) {
    describe(`${preset}/${forkName}/ssz_static/${typeName}/${caseName}`, () => {
      const sszTypeNoUint = replaceUintTypeWithUintBigintType(sszType);
      const caseDir = path.join(typeDir, caseName);
      for (const testId of fs.readdirSync(caseDir)) {
        const onlyId = process.env.ONLY_ID;
        if (onlyId && !testId.includes(onlyId)) {
          continue;
        }

        // Mainnet deals with big full states; timeout must be the 3rd arg to `it`
        // because `vi.setConfig` inside the test callback doesn't affect it.
        const timeout = preset === "mainnet" ? 30 * 1000 : undefined;
        it(
          testId,
          () => {
            const testData = parseSszStaticTestcase(path.join(caseDir, testId));
            const {node, json} = runValidSszTest(sszTypeNoUint, testData);

            // Run auto-generated proof tests only for minimal
            if (isCompositeType(sszTypeNoUint) && preset !== "mainnet") {
              runProofTestOnAllJsonPaths({type: sszTypeNoUint, node, json, rootHex: testData.root});
            }
          },
          timeout
        );
      }
    });
  }
}
