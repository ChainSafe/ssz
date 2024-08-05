const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;

export const allocUnsafe = isNode ? _allocUnsafeNode : _allocUnsafe;

/**
 * Where possible returns a Uint8Array of the requested size that references
 * uninitialized memory. Only use if you are certain you will immediately
 * overwrite every value in the returned `Uint8Array`.
 */
function _allocUnsafe(size = 0): Uint8Array {
  return new Uint8Array(size);
}

/**
 * Where possible returns a Uint8Array of the requested size that references
 * uninitialized memory. Only use if you are certain you will immediately
 * overwrite every value in the returned `Uint8Array`.
 */
function _allocUnsafeNode(size = 0): Uint8Array {
  const out = Buffer.allocUnsafe(size);
  return new Uint8Array(out.buffer, out.byteOffset, out.byteLength);
}
