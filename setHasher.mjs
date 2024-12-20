// Set the hasher to hashtree
// Used to run benchmarks with with visibility into hashtree performance, useful for Lodestar
import {setHasher} from "@chainsafe/persistent-merkle-tree/lib/hasher/index.js";
import {hasher} from "@chainsafe/persistent-merkle-tree/lib/hasher/hashtree.js";
setHasher(hasher);

export {};
