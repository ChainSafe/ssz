import type { GlobalSetupContext } from "vitest/node";

export default function setup({ provide }: GlobalSetupContext): void {
  const runtime = process.env.JS_RUNTIME;

  switch (runtime) {
    case "deno": {
      // @ts-expect-error - Ignore the global object
      if (!global.Deno) {
        throw new Error("Not valid deno runtime available");
      }
      break;
    }
    case "node": {
      if (!global.process) {
        throw new Error("Not valid js runtime available");
      }
      break;
    }
    default:
      throw new Error(
        `Not valid deno runtime available "${runtime}". Possible options are deno | node`
      );
  }

  provide("runtime", runtime);
}

declare module "vitest" {
  export interface ProvidedContext {
    runtime: "deno" | "node";
  }
}
