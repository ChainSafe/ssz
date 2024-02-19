import {HashObject, cloneHashId, getHash, getHashObject} from "@chainsafe/as-sha256";
import {Node} from "@chainsafe/persistent-merkle-tree";

/**
 * BranchNode whose children's data is represented as a struct, not a tree.
 *
 * This approach is usefull for memory efficiency of data that is not modified often, for example the validators
 * registry in Ethereum consensus `state.validators`. The tradeoff is that getting the hash, are proofs is more
 * expensive because the tree has to be recreated every time.
 */
export class BranchNodeStruct<T> extends Node {
  private hashed = false;
  constructor(private readonly valueToNode: (value: T) => Node, readonly value: T) {
    // First null value is to save an extra variable to check if a node has a root or not
    super();
  }

  get rootHashObject(): HashObject {
    this.maybeHash();
    return getHashObject(this.id);
  }

  get root(): Uint8Array {
    this.maybeHash();
    return getHash(this.id);
  }

  maybeHash(): void {
    if (!this.hashed) {
      const node = this.valueToNode(this.value);
      node.maybeHash();
      cloneHashId(node.id, this.id);
      this.hashed = true;
    }
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
