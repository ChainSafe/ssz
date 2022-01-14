import fs from "fs";
import path from "path";
import {ContainerType, Type} from "../../src";
import {ssz} from "../lodestarTypes";
import {SPEC_TEST_LOCATION} from "../specTestVersioning";
import {replaceUintTypeWithUintBigintType} from "./replaceUintTypeWithUintBigintType";
import {parseSszStaticTestcase} from "./testRunner";
import {runValidSszTest} from "./runValidTest";
import {ForkName} from "./fork";
import {ACTIVE_PRESET} from "../lodestarTypes/params";

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

const extraTypes = {
  Eth1Block: new ContainerType(
    {
      timestamp: ssz.UintNumber64,
      depositRoot: ssz.Root,
      depositCount: ssz.UintNumber64,
    },
    {jsonCase: "snake"}
  ),
};

export function sszStatic(fork: ForkName): void {
  const rootDir = path.join(SPEC_TEST_LOCATION, `tests/${ACTIVE_PRESET}/${fork}/ssz_static`);
  for (const typeName of fs.readdirSync(rootDir)) {
    const type =
      (ssz[fork] as Types)[typeName] ||
      (ssz.altair as Types)[typeName] ||
      (ssz.phase0 as Types)[typeName] ||
      (extraTypes as Types)[typeName];
    if (!type) {
      throw Error(`No type for ${typeName}`);
    }

    testStatic(typeName, type, fork, ACTIVE_PRESET);
  }
}

// RUN_ONLY_FAILED_TEST mode:
// - Runs spec tests until 1 test fails. Then it persists its name
// - On the next run of the command it will solo that test such that's easily debuggable
// - Once that tests pass it will remove the flag file and allow to run all tests again in the next run
//
// example:
// $ RUN_ONLY_FAILED_TEST=true RENDER_JSON=true LODESTAR_FORK=merge yarn test:spec-static-minimal
//
const failedTestFilepath = "failedTest.txt";
const failedTestExists = fs.existsSync(failedTestFilepath);
const failedTestStr = failedTestExists ? fs.readFileSync(failedTestFilepath, "utf8") : "";
if (failedTestExists) {
  console.log("failedTestStr", failedTestStr);
}

const {RUN_ONLY_FAILED_TEST} = process.env;
if (RUN_ONLY_FAILED_TEST) {
  process.env.ONLY_CASE = failedTestStr.split(":")[0];
  process.env.ONLY_ID = failedTestStr.split(":")[1] ?? "";
}

function testStatic(typeName: string, sszType: Type<unknown>, forkName: ForkName, preset: string): void {
  const typeDir = path.join(SPEC_TEST_LOCATION, `tests/${preset}/${forkName}/ssz_static/${typeName}`);

  for (const caseName of fs.readdirSync(typeDir)) {
    const caseId = `${preset}/${forkName}/ssz_static/${typeName}/${caseName}`;
    const onlyCase = process.env.ONLY_CASE;
    if (onlyCase && !caseId.includes(onlyCase)) {
      continue;
    }

    describe(caseId, () => {
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

          try {
            const testData = parseSszStaticTestcase(path.join(caseDir, testId));
            runValidSszTest(sszTypeNoUint, testData);

            if (RUN_ONLY_FAILED_TEST && failedTestExists) {
              fs.unlinkSync(failedTestFilepath);
            }
          } catch (e) {
            if (RUN_ONLY_FAILED_TEST && !failedTestExists) {
              fs.writeFileSync(failedTestFilepath, `${caseId}:${testId}`);
              process.exit(666);
            }
            throw e;
          }
        });
      }
    });
  }
}
