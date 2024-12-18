import {wasmCode} from "./wasmCode";
import {wasmSimdCode} from "./wasmSimdCode";

export interface WasmContext {
  readonly PARALLEL_FACTOR: number;
  readonly INPUT_LENGTH: number;
  memory: {
    buffer: ArrayBuffer;
  };
  input: {
    value: number;
  };
  output: {
    value: number;
  };

  init(): void;
  update(dataPtr: number, dataLength: number): void;
  final(outPtr: number): void;

  digest(length: number): void;
  digest64(inPtr: number, outPtr: number): void;
}

export interface WasmSimdContext extends WasmContext {
  batchHash4UintArray64s(outPtr: number): void;
  batchHash4HashObjectInputs(outPtr: number): void;
}

const importObj = {
  env: {
    // modified from https://github.com/AssemblyScript/assemblyscript/blob/v0.9.2/lib/loader/index.js#L70
    abort: function (msg: number, file: number, line: number, col: number) {
      throw Error(`abort: ${msg}:${file}:${line}:${col}`);
    },
  },
};

export function newInstance<T extends boolean>(haveSimd: T): T extends true ? WasmSimdContext : WasmContext {
  return (haveSimd
    ? new WebAssembly.Instance(new WebAssembly.Module(wasmSimdCode), importObj).exports
    : new WebAssembly.Instance(new WebAssembly.Module(wasmCode), importObj).exports) as unknown as T extends true
    ? WasmSimdContext
    : WasmContext;
}
