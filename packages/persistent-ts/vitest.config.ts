import {defineConfig, mergeConfig} from "vitest/config";
import baseConfig from "../../vitest.base.unit.config";

export default mergeConfig(baseConfig, defineConfig({}));
