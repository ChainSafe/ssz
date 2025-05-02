import * as sha256 from "../../src/index.ts";
import {getSimdTests} from "./getSimdTests.ts";

const useSimd = true;
getSimdTests(sha256, useSimd);
