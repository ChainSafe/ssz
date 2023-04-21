import {Hasher} from "./types";
import {hasher as nobleHasher} from "./noble";

export {HashObject} from "@chainsafe/as-sha256/lib/hashObject";
export * from "./types";
export * from "./util";

/**
 * Hasher used across the SSZ codebase
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
