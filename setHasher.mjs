// Set the hasher to hashtree
// Used to run benchmarks with with visibility into hashtree performance, useful for Lodestar
// eslint-disable-next-line import/no-extraneous-dependencies
import { setHasher } from "@chainsafe/persistent-merkle-tree";
// eslint-disable-next-line import/no-extraneous-dependencies
import { hashTreeHasher } from "@chainsafe/persistent-merkle-tree";
setHasher(hashTreeHasher);
