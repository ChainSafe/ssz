import {allocUnsafe} from "@chainsafe/as-sha256";
import {
  concatGindices,
  createProof,
  getNode,
  Gindex,
  Node,
  Proof,
  ProofType,
  Tree,
  merkleizeBlocksBytes,
  HashComputationLevel,
} from "@chainsafe/persistent-merkle-tree";
import {byteArrayEquals} from "../util/byteArray.js";
import {cacheRoot, symbolCachedPermanentRoot, ValueWithCachedPermanentRoot} from "../util/merkleize.js";
import {treePostProcessFromProofNode} from "../util/proof/treePostProcessFromProofNode.js";
import {Type, ByteViews, JsonPath, JsonPathProp} from "./abstract.js";
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
  protected chunkBytesBuffer = new Uint8Array(0);

  constructor(
    /**
     * Caches `hashTreeRoot()` result for struct values.
     *
     * WARNING: Must only be used for immutable values. The cached root is never discarded
     */
    protected readonly cachePermanentRootStruct?: boolean
  ) {
    super();
  }

  /** New instance of a recursive zero'ed value converted to Tree View */
  defaultView(): TV {
    return this.toView(this.defaultValue());
  }

  /** New instance of a recursive zero'ed value converted to Deferred Update Tree View */
  defaultViewDU(): TVDU {
    return this.toViewDU(this.defaultValue());
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
  abstract commitViewDU(view: TVDU, hcOffset?: number, hcByLevel?: HashComputationLevel[] | null): Node;
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

    const root = allocUnsafe(32);
    const safeCache = true;
    this.hashTreeRootInto(value, root, 0, safeCache);

    // hashTreeRootInto will cache the root if cachePermanentRootStruct is true

    return root;
  }

  hashTreeRootInto(value: V, output: Uint8Array, offset: number, safeCache = false): void {
    // Return cached mutable root if any
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        output.set(cachedRoot, offset);
        return;
      }
    }

    const merkleBytes = this.getChunkBytes(value);
    merkleizeBlocksBytes(merkleBytes, this.maxChunkCount, output, offset);
    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
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

  /**
   * Get merkle bytes of each value, the returned Uint8Array should be multiple of 64 bytes.
   * If chunk count is not even, need to append zeroHash(0)
   */
  protected abstract getChunkBytes(value: V): Uint8Array;

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

export function isCompositeType(type: Type<unknown>): type is CompositeTypeAny {
  return !type.isBasic;
}
