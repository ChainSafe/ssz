import {Hasher} from "./types";
// import {hasher as nobleHasher} from "./noble";
import {hasher as csHasher} from "./as-sha256";

export {HashObject} from "@chainsafe/as-sha256/lib/hashObject";
export * from "./types";
export * from "./util";

/**
 * Default hasher used across the SSZ codebase, this does not support batch hash.
 * Use `as-sha256` hasher for batch hashing using SIMD.
 * TODO - batch: Use `hashtree` hasher for 20x speedup
 */
// export let hasher: Hasher = nobleHasher;
// For testing purposes, we use the as-sha256 hasher
export let hasher: Hasher = csHasher;

/**
 * Set the hasher to be used across the SSZ codebase
 *
 * WARNING: This function is intended for power users and must be executed before any other SSZ code is imported
 */
export function setHasher(newHasher: Hasher): void {
  hasher = newHasher;
}
