import {wasmCode} from "./wasmCode.ts";
import {wasmSimdCode} from "./wasmSimdCode.ts";

export interface WasmContext {
  readonly HAS_SIMD: boolean;
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
  batchHash4UintArray64s(outPtr: number): void;
  batchHash4HashObjectInputs(outPtr: number): void;
}

const importObj = {
  env: {
    // modified from https://github.com/AssemblyScript/assemblyscript/blob/v0.9.2/lib/loader/index.js#L70
    abort: (msg: number, file: number, line: number, col: number) => {
      throw Error(`abort: ${msg}:${file}:${line}:${col}`);
    },
  },
};

export function newInstance(useSimd?: boolean): WasmContext {
  const enableSimd = useSimd !== undefined ? useSimd : WebAssembly.validate(wasmSimdCode);
  return enableSimd
    ? (new WebAssembly.Instance(new WebAssembly.Module(wasmSimdCode), importObj).exports as unknown as WasmContext)
    : (new WebAssembly.Instance(new WebAssembly.Module(wasmCode), importObj).exports as unknown as WasmContext);
}
