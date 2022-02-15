import {
  concatGindices,
  createProof,
  getNode,
  Gindex,
  Node,
  Proof,
  ProofType,
  Tree,
} from "@chainsafe/persistent-merkle-tree";
import {byteArrayEquals} from "../util/byteArray";
import {merkleize} from "../util/merkleize";
import {treePostProcessFromProofNode} from "../util/proof/treePostProcessFromProofNode";
import {Type, ValueOf, ByteViews, JsonPath, JsonPathProp} from "./abstract";
export {ByteViews};

export const LENGTH_GINDEX = BigInt(3);

/** View type of a CompositeType */
export type CompositeView<T extends CompositeType<unknown, unknown, unknown>> = T extends CompositeType<
  unknown,
  infer TV,
  unknown
>
  ? TV
  : never;

/** ViewDU type of a CompositeType */
export type CompositeViewDU<T extends CompositeType<unknown, unknown, unknown>> = T extends CompositeType<
  unknown,
  unknown,
  infer TVDU
>
  ? TVDU
  : never;

/** Any CompositeType without any generic arguments */
export type CompositeTypeAny = CompositeType<unknown, unknown, unknown>;

/* eslint-disable @typescript-eslint/member-ordering  */

/** Dedicated property to cache hashTreeRoot of immutable CompositeType values */
const symbolCachedPermanentRoot = Symbol("ssz_cached_permanent_root");

/** Helper type to cast CompositeType values that may have @see symbolCachedPermanentRoot */
type ValueWithCachedPermanentRoot = {
  [symbolCachedPermanentRoot]?: Uint8Array;
};

/**
 * Represents a composite type as defined in the spec:
 * https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md#composite-types
 */
export abstract class CompositeType<V, TV, TVDU> extends Type<V> {
  readonly isBasic = false;
  /**
   * True if the merkleization of this type has a right node with metadata.
   * i.e. ListBasic, ListComposite, BitList, ByteList.
   */
  abstract readonly isList: boolean;
  /**
   * False if the TreeView of this type is immutable. Example:
   * - Any BasicType
   * - ByteVector, ByteList
   *
   * Required for ContainerNodeStruct to ensure no dangerous types are constructed.
   */
  abstract readonly isViewMutable: boolean;

  constructor(
    /**
     * Caches `hashTreeRoot()` result for struct values.
     *
     * WARNING: Must only be used for immutable values. The cached root is never discarded
     */
    private readonly cachePermanentRootStruct?: boolean
  ) {
    super();
  }

  /** New instance of a recursive zero'ed value converted to Tree View */
  get defaultView(): TV {
    return this.toView(this.defaultValue);
  }

  /** New instance of a recursive zero'ed value converted to Deferred Update Tree View */
  get defaultViewDU(): TVDU {
    return this.toViewDU(this.defaultValue);
  }

  /**
   * Returns a {@link TreeView}.
   *
   * A Tree View is a wrapper around a type and an SSZ Tree that contains:
   * - data merkleized
   * - a hook to its parent Tree to propagate changes upwards
   *
   * **View**
   * - Best for simple usage where performance is NOT important
   * - Applies changes immediately
   * - Has reference to parent tree
   * - Does NOT have caches for fast get / set ops
   *
   * **ViewDU**
   * - Best for complex usage where performance is important
   * - Defers changes to when commit is called
   * - Does NOT have a reference to the parent ViewDU
   * - Has caches for fast get / set ops
   */
  abstract getView(tree: Tree): TV;

  /**
   * Returns a {@link TreeViewDU} - Deferred Update Tree View.
   *
   * A Deferred Update Tree View is a wrapper around a type and
   * a SSZ Node that contains:
   * - data merkleized
   * - some arbitrary caches to speed up data manipulation required by the type
   *
   * **View**
   * - Best for simple usage where performance is NOT important
   * - Applies changes immediately
   * - Has reference to parent tree
   * - Does NOT have caches for fast get / set ops
   *
   * **ViewDU**
   * - Best for complex usage where performance is important
   * - Defers changes to when commit is called
   * - Does NOT have a reference to the parent ViewDU
   * - Has caches for fast get / set ops
   */
  abstract getViewDU(node: Node, cache?: unknown): TVDU;

  /** INTERNAL METHOD: Given a Tree View, returns a `Node` with all its updated data */
  abstract commitView(view: TV): Node;
  /** INTERNAL METHOD: Given a Deferred Update Tree View returns a `Node` with all its updated data */
  abstract commitViewDU(view: TVDU): Node;
  /** INTERNAL METHOD: Return the cache of a Deferred Update Tree View. May return `undefined` if this ViewDU has no cache */
  abstract cacheOfViewDU(view: TVDU): unknown;

  /**
   * Deserialize binary data to a Tree View.
   * @see {@link CompositeType.getView}
   */
  deserializeToView(data: Uint8Array): TV {
    const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const node = this.tree_deserializeFromBytes({uint8Array: data, dataView}, 0, data.length);
    return this.getView(new Tree(node));
  }

  /**
   * Deserialize binary data to a Deferred Update Tree View.
   * @see {@link CompositeType.getViewDU}
   */
  deserializeToViewDU(data: Uint8Array): TVDU {
    const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const node = this.tree_deserializeFromBytes({uint8Array: data, dataView}, 0, data.length);
    return this.getViewDU(node);
  }

  /**
   * Transform value to a View.
   * @see {@link CompositeType.getView}
   */
  toView(value: V): TV {
    const node = this.value_toTree(value);
    return this.getView(new Tree(node));
  }

  /**
   * Transform value to a ViewDU.
   * @see {@link CompositeType.getViewDU}
   */
  toViewDU(value: V): TVDU {
    const node = this.value_toTree(value);
    return this.getViewDU(node);
  }

  /**
   * Transform value to a View.
   * @see {@link CompositeType.getView}
   */
  toValueFromView(view: TV): V {
    const node = this.commitView(view);
    return this.tree_toValue(node);
  }

  /**
   * Transform value to a ViewDU.
   * @see {@link CompositeType.getViewDU}
   */
  toValueFromViewDU(view: TVDU): V {
    const node = this.commitViewDU(view);
    return this.tree_toValue(node);
  }

  /**
   * Transform a ViewDU to a View.
   * @see {@link CompositeType.getView} and {@link CompositeType.getViewDU}
   */
  toViewFromViewDU(view: TVDU): TV {
    const node = this.commitViewDU(view);
    return this.getView(new Tree(node));
  }

  /**
   * Transform a View to a ViewDU.
   * @see {@link CompositeType.getView} and {@link CompositeType.getViewDU}
   */
  toViewDUFromView(view: TV): TVDU {
    const node = this.commitView(view);
    return this.getViewDU(node);
  }

  // Merkleize API

  hashTreeRoot(value: V): Uint8Array {
    // Return cached mutable root if any
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        return cachedRoot;
      }
    }

    const root = merkleize(this.getRoots(value), this.maxChunkCount);

    if (this.cachePermanentRootStruct) {
      (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot] = root;
    }

    return root;
  }

  // For debugging and testing this feature
  protected getCachedPermanentRoot(value: V): Uint8Array | undefined {
    return (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
  }

  abstract readonly maxChunkCount: number;
  // TODO: Optimize, return an array of diverse data types to reduce data conversions
  // - For arrays of numbers the most optimal return is an array of uint8, uint32, etc
  //   and feed those numbers directly to the hasher input with a DataView
  // - The return of the hasher should be customizable too, to reduce conversions from Uint8Array
  //   to hashObject and back.
  protected abstract getRoots(value: V): Uint8Array[];

  // Proofs API

  /**
   * Create a Tree View from a Proof. Verifies that the Proof is correct against `root`.
   * @see {@link CompositeType.getView}
   */
  createFromProof(proof: Proof, root?: Uint8Array): TV {
    const rootNodeFromProof = Tree.createFromProof(proof).rootNode;
    const rootNode = treePostProcessFromProofNode(rootNodeFromProof, this);
    if (root !== undefined && !byteArrayEquals(rootNode.root, root)) {
      throw new Error("Proof does not match trusted root");
    }

    return this.getView(new Tree(rootNode));
  }

  /** INTERNAL METHOD: For view's API, create proof from a tree */
  tree_createProof(node: Node, jsonPaths: JsonPath[]): Proof {
    const gindexes = this.tree_createProofGindexes(node, jsonPaths);
    return createProof(node, {
      type: ProofType.treeOffset,
      gindices: gindexes,
    });
  }

  /** INTERNAL METHOD: For view's API, create proof from a tree */
  tree_createProofGindexes(node: Node, jsonPaths: JsonPath[]): Gindex[] {
    const gindexes: Gindex[] = [];

    for (const jsonPath of jsonPaths) {
      const {type, gindex} = this.getPathInfo(jsonPath);
      if (!isCompositeType(type)) {
        gindexes.push(gindex);
      } else {
        // if the path subtype is composite, include the gindices of all the leaves
        const leafGindexes = type.tree_getLeafGindices(
          gindex,
          type.fixedSize === null ? getNode(node, gindex) : undefined
        );
        for (const gindex of leafGindexes) {
          gindexes.push(gindex);
        }
      }
    }

    return gindexes;
  }

  /**
   * Navigate to a subtype & gindex using a path
   */
  getPathInfo(path: JsonPath): {gindex: Gindex; type: Type<unknown>} {
    const gindices: Gindex[] = [];
    let type = this as Type<unknown>;
    for (const prop of path) {
      if (type.isBasic) {
        throw new Error("Invalid path: cannot navigate beyond a basic type");
      }
      const gindex = (type as CompositeTypeAny).getPropertyGindex(prop);
      // else stop navigating
      if (gindex !== null) {
        gindices.push(gindex);
        type = (type as CompositeTypeAny).getPropertyType(prop) as CompositeTypeAny;
      }
    }

    return {
      type,
      gindex: concatGindices(gindices),
    };
  }

  /**
   * INTERNAL METHOD: post process `Ǹode` instance created from a proof and return either the same node,
   * and a new node representing the same data is a different `Node` instance. Currently used exclusively
   * by ContainerNodeStruct to convert `BranchNode` into `BranchNodeStruct`.
   */
  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    return {node, done: false};
  }

  /**
   * Get leaf gindices
   *
   * Note: This is a recursively called method.
   * Subtypes recursively call this method until basic types / leaf data is hit.
   *
   * @param node Used for variable-length types.
   * @param root Used to anchor the returned gindices to a non-root gindex.
   * This is used to augment leaf gindices in recursively-called subtypes relative to the type.
   * @returns The gindices corresponding to leaf data.
   */
  abstract tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[];
  /** Return the generalized index for the subtree. May return null if must not navigate below this type */
  abstract getPropertyGindex(property: JsonPathProp): Gindex | null;
  /** Return the property's subtype if the property exists */
  abstract getPropertyType(property: JsonPathProp): Type<unknown>;
  /** Return a leaf node index's property if the index is within bounds */
  abstract getIndexProperty(index: number): JsonPathProp | null;
}

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
  abstract commit(): void;

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

  /**
   * Merkleize view and compute its hashTreeRoot.
   * Commits any pending changes before computing the root.
   *
   * See spec for definition of hashTreeRoot:
   * https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md#merkleization
   */
  hashTreeRoot(): Uint8Array {
    this.commit();
    return super.hashTreeRoot();
  }

  /**
   * Serialize view to binary data.
   * Commits any pending changes before computing the root.
   */
  serialize(): Uint8Array {
    this.commit();
    return super.serialize();
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

export function isCompositeType(type: Type<unknown>): type is CompositeTypeAny {
  return !type.isBasic;
}
