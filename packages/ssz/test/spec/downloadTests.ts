import fs from "fs";
import path from "path";
import {execSync} from "child_process";
import {SPEC_TEST_LOCATION, SPEC_TEST_VERSION, SPEC_TEST_REPO_URL} from "../specTestVersioning";

/* eslint-disable no-console */

const specVersion = SPEC_TEST_VERSION;
const outputDir = SPEC_TEST_LOCATION;
const specTestsRepoUrl = SPEC_TEST_REPO_URL;
const defaultTestsToDownload = ["general", "mainnet", "minimal"];

const versionFile = path.join(outputDir, "version.txt");
const existingVersion = fs.existsSync(versionFile) && fs.readFileSync(versionFile, "utf8").trim();

if (existingVersion === specVersion) {
  console.log(`version ${specVersion} already downloaded`);
  process.exit(0);
} else {
  console.log(`Downloading new version ${specVersion}`);
}

if (fs.existsSync(outputDir)) {
  console.log(`Cleaning existing version ${existingVersion} at ${outputDir}`);
  shell(`rm -rf ${outputDir}`);
}

fs.mkdirSync(outputDir, {recursive: true});

for (const test of defaultTestsToDownload) {
  const url = `${specTestsRepoUrl}/releases/download/${specVersion}/${test}.tar.gz`;
  console.log(`Downloading ${url} to ${outputDir}`);
  shell(`wget -c ${url} -O - | tar -xz --directory ${outputDir}`);
  console.log(`Downloaded ${url} to ${outputDir}`);
}

// If successful
fs.writeFileSync(versionFile, specVersion);

function shell(cmd: string): string {
  return execSync(cmd, {encoding: "utf8"}).trim();
}
