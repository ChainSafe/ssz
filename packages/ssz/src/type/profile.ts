import {
  BranchNode,
  Gindex,
  Node,
  Tree,
  concatGindices,
  getNode,
  getNodesAtDepth,
  merkleizeBlocksBytes,
  subtreeFillToContents,
  toGindex,
  zeroHash,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";
import {
  ValueWithCachedPermanentRoot,
  cacheRoot,
  maxChunksToDepth,
  symbolCachedPermanentRoot,
} from "../util/merkleize.ts";
import {namedClass} from "../util/named.ts";
import {Case} from "../util/strings.ts";
import {Require} from "../util/types.ts";
import {BitArray} from "../value/bitArray.ts";
import {
  ContainerTreeViewType,
  ContainerTreeViewTypeConstructor,
  FieldEntry,
  ValueOfFields,
  computeSerdesData,
  getProfileTreeViewClass,
} from "../view/profile.ts";
import {
  ContainerTreeViewDUType,
  ContainerTreeViewDUTypeConstructor,
  getProfileTreeViewDUClass,
} from "../viewDU/profile.ts";
import {Type, ValueOf} from "./abstract.ts";
import {ByteViews, CompositeType, CompositeTypeAny} from "./composite.ts";
import {NonOptionalFields, isOptionalType, toNonOptionalType} from "./optional.ts";
import {mixInActiveFields, setActiveFields} from "./stableContainer.ts";

type BytesRange = {start: number; end: number};

export type ProfileOptions<Fields extends Record<string, unknown>> = {
  typeName?: string;
  jsonCase?: KeyCase;
  casingMap?: CasingMap<Fields>;
  cachePermanentRootStruct?: boolean;
  getProfileTreeViewClass?: typeof getProfileTreeViewClass;
  getProfileTreeViewDUClass?: typeof getProfileTreeViewDUClass;
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

/**
 * Profile: ordered heterogeneous collection of values that inherits merkleization from a base stable container
 * - EIP: https://eips.ethereum.org/EIPS/eip-7495
 * - No reordering of fields for merkleization
 */
export class ProfileType<Fields extends Record<string, Type<unknown>>> extends CompositeType<
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
  readonly activeFields: BitArray;

  // Precomputed data for faster serdes
  readonly fieldsEntries: FieldEntry<NonOptionalFields<Fields>>[];
  /** End of fixed section of serialized Container */
  protected readonly fieldsGindex: Record<keyof Fields, Gindex>;
  protected readonly jsonKeyToFieldName: Record<string, keyof Fields>;

  /** Cached TreeView constuctor with custom prototype for this Type's properties */
  protected readonly TreeView: ContainerTreeViewTypeConstructor<Fields>;
  protected readonly TreeViewDU: ContainerTreeViewDUTypeConstructor<Fields>;
  private optionalFieldsCount: number;
  // temporary root to avoid memory allocation
  private tempRoot = new Uint8Array(32);

  constructor(
    readonly fields: Fields,
    activeFields: BitArray,
    readonly opts?: ProfileOptions<Fields>
  ) {
    super();

    // Render detailed typeName. Consumers should overwrite since it can get long
    this.typeName = opts?.typeName ?? renderContainerTypeName(fields);

    if (activeFields.getTrueBitIndexes().length !== Object.keys(fields).length) {
      throw new Error("activeFields must have the same number of true bits as fields");
    }

    this.activeFields = activeFields;
    this.maxChunkCount = this.activeFields.bitLen;
    this.depth = maxChunksToDepth(this.maxChunkCount) + 1;

    // Precalculated data for faster serdes
    this.fieldsEntries = [];
    const fieldNames = Object.keys(fields) as (keyof Fields)[];
    this.optionalFieldsCount = 0;
    for (let i = 0, fieldIx = 0; i < this.activeFields.bitLen; i++) {
      if (!this.activeFields.get(i)) {
        continue;
      }

      const fieldName = fieldNames[fieldIx++];
      const fieldType = fields[fieldName];
      const optional = isOptionalType(fieldType);
      this.fieldsEntries.push({
        fieldName,
        fieldType: toNonOptionalType(fieldType),
        jsonKey: precomputeJsonKey(fieldName, opts?.casingMap, opts?.jsonCase),
        gindex: toGindex(this.depth, BigInt(i)),
        chunkIndex: i,
        optional,
      });

      if (optional) {
        this.optionalFieldsCount++;
      }
    }

    if (this.fieldsEntries.length === 0) {
      throw Error("Container must have > 0 fields");
    }

    // Precalculate for Proofs API
    this.fieldsGindex = {} as Record<keyof Fields, Gindex>;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, chunkIndex} = this.fieldsEntries[i];
      this.fieldsGindex[fieldName] = toGindex(this.depth, BigInt(chunkIndex));
    }

    // To resolve JSON paths in fieldName notation and jsonKey notation
    this.jsonKeyToFieldName = {};
    for (const {fieldName, jsonKey} of this.fieldsEntries) {
      this.jsonKeyToFieldName[jsonKey] = fieldName;
    }

    const {minLen, maxLen, fixedSize} = precomputeSizes(fields);
    this.minSize = minLen;
    this.maxSize = maxLen;
    this.fixedSize = fixedSize;

    // TODO: This options are necessary for ContainerNodeStruct to override this.
    // Refactor this constructor to allow customization without pollutin the options
    this.TreeView = opts?.getProfileTreeViewClass?.(this) ?? getProfileTreeViewClass(this);
    this.TreeViewDU = opts?.getProfileTreeViewDUClass?.(this) ?? getProfileTreeViewDUClass(this);
    const fieldBytes = this.activeFields.bitLen * 32;
    this.blocksBuffer = new Uint8Array(Math.ceil(fieldBytes / 64) * 64);
  }

  static named<Fields extends Record<string, Type<unknown>>>(
    fields: Fields,
    activeFields: BitArray,
    opts: Require<ProfileOptions<Fields>, "typeName">
  ): ProfileType<Fields> {
    return new (namedClass(ProfileType, opts.typeName))(fields, activeFields, opts);
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
    let totalSize = Math.ceil(this.optionalFieldsCount / 8);
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
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
    const optionalFields = BitArray.fromBitLen(this.optionalFieldsCount);
    let optionalIndex = 0;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, optional} = this.fieldsEntries[i];
      if (optional) {
        optionalFields.set(optionalIndex++, value[fieldName] !== null);
      }
    }

    output.uint8Array.set(optionalFields.uint8Array, offset);

    const {fixedEnd} = computeSerdesData(optionalFields, this.fieldsEntries);

    const optionalFieldsLen = optionalFields.uint8Array.length;
    let fixedIndex = offset + optionalFieldsLen;
    let variableIndex = offset + fixedEnd + optionalFieldsLen;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      // skip optional fields with nullish values
      if (optional && value[fieldName] == null) {
        continue;
      }

      if (fieldType.fixedSize === null) {
        // write offset relative to the start of serialized active fields, after the Bitvector[N]
        output.dataView.setUint32(fixedIndex, variableIndex - offset - optionalFieldsLen, true);
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
    const {optionalFields, fieldRanges} = this.getFieldRanges(data, start, end);
    const value = {} as {[K in keyof Fields]: unknown};
    const optionalFieldsLen = optionalFields.uint8Array.length;
    start += optionalFieldsLen;

    let optionalIndex = 0;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, optional} = this.fieldsEntries[i];
      if (optional && !optionalFields.get(optionalIndex++)) {
        value[fieldName] = null;
        continue;
      }
      const fieldRange = fieldRanges[i];
      value[fieldName] = fieldType.value_deserializeFromBytes(data, start + fieldRange.start, start + fieldRange.end);
    }

    return value as ValueOfFields<Fields>;
  }

  tree_serializedSize(node: Node): number {
    let totalSize = Math.ceil(this.optionalFieldsCount / 8);
    const nodes = getNodesAtDepth(node, this.depth, 0, this.activeFields.bitLen) as Node[];
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType, chunkIndex, optional} = this.fieldsEntries[i];
      const node = nodes[chunkIndex];
      // zeroNode() means optional field is null, it's different from a node with all zeros
      if (optional && node === zeroNode(0)) {
        continue;
      }
      // Offset (4 bytes) + size
      totalSize += fieldType.fixedSize === null ? 4 + fieldType.tree_serializedSize(node) : fieldType.fixedSize;
    }
    return totalSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const optionalFields = BitArray.fromBitLen(this.optionalFieldsCount);
    const optionalFieldsLen = optionalFields.uint8Array.length;

    const nodes = getNodesAtDepth(node, this.depth, 0, this.activeFields.bitLen);
    let optionalIndex = -1;
    if (this.optionalFieldsCount > 0) {
      // 1st loop to compute optional fields
      for (let i = 0; i < this.fieldsEntries.length; i++) {
        const {chunkIndex, optional} = this.fieldsEntries[i];
        const node = nodes[chunkIndex];
        if (optional) {
          optionalIndex++;
          if (node !== zeroNode(0)) {
            optionalFields.set(optionalIndex, true);
          }
        }
      }
    }

    output.uint8Array.set(optionalFields.uint8Array, offset);

    const {fixedEnd} = computeSerdesData(optionalFields, this.fieldsEntries);
    let fixedIndex = offset + optionalFieldsLen;
    let variableIndex = offset + fixedEnd + optionalFieldsLen;

    // 2nd loop to serialize fields
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType, chunkIndex, optional} = this.fieldsEntries[i];
      const node = nodes[chunkIndex];
      if (optional && node === zeroNode(0)) {
        continue;
      }

      if (fieldType.fixedSize === null) {
        // write offset relative to the start of serialized active fields, after the Bitvector[N]
        output.dataView.setUint32(fixedIndex, variableIndex - offset - optionalFieldsLen, true);
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
    const {optionalFields, fieldRanges} = this.getFieldRanges(data, start, end);
    const nodes = new Array<Node>(this.activeFields.bitLen).fill(zeroNode(0));
    const optionalFieldsLen = optionalFields.uint8Array.length;
    start += optionalFieldsLen;

    let optionalIndex = -1;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType, chunkIndex, optional} = this.fieldsEntries[i];
      if (optional) {
        optionalIndex++;
        if (!optionalFields.get(optionalIndex)) {
          continue;
        }
      }

      const fieldRange = fieldRanges[i];
      nodes[chunkIndex] = fieldType.tree_deserializeFromBytes(data, start + fieldRange.start, start + fieldRange.end);
    }

    const root = new BranchNode(subtreeFillToContents(nodes, this.depth - 1), zeroNode(0));
    return setActiveFields(root, this.activeFields);
  }

  // Merkleization
  // hashTreeRoot is the same to parent as it call hashTreeRootInto()
  hashTreeRootInto(value: ValueOfFields<Fields>, output: Uint8Array, offset: number, safeCache = false): void {
    // Return cached mutable root if any
    if (this.cachePermanentRootStruct) {
      const cachedRoot = (value as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot];
      if (cachedRoot) {
        output.set(cachedRoot, offset);
        return;
      }
    }

    const blocksBytes = this.getBlocksBytes(value);
    merkleizeBlocksBytes(blocksBytes, this.maxChunkCount, this.tempRoot, 0);
    mixInActiveFields(this.tempRoot, this.activeFields, output, offset);

    if (this.cachePermanentRootStruct) {
      cacheRoot(value as ValueWithCachedPermanentRoot, output, offset, safeCache);
    }
  }

  protected getBlocksBytes(struct: ValueOfFields<Fields>): Uint8Array {
    this.blocksBuffer.fill(0);
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType, chunkIndex, optional} = this.fieldsEntries[i];
      if (optional && struct[fieldName] == null) {
        this.blocksBuffer.set(zeroHash(0), chunkIndex * 32);
      } else {
        fieldType.hashTreeRootInto(struct[fieldName], this.blocksBuffer, chunkIndex * 32);
      }
    }
    // remaining bytes are zeroed as we never write them
    return this.blocksBuffer;
  }

  // Proofs

  /** INTERNAL METHOD: For view's API, create proof from a tree */

  getPropertyGindex(prop: string): Gindex | null {
    const gindex = this.fieldsGindex[prop] ?? this.fieldsGindex[this.jsonKeyToFieldName[prop]];
    if (gindex === undefined) throw Error(`Unknown container property ${prop}`);
    return gindex;
  }

  getPropertyType(prop: string): Type<unknown> {
    const type = this.fields[prop] ?? this.fields[this.jsonKeyToFieldName[prop]];
    if (type === undefined) throw Error(`Unknown container property ${prop}`);
    return type;
  }

  getIndexProperty(index: number): string | null {
    if (index >= this.fieldsEntries.length) {
      return null;
    }
    return this.fieldsEntries[index].fieldName as string;
  }

  tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[] {
    const gindices: Gindex[] = [];
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
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
      const {fieldName, fieldType, jsonKey} = this.fieldsEntries[i];
      const jsonValue = (json as Record<string, unknown>)[jsonKey];
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
      const {fieldName, fieldType, jsonKey} = this.fieldsEntries[i];
      json[jsonKey] = fieldType.toJson(value[fieldName]);
    }

    return json;
  }

  clone(value: ValueOfFields<Fields>): ValueOfFields<Fields> {
    const newValue = {} as ValueOfFields<Fields>;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      newValue[fieldName] = fieldType.clone(value[fieldName]) as ValueOf<Fields[keyof Fields]>;
    }

    return newValue;
  }

  equals(a: ValueOfFields<Fields>, b: ValueOfFields<Fields>): boolean {
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      if (!fieldType.equals(a[fieldName], b[fieldName])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Deserializer helper: Returns the bytes ranges of all fields, both variable and fixed size.
   * Fields may not be contiguous in the serialized bytes, so the returned ranges are [start, end].
   * - For fixed size fields re-uses the pre-computed values this.fieldRangesFixedLen
   * - For variable size fields does a first pass over the fixed section to read offsets
   * - offsets are relative to the start of serialized active fields, after the Bitvector[N]
   */
  getFieldRanges(data: ByteViews, start: number, end: number): {optionalFields: BitArray; fieldRanges: BytesRange[]} {
    const optionalFieldsByteLen = Math.ceil(this.optionalFieldsCount / 8);
    const optionalFields = new BitArray(
      data.uint8Array.subarray(start, start + optionalFieldsByteLen),
      this.optionalFieldsCount
    );

    const {variableOffsetsPosition, fixedEnd, fieldRangesFixedLen, isFixedLen} = computeSerdesData(
      optionalFields,
      this.fieldsEntries
    );

    if (variableOffsetsPosition.length === 0) {
      // Validate fixed length container
      const size = end - start;
      if (size !== fixedEnd + optionalFieldsByteLen) {
        throw Error(
          `${this.typeName} size ${size} not equal fixed end plus optionalFieldsByteLen ${
            fixedEnd + optionalFieldsByteLen
          }`
        );
      }

      return {optionalFields, fieldRanges: fieldRangesFixedLen};
    }

    // Read offsets in one pass
    const offsets = readVariableOffsets(
      data.dataView,
      start,
      end,
      optionalFieldsByteLen,
      fixedEnd,
      variableOffsetsPosition
    );
    offsets.push(end - start - optionalFieldsByteLen); // The offsets are relative to the start of serialized optional fields

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

    return {optionalFields, fieldRanges};
  }
}

/**
 * Returns the byte ranges of all variable size fields.
 * Offsets are relative to the start of serialized active fields, after the Bitvector[N]
 */
function readVariableOffsets(
  data: DataView,
  start: number,
  end: number,
  optionalFieldsEnd: number,
  fixedEnd: number,
  variableOffsetsPosition: number[]
): number[] {
  // Since variable-sized values can be interspersed with fixed-sized values, we precalculate
  // the offset indices so we can more easily deserialize the fields in once pass first we get the fixed sizes
  // Note: `fixedSizes[i] = null` if that field has variable length

  const size = end - start;
  const optionalFieldsByteLen = optionalFieldsEnd - start;

  // with the fixed sizes, we can read the offsets, and store for our single pass
  const offsets = new Array<number>(variableOffsetsPosition.length);
  for (let i = 0; i < variableOffsetsPosition.length; i++) {
    const offset = data.getUint32(start + variableOffsetsPosition[i] + optionalFieldsByteLen, true);

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
      // +4 for the offset
      minLen += 4;
      maxLen += 4;
      fixedSize = null;
    } else if (fixedSize !== null) {
      fixedSize += fieldType.fixedSize;
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
      throw Error(`casingMap[${String(fieldName as symbol)}] not defined`);
    }
    return keyFromCaseMap as string;
  }

  if (jsonCase) return Case[jsonCase](fieldName as string);

  return fieldName as string;
}

/**
 * Render field typeNames for a detailed typeName of this Container
 */
export function renderContainerTypeName<Fields extends Record<string, Type<unknown>>>(
  fields: Fields,
  prefix = "Profile"
): string {
  const fieldNames = Object.keys(fields) as (keyof Fields)[];
  const fieldTypeNames = fieldNames
    .map((fieldName) => `${String(fieldName as symbol)}: ${fields[fieldName].typeName}`)
    .join(", ");
  return `${prefix}({${fieldTypeNames}})`;
}
