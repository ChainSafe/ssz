// Set the hasher to as-sha256
// Used to run benchmarks with with visibility into as-sha256 performance, useful for Lodestar
import {setHasher} from "@chainsafe/persistent-merkle-tree/hasher";
import {hasher} from "@chainsafe/persistent-merkle-tree/hasher/as-sha256";
setHasher(hasher);
