import {defineConfig, mergeConfig} from "vitest/config";
import baseConfig from "../../vitest.base.unit.config.js";
import {getRuntime} from "../../vitest.base.unit.config.js";

export default mergeConfig(
  baseConfig,
  defineConfig({test: {coverage: {enabled: getRuntime() === "node", reporter: ["text", "clover"]}}})
);
