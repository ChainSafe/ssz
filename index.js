import wasm from "./wasm";

/**
 * Wraps the AssemblyScript build in a JS function.
 * This allows users to not have to make AS a dependency in their project.
 * @param {Uint8Array} message Message to hash
 */
function sha256(message) {
    // @ts-ignore
    const arr = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, message));
    return wasm.hash(arr);
}

export default sha256;
export {wasm};