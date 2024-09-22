import {
  Node,
  BranchNode,
  LeafNode,
  getNodesAtDepth,
  subtreeFillToContents,
  Tree,
  Gindex,
  toGindex,
  concatGindices,
  getNode,
  zeroNode,
  countToDepth,
  getNodeH,
  setNode,
  setNodeWithFn,
} from "@chainsafe/persistent-merkle-tree";
import {
  ValueWithCachedPermanentRoot,
  hash64,
  maxChunksToDepth,
  merkleize,
  splitIntoRootChunks,
  symbolCachedPermanentRoot,
} from "../util/merkleize";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {JsonPath, Type, ValueOf} from "./abstract";
import {CompositeType, ByteViews, CompositeTypeAny, isCompositeType} from "./composite";
import {
  getContainerTreeViewClass,
  ValueOfFields,
  FieldEntry,
  ContainerTreeViewType,
  ContainerTreeViewTypeConstructor,
  NonOptionalType,
  NonOptionalFields,
  computeSerdesData,
} from "../view/stableContainer";
import {
  getContainerTreeViewDUClass,
  ContainerTreeViewDUType,
  ContainerTreeViewDUTypeConstructor,
} from "../viewDU/stableContainer";
import {Case} from "../util/strings";
import {OptionalType} from "./optional";
import {BitArray} from "../value/bitArray";
/* eslint-disable @typescript-eslint/member-ordering */

type BytesRange = {start: number; end: number};

export type StableContainerOptions<Fields extends Record<string, unknown>> = {
  typeName?: string;
  jsonCase?: KeyCase;
  casingMap?: CasingMap<Fields>;
  cachePermanentRootStruct?: boolean;
  getContainerTreeViewClass?: typeof getContainerTreeViewClass;
  getContainerTreeViewDUClass?: typeof getContainerTreeViewDUClass;
};

export type KeyCase =
  | "eth2"
  | "snake"
  | "constant"
  | "camel"
  | "header"
  //Same as squish
  | "pascal";

type CasingMap<Fields extends Record<string, unknown>> = Partial<{[K in keyof Fields]: string}>;

function isOptionalType(type: Type<unknown>): type is OptionalType<Type<unknown>> {
  return type instanceof OptionalType;
}

function toNonOptionalType<T extends Type<unknown>>(type: T): NonOptionalType<T> {
  return (isOptionalType(type) ? type.elementType : type) as NonOptionalType<T>;
}

/**
 * StableContainer: ordered heterogeneous collection of values
 * - Notation: Custom name per instance
 */
export class StableContainerType<Fields extends Record<string, Type<unknown>>> extends CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  ContainerTreeViewDUType<Fields>
> {
  readonly typeName: string;
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedSize: number | null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = false;
  readonly isViewMutable = true;

  readonly fields: Fields;
  // Precomputed data for faster serdes
  readonly fieldsEntries: FieldEntry<NonOptionalFields<Fields>>[];
  /** End of fixed section of serialized Container */
  // readonly fixedEnd: number;
  protected readonly fieldsGindex: Record<keyof Fields, Gindex>;
  protected readonly jsonKeyToFieldName: Record<string, keyof Fields>;
  // protected readonly isFixedLen: boolean[];
  // protected readonly fieldRangesFixedLen: BytesRange[];
  // /** Offsets position relative to start of serialized Container. Length may not equal field count. */
  // protected readonly variableOffsetsPosition: number[];

  /** Cached TreeView constuctor with custom prototype for this Type's properties */
  protected readonly TreeView: ContainerTreeViewTypeConstructor<Fields>;
  protected readonly TreeViewDU: ContainerTreeViewDUTypeConstructor<Fields>;

  constructor(fields: Fields, readonly maxFields: number, readonly opts?: StableContainerOptions<Fields>) {
    super(opts?.cachePermanentRootStruct);

    this.fields = fields;

    // Render detailed typeName. Consumers should overwrite since it can get long
    this.typeName = opts?.typeName ?? renderContainerTypeName(fields);

    this.maxChunkCount = maxFields;
    // Add 1 for the mixed-in bitvector
    this.depth = maxChunksToDepth(this.maxChunkCount) + 1;

    // Precalculated data for faster serdes
    this.fieldsEntries = [];
    for (const fieldName of Object.keys(fields) as (keyof Fields)[]) {
      const fieldType = fields[fieldName];

      this.fieldsEntries.push({
        fieldName,
        fieldType: toNonOptionalType(fieldType),
        jsonKey: precomputeJsonKey(fieldName, opts?.casingMap, opts?.jsonCase),
        gindex: toGindex(this.depth, BigInt(this.fieldsEntries.length)),
        optional: isOptionalType(fieldType),
      });
    }

    if (this.fieldsEntries.length === 0) {
      throw Error("StableContainer must have > 0 fields");
    }

    // Precalculate for Proofs API
    this.fieldsGindex = {} as Record<keyof Fields, Gindex>;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      this.fieldsGindex[this.fieldsEntries[i].fieldName] = toGindex(this.depth, BigInt(i));
    }

    // To resolve JSON paths in fieldName notation and jsonKey notation
    this.jsonKeyToFieldName = {};
    for (const {fieldName, jsonKey} of this.fieldsEntries) {
      this.jsonKeyToFieldName[jsonKey] = fieldName;
    }

    const {minLen, maxLen, fixedSize} = precomputeSizes(this.fieldsEntries);
    this.minSize = minLen;
    this.maxSize = maxLen;
    this.fixedSize = fixedSize;

    // TODO: This options are necessary for ContainerNodeStruct to override this.
    // Refactor this constructor to allow customization without pollutin the options
    this.TreeView = opts?.getContainerTreeViewClass?.(this) ?? getContainerTreeViewClass(this);
    this.TreeViewDU = opts?.getContainerTreeViewDUClass?.(this) ?? getContainerTreeViewDUClass(this);
  }

  static named<Fields extends Record<string, Type<unknown>>>(
    fields: Fields,
    maxFields: number,
    opts: Require<StableContainerOptions<Fields>, "typeName">
  ): StableContainerType<Fields> {
    return new (namedClass(StableContainerType, opts.typeName))(fields, maxFields, opts);
  }

  defaultValue(): ValueOfFields<Fields> {
    const value = {} as ValueOfFields<Fields>;
    for (const {fieldName, fieldType, optional} of this.fieldsEntries) {
      value[fieldName] = (optional ? null : fieldType.defaultValue()) as ValueOf<Fields[keyof Fields]>;
    }
    return value;
  }

  getView(tree: Tree): ContainerTreeViewType<Fields> {
    return new this.TreeView(this, tree);
  }

  getViewDU(node: Node, cache?: unknown): ContainerTreeViewDUType<Fields> {
    return new this.TreeViewDU(this, node, cache);
  }

  cacheOfViewDU(view: ContainerTreeViewDUType<Fields>): unknown {
    return view.cache;
  }

  commitView(view: ContainerTreeViewType<Fields>): Node {
    return view.node;
  }

  commitViewDU(view: ContainerTreeViewDUType<Fields>): Node {
    view.commit();
    return view.node;
  }

  // Serialization + deserialization
  // -------------------------------
  // Containers can mix fixed length and variable length data.
  //
  // Fixed part                         Variable part
  // [field1 offset][field2 data       ][field1 data               ]
  // [0x000000c]    [0xaabbaabbaabbaabb][0xffffffffffffffffffffffff]

  value_serializedSize(value: ValueOfFields<Fields>): number {
    let totalSize = Math.ceil(this.fieldsEntries.length / 8);
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      // skip optional fields with nullish values
      if (optional && value[fieldName] == null) {
        continue;
      }

      // Offset (4 bytes) + size
      totalSize +=
        fieldType.fixedSize === null ? 4 + fieldType.value_serializedSize(value[fieldName]) : fieldType.fixedSize;
    }

    return totalSize;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOfFields<Fields>): number {
    // compute active field bitvector
    const activeFields = BitArray.fromBoolArray(this.fieldsEntries.map(({fieldName}) => value[fieldName] != null));
    // write active field bitvector
    output.uint8Array.set(activeFields.uint8Array, offset);

    const {fixedEnd} = computeSerdesData(activeFields, this.fieldsEntries);

    let fixedIndex = offset + activeFields.uint8Array.length;
    let variableIndex = offset + fixedEnd;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      // skip optional fields with nullish values
      if (optional && value[fieldName] == null) {
        continue;
      }

      if (fieldType.fixedSize === null) {
        // write offset
        output.dataView.setUint32(fixedIndex, variableIndex - activeFields.uint8Array.length - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.value_serializeToBytes(output, variableIndex, value[fieldName]);
      } else {
        fixedIndex = fieldType.value_serializeToBytes(output, fixedIndex, value[fieldName]);
      }
    }
    return variableIndex;
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ValueOfFields<Fields> {
    const {activeFields, fieldRanges} = this.getFieldRanges(data, start, end);
    const value = {} as {[K in keyof Fields]: unknown};

    for (let i = 0, rangesIx = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      if (optional && !activeFields.get(i)) {
        value[fieldName] = null;
        continue;
      }

      const fieldRange = fieldRanges[rangesIx++];
      value[fieldName] = fieldType.value_deserializeFromBytes(data, start + fieldRange.start, start + fieldRange.end);
    }

    return value as ValueOfFields<Fields>;
  }

  tree_serializedSize(node: Node): number {
    let totalSize = Math.ceil(this.fieldsEntries.length / 8);
    const activeFields = this.tree_getActiveFields(node);
    const nodes = getNodesAtDepth(node, this.depth, 0, this.fieldsEntries.length) as Node[];
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType, optional} = this.fieldsEntries[i];
      const node = nodes[i];
      if (optional && !activeFields.get(i)) {
        continue;
      }

      // Offset (4 bytes) + size
      totalSize += fieldType.fixedSize === null ? 4 + fieldType.tree_serializedSize(node) : fieldType.fixedSize;
    }
    return totalSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    // compute active field bitvector
    const activeFields = this.tree_getActiveFields(node);
    // write active field bitvector
    output.uint8Array.set(activeFields.uint8Array, offset);

    const {fixedEnd} = computeSerdesData(activeFields, this.fieldsEntries);

    let fixedIndex = offset + activeFields.uint8Array.length;
    let variableIndex = offset + fixedEnd;

    const nodes = getNodesAtDepth(node, this.depth, 0, this.fieldsEntries.length);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType, optional} = this.fieldsEntries[i];
      if (optional && !activeFields.get(i)) {
        continue;
      }

      const node = nodes[i];
      if (fieldType.fixedSize === null) {
        // write offset
        output.dataView.setUint32(fixedIndex, variableIndex - activeFields.uint8Array.length - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.tree_serializeToBytes(output, variableIndex, node);
      } else {
        fixedIndex = fieldType.tree_serializeToBytes(output, fixedIndex, node);
      }
    }
    return variableIndex;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const {activeFields, fieldRanges} = this.getFieldRanges(data, start, end);
    const nodes = new Array<Node>(this.fieldsEntries.length);

    for (let i = 0, rangesIx = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType, optional} = this.fieldsEntries[i];
      if (optional && !activeFields.get(i)) {
        nodes[i] = zeroNode(0);
        continue;
      }

      const fieldRange = fieldRanges[rangesIx++];
      nodes[i] = fieldType.tree_deserializeFromBytes(data, start + fieldRange.start, start + fieldRange.end);
    }

    const rootNode = new BranchNode(subtreeFillToContents(nodes, this.depth - 1), zeroNode(0));
    return this.tree_setActiveFields(rootNode, activeFields);
  }

  // Merkleization
  hashTreeRoot(value: ValueOfFields<Fields>): Uint8Array {
    // Return cached mutable root if any
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        return cachedRoot;
      }
    }

    // compute active field bitvector
    const activeFields = BitArray.fromBoolArray(this.fieldsEntries.map(({fieldName}) => value[fieldName] != null));
    const root = mixInActiveFields(super.hashTreeRoot(value), activeFields);

    if (this.cachePermanentRootStruct) {
      (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot] = root;
    }

    return root;
  }

  protected getRoots(struct: ValueOfFields<Fields>): Uint8Array[] {
    const roots = new Array<Uint8Array>(this.fieldsEntries.length);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      if (optional && struct[fieldName] == null) {
        roots[i] = new Uint8Array(32);
        continue;
      }

      roots[i] = fieldType.hashTreeRoot(struct[fieldName]);
    }

    return roots;
  }

  // Proofs

  // getPropertyGindex
  // getPropertyType
  // tree_getLeafGindices

  getPropertyGindex(prop: string): Gindex | null {
    const gindex = this.fieldsGindex[prop] ?? this.fieldsGindex[this.jsonKeyToFieldName[prop]];
    if (gindex === undefined) throw Error(`Unknown container property ${prop}`);
    return gindex;
  }

  getPropertyType(prop: string): Type<unknown> {
    const fieldName = this.fields[prop] ? prop : this.jsonKeyToFieldName[prop];
    const entry = this.fieldsEntries.find((entry) => entry.fieldName === fieldName);
    if (entry === undefined) throw Error(`Unknown container property ${prop}`);
    return entry.fieldType;
  }

  getIndexProperty(index: number): string | null {
    if (index >= this.fieldsEntries.length) {
      return null;
    }
    return this.fieldsEntries[index].fieldName as string;
  }

  tree_createProofGindexes(node: Node, jsonPaths: JsonPath[]): Gindex[] {
    const gindexes: Gindex[] = [];
    const activeFields = this.tree_getActiveFields(node);

    for (const jsonPath of jsonPaths) {
      const prop = jsonPath[0];
      if (prop == null) {
        continue;
      }
      const fieldIndex = this.fieldsEntries.findIndex((entry) => entry.fieldName === prop);
      if (fieldIndex === -1) throw Error(`Unknown container property ${prop}`);
      const entry = this.fieldsEntries[fieldIndex];
      if (entry.optional && !activeFields.get(fieldIndex)) {
        // field is inactive and doesn't count as a leaf
        continue;
      }

      // same to Composite
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

  tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[] {
    const gindices: Gindex[] = [];
    if (!rootNode) {
      throw new Error("StableContainer.tree_getLeafGindices requires tree argument to get leaves");
    }
    const activeFields = this.tree_getActiveFields(rootNode);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      if (optional && !activeFields.get(i)) {
        // field is inactive and doesn't count as a leaf
        continue;
      }

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

  // JSON

  fromJson(json: unknown): ValueOfFields<Fields> {
    if (typeof json !== "object") {
      throw Error("JSON must be of type object");
    }
    if (json === null) {
      throw Error("JSON must not be null");
    }

    const value = {} as ValueOfFields<Fields>;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, jsonKey, optional} = this.fieldsEntries[i];
      const jsonValue = (json as Record<string, unknown>)[jsonKey];
      if (optional && jsonValue == null) {
        value[fieldName] = null as ValueOf<Fields[keyof Fields]>;
        continue;
      }

      if (jsonValue === undefined) {
        throw Error(`JSON expected key ${jsonKey} is undefined`);
      }
      value[fieldName] = fieldType.fromJson(jsonValue) as ValueOf<Fields[keyof Fields]>;
    }

    return value;
  }

  toJson(value: ValueOfFields<Fields>): Record<string, unknown> {
    const json: Record<string, unknown> = {};

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, jsonKey, optional} = this.fieldsEntries[i];
      if (optional && value[fieldName] == null) {
        json[jsonKey] = null;
        continue;
      }

      json[jsonKey] = fieldType.toJson(value[fieldName]);
    }

    return json;
  }

  clone(value: ValueOfFields<Fields>): ValueOfFields<Fields> {
    const newValue = {} as ValueOfFields<Fields>;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      if (optional && value[fieldName] == null) {
        newValue[fieldName] = null as ValueOf<Fields[keyof Fields]>;
        continue;
      }

      newValue[fieldName] = fieldType.clone(value[fieldName]) as ValueOf<Fields[keyof Fields]>;
    }

    return newValue;
  }

  equals(a: ValueOfFields<Fields>, b: ValueOfFields<Fields>): boolean {
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      if (optional) {
        if (a[fieldName] == null && b[fieldName] == null) {
          continue;
        }
        if (a[fieldName] == null || b[fieldName] == null) {
          return false;
        }
      }
      if (!fieldType.equals(a[fieldName], b[fieldName])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Deserializer helper: Returns the bytes ranges of all active fields, both variable and fixed size.
   * Also returns the active field bitvector.
   *
   * Fields may not be contiguous in the serialized bytes, so the returned ranges are [start, end].
   * - For fixed size fields re-uses the pre-computed values this.fieldRangesFixedLen
   * - For variable size fields does a first pass over the fixed section to read offsets
   */
  getFieldRanges(data: ByteViews, start: number, end: number): {activeFields: BitArray; fieldRanges: BytesRange[]} {
    const activeFieldsByteLen = Math.ceil(this.fieldsEntries.length / 8);
    // active fields bitvector, do not mutate
    const activeFields = new BitArray(
      data.uint8Array.subarray(start, start + activeFieldsByteLen),
      this.fieldsEntries.length
    );

    const {variableOffsetsPosition, fixedEnd, fieldRangesFixedLen, isFixedLen} = computeSerdesData(
      activeFields,
      this.fieldsEntries
    );

    if (variableOffsetsPosition.length === 0) {
      // Validate fixed length container
      const size = end - start;
      if (size !== fixedEnd) {
        throw Error(`${this.typeName} size ${size} not equal fixed size ${fixedEnd}`);
      }

      return {activeFields, fieldRanges: fieldRangesFixedLen};
    }

    // Read offsets in one pass
    const offsets = readVariableOffsets(
      data.dataView,
      start,
      end,
      activeFieldsByteLen,
      fixedEnd,
      variableOffsetsPosition
    );
    offsets.push(end - start); // The offsets are relative to the start

    // Merge fieldRangesFixedLen + offsets in one array
    let variableIdx = 0;
    let fixedIdx = 0;
    const fieldRanges = new Array<BytesRange>(isFixedLen.length);

    for (let i = 0; i < isFixedLen.length; i++) {
      if (isFixedLen[i]) {
        // push from fixLen ranges ++
        fieldRanges[i] = fieldRangesFixedLen[fixedIdx++];
      } else {
        // push from varLen ranges ++
        fieldRanges[i] = {start: offsets[variableIdx], end: offsets[variableIdx + 1]};
        variableIdx++;
      }
    }
    return {activeFields, fieldRanges};
  }

  // helpers for the active fields
  tree_getActiveFields(rootNode: Node): BitArray {
    return getActiveFields(rootNode, this.fieldsEntries.length);
  }

  tree_setActiveFields(rootNode: Node, activeFields: BitArray): Node {
    return setActiveFields(rootNode, activeFields);
  }

  tree_getActiveField(rootNode: Node, fieldIndex: number): boolean {
    return getActiveField(rootNode, this.fieldsEntries.length, fieldIndex);
  }

  tree_setActiveField(rootNode: Node, fieldIndex: number, value: boolean): Node {
    return setActiveField(rootNode, this.fieldsEntries.length, fieldIndex, value);
  }
}

/**
 * Returns the byte ranges of all variable size fields.
 */
function readVariableOffsets(
  data: DataView,
  start: number,
  end: number,
  activeFieldsEnd: number,
  fixedEnd: number,
  variableOffsetsPosition: number[]
): number[] {
  // Since variable-sized values can be interspersed with fixed-sized values, we precalculate
  // the offset indices so we can more easily deserialize the fields in once pass first we get the fixed sizes
  // Note: `fixedSizes[i] = null` if that field has variable length

  const size = end - start;
  const activeFieldsByteLen = activeFieldsEnd - start;

  // with the fixed sizes, we can read the offsets, and store for our single pass
  const offsets = new Array<number>(variableOffsetsPosition.length);
  for (let i = 0; i < variableOffsetsPosition.length; i++) {
    const offset = data.getUint32(start + variableOffsetsPosition[i], true) + activeFieldsByteLen;

    // Validate offsets. If the list is empty the offset points to the end of the buffer, offset == size
    if (offset > size) {
      throw new Error(`Offset out of bounds ${offset} > ${size}`);
    }
    if (i === 0) {
      if (offset !== fixedEnd) {
        throw new Error(`First offset must equal to fixedEnd ${offset} != ${fixedEnd}`);
      }
    } else {
      if (offset < offsets[i - 1]) {
        throw new Error(`Offsets must be increasing ${offset} < ${offsets[i - 1]}`);
      }
    }

    offsets[i] = offset;
  }

  return offsets;
}

/**
 * Precompute sizes of the Container doing one pass over fields
 */
function precomputeSizes<Fields extends Record<string, Type<unknown>>>(
  fields: FieldEntry<Fields>[]
): {
  minLen: number;
  maxLen: number;
  fixedSize: number | null;
} {
  // at a minimum, the active fields bitvector is prepended
  const activeFieldsLen = Math.ceil(fields.length / 8);

  let minLen = activeFieldsLen;
  let maxLen = activeFieldsLen;
  const fixedSize = null;

  for (const {fieldType, optional} of fields) {
    minLen += optional ? 0 : fieldType.minSize;
    maxLen += fieldType.maxSize;

    if (fieldType.fixedSize === null) {
      // +4 for the offset
      minLen += optional ? 0 : 4;
      maxLen += 4;
    }
  }
  return {minLen, maxLen, fixedSize};
}

/**
 * Compute the JSON key for each fieldName. There will exist a single JSON representation for each type.
 * To transform JSON payloads to a casing that is different from the type's defined use external tooling.
 */
export function precomputeJsonKey<Fields extends Record<string, Type<unknown>>>(
  fieldName: keyof Fields,
  casingMap?: CasingMap<Fields>,
  jsonCase?: KeyCase
): string {
  if (casingMap) {
    const keyFromCaseMap = casingMap[fieldName];
    if (keyFromCaseMap === undefined) {
      throw Error(`casingMap[${fieldName}] not defined`);
    }
    return keyFromCaseMap as string;
  } else if (jsonCase) {
    return Case[jsonCase](fieldName as string);
  } else {
    return fieldName as string;
  }
}

/**
 * Render field typeNames for a detailed typeName of this Container
 */
export function renderContainerTypeName<Fields extends Record<string, Type<unknown>>>(
  fields: Fields,
  prefix = "StableContainer"
): string {
  const fieldNames = Object.keys(fields) as (keyof Fields)[];
  const fieldTypeNames = fieldNames.map((fieldName) => `${fieldName}: ${fields[fieldName].typeName}`).join(", ");
  return `${prefix}({${fieldTypeNames}})`;
}

/**
 * Get the active field bitvector, given the root of the tree and # of fields
 */
export function getActiveFields(rootNode: Node, bitLen: number): BitArray {
  // fast path for depth 1, the bitvector fits in one chunk
  if (bitLen <= 256) {
    return new BitArray(rootNode.right.root.subarray(0, Math.ceil(bitLen / 8)), bitLen);
  }

  const activeFieldsBuf = new Uint8Array(Math.ceil(bitLen / 8));
  const depth = countToDepth(BigInt(activeFieldsBuf.length));
  const nodes = getNodesAtDepth(rootNode.right, depth, 0, Math.ceil(bitLen / 256));
  for (let i = 0; i < nodes.length; i++) {
    activeFieldsBuf.set(nodes[i].root, i * 32);
  }

  return new BitArray(activeFieldsBuf, bitLen);
}

export function setActiveFields(rootNode: Node, activeFields: BitArray): Node {
  // fast path for depth 1, the bitvector fits in one chunk
  if (activeFields.bitLen <= 256) {
    const activeFieldsBuf = new Uint8Array(32);
    activeFieldsBuf.set(activeFields.uint8Array);
    return new BranchNode(rootNode.left, LeafNode.fromRoot(activeFieldsBuf));
  }

  const activeFieldsChunkCount = Math.ceil(activeFields.bitLen / 256);
  const nodes: Node[] = [];
  for (let i = 0; i < activeFieldsChunkCount; i++) {
    const activeFieldsBuf = new Uint8Array(32);
    activeFieldsBuf.set(activeFields.uint8Array.subarray(i * 32, (i + 1) * 32));
    nodes.push(LeafNode.fromRoot(activeFieldsBuf));
  }

  return new BranchNode(rootNode.left, subtreeFillToContents(nodes, Math.ceil(Math.log2(activeFieldsChunkCount))));
}

export function getActiveField(rootNode: Node, bitLen: number, fieldIndex: number): boolean {
  const hIndex = Math.floor(fieldIndex / 32);
  const hBitIndex = fieldIndex % 32;

  // fast path for depth 1, the bitvector fits in one chunk
  if (bitLen <= 256) {
    const h = getNodeH(rootNode.right, hIndex);
    return Boolean(h & (1 << hBitIndex));
  }

  const chunkCount = Math.ceil(bitLen / 256);
  const chunkIx = bitLen % 256;
  const depth = Math.ceil(Math.log2(chunkCount));

  const chunk = getNode(rootNode, toGindex(depth, BigInt(chunkIx)));
  const h = getNodeH(chunk, hIndex);
  return Boolean(h & (1 << hBitIndex));
}

export function setActiveField(rootNode: Node, bitLen: number, fieldIndex: number, value: boolean): Node {
  const bitIx = Math.min(fieldIndex / 8);
  const byteIx = fieldIndex % 8;

  // fast path for depth 1, the bitvector fits in one chunk
  if (bitLen <= 256) {
    const activeFieldsBuf = rootNode.right.root;
    activeFieldsBuf[byteIx] |= (value ? 1 : 0) << bitIx;

    return setNode(rootNode, "11", LeafNode.fromRoot(activeFieldsBuf));
  }

  const chunkCount = Math.ceil(bitLen / 256);
  const chunkIx = bitLen % 256;
  const depth = Math.ceil(Math.log2(chunkCount));
  return setNodeWithFn(rootNode, BigInt(2 * depth + chunkIx), (node) => {
    const chunkBuf = node.root;
    chunkBuf[byteIx] |= (value ? 1 : 0) << bitIx;
    return LeafNode.fromRoot(chunkBuf);
  });
}

export function mixInActiveFields(root: Uint8Array, activeFields: BitArray): Uint8Array {
  // fast path for depth 1, the bitvector fits in one chunk
  if (activeFields.bitLen <= 256) {
    const activeFieldsChunk = new Uint8Array(32);
    activeFieldsChunk.set(activeFields.uint8Array);
    return hash64(root, activeFieldsChunk);
  }

  const activeFieldsChunks = splitIntoRootChunks(activeFields.uint8Array);
  const activeFieldsRoot = merkleize(activeFieldsChunks, activeFieldsChunks.length);
  return hash64(root, activeFieldsRoot);
}
