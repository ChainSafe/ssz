import * as sha256 from "../../src/index.js";
import {getSimdTests} from "./getSimdTests.js";

const useSimd = true;
getSimdTests(sha256, useSimd);
