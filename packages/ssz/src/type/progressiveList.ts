import {allocUnsafe} from "@chainsafe/as-sha256";
import {
  BranchNode,
  Gindex,
  HashComputationLevel,
  LeafNode,
  Node,
  Proof,
  Tree,
  concatGindices,
  getHashComputations,
  getNode,
  merkleizeBlocksBytes,
  packedNodeRootsToBytes,
  packedRootsBytesToLeafNodes,
  setNode,
  subtreeFillToContents,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";
import {pushAll} from "../util/array.ts";
import {byteArrayEquals} from "../util/byteArray.ts";
import {ValueWithCachedPermanentRoot, cacheRoot, symbolCachedPermanentRoot} from "../util/merkleize.ts";
import {namedClass} from "../util/named.ts";
import {Require} from "../util/types.ts";
import {TreeView} from "../view/abstract.ts";
import {TreeViewDU} from "../viewDU/abstract.ts";
import {ValueOf} from "./abstract.ts";
import {ArrayType} from "./array.ts";
import {
  addLengthNode,
  assertValidArrayLength,
  getLengthFromRootNode,
  setChunksNode,
  value_deserializeFromBytesArrayBasic,
  value_serializeToBytesArrayBasic,
} from "./arrayBasic.ts";
import {
  minSizeArrayComposite,
  value_deserializeFromBytesArrayComposite,
  value_serializeToBytesArrayComposite,
  value_serializedSizeArrayComposite,
} from "./arrayComposite.ts";
import {BasicType} from "./basic.ts";
import {ByteViews} from "./composite.ts";
import {CompositeType, CompositeView, CompositeViewDU} from "./composite.ts";
import {
  PROGRESSIVE_LIST_MAX_SIZE,
  getNodesAtProgressiveDepth,
  merkleizeProgressiveBytes,
  progressiveChunkGindex,
  progressiveSubtreeDepth,
  progressiveSubtreeFillToContents,
} from "./progressive.ts";

export interface ProgressiveListOpts {
  typeName?: string;
  cachePermanentRootStruct?: boolean;
}

const CHUNKS_GINDEX = BigInt(2);
const LENGTH_GINDEX = BigInt(3);

export class ProgressiveListBasicType<ElementType extends BasicType<unknown>> extends ArrayType<
  ElementType,
  ProgressiveListBasicTreeView<ElementType>,
  ProgressiveListBasicTreeViewDU<ElementType>
> {
  readonly typeName: string;
  readonly itemsPerChunk: number;
  readonly depth = 1;
  readonly chunkDepth = 0;
  readonly maxChunkCount = Number.MAX_SAFE_INTEGER;
  readonly fixedSize = null;
  readonly minSize = 0;
  readonly maxSize = PROGRESSIVE_LIST_MAX_SIZE;
  readonly isList = true;
  readonly isViewMutable = true;
  readonly limit = Number.MAX_SAFE_INTEGER;
  readonly mixInLengthBlockBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthBlockBytes.buffer,
    this.mixInLengthBlockBytes.byteOffset,
    this.mixInLengthBlockBytes.byteLength
  );
  protected readonly defaultLen = 0;

  constructor(
    readonly elementType: ElementType,
    opts?: ProgressiveListOpts
  ) {
    super(elementType, opts?.cachePermanentRootStruct);

    if (!elementType.isBasic) throw Error("elementType must be basic");

    this.typeName = opts?.typeName ?? `ProgressiveList[${elementType.typeName}]`;
    this.itemsPerChunk = 32 / elementType.byteLength;
  }

  static named<ElementType extends BasicType<unknown>>(
    elementType: ElementType,
    opts: Require<ProgressiveListOpts, "typeName">
  ): ProgressiveListBasicType<ElementType> {
    return new (namedClass(ProgressiveListBasicType, opts.typeName))(elementType, opts);
  }

  getView(tree: Tree): ProgressiveListBasicTreeView<ElementType> {
    return new ProgressiveListBasicTreeView(this, tree);
  }

  getViewDU(node: Node): ProgressiveListBasicTreeViewDU<ElementType> {
    return new ProgressiveListBasicTreeViewDU(this, node);
  }

  commitView(view: ProgressiveListBasicTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(
    view: ProgressiveListBasicTreeViewDU<ElementType>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
    return view.node;
  }

  cacheOfViewDU(): unknown {
    return;
  }

  createFromProof(proof: Proof, root?: Uint8Array): ProgressiveListBasicTreeView<ElementType> {
    const rootNode = Tree.createFromProof(proof).rootNode;
    if (root !== undefined && !byteArrayEquals(rootNode.root, root)) {
      throw new Error("Proof does not match trusted root");
    }
    return this.getView(new Tree(rootNode));
  }

  value_serializedSize(value: ValueOf<ElementType>[]): number {
    return value.length * this.elementType.byteLength;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayBasic(this.elementType, value.length, output, offset, value);
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayBasic(this.elementType, data, start, end, this);
  }

  tree_serializedSize(node: Node): number {
    return this.tree_getLength(node) * this.elementType.byteLength;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    const size = length * this.elementType.byteLength;
    const chunkCount = Math.ceil(size / 32);
    const nodes = getNodesAtProgressiveDepth(chunksNode, chunkCount);
    packedNodeRootsToBytes(output.dataView, offset, size, nodes);
    return offset + size;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const length = (end - start) / this.elementType.byteLength;
    assertValidArrayLength(length, this, true);
    const nodes = packedRootsBytesToLeafNodes(data.dataView, start, end);
    return addLengthNode(progressiveSubtreeFillToContents(nodes), length);
  }

  tree_getLength(node: Node): number {
    return getLengthFromRootNode(node);
  }

  tree_setLength(tree: Tree, length: number): void {
    tree.rootNode = addLengthNode(tree.rootNode.left, length);
  }

  tree_getChunksNode(node: Node): Node {
    return node.left;
  }

  tree_chunksNodeOffset(): number {
    return 1;
  }

  tree_setChunksNode(
    rootNode: Node,
    chunksNode: Node,
    newLength: number | null,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    return setChunksNode(rootNode, chunksNode, newLength, hcOffset, hcByLevel);
  }

  hashTreeRoot(value: ValueOf<ElementType>[]): Uint8Array {
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        return cachedRoot;
      }
    }

    const root = allocUnsafe(32);
    this.hashTreeRootInto(value, root, 0, true);
    return root;
  }

  hashTreeRootInto(value: ValueOf<ElementType>[], output: Uint8Array, offset: number, safeCache = false): void {
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        output.set(cachedRoot, offset);
        return;
      }
    }

    const blockBytes = this.getBlocksBytes(value);
    const chunkCount = Math.ceil(this.value_serializedSize(value) / 32);

    merkleizeProgressiveBytes(blockBytes, chunkCount, this.mixInLengthBlockBytes, 0);
    this.mixInLengthBuffer.writeUIntLE(value.length, 32, 6);
    merkleizeBlocksBytes(this.mixInLengthBlockBytes, 2, output, offset);

    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
  }

  protected getBlocksBytes(value: ValueOf<ElementType>[]): Uint8Array {
    const byteLen = this.value_serializedSize(value);
    const blockByteLen = Math.ceil(byteLen / 64) * 64;
    if (blockByteLen > this.blocksBuffer.length) {
      this.blocksBuffer = new Uint8Array(blockByteLen);
    }
    const blockBytes = this.blocksBuffer.subarray(0, blockByteLen);
    const uint8Array = blockBytes.subarray(0, byteLen);
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    value_serializeToBytesArrayBasic(this.elementType, value.length, {uint8Array, dataView}, 0, value);
    blockBytes.subarray(byteLen).fill(0);
    return blockBytes;
  }

  getPropertyGindex(prop: string | number): Gindex {
    if (typeof prop !== "number") {
      throw Error(`Invalid array index: ${prop}`);
    }

    const chunkIndex = Math.floor(prop / this.itemsPerChunk);
    return concatGindices([CHUNKS_GINDEX, progressiveChunkGindex(chunkIndex)]);
  }

  tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[] {
    if (!rootNode) {
      throw new Error("ProgressiveList type requires tree argument to get leaves");
    }

    const length = this.tree_getLength(rootNode);
    const chunkCount = Math.ceil(length / this.itemsPerChunk);
    const gindices = new Array<Gindex>(chunkCount);
    for (let i = 0; i < chunkCount; i++) {
      gindices[i] = concatGindices([rootGindex, CHUNKS_GINDEX, progressiveChunkGindex(i)]);
    }
    gindices.push(concatGindices([rootGindex, LENGTH_GINDEX]));
    return gindices;
  }

  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    return {node, done: true};
  }
}

export class ProgressiveListCompositeType<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>,
> extends ArrayType<
  ElementType,
  ProgressiveListCompositeTreeView<ElementType>,
  ProgressiveListCompositeTreeViewDU<ElementType>
> {
  readonly typeName: string;
  readonly itemsPerChunk = 1;
  readonly depth = 1;
  readonly chunkDepth = 0;
  readonly maxChunkCount = Number.MAX_SAFE_INTEGER;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = true;
  readonly isViewMutable = true;
  readonly limit = Number.MAX_SAFE_INTEGER;
  readonly mixInLengthBlockBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthBlockBytes.buffer,
    this.mixInLengthBlockBytes.byteOffset,
    this.mixInLengthBlockBytes.byteLength
  );
  protected readonly defaultLen = 0;

  constructor(
    readonly elementType: ElementType,
    opts?: ProgressiveListOpts
  ) {
    super(elementType, opts?.cachePermanentRootStruct);

    if (elementType.isBasic) throw Error("elementType must not be basic");

    this.typeName = opts?.typeName ?? `ProgressiveList[${elementType.typeName}]`;
    this.minSize = minSizeArrayComposite(elementType, 0);
    this.maxSize = PROGRESSIVE_LIST_MAX_SIZE;
  }

  static named<
    ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>,
  >(
    elementType: ElementType,
    opts: Require<ProgressiveListOpts, "typeName">
  ): ProgressiveListCompositeType<ElementType> {
    return new (namedClass(ProgressiveListCompositeType, opts.typeName))(elementType, opts);
  }

  getView(tree: Tree): ProgressiveListCompositeTreeView<ElementType> {
    return new ProgressiveListCompositeTreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ProgressiveListCompositeTreeViewDU<ElementType> {
    return new ProgressiveListCompositeTreeViewDU(this, node, cache as ProgressiveListCompositeTreeViewDUCache);
  }

  commitView(view: ProgressiveListCompositeTreeView<ElementType>): Node {
    return view.node;
  }

  commitViewDU(
    view: ProgressiveListCompositeTreeViewDU<ElementType>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
    return view.node;
  }

  cacheOfViewDU(): unknown {
    return;
  }

  createFromProof(proof: Proof, root?: Uint8Array): ProgressiveListCompositeTreeView<ElementType> {
    const rootNode = Tree.createFromProof(proof).rootNode;
    if (root !== undefined && !byteArrayEquals(rootNode.root, root)) {
      throw new Error("Proof does not match trusted root");
    }
    return this.getView(new Tree(rootNode));
  }

  value_serializedSize(value: ValueOf<ElementType>[]): number {
    return value_serializedSizeArrayComposite(this.elementType, value.length, value);
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOf<ElementType>[]): number {
    return value_serializeToBytesArrayComposite(this.elementType, value.length, output, offset, value);
  }

  value_deserializeFromBytes(
    data: ByteViews,
    start: number,
    end: number,
    reuseBytes?: boolean
  ): ValueOf<ElementType>[] {
    return value_deserializeFromBytesArrayComposite(this.elementType, data, start, end, this, reuseBytes);
  }

  tree_serializedSize(node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    const nodes = getNodesAtProgressiveDepth(chunksNode, length);

    if (this.elementType.fixedSize === null) {
      let size = 0;
      for (const node of nodes) {
        size += 4 + this.elementType.tree_serializedSize(node);
      }
      return size;
    }

    return length * this.elementType.fixedSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const chunksNode = this.tree_getChunksNode(node);
    const length = this.tree_getLength(node);
    const nodes = getNodesAtProgressiveDepth(chunksNode, length);

    if (this.elementType.fixedSize === null) {
      let variableIndex = offset + length * 4;
      for (let i = 0; i < nodes.length; i++) {
        output.dataView.setUint32(offset + i * 4, variableIndex - offset, true);
        variableIndex = this.elementType.tree_serializeToBytes(output, variableIndex, nodes[i]);
      }
      return variableIndex;
    }

    for (const node of nodes) {
      offset = this.elementType.tree_serializeToBytes(output, offset, node);
    }
    return offset;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const offsets = readOffsetsProgressiveListComposite(this.elementType.fixedSize, data.dataView, start, end, this);
    const length = offsets.length;
    const nodes = new Array<Node>(length);

    for (let i = 0; i < length; i++) {
      const startEl = start + offsets[i];
      const endEl = i === length - 1 ? end : start + offsets[i + 1];
      nodes[i] = this.elementType.tree_deserializeFromBytes(data, startEl, endEl);
    }

    return addLengthNode(progressiveSubtreeFillToContents(nodes), length);
  }

  tree_getLength(node: Node): number {
    return getLengthFromRootNode(node);
  }

  tree_setLength(tree: Tree, length: number): void {
    tree.rootNode = addLengthNode(tree.rootNode.left, length);
  }

  tree_getChunksNode(node: Node): Node {
    return node.left;
  }

  tree_chunksNodeOffset(): number {
    return 1;
  }

  tree_setChunksNode(
    rootNode: Node,
    chunksNode: Node,
    newLength: number | null,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    return setChunksNode(rootNode, chunksNode, newLength, hcOffset, hcByLevel);
  }

  hashTreeRoot(value: ValueOf<ElementType>[]): Uint8Array {
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        return cachedRoot;
      }
    }

    const root = allocUnsafe(32);
    this.hashTreeRootInto(value, root, 0, true);
    return root;
  }

  hashTreeRootInto(value: ValueOf<ElementType>[], output: Uint8Array, offset: number, safeCache = false): void {
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        output.set(cachedRoot, offset);
        return;
      }
    }

    const blockBytes = this.getBlocksBytes(value);

    merkleizeProgressiveBytes(blockBytes, value.length, this.mixInLengthBlockBytes, 0);
    this.mixInLengthBuffer.writeUIntLE(value.length, 32, 6);
    merkleizeBlocksBytes(this.mixInLengthBlockBytes, 2, output, offset);

    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
  }

  protected getBlocksBytes(value: ValueOf<ElementType>[]): Uint8Array {
    const blockBytesLen = Math.ceil(value.length / 2) * 64;
    if (blockBytesLen > this.blocksBuffer.length) {
      this.blocksBuffer = new Uint8Array(blockBytesLen);
    }
    const blockBytes = this.blocksBuffer.subarray(0, blockBytesLen);
    for (let i = 0; i < value.length; i++) {
      this.elementType.hashTreeRootInto(value[i], blockBytes, i * 32);
    }
    if (value.length % 2 === 1) {
      blockBytes.subarray(value.length * 32, value.length * 32 + 32).fill(0);
    }
    return blockBytes;
  }

  getPropertyGindex(prop: string | number): Gindex {
    if (typeof prop !== "number") {
      throw Error(`Invalid array index: ${prop}`);
    }

    return concatGindices([CHUNKS_GINDEX, progressiveChunkGindex(prop)]);
  }

  tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[] {
    if (!rootNode) {
      throw new Error("ProgressiveList type requires tree argument to get leaves");
    }

    const length = this.tree_getLength(rootNode);
    const gindices: Gindex[] = [];
    for (let i = 0; i < length; i++) {
      const elementGindexFromListRoot = concatGindices([CHUNKS_GINDEX, progressiveChunkGindex(i)]);
      const elementGindex = concatGindices([rootGindex, elementGindexFromListRoot]);
      if (this.elementType.isBasic) {
        gindices.push(elementGindex);
      } else if (this.elementType.fixedSize === null) {
        pushAll(
          gindices,
          this.elementType.tree_getLeafGindices(elementGindex, getNode(rootNode, elementGindexFromListRoot))
        );
      } else {
        pushAll(gindices, this.elementType.tree_getLeafGindices(elementGindex));
      }
    }
    gindices.push(concatGindices([rootGindex, LENGTH_GINDEX]));
    return gindices;
  }

  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    return {node, done: true};
  }
}

export class ProgressiveListBasicTreeView<ElementType extends BasicType<unknown>> extends TreeView<
  ProgressiveListBasicType<ElementType>
> {
  constructor(
    readonly type: ProgressiveListBasicType<ElementType>,
    protected tree: Tree
  ) {
    super();
  }

  get length(): number {
    return this.type.tree_getLength(this.tree.rootNode);
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  get(index: number): ValueOf<ElementType> {
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const leafNode = this.tree.getNode(chunkGindexFromListRoot(chunkIndex)) as LeafNode;
    return this.type.elementType.tree_getFromPackedNode(leafNode, index) as ValueOf<ElementType>;
  }

  set(index: number, value: ValueOf<ElementType>): void {
    const length = this.length;
    if (index >= length) {
      throw Error(`Error setting index over length ${index} > ${length}`);
    }

    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const gindex = chunkGindexFromListRoot(chunkIndex);
    const leafNode = (this.tree.getNode(gindex) as LeafNode).clone();
    this.type.elementType.tree_setToPackedNode(leafNode, index, value);
    this.tree.setNode(gindex, leafNode);
  }

  getAll(values?: ValueOf<ElementType>[]): ValueOf<ElementType>[] {
    const length = this.length;
    if (values && values.length !== length) {
      throw Error(`Expected ${length} values, got ${values.length}`);
    }

    const chunksNode = this.type.tree_getChunksNode(this.node);
    const chunkCount = Math.ceil(length / this.type.itemsPerChunk);
    const leafNodes = getNodesAtProgressiveDepth(chunksNode, chunkCount) as LeafNode[];
    values = values ?? new Array<ValueOf<ElementType>>(length);

    for (let i = 0; i < length; i++) {
      values[i] = this.type.elementType.tree_getFromPackedNode(
        leafNodes[Math.floor(i / this.type.itemsPerChunk)],
        i
      ) as ValueOf<ElementType>;
    }
    return values;
  }
}

export class ProgressiveListBasicTreeViewDU<ElementType extends BasicType<unknown>> extends TreeViewDU<
  ProgressiveListBasicType<ElementType>
> {
  constructor(
    readonly type: ProgressiveListBasicType<ElementType>,
    protected _rootNode: Node
  ) {
    super();
  }

  get length(): number {
    return this.type.tree_getLength(this._rootNode);
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): unknown {
    return undefined;
  }

  commit(hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): void {
    if (hcByLevel !== null && this._rootNode.h0 === null) {
      getHashComputations(this._rootNode, hcOffset, hcByLevel);
    }
  }

  get(index: number): ValueOf<ElementType> {
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const leafNode = getNode(this._rootNode, chunkGindexFromListRoot(chunkIndex)) as LeafNode;
    return this.type.elementType.tree_getFromPackedNode(leafNode, index) as ValueOf<ElementType>;
  }

  set(index: number, value: ValueOf<ElementType>): void {
    const length = this.length;
    if (index >= length) {
      throw Error(`Error setting index over length ${index} > ${length}`);
    }

    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const gindex = chunkGindexFromListRoot(chunkIndex);
    const leafNode = (getNode(this._rootNode, gindex) as LeafNode).clone();
    this.type.elementType.tree_setToPackedNode(leafNode, index, value);
    this._rootNode = setNode(this._rootNode, gindex, leafNode);
  }

  push(value: ValueOf<ElementType>): void {
    const length = this.length;
    if (length >= this.type.limit) {
      throw Error("Error pushing over limit");
    }

    const chunkIndex = Math.floor(length / this.type.itemsPerChunk);
    const gindex = chunkGindexFromListRoot(chunkIndex);
    const leafNode =
      length % this.type.itemsPerChunk === 0
        ? LeafNode.fromZero()
        : (getNode(this._rootNode, gindex) as LeafNode).clone();

    this.type.elementType.tree_setToPackedNode(leafNode, length, value);

    const chunksNode = appendProgressiveChunk(this.type.tree_getChunksNode(this._rootNode), chunkIndex, leafNode);
    this._rootNode = this.type.tree_setChunksNode(this._rootNode, chunksNode, length + 1);
  }

  getAll(values?: ValueOf<ElementType>[]): ValueOf<ElementType>[] {
    const view = new ProgressiveListBasicTreeView(this.type, new Tree(this._rootNode));
    return view.getAll(values);
  }

  /**
   * Returns a new ProgressiveListBasicTreeViewDU instance with the values from 0 to `index`.
   * To achieve it, rebinds the underlying tree zero-ing all nodes right of `chunkIndex`.
   * Also set all value right of `index` in the same chunk to 0.
   */
  sliceTo(index: number): this {
    if (index < 0) {
      throw new Error(`Does not support sliceTo() with negative index ${index}`);
    }

    const length = this.length;
    if (index >= length - 1) {
      return this;
    }

    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    const chunkIndex = Math.floor(index / this.type.itemsPerChunk);
    const nodePrev = getNode(this._rootNode, chunkGindexFromListRoot(chunkIndex)) as LeafNode;

    const nodeChanged = LeafNode.fromZero();
    for (let i = chunkIndex * this.type.itemsPerChunk; i <= index; i++) {
      const prevValue = this.type.elementType.tree_getFromPackedNode(nodePrev, i);
      this.type.elementType.tree_setToPackedNode(nodeChanged, i, prevValue);
    }

    const chunkCount = Math.ceil((index + 1) / this.type.itemsPerChunk);
    const nodes = getNodesAtProgressiveDepth(chunksNode, chunkCount);
    nodes[chunkIndex] = nodeChanged;
    const newChunksNode = progressiveSubtreeFillToContents(nodes);

    const newLength = index + 1;
    const newRootNode = this.type.tree_setChunksNode(this._rootNode, newChunksNode, newLength);
    return this.type.getViewDU(newRootNode) as this;
  }

  /**
   * Returns a new ProgressiveListBasicTreeViewDU instance with the values from `index` to the end of list.
   */
  sliceFrom(index: number): this {
    return this.type.toViewDU(this.getAll().slice(index)) as this;
  }

  protected clearCache(): void {
    // No cached data to clear.
  }
}

export class ProgressiveListCompositeTreeView<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>,
> extends TreeView<ProgressiveListCompositeType<ElementType>> {
  constructor(
    readonly type: ProgressiveListCompositeType<ElementType>,
    protected tree: Tree
  ) {
    super();
  }

  get length(): number {
    return this.type.tree_getLength(this.tree.rootNode);
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  get(index: number): CompositeView<ElementType> {
    const subtree = this.tree.getSubtree(chunkGindexFromListRoot(index));
    return this.type.elementType.getView(subtree);
  }

  set(index: number, view: CompositeView<ElementType>): void {
    const length = this.length;
    if (index >= length) {
      throw Error(`Error setting index over length ${index} > ${length}`);
    }

    this.tree.setNode(chunkGindexFromListRoot(index), this.type.elementType.commitView(view));
  }

  getAllReadonlyValues(values?: ValueOf<ElementType>[]): ValueOf<ElementType>[] {
    const length = this.length;
    if (values && values.length !== length) {
      throw Error(`Expected ${length} values, got ${values.length}`);
    }

    const chunksNode = this.type.tree_getChunksNode(this.node);
    const nodes = getNodesAtProgressiveDepth(chunksNode, length);
    values = values ?? new Array<ValueOf<ElementType>>(length);
    for (let i = 0; i < length; i++) {
      values[i] = this.type.elementType.tree_toValue(nodes[i]);
    }
    return values;
  }
}

export class ProgressiveListCompositeTreeViewDU<
  ElementType extends CompositeType<ValueOf<ElementType>, CompositeView<ElementType>, CompositeViewDU<ElementType>>,
> extends TreeViewDU<ProgressiveListCompositeType<ElementType>> {
  private nodes: Node[] = [];
  private caches: unknown[] = [];
  private readonly viewsChanged = new Map<number, CompositeViewDU<ElementType>>();
  private nodesPopulated = false;

  constructor(
    readonly type: ProgressiveListCompositeType<ElementType>,
    protected _rootNode: Node,
    cache?: ProgressiveListCompositeTreeViewDUCache
  ) {
    super();
    if (cache) {
      this.nodes = cache.nodes ?? [];
      this.caches = cache.caches;
      this.nodesPopulated = cache.nodesPopulated ?? false;
    }
  }

  get length(): number {
    return this.type.tree_getLength(this._rootNode);
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): ProgressiveListCompositeTreeViewDUCache {
    return {nodes: this.nodes, caches: this.caches, nodesPopulated: this.nodesPopulated};
  }

  commit(hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): void {
    for (const [index, view] of this.viewsChanged) {
      const gindex = chunkGindexFromListRoot(index);
      this._rootNode = setNode(this._rootNode, gindex, this.type.elementType.commitViewDU(view));
      this.caches[index] = this.type.elementType.cacheOfViewDU(view);
      this.nodes[index] = getNode(this._rootNode, gindex);
    }
    this.viewsChanged.clear();

    if (hcByLevel !== null && this._rootNode.h0 === null) {
      getHashComputations(this._rootNode, hcOffset, hcByLevel);
    }
  }

  get(index: number): CompositeViewDU<ElementType> {
    const changed = this.viewsChanged.get(index);
    if (changed) {
      return changed;
    }

    let node = this.nodes[index];
    if (node === undefined) {
      node = getNode(this._rootNode, chunkGindexFromListRoot(index));
      this.nodes[index] = node;
    }

    const view = this.type.elementType.getViewDU(node, this.caches[index]);
    if (this.type.elementType.isViewMutable) {
      this.viewsChanged.set(index, view);
    }
    return view;
  }

  /**
   * Get element at `index`. Returns a view of the Composite element type.
   * DOES NOT PROPAGATE CHANGES: use only for reads and to skip parent references.
   */
  getReadonly(index: number): CompositeViewDU<ElementType> {
    const changed = this.viewsChanged.get(index);
    if (changed) {
      return changed;
    }

    let node = this.nodes[index];
    if (node === undefined) {
      node = getNode(this._rootNode, chunkGindexFromListRoot(index));
      this.nodes[index] = node;
    }

    return this.type.elementType.getViewDU(node, this.caches[index]);
  }

  set(index: number, view: CompositeViewDU<ElementType>): void {
    const length = this.length;
    if (index >= length) {
      throw Error(`Error setting index over length ${index} > ${length}`);
    }

    this.viewsChanged.set(index, view);
  }

  push(view: CompositeViewDU<ElementType>): void {
    this.commit();

    const length = this.length;
    if (length >= this.type.limit) {
      throw Error("Error pushing over limit");
    }

    const node = this.type.elementType.commitViewDU(view);
    const chunksNode = appendProgressiveChunk(this.type.tree_getChunksNode(this._rootNode), length, node);
    this._rootNode = this.type.tree_setChunksNode(this._rootNode, chunksNode, length + 1);
    if (this.nodesPopulated) {
      this.nodes[length] = node;
    }
    this.caches[length] = this.type.elementType.cacheOfViewDU(view);
    if (this.type.elementType.isViewMutable) {
      this.viewsChanged.set(length, view);
    }
  }

  /**
   * Returns all elements at every index, if an index is modified it will return the modified view.
   * No need to commit() before calling this function.
   */
  getAllReadonly(views?: CompositeViewDU<ElementType>[]): CompositeViewDU<ElementType>[] {
    const length = this.length;
    if (views && views.length !== length) {
      throw Error(`Expected ${length} views, got ${views.length}`);
    }
    this.populateAllOldNodes();

    views = views ?? new Array<CompositeViewDU<ElementType>>(length);
    for (let i = 0; i < length; i++) {
      views[i] = this.getReadonly(i);
    }
    return views;
  }

  /**
   * Apply `fn` to each ViewDU in the array.
   * Similar to getAllReadOnly(), no need to commit() before calling this function.
   * if an item is modified it will return the modified view.
   */
  forEach(fn: (viewDU: CompositeViewDU<ElementType>, index: number) => void): void {
    this.populateAllOldNodes();
    for (let i = 0; i < this.length; i++) {
      fn(this.getReadonly(i), i);
    }
  }

  /**
   * WARNING: Returns all commited changes, if there are any pending changes commit them beforehand
   * @param values optional output parameter, if is provided it must be an array of the same length as this array
   */
  getAllReadonlyValues(values?: ValueOf<ElementType>[]): ValueOf<ElementType>[] {
    const length = this.length;
    if (values && values.length !== length) {
      throw Error(`Expected ${length} values, got ${values.length}`);
    }
    this.populateAllNodes();

    values = values ?? new Array<ValueOf<ElementType>>(length);
    for (let i = 0; i < length; i++) {
      values[i] = this.type.elementType.tree_toValue(this.nodes[i]);
    }
    return values;
  }

  /**
   * Apply `fn` to each value in the array.
   */
  forEachValue(fn: (value: ValueOf<ElementType>, index: number) => void): void {
    this.populateAllNodes();
    for (let i = 0; i < this.length; i++) {
      fn(this.type.elementType.tree_toValue(this.nodes[i]), i);
    }
  }

  /**
   * Get by range of indexes. Returns an array of views of the Composite element type.
   * This is similar to getAllReadonly() where we dont have to commit() before calling this function.
   */
  getReadonlyByRange(startIndex: number, count: number): CompositeViewDU<ElementType>[] {
    if (startIndex < 0) {
      throw Error(`Error getting by range, startIndex < 0: ${startIndex}`);
    }

    if (count <= 0) {
      throw Error(`Error getting by range, count <= 0: ${count}`);
    }

    const length = this.length;
    if (startIndex >= length) {
      throw Error(`Error getting by range, startIndex >= length: ${startIndex} >= ${length}`);
    }

    count = Math.min(count, length - startIndex);

    const result = new Array<CompositeViewDU<ElementType>>(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.getReadonly(startIndex + i);
    }
    return result;
  }

  /**
   * Returns a new ProgressiveListCompositeTreeViewDU instance with the values from 0 to `index`.
   * `index` is inclusive.
   */
  sliceTo(index: number): this {
    this.commit();
    const rootNode = this._rootNode;
    const length = this.length;

    if (index >= length - 1) {
      return this;
    }

    const newLength = Math.max(index + 1, 0);
    const chunksNode = this.type.tree_getChunksNode(rootNode);
    const nodes = getNodesAtProgressiveDepth(chunksNode, newLength);
    const newChunksNode = progressiveSubtreeFillToContents(nodes);
    const newRootNode = this.type.tree_setChunksNode(rootNode, newChunksNode, newLength);

    return this.rootNodeToViewDU(newRootNode);
  }

  /**
   * Returns a new ProgressiveListCompositeTreeViewDU instance with the values from `index` to the end of list.
   */
  sliceFrom(index: number): this {
    this.commit();
    this.populateAllNodes();

    if (index < 0) {
      index += this.nodes.length;
    }
    if (index <= 0) {
      return this;
    }

    const nodes = index >= this.nodes.length ? [] : this.nodes.slice(index);
    const newChunksNode = progressiveSubtreeFillToContents(nodes);
    const newRootNode = this.type.tree_setChunksNode(this._rootNode, newChunksNode, nodes.length);

    return this.rootNodeToViewDU(newRootNode);
  }

  protected clearCache(): void {
    this.nodes = [];
    this.caches = [];
    this.nodesPopulated = false;
    this.viewsChanged.clear();
  }

  protected populateAllNodes(): void {
    if (this.viewsChanged.size > 0) {
      throw Error("Must commit changes before reading all nodes");
    }

    if (!this.nodesPopulated) {
      const chunksNode = this.type.tree_getChunksNode(this._rootNode);
      this.nodes = getNodesAtProgressiveDepth(chunksNode, this.length);
      this.nodesPopulated = true;
    }
  }

  protected populateAllOldNodes(): void {
    if (!this.nodesPopulated) {
      const chunksNode = this.type.tree_getChunksNode(this._rootNode);
      this.nodes = getNodesAtProgressiveDepth(chunksNode, this.length);
      this.nodesPopulated = true;
    }
  }

  protected rootNodeToViewDU(rootNode: Node): this {
    return this.type.getViewDU(rootNode) as this;
  }
}

type ProgressiveListCompositeTreeViewDUCache = {
  nodes?: Node[];
  caches: unknown[];
  nodesPopulated?: boolean;
};

function chunkGindexFromListRoot(chunkIndex: number): Gindex {
  return concatGindices([CHUNKS_GINDEX, progressiveChunkGindex(chunkIndex)]);
}

function appendProgressiveChunk(chunksNode: Node, chunkIndex: number, chunkNode: Node): Node {
  const {subtreeIndex, subtreeStart} = progressiveSubtreeIndexAndStart(chunkIndex);
  if (chunkIndex !== subtreeStart) {
    return setNode(chunksNode, progressiveChunkGindex(chunkIndex), chunkNode);
  }

  const subtreeNode = subtreeFillToContents([chunkNode], progressiveSubtreeDepth(subtreeIndex));
  const subtreeBranch = new BranchNode(subtreeNode, zeroNode(0));
  if (subtreeIndex === 0) {
    return subtreeBranch;
  }

  return setNode(chunksNode, progressiveSubtreeBranchGindex(subtreeIndex), subtreeBranch);
}

function progressiveSubtreeIndexAndStart(chunkIndex: number): {subtreeIndex: number; subtreeStart: number} {
  let subtreeIndex = 0;
  let subtreeStart = 0;
  let subtreeLength = 1;
  while (chunkIndex >= subtreeStart + subtreeLength) {
    subtreeStart += subtreeLength;
    subtreeLength *= 4;
    subtreeIndex++;
  }
  return {subtreeIndex, subtreeStart};
}

function progressiveSubtreeBranchGindex(subtreeIndex: number): Gindex {
  return concatGindices(Array.from({length: subtreeIndex}, () => BigInt(3)));
}

function readOffsetsProgressiveListComposite(
  elementFixedSize: null | number,
  data: DataView,
  start: number,
  end: number,
  arrayProps: {isList: true; limit: number}
): Uint32Array {
  const size = end - start;

  if (elementFixedSize === null) {
    const offsets = readVariableOffsetsProgressiveList(data, start, size);
    assertValidArrayLength(offsets.length, arrayProps);
    return offsets;
  }

  if (elementFixedSize === 0) {
    throw Error("element fixed length is 0");
  }
  if (size % elementFixedSize !== 0) {
    throw Error(`size ${size} is not multiple of element fixedSize ${elementFixedSize}`);
  }

  const length = size / elementFixedSize;
  assertValidArrayLength(length, arrayProps);
  const offsets = new Uint32Array(length);
  for (let i = 0; i < length; i++) {
    offsets[i] = i * elementFixedSize;
  }
  return offsets;
}

function readVariableOffsetsProgressiveList(data: DataView, start: number, size: number): Uint32Array {
  if (size === 0) {
    return new Uint32Array(0);
  }
  if (size < 4) {
    throw Error(`Variable length list data is too short ${size}`);
  }

  const firstOffset = data.getUint32(start, true);
  if (firstOffset % 4 !== 0) {
    throw Error(`First offset must be a multiple of 4, got ${firstOffset}`);
  }
  if (firstOffset > size) {
    throw Error(`First offset out of bounds ${firstOffset} > ${size}`);
  }

  const length = firstOffset / 4;
  if (length === 0) {
    throw Error("Variable length list first offset must be greater than zero");
  }

  const offsets = new Uint32Array(length);
  offsets[0] = firstOffset;

  for (let i = 1; i < length; i++) {
    const offset = data.getUint32(start + i * 4, true);
    if (offset < offsets[i - 1]) {
      throw Error(`Offsets must be increasing ${offset} < ${offsets[i - 1]}`);
    }
    if (offset > size) {
      throw Error(`Offset out of bounds ${offset} > ${size}`);
    }
    offsets[i] = offset;
  }

  return offsets;
}
