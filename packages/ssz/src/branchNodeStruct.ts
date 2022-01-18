import {HashObject, byteArrayToHashObject} from "@chainsafe/as-sha256";
import {BranchNode, hashObjectToUint8Array, Node} from "@chainsafe/persistent-merkle-tree";

export type BranchNodeStructSchema<V> = {
  valueToNode(value: V): Node;
  // TODO: Provide method to hashTreeRoot() to HashObject
  hashTreeRoot(value: V): Uint8Array;
  cloneValue(value: V): V;
};

/**
 * BranchNode whose children's data is represented as a struct, not a tree.
 *
 * This approach is usefull for memory efficiency of data that is not modified often, for example the validators
 * registry in Ethereum consensus `state.validators`. The tradeoff is that getting the hash, are proofs is more
 * expensive because the tree has to be recreated every time.
 */
export class BranchNodeStruct<V> extends Node {
  constructor(private readonly schema: BranchNodeStructSchema<V>, readonly value: V) {
    // First null value is to save an extra variable to check if a node has a root or not
    super(null as unknown as number, 0, 0, 0, 0, 0, 0, 0);
  }

  get rootHashObject(): HashObject {
    if (this.h0 === null) {
      const root = this.schema.hashTreeRoot(this.value);
      this.applyHash(byteArrayToHashObject(root));
    }
    return this;
  }

  get root(): Uint8Array {
    if (this.h0 === null) {
      const root = this.schema.hashTreeRoot(this.value);
      this.applyHash(byteArrayToHashObject(root));
      return root;
    } else {
      return hashObjectToUint8Array(this.rootHashObject);
    }
  }

  isLeaf(): boolean {
    return false;
  }

  get left(): Node {
    return this.schema.valueToNode(this.value).left;
  }

  get right(): Node {
    return this.schema.valueToNode(this.value).right;
  }

  rebindLeft(left: Node): Node {
    return new BranchNode(left, this.right);
  }

  rebindRight(right: Node): Node {
    return new BranchNode(this.left, right);
  }

  /**
   * Returns new BranchNodeStruct with same schema and a shallow copy of value
   * `newValue = this.schema.cloneValue(value)`
   */
  clone(): BranchNodeStruct<V> {
    return new BranchNodeStruct(this.schema, this.schema.cloneValue(this.value));
  }
}
