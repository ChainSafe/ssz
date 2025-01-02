import {AssemblyScriptSha256Hasher} from "../../src/index.js";
import {getSimdTests} from "./getSimdTests.js";

const useSimd = false;
const sha256 = await AssemblyScriptSha256Hasher.initialize(useSimd);
getSimdTests(sha256, useSimd);
