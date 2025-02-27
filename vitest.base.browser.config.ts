import { defineConfig, mergeConfig } from "vitest/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import baseConfig from "./vitest.base.unit.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      nodePolyfills({
        include: ["buffer", "crypto", "util", "stream"],
        globals: { Buffer: true },
        protocolImports: true,
      }),
    ],
    test: {
      browser: {
        headless: true,
        provider: "webdriverio",
        screenshotFailures: false,
        instances: [{ browser: "chrome" }, { browser: "firefox" }],
      },
    },
    optimizeDeps: {
      include: [
        "vite-plugin-node-polyfills/shims/buffer",
        "vite-plugin-node-polyfills/shims/global",
        "vite-plugin-node-polyfills/shims/process",
      ],
    },
  })
);
