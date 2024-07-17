import {Hasher} from "./types";
import {hasher as nobleHasher} from "./noble";
import type {HashComputation} from "../node";

export * from "./types";
export * from "./util";

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

export function merkleizeInto(data: Uint8Array, padFor: number, output: Uint8Array, offset: number): void {
  hasher.merkleizeInto(data, padFor, output, offset);
}

export function executeHashComputations(hashComputations: HashComputation[][]): void {
  hasher.executeHashComputations(hashComputations);
}
