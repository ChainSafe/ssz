import * as sha256 from "../../src/index.js";
import {getSimdTests} from "./getSimdTests.js";

const useSimd = false;
getSimdTests(sha256, useSimd);
