import {defineConfig, mergeConfig} from "vitest/config";
import baseConfig from "../../vitest.base.unit.config.ts";
import {getRuntime} from "../../vitest.base.unit.config.ts";

export default mergeConfig(
  baseConfig,
  defineConfig({test: {coverage: {enabled: getRuntime() === "node", reporter: ["text", "clover"]}}})
);
