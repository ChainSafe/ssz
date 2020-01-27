const {wasmInit} = require("./wasm");

let wasm = null;

/**
 * Use this method to initialize wasm build.
 * This method needs to be called only once but
 * before using any other method.
 */
export async function initSha256() {
  if(!wasm) wasm = await wasmInit();
}

/**
 * Wraps the AssemblyScript build in a JS function.
 * This allows users to not have to make AS a dependency in their project.
 * @param {Uint8Array} message Message to hash
 */
export function sha256(message) {
  checkInit();
  const input  = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, message));
  const output = wasm.hash(input);
  const result = wasm.__getUint8Array(output).slice();
  wasm.__release(output);
  wasm.__release(input);
  return result;
}

export default sha256;

export function clean() {
  checkInit();
  wasm.clean();
}

export function init() {
  checkInit();
  clean();
}

export function update(data, length) {
  checkInit();
  const input = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, data));
  wasm.update(input, length);
  wasm.__release(input);
}

export function digest() {
  checkInit();
  const output = wasm.digest();
  const digest = wasm.__getUint8Array(output).slice();
  wasm.__release(output);
  return digest;
}

export function toHexString(bytes) {
  checkInit();
  const hex = wasm.toHexString(bytes);
  return hex;
}

function checkInit() {
  if(!wasm) throw new Error("Please call 'initSha256' before using other methods");
}
