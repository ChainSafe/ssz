import {defineConfig, mergeConfig} from "vitest/config";
import baseConfig from "../../vitest.base.unit.config";
import {getRuntime} from "../../vitest.base.unit.config";

export default mergeConfig(
  baseConfig,
  defineConfig({test: {coverage: {enabled: getRuntime() === "node", reporter: ["text", "clover"]}}})
);
