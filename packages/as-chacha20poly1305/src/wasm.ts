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
  numberOperation(
    x0: number, x1: number, x2: number,
    x3: number, x4: number, x5: number,
    x6: number, x7: number, x8: number,
    x9: number, x10: number, x11: number,
    x12: number, x13: number, x14: number,
    x15: number
    ): number;
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
