import loader from "@assemblyscript/loader";
import wasmCode from "../build/optimized.wasm";
import {Buffer} from "buffer";

const module = new WebAssembly.Module(Buffer.from(wasmCode, 'binary'));

export function newInstance() {
  return loader.instantiateSync(module);
}
