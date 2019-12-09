const {wasmInit}  = require("./wasm");

let wasm;

/**
 * Use this method to initialize wasm build.
 * This method needs to be called only once but
 * before using any other method.
 */
export async function initSha256() {
  if(!wasm) {
    wasm = await wasmInit();
  }
}

/**
 * Wraps the AssemblyScript build in a JS function.
 * This allows users to not have to make AS a dependency in their project.
 * @param {Uint8Array} message Message to hash
 */
export function sha256(message) {
  checkInit();
  const arr = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, message));
  const pointer = wasm.hash(arr);
  const result = wasm.__getUint8Array(pointer);
  wasm.__release(arr);
  wasm.__release(pointer);
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
  const arr = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, data));
  wasm.update(arr, length);
  wasm.__release(arr);
}

export function digest() {
  checkInit();
  const digestPointer = wasm.digest();
  const digest = wasm.__getUint8Array(digestPointer);
  wasm.__release(digestPointer);
  return digest;
}

function checkInit() {
  if(!wasm) {
    throw new Error("Please call 'initSha256' before using other methods");
  }
}