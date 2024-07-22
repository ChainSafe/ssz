import {HashComputationLevel, executeHashComputations, HashComputationGroup} from "@chainsafe/persistent-merkle-tree";
import {ByteViews, CompositeType} from "../type/composite";
import {TreeView} from "../view/abstract";

/**
 * Always allocating a new HashComputationGroup for each hashTreeRoot() is not great for gc
 * because a lot of ViewDUs are not changed and computed root already.
 */
const symbolCachedTreeRoot = Symbol("ssz_cached_tree_root");

export type NodeWithCachedTreeRoot = {
  [symbolCachedTreeRoot]?: Uint8Array;
};

/* eslint-disable @typescript-eslint/member-ordering  */

/**
 * A Deferred Update Tree View (`ViewDU`) is a wrapper around a type and
 * a SSZ Node that contains:
 * - data merkleized
 * - some arbitrary caches to speed up data manipulation required by the type
 *
 * **ViewDU**
 * - Best for complex usage where performance is important
 * - Defers changes to when commit is called
 * - Does NOT have a reference to the parent ViewDU
 * - Has caches for fast get / set ops
 */
export abstract class TreeViewDU<T extends CompositeType<unknown, unknown, unknown>> extends TreeView<T> {
  /**
   * Applies any deferred updates that may be pending in this ViewDU instance and updates its internal `Node`.
   */
  abstract commit(hcOffset?: number, hcByLevel?: HashComputationLevel[] | null): void;

  /**
   * Returns arbitrary data that is useful for this ViewDU instance to optimize data manipulation. This caches MUST
   * not include non-commited data. `this.cache` can be called at any time, both before and after calling `commit()`.
   */
  abstract readonly cache: unknown;

  /**
   * MUST drop any reference to mutable cache data. After `clearCache()`, if the dropped caches are mutated, no changes
   * should apply to this instance both before and after calling `commit()`.
   */
  protected abstract clearCache(): void;

  /*
   * By default use type to serialize ViewDU.
   */
  serializeToBytes(output: ByteViews, offset: number): number {
    return this.type.tree_serializeToBytes(output, offset, this.node);
  }

  /**
   * Merkleize view and compute its hashTreeRoot.
   * Commits any pending changes before computing the root.
   *
   * See spec for definition of hashTreeRoot:
   * https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md#merkleization
   */
  hashTreeRoot(hcGroup: HashComputationGroup = new HashComputationGroup()): Uint8Array {
    // in ethereum consensus, the only type goes with TVDU is BeaconState and it's really more efficient to hash the tree in batch
    // if consumers don't want to batch hash, just go with `this.node.root` similar to what View.hashTreeRoot() does
    // there should not be another ViewDU.hashTreeRoot() during this flow so it's safe to reuse nextHashComps
    const offset = 0;
    hcGroup.reset();
    this.commit(offset, hcGroup.byLevel);
    hcGroup.clean();
    const cachedRoot = (this.node as NodeWithCachedTreeRoot)[symbolCachedTreeRoot];
    if (cachedRoot) {
      return cachedRoot;
    }
    executeHashComputations(hcGroup.byLevel);
    // This makes sure the root node is computed by batch
    if (this.node.h0 === null) {
      throw Error("Root is not computed by batch");
    }

    const root = this.node.root;
    (this.node as NodeWithCachedTreeRoot)[symbolCachedTreeRoot] = root;
    return root;
  }

  /**
   * Serialize view to binary data.
   * Commits any pending changes before computing the root.
   * Warning: this calls commit() which evict all pending HashComputations. Consider calling hashTreeRoot() before this
   */
  serialize(): Uint8Array {
    this.commit();
    const output = new Uint8Array(this.type.tree_serializedSize(this.node));
    const dataView = new DataView(output.buffer, output.byteOffset, output.byteLength);
    this.serializeToBytes({uint8Array: output, dataView}, 0);
    return output;
  }

  /**
   * Return a new ViewDU instance referencing the same internal `Node`.
   *
   * By default it will transfer the cache of this ViewDU to the new cloned instance. Set `dontTransferCache` to true
   * to NOT transfer the cache to the cloned instance.
   */
  clone(dontTransferCache?: boolean): this {
    if (dontTransferCache) {
      return this.type.getViewDU(this.node) as this;
    } else {
      const cache = this.cache;
      this.clearCache();
      return this.type.getViewDU(this.node, cache) as this;
    }
  }
}
