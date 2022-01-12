import fs from "fs";
import path from "path";
import {ACTIVE_PRESET, ForkName, PresetName} from "@chainsafe/lodestar-params";
import {ContainerType, Type} from "../../src";
import {ssz} from "../lodestarTypes";
import {SPEC_TEST_LOCATION} from "../specTestVersioning";
import {replaceUintTypeWithUintBigintType} from "./replaceUintTypeWithUintBigintType";
import {parseSszStaticTestcase} from "./testRunner";
import {runValidTest} from "./generic/index.test";

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
  Eth1Block: new ContainerType({
    timestamp: ssz.Number64,
    depositRoot: ssz.Root,
    depositCount: ssz.Number64,
  }),
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

function testStatic(typeName: string, sszType: Type<unknown>, forkName: ForkName, preset: PresetName): void {
  const typeDir = path.join(SPEC_TEST_LOCATION, `tests/${preset}/${forkName}/ssz_static/${typeName}`);

  for (const caseName of fs.readdirSync(typeDir)) {
    describe(`${preset}/${forkName}/ssz_static/${typeName}/${caseName}`, () => {
      const sszTypeNoUint = replaceUintTypeWithUintBigintType(sszType);
      const testData = parseSszStaticTestcase(path.join(typeDir, caseName));
      runValidTest(sszTypeNoUint, testData);
    });
  }
}
