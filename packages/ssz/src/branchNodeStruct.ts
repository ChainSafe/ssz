import type {HashObject} from "@chainsafe/as-sha256/lib/hashObject";
import {hashObjectToUint8Array, Node} from "@chainsafe/persistent-merkle-tree";

/**
 * BranchNode whose children's data is represented as a struct, not a tree.
 *
 * This approach is usefull for memory efficiency of data that is not modified often, for example the validators
 * registry in Ethereum consensus `state.validators`. The tradeoff is that getting the hash, are proofs is more
 * expensive because the tree has to be recreated every time.
 */
export class BranchNodeStruct<T> extends Node {
  constructor(private readonly valueToNode: (value: T) => Node, readonly value: T) {
    // First null value is to save an extra variable to check if a node has a root or not
    super(null as unknown as number, 0, 0, 0, 0, 0, 0, 0);
  }

  get rootHashObject(): HashObject {
    if (this.h0 === null) {
      const node = this.valueToNode(this.value);
      super.applyHash(node.rootHashObject);
    }
    return this;
  }

  get root(): Uint8Array {
    return hashObjectToUint8Array(this.rootHashObject);
  }

  isLeaf(): boolean {
    return false;
  }

  get left(): Node {
    return this.valueToNode(this.value).left;
  }

  get right(): Node {
    return this.valueToNode(this.value).right;
  }
}
