import * as sha256 from "../../src/index.ts";
import {getSimdTests} from "./getSimdTests.ts";

const useSimd = false;
getSimdTests(sha256, useSimd);
