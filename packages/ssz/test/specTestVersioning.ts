import path from "node:path";
import url from "node:url";
import {DownloadTestsOptions} from "@lodestar/spec-test-util/downloadTests";

// WARNING! Don't move or rename this file !!!
//
// This file is used to generate the cache ID for spec tests download in Github Actions CI
// It's path is hardcoded in: `.github/workflows/test-spec.yml`
//
// The contents of this file MUST include the URL, version and target path, and nothing else.

export const ethereumConsensusSpecsTests: DownloadTestsOptions = {
  specVersion: "v1.7.0-alpha.5",
  outputDir: path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../spec-tests"),
  specTestsRepoUrl: "https://github.com/ethereum/consensus-specs",
  testsToDownload: ["general", "mainnet", "minimal"],
};
