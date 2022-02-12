import loader from "@assemblyscript/loader";
import {Buffer} from "buffer";
// @ts-ignore
import wasmCode from "../build/optimized.wasm";

const module = new WebAssembly.Module(Buffer.from(wasmCode, "binary"));

export interface WasmContext {
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

export function newInstance(): WasmContext {
  return loader.instantiateSync(module);
}
