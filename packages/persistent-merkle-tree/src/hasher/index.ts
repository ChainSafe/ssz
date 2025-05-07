import type {HashComputationLevel} from "../hashComputation.ts";
import {hasher as nobleHasher} from "./noble.ts";
import {Hasher} from "./types.ts";

export * from "./types.ts";
export * from "./util.ts";

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
