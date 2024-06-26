import {Hasher} from "./types";
import {hasher as csHasher} from "./as-sha256";

export * from "./types";
export * from "./util";

/**
 * Default hasher used across the SSZ codebase, this does not support batch hash.
 * Use `as-sha256` hasher for batch hashing using SIMD.
 * TODO - batch: Use `hashtree` hasher for 20x speedup
 */
// For testing purposes, we use the hashtree hasher
export let hasher: Hasher = csHasher;

/**
 * Set the hasher to be used across the SSZ codebase
 *
 * WARNING: This function is intended for power users and must be executed before any other SSZ code is imported
 */
export function setHasher(newHasher: Hasher): void {
  hasher = newHasher;
}

export function digest64(a: Uint8Array, b: Uint8Array): Uint8Array {
  return hasher.digest64(a, b);
}

export function digestNLevelUnsafe(data: Uint8Array, nLevel: number): Uint8Array {
  return hasher.digestNLevelUnsafe(data, nLevel);
}
