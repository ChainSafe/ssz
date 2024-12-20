import path from "node:path";
import {defineConfig} from "vitest/config";
const __dirname = new URL(".", import.meta.url).pathname;

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    exclude: [
      "**/spec-tests/**",
      "**/spec-tests-bls/**",
      "**/*.browser.test.ts",
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
    setupFiles: [path.join(__dirname, "./vitest/setupFiles/customMatchers.ts")],
    reporters: process.env.GITHUB_ACTIONS
      ? ["verbose", "hanging-process", "github-actions"]
      : [
          process.env.TEST_COMPACT_OUTPUT ? "basic" : "verbose",
          "hanging-process",
        ],
    onConsoleLog: () => !process.env.TEST_QUIET_CONSOLE,
  },
});
