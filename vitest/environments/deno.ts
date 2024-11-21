import type {Environment} from "vitest/environments";

export default <Environment>{
  name: "deno",
  transformMode: "ssr",
  async setupVM() {
    // @ts-expect-error - Ignore the global object
    if (!global.Deno) {
      throw new Error("Not valid deno runtime available");
    }

    // Deno supports `node:vm` module.
    const vm = await import("node:vm");
    const context = vm.createContext();
    return {
      getVmContext() {
        return context;
      },
      teardown() {
        // called after all tests with this env have been run
      },
    };
  },
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      },
    };
  },
};
