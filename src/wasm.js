const loader = require("assemblyscript/lib/loader");
import wasmCode from "../build/optimized.wasm";
import {Buffer} from "buffer";

export async function wasmInit() {
  return loader.instantiate(
    await WebAssembly.compile(Buffer.from(wasmCode, 'binary')),
  );
}