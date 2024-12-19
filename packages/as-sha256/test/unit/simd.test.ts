import * as sha256 from "../../src/index.js";
import {getSimdTests} from "./getSimdTests.js";

const useSimd = true;
sha256.reinitializeInstance(useSimd);
getSimdTests(sha256, useSimd);
