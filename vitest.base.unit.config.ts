import path from "node:path";
import {defineConfig} from "vitest/config";
import {BuiltinEnvironment} from "vitest/node";
import {Environment} from "vitest/environments";
const __dirname = new URL(".", import.meta.url).pathname;
import denoEnvironment from "./vitest/environments/deno";

function getTestEnvironment(
  runtime?: string
): BuiltinEnvironment | Environment {
  switch (runtime) {
    case "deno":
      return denoEnvironment;
    case "node":
      return "node";
    default: {
      if (runtime) {
        throw new Error(`Unsupported JS Runtime '${runtime}'`);
      } else {
        throw new Error(
          "Please define `JS_RUNTIME` env variable to either node | deno"
        );
      }
    }
  }
}

export default defineConfig({
  resolve: {
    // Adding `deno` field is just for testing purpose.
    // Vite validates the package.json and could not find `lib/index.js` in deno runtime
    mainFields: ["deno", "main"],
  },
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
    environment: getTestEnvironment(process.env.JS_RUNTIME),
  },
});
