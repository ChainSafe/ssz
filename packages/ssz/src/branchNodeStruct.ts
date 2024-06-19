import {HashObject} from "@chainsafe/as-sha256/lib/hashObject";
import {
  hashObjectToUint8Array,
  Node,
  getHashComputations,
  HashComputationGroup,
} from "@chainsafe/persistent-merkle-tree";

export type ValueToNodeFn<T> = (
  value: T,
  hashComps: HashComputationGroup | null,
  hashCompRootNode: Node | null
) => Node;

/**
 * BranchNode whose children's data is represented as a struct, the backed tree is lazily computed from the struct.
 *
 * This approach is usefull for memory efficiency of data that is not modified often, for example the validators
 * registry in Ethereum consensus `state.validators`. The tradeoff is that getting the hash, are proofs is more
 * expensive because the tree has to be recreated every time.
 */
export class BranchNodeStruct<T> extends Node {
  /**
   * this represents the backed tree which is lazily computed from value
   */
  private _rootNode: Node | null = null;
  constructor(private readonly valueToNode: ValueToNodeFn<T>, readonly value: T) {
    // First null value is to save an extra variable to check if a node has a root or not
    super(null as unknown as number, 0, 0, 0, 0, 0, 0, 0);
    this._rootNode = null;
  }

  get rootHashObject(): HashObject {
    if (this.h0 === null) {
      super.applyHash(this.rootNode.rootHashObject);
      // this node has been hashed, we can clear the backed tree to release a lot of memory
      this._rootNode = null;
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
    return this.rootNode.left;
  }

  get right(): Node {
    return this.rootNode.right;
  }

  getHashComputations(hashComps: HashComputationGroup): void {
    if (this.h0 !== null) {
      return;
    }

    if (this._rootNode === null) {
      // set dest of HashComputation to this node
      this._rootNode = this.valueToNode(this.value, hashComps, this);
    } else {
      // not likely to hit this path if called from ViewDU, handle just in case
      getHashComputations(this, hashComps.offset, hashComps.byLevel);
    }
  }

  /**
   * Singleton implementation to make sure there is single backed tree for this node.
   * This is important for batching HashComputations
   */
  private get rootNode(): Node {
    if (this._rootNode === null) {
      this._rootNode = this.valueToNode(this.value, null, null);
    }
    return this._rootNode;
  }
}
