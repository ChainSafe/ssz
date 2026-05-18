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
  setNode,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";
import {byteArrayEquals} from "../util/byteArray.ts";
import {ValueWithCachedPermanentRoot, cacheRoot, symbolCachedPermanentRoot} from "../util/merkleize.ts";
import {namedClass} from "../util/named.ts";
import {Case} from "../util/strings.ts";
import {Require} from "../util/types.ts";
import {BitArray} from "../value/bitArray.ts";
import {TreeView} from "../view/abstract.ts";
import {TreeViewDU} from "../viewDU/abstract.ts";
import {Type, ValueOf} from "./abstract.ts";
import {BasicType, isBasicType} from "./basic.ts";
import {
  ByteViews,
  CompositeType,
  CompositeTypeAny,
  CompositeView,
  CompositeViewDU,
  isCompositeType,
} from "./composite.ts";
import {merkleizeProgressiveBytes, progressiveChunkGindex, progressiveSubtreeFillToContents} from "./progressive.ts";
import {mixInActiveFields} from "./stableContainer.ts";

type BytesRange = {start: number; end: number};

export type ProgressiveContainerOptions<Fields extends Record<string, unknown>> = {
  typeName?: string;
  jsonCase?: KeyCase;
  casingMap?: CasingMap<Fields>;
  cachePermanentRootStruct?: boolean;
};

export type KeyCase = "eth2" | "snake" | "constant" | "camel" | "header" | "pascal";

type CasingMap<Fields extends Record<string, unknown>> = Partial<{[K in keyof Fields]: string}>;

export type ValueOfFields<Fields extends Record<string, Type<unknown>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

type FieldsView<Fields extends Record<string, Type<unknown>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<unknown, infer TV, unknown>
    ? TV
    : Fields[K] extends BasicType<infer V>
      ? V
      : never;
};

type FieldsViewDU<Fields extends Record<string, Type<unknown>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<unknown, unknown, infer TVDU>
    ? TVDU
    : Fields[K] extends BasicType<infer V>
      ? V
      : never;
};

export type ProgressiveContainerTreeViewType<Fields extends Record<string, Type<unknown>>> = FieldsView<Fields> &
  TreeView<ProgressiveContainerType<Fields>>;
export type ProgressiveContainerTreeViewDUType<Fields extends Record<string, Type<unknown>>> = FieldsViewDU<Fields> &
  TreeViewDU<ProgressiveContainerType<Fields>>;

type ProgressiveContainerTreeViewTypeConstructor<Fields extends Record<string, Type<unknown>>> = new (
  type: ProgressiveContainerType<Fields>,
  tree: Tree
) => ProgressiveContainerTreeViewType<Fields>;

type ProgressiveContainerTreeViewDUTypeConstructor<Fields extends Record<string, Type<unknown>>> = new (
  type: ProgressiveContainerType<Fields>,
  node: Node,
  cache?: unknown
) => ProgressiveContainerTreeViewDUType<Fields>;

type FieldEntry<Fields extends Record<string, Type<unknown>>> = {
  fieldName: keyof Fields;
  fieldType: Fields[keyof Fields];
  jsonKey: string;
  gindex: Gindex;
  chunkIndex: number;
};

const FIELDS_GINDEX = BigInt(2);

/**
 * ProgressiveContainer: ordered heterogeneous collection with EIP-7916 progressive merkleization.
 * - Serialization is identical to Container over the active fields.
 * - Hash tree root mixes in the active-fields bitvector from the type definition.
 */
export class ProgressiveContainerType<Fields extends Record<string, Type<unknown>>> extends CompositeType<
  ValueOfFields<Fields>,
  ProgressiveContainerTreeViewType<Fields>,
  ProgressiveContainerTreeViewDUType<Fields>
> {
  readonly typeName: string;
  readonly depth = 2;
  readonly maxChunkCount: number;
  readonly fixedSize: number | null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = false;
  readonly isViewMutable = true;
  readonly fieldsEntries: FieldEntry<Fields>[];
  readonly activeFields: BitArray;
  protected readonly fieldsGindex: Record<keyof Fields, Gindex>;
  protected readonly jsonKeyToFieldName: Record<string, keyof Fields>;
  protected readonly isFixedLen: boolean[];
  protected readonly fieldRangesFixedLen: BytesRange[];
  protected readonly variableOffsetsPosition: number[];
  readonly fixedEnd: number;
  protected readonly TreeView: ProgressiveContainerTreeViewTypeConstructor<Fields>;
  protected readonly TreeViewDU: ProgressiveContainerTreeViewDUTypeConstructor<Fields>;
  private readonly tempRoot = new Uint8Array(32);

  constructor(
    readonly fields: Fields,
    activeFields: BitArray | boolean[],
    readonly opts?: ProgressiveContainerOptions<Fields>
  ) {
    super(opts?.cachePermanentRootStruct);

    this.activeFields = Array.isArray(activeFields) ? BitArray.fromBoolArray(activeFields) : activeFields.clone();
    validateActiveFields(this.activeFields, Object.keys(fields).length);

    this.typeName = opts?.typeName ?? renderProgressiveContainerTypeName(fields);
    this.maxChunkCount = this.activeFields.bitLen;

    const activeFieldIndexes = this.activeFields.getTrueBitIndexes();
    const fieldNames = Object.keys(fields) as (keyof Fields)[];
    this.fieldsEntries = [];
    for (let i = 0; i < fieldNames.length; i++) {
      const fieldName = fieldNames[i];
      const chunkIndex = activeFieldIndexes[i];
      this.fieldsEntries.push({
        fieldName,
        fieldType: fields[fieldName],
        jsonKey: precomputeJsonKey(fieldName, opts?.casingMap, opts?.jsonCase),
        gindex: concatGindices([FIELDS_GINDEX, progressiveChunkGindex(chunkIndex)]),
        chunkIndex,
      });
    }

    this.fieldsGindex = {} as Record<keyof Fields, Gindex>;
    for (const {fieldName, gindex} of this.fieldsEntries) {
      this.fieldsGindex[fieldName] = gindex;
    }

    this.jsonKeyToFieldName = {};
    for (const {fieldName, jsonKey} of this.fieldsEntries) {
      this.jsonKeyToFieldName[jsonKey] = fieldName;
    }

    const {minLen, maxLen, fixedSize} = precomputeSizes(fields);
    this.minSize = minLen;
    this.maxSize = maxLen;
    this.fixedSize = fixedSize;

    const {isFixedLen, fieldRangesFixedLen, variableOffsetsPosition, fixedEnd} = precomputeSerdesData(fields);
    this.isFixedLen = isFixedLen;
    this.fieldRangesFixedLen = fieldRangesFixedLen;
    this.variableOffsetsPosition = variableOffsetsPosition;
    this.fixedEnd = fixedEnd;

    this.TreeView = getProgressiveContainerTreeViewClass(this);
    this.TreeViewDU = getProgressiveContainerTreeViewDUClass(this);

    const fieldBytes = this.activeFields.bitLen * 32;
    this.blocksBuffer = new Uint8Array(Math.ceil(fieldBytes / 64) * 64);
  }

  static named<Fields extends Record<string, Type<unknown>>>(
    fields: Fields,
    activeFields: BitArray | boolean[],
    opts: Require<ProgressiveContainerOptions<Fields>, "typeName">
  ): ProgressiveContainerType<Fields> {
    return new (namedClass(ProgressiveContainerType, opts.typeName))(fields, activeFields, opts);
  }

  defaultValue(): ValueOfFields<Fields> {
    const value = {} as ValueOfFields<Fields>;
    for (const {fieldName, fieldType} of this.fieldsEntries) {
      value[fieldName] = fieldType.defaultValue() as ValueOf<Fields[keyof Fields]>;
    }
    return value;
  }

  getView(tree: Tree): ProgressiveContainerTreeViewType<Fields> {
    return new this.TreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ProgressiveContainerTreeViewDUType<Fields> {
    return new this.TreeViewDU(this, node, cache);
  }

  cacheOfViewDU(view: ProgressiveContainerTreeViewDUType<Fields>): unknown {
    return view.cache;
  }

  commitView(view: ProgressiveContainerTreeViewType<Fields>): Node {
    return view.node;
  }

  commitViewDU(
    view: ProgressiveContainerTreeViewDUType<Fields>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
    return view.node;
  }

  createFromProof(proof: Proof, root?: Uint8Array): ProgressiveContainerTreeViewType<Fields> {
    const rootNode = Tree.createFromProof(proof).rootNode;
    if (root !== undefined && !byteArrayEquals(rootNode.root, root)) {
      throw new Error("Proof does not match trusted root");
    }
    return this.getView(new Tree(rootNode));
  }

  value_serializedSize(value: ValueOfFields<Fields>): number {
    let totalSize = 0;
    for (const {fieldName, fieldType} of this.fieldsEntries) {
      totalSize +=
        fieldType.fixedSize === null ? 4 + fieldType.value_serializedSize(value[fieldName]) : fieldType.fixedSize;
    }
    return totalSize;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOfFields<Fields>): number {
    let fixedIndex = offset;
    let variableIndex = offset + this.fixedEnd;

    for (const {fieldName, fieldType} of this.fieldsEntries) {
      if (fieldType.fixedSize === null) {
        output.dataView.setUint32(fixedIndex, variableIndex - offset, true);
        fixedIndex += 4;
        variableIndex = fieldType.value_serializeToBytes(output, variableIndex, value[fieldName]);
      } else {
        fixedIndex = fieldType.value_serializeToBytes(output, fixedIndex, value[fieldName]);
      }
    }
    return variableIndex;
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number, reuseBytes?: boolean): ValueOfFields<Fields> {
    const fieldRanges = this.getFieldRanges(data.dataView, start, end);
    const value = {} as {[K in keyof Fields]: unknown};

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      const fieldRange = fieldRanges[i];
      value[fieldName] = fieldType.value_deserializeFromBytes(
        data,
        start + fieldRange.start,
        start + fieldRange.end,
        reuseBytes
      );
    }

    return value as ValueOfFields<Fields>;
  }

  tree_serializedSize(node: Node): number {
    let totalSize = 0;
    for (const {fieldType, gindex} of this.fieldsEntries) {
      const fieldNode = getNode(node, gindex);
      totalSize += fieldType.fixedSize === null ? 4 + fieldType.tree_serializedSize(fieldNode) : fieldType.fixedSize;
    }
    return totalSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    let fixedIndex = offset;
    let variableIndex = offset + this.fixedEnd;

    for (const {fieldType, gindex} of this.fieldsEntries) {
      const fieldNode = getNode(node, gindex);
      if (fieldType.fixedSize === null) {
        output.dataView.setUint32(fixedIndex, variableIndex - offset, true);
        fixedIndex += 4;
        variableIndex = fieldType.tree_serializeToBytes(output, variableIndex, fieldNode);
      } else {
        fixedIndex = fieldType.tree_serializeToBytes(output, fixedIndex, fieldNode);
      }
    }
    return variableIndex;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const fieldRanges = this.getFieldRanges(data.dataView, start, end);
    const nodes = new Array<Node>(this.activeFields.bitLen).fill(zeroNode(0));

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType, chunkIndex} = this.fieldsEntries[i];
      const fieldRange = fieldRanges[i];
      nodes[chunkIndex] = fieldType.tree_deserializeFromBytes(data, start + fieldRange.start, start + fieldRange.end);
    }

    return new BranchNode(progressiveSubtreeFillToContents(nodes), activeFieldsToNode(this.activeFields));
  }

  hashTreeRootInto(value: ValueOfFields<Fields>, output: Uint8Array, offset: number, safeCache = false): void {
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        output.set(cachedRoot, offset);
        return;
      }
    }

    const blocksBytes = this.getBlocksBytes(value);
    merkleizeProgressiveBytes(blocksBytes, this.activeFields.bitLen, this.tempRoot, 0);
    mixInActiveFields(this.tempRoot, this.activeFields, output, offset);

    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
  }

  protected getBlocksBytes(struct: ValueOfFields<Fields>): Uint8Array {
    this.blocksBuffer.fill(0);
    for (const {fieldName, fieldType, chunkIndex} of this.fieldsEntries) {
      fieldType.hashTreeRootInto(struct[fieldName], this.blocksBuffer, chunkIndex * 32);
    }
    return this.blocksBuffer;
  }

  getPropertyGindex(prop: string): Gindex | null {
    const gindex = this.fieldsGindex[prop] ?? this.fieldsGindex[this.jsonKeyToFieldName[prop]];
    if (gindex === undefined) throw Error(`Unknown container property ${prop}`);
    return gindex;
  }

  getPropertyType(prop: string): Type<unknown> {
    const fieldName = this.fields[prop] ? prop : this.jsonKeyToFieldName[prop];
    const type = this.fields[fieldName];
    if (type === undefined) throw Error(`Unknown container property ${prop}`);
    return type;
  }

  getIndexProperty(index: number): string | null {
    const entry = this.fieldsEntries.find((entry) => entry.chunkIndex === index);
    return entry ? (entry.fieldName as string) : null;
  }

  tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[] {
    const gindices: Gindex[] = [];
    for (const {fieldName, fieldType} of this.fieldsEntries) {
      const fieldGindex = this.fieldsGindex[fieldName];
      const fieldGindexFromRoot = concatGindices([rootGindex, fieldGindex]);

      if (fieldType.isBasic) {
        gindices.push(fieldGindexFromRoot);
      } else {
        const compositeType = fieldType as unknown as CompositeTypeAny;
        if (fieldType.fixedSize === null) {
          if (!rootNode) {
            throw new Error("variable type requires tree argument to get leaves");
          }
          gindices.push(...compositeType.tree_getLeafGindices(fieldGindexFromRoot, getNode(rootNode, fieldGindex)));
        } else {
          gindices.push(...compositeType.tree_getLeafGindices(fieldGindexFromRoot));
        }
      }
    }
    return gindices;
  }

  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    return {node, done: true};
  }

  fromJson(json: unknown): ValueOfFields<Fields> {
    if (typeof json !== "object") throw Error("JSON must be of type object");
    if (json === null) throw Error("JSON must not be null");

    const value = {} as ValueOfFields<Fields>;
    for (const {fieldName, fieldType, jsonKey} of this.fieldsEntries) {
      const jsonValue = (json as Record<string, unknown>)[jsonKey];
      if (jsonValue === undefined) throw Error(`JSON expected key ${jsonKey} is undefined`);
      value[fieldName] = fieldType.fromJson(jsonValue) as ValueOf<Fields[keyof Fields]>;
    }
    return value;
  }

  toJson(value: ValueOfFields<Fields>): Record<string, unknown> {
    const json: Record<string, unknown> = {};
    for (const {fieldName, fieldType, jsonKey} of this.fieldsEntries) {
      json[jsonKey] = fieldType.toJson(value[fieldName]);
    }
    return json;
  }

  clone(value: ValueOfFields<Fields>): ValueOfFields<Fields> {
    const newValue = {} as ValueOfFields<Fields>;
    for (const {fieldName, fieldType} of this.fieldsEntries) {
      newValue[fieldName] = fieldType.clone(value[fieldName]) as ValueOf<Fields[keyof Fields]>;
    }
    return newValue;
  }

  equals(a: ValueOfFields<Fields>, b: ValueOfFields<Fields>): boolean {
    for (const {fieldName, fieldType} of this.fieldsEntries) {
      if (!fieldType.equals(a[fieldName], b[fieldName])) {
        return false;
      }
    }
    return true;
  }

  getFieldRanges(data: DataView, start: number, end: number): BytesRange[] {
    if (this.variableOffsetsPosition.length === 0) {
      const size = end - start;
      if (size !== this.fixedEnd) {
        throw Error(`${this.typeName} size ${size} not equal fixed size ${this.fixedEnd}`);
      }
      return this.fieldRangesFixedLen;
    }

    const offsets = readVariableOffsets(data, start, end, this.fixedEnd, this.variableOffsetsPosition);
    offsets.push(end - start);

    let variableIdx = 0;
    let fixedIdx = 0;
    const fieldRanges = new Array<BytesRange>(this.isFixedLen.length);
    for (let i = 0; i < this.isFixedLen.length; i++) {
      if (this.isFixedLen[i]) {
        fieldRanges[i] = this.fieldRangesFixedLen[fixedIdx++];
      } else {
        fieldRanges[i] = {start: offsets[variableIdx], end: offsets[variableIdx + 1]};
        variableIdx++;
      }
    }
    return fieldRanges;
  }
}

class ProgressiveContainerTreeView<Fields extends Record<string, Type<unknown>>> extends TreeView<
  ProgressiveContainerType<Fields>
> {
  constructor(
    readonly type: ProgressiveContainerType<Fields>,
    readonly tree: Tree
  ) {
    super();
  }

  get node(): Node {
    return this.tree.rootNode;
  }
}

class ProgressiveContainerTreeViewDU<Fields extends Record<string, Type<unknown>>> extends TreeViewDU<
  ProgressiveContainerType<Fields>
> {
  protected nodes: Node[] = [];
  protected caches: unknown[] = [];
  protected readonly nodesChanged = new Set<number>();
  protected readonly viewsChanged = new Map<number, unknown>();

  constructor(
    readonly type: ProgressiveContainerType<Fields>,
    protected _rootNode: Node,
    cache?: {nodes: Node[]; caches: unknown[]}
  ) {
    super();
    if (cache) {
      this.nodes = cache.nodes;
      this.caches = cache.caches;
    }
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): {nodes: Node[]; caches: unknown[]} {
    return {nodes: this.nodes, caches: this.caches};
  }

  commit(hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): void {
    for (const [index, view] of this.viewsChanged) {
      const {fieldType, gindex} = this.type.fieldsEntries[index];
      const compositeType = fieldType as unknown as CompositeTypeAny;
      const node = compositeType.commitViewDU(view);
      this.nodes[index] = node;
      this.caches[index] = compositeType.cacheOfViewDU(view);
      this._rootNode = setNode(this._rootNode, gindex, node);
    }

    for (const index of this.nodesChanged) {
      this._rootNode = setNode(this._rootNode, this.type.fieldsEntries[index].gindex, this.nodes[index]);
    }

    this.nodesChanged.clear();
    this.viewsChanged.clear();

    if (hcByLevel !== null && this._rootNode.h0 === null) {
      getHashComputations(this._rootNode, hcOffset, hcByLevel);
    }
  }

  protected clearCache(): void {
    this.nodes = [];
    this.caches = [];
    this.nodesChanged.clear();
    this.viewsChanged.clear();
  }
}

function getProgressiveContainerTreeViewClass<Fields extends Record<string, Type<unknown>>>(
  containerType: ProgressiveContainerType<Fields>
): {new (type: ProgressiveContainerType<Fields>, tree: Tree): ProgressiveContainerTreeViewType<Fields>} {
  class CustomProgressiveContainerTreeView extends ProgressiveContainerTreeView<Fields> {}

  for (const [index, {fieldName, fieldType, gindex}] of containerType.fieldsEntries.entries()) {
    if (isBasicType(fieldType)) {
      Object.defineProperty(CustomProgressiveContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,
        get: function (this: CustomProgressiveContainerTreeView) {
          return fieldType.tree_getFromNode(this.tree.getNode(gindex) as LeafNode);
        },
        set: function (this: CustomProgressiveContainerTreeView, value) {
          const leafNode = (this.tree.getNode(gindex) as LeafNode).clone();
          fieldType.tree_setToNode(leafNode, value);
          this.tree.setNode(gindex, leafNode);
        },
      });
    } else if (isCompositeType(fieldType)) {
      Object.defineProperty(CustomProgressiveContainerTreeView.prototype, fieldName, {
        configurable: false,
        enumerable: true,
        get: function (this: CustomProgressiveContainerTreeView) {
          return fieldType.getView(this.tree.getSubtree(gindex));
        },
        set: function (this: CustomProgressiveContainerTreeView, view: CompositeView<typeof fieldType>) {
          this.tree.setNode(gindex, fieldType.commitView(view));
        },
      });
    } else {
      throw Error(`Unknown fieldType ${fieldType.typeName} at index ${index}`);
    }
  }

  Object.defineProperty(CustomProgressiveContainerTreeView, "name", {value: containerType.typeName, writable: false});
  return CustomProgressiveContainerTreeView as unknown as {
    new (type: ProgressiveContainerType<Fields>, tree: Tree): ProgressiveContainerTreeViewType<Fields>;
  };
}

function getProgressiveContainerTreeViewDUClass<Fields extends Record<string, Type<unknown>>>(
  containerType: ProgressiveContainerType<Fields>
): {
  new (type: ProgressiveContainerType<Fields>, node: Node, cache?: unknown): ProgressiveContainerTreeViewDUType<Fields>;
} {
  class CustomProgressiveContainerTreeViewDU extends ProgressiveContainerTreeViewDU<Fields> {}

  for (const [index, {fieldName, fieldType, gindex}] of containerType.fieldsEntries.entries()) {
    if (isBasicType(fieldType)) {
      Object.defineProperty(CustomProgressiveContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,
        get: function (this: CustomProgressiveContainerTreeViewDU) {
          let node = this.nodes[index];
          if (node === undefined) {
            node = getNode(this._rootNode, gindex);
            this.nodes[index] = node;
          }
          return fieldType.tree_getFromNode(node as LeafNode);
        },
        set: function (this: CustomProgressiveContainerTreeViewDU, value) {
          let nodeChanged: LeafNode;
          if (this.nodesChanged.has(index)) {
            nodeChanged = this.nodes[index] as LeafNode;
          } else {
            nodeChanged = ((this.nodes[index] ?? getNode(this._rootNode, gindex)) as LeafNode).clone();
            this.nodes[index] = nodeChanged;
            this.nodesChanged.add(index);
          }
          fieldType.tree_setToNode(nodeChanged, value);
        },
      });
    } else if (isCompositeType(fieldType)) {
      Object.defineProperty(CustomProgressiveContainerTreeViewDU.prototype, fieldName, {
        configurable: false,
        enumerable: true,
        get: function (this: CustomProgressiveContainerTreeViewDU) {
          const viewChanged = this.viewsChanged.get(index);
          if (viewChanged) {
            return viewChanged;
          }

          let node = this.nodes[index];
          if (node === undefined) {
            node = getNode(this._rootNode, gindex);
            this.nodes[index] = node;
          }

          const view = fieldType.getViewDU(node, this.caches[index]);
          if (fieldType.isViewMutable) {
            this.viewsChanged.set(index, view);
          }
          return view;
        },
        set: function (this: CustomProgressiveContainerTreeViewDU, view: CompositeViewDU<typeof fieldType>) {
          this.viewsChanged.set(index, view);
        },
      });
    } else {
      throw Error(`Unknown fieldType ${fieldType.typeName} at index ${index}`);
    }
  }

  Object.defineProperty(CustomProgressiveContainerTreeViewDU, "name", {value: containerType.typeName, writable: false});
  return CustomProgressiveContainerTreeViewDU as unknown as {
    new (
      type: ProgressiveContainerType<Fields>,
      node: Node,
      cache?: unknown
    ): ProgressiveContainerTreeViewDUType<Fields>;
  };
}

function validateActiveFields(activeFields: BitArray, fieldCount: number): void {
  if (activeFields.bitLen === 0) {
    throw Error("ProgressiveContainer activeFields must not be empty");
  }
  if (activeFields.bitLen > 256) {
    throw Error("ProgressiveContainer activeFields bit length must be <= 256");
  }
  if (!activeFields.get(activeFields.bitLen - 1)) {
    throw Error("ProgressiveContainer activeFields must not end in false");
  }
  if (activeFields.getTrueBitIndexes().length !== fieldCount) {
    throw Error("ProgressiveContainer activeFields true bit count must equal field count");
  }
  if (fieldCount === 0) {
    throw Error("ProgressiveContainer must have > 0 fields");
  }
}

function activeFieldsToNode(activeFields: BitArray): Node {
  const root = new Uint8Array(32);
  root.set(activeFields.uint8Array);
  return LeafNode.fromRoot(root);
}

function readVariableOffsets(
  data: DataView,
  start: number,
  end: number,
  fixedEnd: number,
  variableOffsetsPosition: number[]
): number[] {
  const size = end - start;
  const offsets = new Array<number>(variableOffsetsPosition.length);
  for (let i = 0; i < variableOffsetsPosition.length; i++) {
    const offset = data.getUint32(start + variableOffsetsPosition[i], true);

    if (offset > size) {
      throw new Error(`Offset out of bounds ${offset} > ${size}`);
    }
    if (i === 0) {
      if (offset !== fixedEnd) {
        throw new Error(`First offset must equal to fixedEnd ${offset} != ${fixedEnd}`);
      }
    } else if (offset < offsets[i - 1]) {
      throw new Error(`Offsets must be increasing ${offset} < ${offsets[i - 1]}`);
    }

    offsets[i] = offset;
  }

  return offsets;
}

function precomputeSerdesData(fields: Record<string, Type<unknown>>): {
  isFixedLen: boolean[];
  fieldRangesFixedLen: BytesRange[];
  variableOffsetsPosition: number[];
  fixedEnd: number;
} {
  const isFixedLen: boolean[] = [];
  const fieldRangesFixedLen: BytesRange[] = [];
  const variableOffsetsPosition: number[] = [];
  let pointerFixed = 0;

  for (const fieldType of Object.values(fields)) {
    isFixedLen.push(fieldType.fixedSize !== null);
    if (fieldType.fixedSize === null) {
      variableOffsetsPosition.push(pointerFixed);
      pointerFixed += 4;
    } else {
      fieldRangesFixedLen.push({start: pointerFixed, end: pointerFixed + fieldType.fixedSize});
      pointerFixed += fieldType.fixedSize;
    }
  }

  return {isFixedLen, fieldRangesFixedLen, variableOffsetsPosition, fixedEnd: pointerFixed};
}

function precomputeSizes(fields: Record<string, Type<unknown>>): {
  minLen: number;
  maxLen: number;
  fixedSize: number | null;
} {
  let minLen = 0;
  let maxLen = 0;
  let fixedSize: number | null = 0;

  for (const fieldType of Object.values(fields)) {
    minLen += fieldType.minSize;
    maxLen += fieldType.maxSize;

    if (fieldType.fixedSize === null) {
      minLen += 4;
      maxLen += 4;
      fixedSize = null;
    } else if (fixedSize !== null) {
      fixedSize += fieldType.fixedSize;
    }
  }
  return {minLen, maxLen, fixedSize};
}

function precomputeJsonKey<Fields extends Record<string, unknown>>(
  fieldName: keyof Fields,
  casingMap?: CasingMap<Fields>,
  jsonCase?: KeyCase
): string {
  if (casingMap) {
    const keyFromCaseMap = casingMap[fieldName];
    if (keyFromCaseMap === undefined) {
      throw Error(`casingMap[${String(fieldName as symbol)}] not defined`);
    }
    return keyFromCaseMap as string;
  }
  if (jsonCase) return Case[jsonCase](fieldName as string);
  return fieldName as string;
}

function renderProgressiveContainerTypeName<Fields extends Record<string, Type<unknown>>>(fields: Fields): string {
  const fieldNames = Object.keys(fields) as (keyof Fields)[];
  const fieldTypeNames = fieldNames
    .map((fieldName) => `${String(fieldName as symbol)}: ${fields[fieldName].typeName}`)
    .join(", ");
  return `ProgressiveContainer({${fieldTypeNames}})`;
}
