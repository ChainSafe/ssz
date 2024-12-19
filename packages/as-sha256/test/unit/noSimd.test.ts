import * as sha256 from "../../src/index.js";
import {getSimdTests} from "./getSimdTests.js";

const useSimd = false;
sha256.reinitializeInstance(useSimd);
getSimdTests(sha256, useSimd);
