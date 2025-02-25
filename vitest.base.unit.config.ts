import path from "node:path";
import { defineConfig, ViteUserConfig } from "vitest/config";
const __dirname = new URL(".", import.meta.url).pathname;

export type Runtime = "node" | "deno" | "bun";

export function getRuntime(): Runtime {
  if ("bun" in process.versions) return "bun";
  if ("deno" in process.versions) return "deno";

  return "node";
}

export function getPoolOptions(runtime: Runtime): ViteUserConfig["test"] {
  if (runtime === "node") {
    return {
      pool: "threads",
      poolOptions: {
        threads: {
          singleThread: true,
          minThreads: 2,
          maxThreads: 10,
        },
      },
      coverage: {
        enabled: true,
      },
      reporters: process.env.GITHUB_ACTIONS
        ? ["verbose", "hanging-process", "github-actions"]
        : [
            process.env.TEST_COMPACT_OUTPUT ? "basic" : "verbose",
            "hanging-process",
          ],
    };
  }

  return {
    pool: "vitest-in-process-pool",
    reporters: [["default", { summary: false }]],
    coverage: {
      enabled: false,
    },
  };
}

export default defineConfig({
  test: {
    ...getPoolOptions(getRuntime()),
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
    coverage: {
      reporter: ["clover", "text"],
    },
    onConsoleLog: () => !process.env.TEST_QUIET_CONSOLE,
  },
});
