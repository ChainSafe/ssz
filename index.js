import wasm from "./wasm";

/**
 * Wraps the AssemblyScript build in a JS function.
 * This allows users to not have to make AS a dependency in their project.
 * @param {Uint8Array} message Message to hash
 */
export default function sha256(message) {
  // @ts-ignore
  const arr = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, message));
  wasm.__release(arr);
  return wasm.hash(arr);
}

export function clean() {
  // @ts-ignore
  wasm.clean();
}

export function init() {
  // @ts-ignore
  clean();
}

export function update(data, length) {
  // @ts-ignore
  const arr = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, data));
  wasm.__release(arr);
  wasm.update(arr, length)
}

export function digest() {
  // @ts-ignore
  const digestPointer = wasm.digest();
  const digest = wasm.__getUint8Array(digestPointer);
  wasm.__release(digestPointer)
  return digest;
}