import {Node, Proof, Tree} from "@chainsafe/persistent-merkle-tree";
import {byteArrayEquals} from "../util/byteArray";
import {merkleizeSingleBuff} from "../util/merkleize";
import {Type, ValueOf} from "./abstract";

/**
 * Proof path
 * ```
 * ["validators", 1234, "slashed"]
 * ```
 */
export type Path = (string | number)[];

export type CompositeView<T extends CompositeType<unknown, unknown, unknown>> = T extends CompositeType<
  unknown,
  infer TV,
  unknown
>
  ? TV
  : never;
export type CompositeViewDU<T extends CompositeType<unknown, unknown, unknown>> = T extends CompositeType<
  unknown,
  unknown,
  infer TVDU
>
  ? TVDU
  : never;

/* eslint-disable @typescript-eslint/member-ordering  */

const symbolCachedPermanentRoot = Symbol("ssz_cached_permanent_root");

type ValueWithCachedPermanentRoot = {
  [symbolCachedPermanentRoot]?: Uint8Array;
};

export abstract class CompositeType<V, TV, TVDU> extends Type<V> {
  readonly isBasic = false;

  constructor(
    /**
     * Caches hashTreeRoot() result for struct values.
     * WARNING: Must only be used with value that never mutate. The cached root is never discarded
     */
    private readonly cachePermanentRootStruct?: boolean
  ) {
    super();
  }

  abstract getView(tree: Tree): TV;
  /**
   * ViewDU = View Deferred Update
   */
  abstract getViewDU(node: Node, cache?: unknown): TVDU;
  /**
   * Sample implementation
   * ```ts
   * // Commit must drop the invalidateParent() reference
   * view.commit();
   * return view.node;
   * ```
   * @param view
   * @returns
   */
  abstract commitView(view: TV): Node;
  abstract commitViewDU(view: TVDU): Node;
  abstract cacheOfViewDU(view: TVDU): unknown;

  deserializeToView(data: Uint8Array): TV {
    const node = this.tree_deserializeFromBytes(data, 0, data.length);
    return this.getView(new Tree(node));
  }

  deserializeToViewDU(data: Uint8Array): TVDU {
    const node = this.tree_deserializeFromBytes(data, 0, data.length);
    return this.getViewDU(node);
  }

  toView(value: V): TV {
    const node = this.value_toTree(value);
    return this.getView(new Tree(node));
  }

  toViewDU(value: V): TVDU {
    const node = this.value_toTree(value);
    return this.getViewDU(node);
  }

  toValueFromView(view: TV): V {
    const node = this.commitView(view);
    return this.tree_toValue(node);
  }

  toValueFromViewDU(view: TVDU): V {
    const node = this.commitViewDU(view);
    return this.tree_toValue(node);
  }

  toViewFromViewDU(view: TVDU): TV {
    const node = this.commitViewDU(view);
    return this.getView(new Tree(node));
  }

  toViewDUFromView(view: TV): TVDU {
    const node = this.commitView(view);
    return this.getViewDU(node);
  }

  toStructFromView(view: TV): V {
    // Un-performant path but useful for testing and prototyping
    const node = this.commitView(view);
    const output = new Uint8Array(this.tree_serializedSize(node));
    return this.deserialize(output);
  }

  hashTreeRoot(value: V): Uint8Array {
    // Return cached mutable root if any
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        return cachedRoot;
      }
    }

    const root = merkleizeSingleBuff(this.getRoots(value), this.maxChunkCount);

    if (this.cachePermanentRootStruct) {
      (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot] = root;
    }

    return root;
  }

  // Proofs API

  createFromProof(proof: Proof, root: Uint8Array): TV {
    const tree = Tree.createFromProof(proof);
    if (!byteArrayEquals(tree.root, root)) {
      throw new Error("Proof does not match trusted root");
    }
    return this.getView(tree);
  }

  createFromProofUnsafe(proof: Proof): TV {
    return this.getView(Tree.createFromProof(proof));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tree_createProof(node: Node, paths: Path[]): Proof {
    throw Error("TODO");
  }

  protected abstract readonly maxChunkCount: number;
  protected abstract getRoots(value: V): Uint8Array;
}

export abstract class TreeView<T extends CompositeType<unknown, unknown, unknown>> {
  abstract readonly node: Node;
  abstract readonly type: T;

  serialize(): Uint8Array {
    const output = new Uint8Array(this.type.tree_serializedSize(this.node));
    this.type.tree_serializeToBytes(output, 0, this.node);
    return output;
  }

  hashTreeRoot(): Uint8Array {
    return this.node.root;
  }

  createProof(paths: Path[]): Proof {
    return this.type.tree_createProof(this.node, paths);
  }

  toValue(): ValueOf<T> {
    return this.type.tree_toValue(this.node) as ValueOf<T>;
  }

  clone(): this {
    return this.type.getView(new Tree(this.node)) as this;
  }
}

export abstract class TreeViewDU<T extends CompositeType<unknown, unknown, unknown>> extends TreeView<T> {
  abstract commit(): Node;
  abstract readonly cache: unknown;

  protected abstract clearCache(): void;

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
