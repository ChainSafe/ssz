import {Hasher} from "./types.js";
import {hasher as nobleHasher} from "./noble.js";
import type {HashComputationLevel} from "../hashComputation.js";

export * from "./types.js";
export * from "./util.js";
export {hasher as hashTreeHasher} from "./hashtree.js";
export {hasher as asSHA256Hasher} from "./as-sha256.js";

/**
 * Hasher used across the SSZ codebase, by default, this does not support batch hash.
 */
export let hasher: Hasher = nobleHasher;

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

export function merkleizeBlocksBytes(
  blocksBytes: Uint8Array,
  padFor: number,
  output: Uint8Array,
  offset: number
): void {
  hasher.merkleizeBlocksBytes(blocksBytes, padFor, output, offset);
}

export function merkleizeBlockArray(
  blocks: Uint8Array[],
  blockLimit: number,
  padFor: number,
  output: Uint8Array,
  offset: number
): void {
  hasher.merkleizeBlockArray(blocks, blockLimit, padFor, output, offset);
}

export function executeHashComputations(hashComputations: HashComputationLevel[]): void {
  hasher.executeHashComputations(hashComputations);
}
