import {Hasher} from "./types";
import {hasher as nobleHasher} from "./noble";

export {HashObject} from "@chainsafe/as-sha256/hashObject";
export * from "./types";
export * from "./util";

export let hasher: Hasher = nobleHasher;

export function setHasher(newHasher: Hasher): void {
  hasher = newHasher;
}
