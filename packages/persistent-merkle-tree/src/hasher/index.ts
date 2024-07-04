import {Hasher} from "./types";
// import {hasher as nobleHasher} from "./noble";
// import {hasher as csHasher} from "./as-sha256";
import {hasher as hashtreeHasher} from "./hashtree";

export * from "./types";
export * from "./util";

/**
 * Default hasher used across the SSZ codebase, this does not support batch hash.
 * Use `as-sha256` hasher for batch hashing using SIMD.
 * TODO - batch: Use `hashtree` hasher for 20x speedup
 */
// export let hasher: Hasher = nobleHasher;
// For testing purposes, we use the as-sha256 hasher
// export let hasher: Hasher = csHasher;

// For testing purposes, we use the hashtree hasher
export let hasher: Hasher = hashtreeHasher;

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

export function digestNLevel(data: Uint8Array, nLevel: number): Uint8Array {
  return hasher.digestNLevel(data, nLevel);
}

export function merkleizeInto(data: Uint8Array, padFor: number, output: Uint8Array, offset: number): void {
  hasher.merkleizeInto(data, padFor, output, offset);
}
