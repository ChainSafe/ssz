import {wasmCode} from "./wasmCode";

const _module = new WebAssembly.Module(wasmCode);

export interface WasmContext {
  readonly INPUT_LENGTH: number;
  readonly KEY_LENGTH: number;
  readonly COUNTER_LENGTH: number;

  memory: {
    buffer: ArrayBuffer;
  };
  input: {
    value: number;
  };
  output: {
    value: number;
  };
  key: {
    value: number;
  };
  counter: {
    value: number;
  };
  debug: {
    value: number;
  };

  streamXORUpdate(dataLength: number): number;
}

const importObj = {
  env: {
    // modified from https://github.com/AssemblyScript/assemblyscript/blob/v0.9.2/lib/loader/index.js#L70
    abort: function (msg: number, file: number, line: number, col: number) {
      throw Error(`abort: ${msg}:${file}:${line}:${col}`);
    },
  },
};

export function newInstance(): WasmContext {
  return new WebAssembly.Instance(_module, importObj).exports as unknown as WasmContext;
}
