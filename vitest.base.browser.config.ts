import { defineConfig, mergeConfig } from "vitest/config";
import {nodePolyfills} from "vite-plugin-node-polyfills";

import baseConfig from "./vitest.base.unit.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      nodePolyfills({
        include: ["buffer", "crypto", "util", "stream"],
        globals: {Buffer: true},
        protocolImports: true,
      }),
    ],
    test: {
      browser: {
        name: "chrome",
        headless: true,
        provider: "webdriverio",
        screenshotFailures: false,
      },
    },
  })
);
