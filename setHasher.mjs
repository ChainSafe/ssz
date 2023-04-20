// Set the hasher to as-sha256
// Used to run benchmarks with with visibility into as-sha256 performance, useful for Lodestar
import {setHasher} from "@chainsafe/persistent-merkle-tree/lib/hasher/index.js";
import {hasher} from "@chainsafe/persistent-merkle-tree/lib/hasher/as-sha256.js";
setHasher(hasher);
