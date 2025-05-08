import {HashComputationLevel, getHashComputations} from "../../src/hashComputation.ts";
import {executeHashComputations} from "../../src/hasher/index.ts";
import {Node} from "../../src/node.ts";

/**
 * This is only a test utility function, don't want to use it in production because it allocates memory every time.
 */
export function batchHash(node: Node): void {
  const hashComputations: HashComputationLevel[] = [];
  getHashComputations(node, 0, hashComputations);
  executeHashComputations(hashComputations);
  if (node.h0 === null) {
    throw Error("Root node h0 is null");
  }
}
