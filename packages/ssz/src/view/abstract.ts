import {Node, Proof, Tree} from "@chainsafe/persistent-merkle-tree";
import {JsonPath, ValueOf} from "../type/abstract.js";
import {CompositeType} from "../type/composite.js";

/**
 * A Tree View is a wrapper around a type and an SSZ Tree that contains:
 * - data merkleized
 * - a hook to its parent Tree to propagate changes upwards
 *
 * **View**
 * - Best for simple usage where performance is NOT important
 * - Applies changes immediately
 * - Has reference to parent tree
 * - Does NOT have caches for fast get / set ops
 */
export abstract class TreeView<T extends CompositeType<unknown, unknown, unknown>> {
  /** Merkle tree root node */
  abstract readonly node: Node;
  /** SSZ type associated with this Tree View */
  abstract readonly type: T;

  /** Serialize view to binary data */
  serialize(): Uint8Array {
    const output = new Uint8Array(this.type.tree_serializedSize(this.node));
    const dataView = new DataView(output.buffer, output.byteOffset, output.byteLength);
    this.type.tree_serializeToBytes({uint8Array: output, dataView}, 0, this.node);
    return output;
  }

  /**
   * Merkleize view and compute its hashTreeRoot.
   *
   * See spec for definition of hashTreeRoot:
   * https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md#merkleization
   */
  hashTreeRoot(): Uint8Array {
    return this.node.root;
  }

  /**
   * Create a Merkle multiproof on this view's data.
   * A `path` is an array of 'JSON' paths into the data
   * @example
   * ```ts
   * state.createProof([
   *   ["validators", 1234, "slashed"],
   *   ["genesisTime"]
   * ])
   * ```
   *
   * See spec for definition of merkle multiproofs:
   * https://github.com/ethereum/consensus-specs/blob/dev/ssz/merkle-proofs.md#merkle-multiproofs
   */
  createProof(paths: JsonPath[]): Proof {
    return this.type.tree_createProof(this.node, paths);
  }

  /**
   * Transform the view into a value, from the current node instance.
   * For ViewDU returns the value of the committed data, so call .commit() before if there are pending changes.
   */
  toValue(): ValueOf<T> {
    return this.type.tree_toValue(this.node) as ValueOf<T>;
  }

  /** Return a new Tree View instance referencing the same internal `Node`. Drops its existing `Tree` hook if any */
  clone(): this {
    return this.type.getView(new Tree(this.node)) as this;
  }
}
