import {
  Node,
  getNodesAtDepth,
  subtreeFillToContents,
  Tree,
  Gindex,
  toGindex,
  concatGindices,
  getNode,
  HashComputationLevel,
} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/merkleize";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {Type, ValueOf} from "./abstract";
import {CompositeType, ByteViews, CompositeTypeAny} from "./composite";
import {getContainerTreeViewClass} from "../view/container";
import {ValueOfFields, FieldEntry, ContainerTreeViewType, ContainerTreeViewTypeConstructor} from "../view/container";
import {
  getContainerTreeViewDUClass,
  ContainerTreeViewDUType,
  ContainerTreeViewDUTypeConstructor,
} from "../viewDU/container";
import {Case} from "../util/strings";
/* eslint-disable @typescript-eslint/member-ordering */

type BytesRange = {start: number; end: number};

export type ContainerOptions<Fields extends Record<string, unknown>> = {
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

/**
 * Container: ordered heterogeneous collection of values
 * - Notation: Custom name per instance
 */
export class ContainerType<Fields extends Record<string, Type<unknown>>> extends CompositeType<
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

  // Precomputed data for faster serdes
  readonly fieldsEntries: FieldEntry<Fields>[];
  /** End of fixed section of serialized Container */
  readonly fixedEnd: number;
  protected readonly fieldsGindex: Record<keyof Fields, Gindex>;
  protected readonly jsonKeyToFieldName: Record<string, keyof Fields>;
  protected readonly isFixedLen: boolean[];
  protected readonly fieldRangesFixedLen: BytesRange[];
  /** Offsets position relative to start of serialized Container. Length may not equal field count. */
  protected readonly variableOffsetsPosition: number[];

  /** Cached TreeView constuctor with custom prototype for this Type's properties */
  protected readonly TreeView: ContainerTreeViewTypeConstructor<Fields>;
  protected readonly TreeViewDU: ContainerTreeViewDUTypeConstructor<Fields>;

  constructor(readonly fields: Fields, readonly opts?: ContainerOptions<Fields>) {
    super(opts?.cachePermanentRootStruct);

    // Render detailed typeName. Consumers should overwrite since it can get long
    this.typeName = opts?.typeName ?? renderContainerTypeName(fields);

    this.maxChunkCount = Object.keys(fields).length;
    this.depth = maxChunksToDepth(this.maxChunkCount);

    // Precalculated data for faster serdes
    this.fieldsEntries = [];
    for (const fieldName of Object.keys(fields) as (keyof Fields)[]) {
      this.fieldsEntries.push({
        fieldName,
        fieldType: this.fields[fieldName],
        jsonKey: precomputeJsonKey(fieldName, opts?.casingMap, opts?.jsonCase),
        gindex: toGindex(this.depth, BigInt(this.fieldsEntries.length)),
      });
    }

    if (this.fieldsEntries.length === 0) {
      throw Error("Container must have > 0 fields");
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

    const {minLen, maxLen, fixedSize} = precomputeSizes(fields);
    this.minSize = minLen;
    this.maxSize = maxLen;
    this.fixedSize = fixedSize;

    const {isFixedLen, fieldRangesFixedLen, variableOffsetsPosition, fixedEnd} = precomputeSerdesData(fields);
    this.isFixedLen = isFixedLen;
    this.fieldRangesFixedLen = fieldRangesFixedLen;
    this.variableOffsetsPosition = variableOffsetsPosition;
    this.fixedEnd = fixedEnd;

    // TODO: This options are necessary for ContainerNodeStruct to override this.
    // Refactor this constructor to allow customization without pollutin the options
    this.TreeView = opts?.getContainerTreeViewClass?.(this) ?? getContainerTreeViewClass(this);
    this.TreeViewDU = opts?.getContainerTreeViewDUClass?.(this) ?? getContainerTreeViewDUClass(this);
    const fieldBytes = this.fieldsEntries.length * 32;
    this.blocksBuffer = new Uint8Array(Math.ceil(fieldBytes / 64) * 64);
  }

  static named<Fields extends Record<string, Type<unknown>>>(
    fields: Fields,
    opts: Require<ContainerOptions<Fields>, "typeName">
  ): ContainerType<Fields> {
    return new (namedClass(ContainerType, opts.typeName))(fields, opts);
  }

  defaultValue(): ValueOfFields<Fields> {
    const value = {} as ValueOfFields<Fields>;
    for (const {fieldName, fieldType} of this.fieldsEntries) {
      value[fieldName] = fieldType.defaultValue() as ValueOf<Fields[keyof Fields]>;
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

  commitViewDU(
    view: ContainerTreeViewDUType<Fields>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
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
    let totalSize = 0;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      // Offset (4 bytes) + size
      totalSize +=
        fieldType.fixedSize === null ? 4 + fieldType.value_serializedSize(value[fieldName]) : fieldType.fixedSize;
    }
    return totalSize;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOfFields<Fields>): number {
    let fixedIndex = offset;
    let variableIndex = offset + this.fixedEnd;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      if (fieldType.fixedSize === null) {
        // write offset
        output.dataView.setUint32(fixedIndex, variableIndex - offset, true);
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
    const fieldRanges = this.getFieldRanges(data.dataView, start, end);
    const value = {} as {[K in keyof Fields]: unknown};

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      const fieldRange = fieldRanges[i];
      value[fieldName] = fieldType.value_deserializeFromBytes(data, start + fieldRange.start, start + fieldRange.end);
    }

    return value as ValueOfFields<Fields>;
  }

  tree_serializedSize(node: Node): number {
    let totalSize = 0;
    const nodes = getNodesAtDepth(node, this.depth, 0, this.fieldsEntries.length) as Node[];
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType} = this.fieldsEntries[i];
      const node = nodes[i];
      // Offset (4 bytes) + size
      totalSize += fieldType.fixedSize === null ? 4 + fieldType.tree_serializedSize(node) : fieldType.fixedSize;
    }
    return totalSize;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    let fixedIndex = offset;
    let variableIndex = offset + this.fixedEnd;

    const nodes = getNodesAtDepth(node, this.depth, 0, this.fieldsEntries.length);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType} = this.fieldsEntries[i];
      const node = nodes[i];
      if (fieldType.fixedSize === null) {
        // write offset
        output.dataView.setUint32(fixedIndex, variableIndex - offset, true);
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
    const fieldRanges = this.getFieldRanges(data.dataView, start, end);
    const nodes = new Array<Node>(this.fieldsEntries.length);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType} = this.fieldsEntries[i];
      const fieldRange = fieldRanges[i];
      nodes[i] = fieldType.tree_deserializeFromBytes(data, start + fieldRange.start, start + fieldRange.end);
    }

    return subtreeFillToContents(nodes, this.depth);
  }

  // Merkleization

  protected getBlocksBytes(struct: ValueOfFields<Fields>): Uint8Array {
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      fieldType.hashTreeRootInto(struct[fieldName], this.blocksBuffer, i * 32);
    }
    // remaining bytes are zeroed as we never write them
    return this.blocksBuffer;
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
   */
  getFieldRanges(data: DataView, start: number, end: number): BytesRange[] {
    if (this.variableOffsetsPosition.length === 0) {
      // Validate fixed length container
      const size = end - start;
      if (size !== this.fixedEnd) {
        throw Error(`${this.typeName} size ${size} not equal fixed size ${this.fixedEnd}`);
      }

      return this.fieldRangesFixedLen;
    }

    // Read offsets in one pass
    const offsets = readVariableOffsets(data, start, end, this.fixedEnd, this.variableOffsetsPosition);
    offsets.push(end - start); // The offsets are relative to the start

    // Merge fieldRangesFixedLen + offsets in one array
    let variableIdx = 0;
    let fixedIdx = 0;
    const fieldRanges = new Array<BytesRange>(this.isFixedLen.length);

    for (let i = 0; i < this.isFixedLen.length; i++) {
      if (this.isFixedLen[i]) {
        // push from fixLen ranges ++
        fieldRanges[i] = this.fieldRangesFixedLen[fixedIdx++];
      } else {
        // push from varLen ranges ++
        fieldRanges[i] = {start: offsets[variableIdx], end: offsets[variableIdx + 1]};
        variableIdx++;
      }
    }
    return fieldRanges;
  }
}

/**
 * Returns the byte ranges of all variable size fields.
 */
function readVariableOffsets(
  data: DataView,
  start: number,
  end: number,
  fixedEnd: number,
  variableOffsetsPosition: number[]
): number[] {
  // Since variable-sized values can be interspersed with fixed-sized values, we precalculate
  // the offset indices so we can more easily deserialize the fields in once pass first we get the fixed sizes
  // Note: `fixedSizes[i] = null` if that field has variable length

  const size = end - start;

  // with the fixed sizes, we can read the offsets, and store for our single pass
  const offsets = new Array<number>(variableOffsetsPosition.length);
  for (let i = 0; i < variableOffsetsPosition.length; i++) {
    const offset = data.getUint32(start + variableOffsetsPosition[i], true);

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
 * Precompute fixed and variable offsets position for faster deserialization.
 * @returns Does a single pass over all fields and returns:
 * - isFixedLen: If field index [i] is fixed length
 * - fieldRangesFixedLen: For fields with fixed length, their range of bytes
 * - variableOffsetsPosition: Position of the 4 bytes offset for variable size fields
 * - fixedEnd: End of the fixed size range
 * -
 */
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
      // Variable length
      variableOffsetsPosition.push(pointerFixed);
      pointerFixed += 4;
    } else {
      fieldRangesFixedLen.push({start: pointerFixed, end: pointerFixed + fieldType.fixedSize});
      pointerFixed += fieldType.fixedSize;
    }
  }

  return {
    isFixedLen,
    fieldRangesFixedLen,
    variableOffsetsPosition,
    fixedEnd: pointerFixed,
  };
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
  prefix = "Container"
): string {
  const fieldNames = Object.keys(fields) as (keyof Fields)[];
  const fieldTypeNames = fieldNames.map((fieldName) => `${fieldName}: ${fields[fieldName].typeName}`).join(", ");
  return `${prefix}({${fieldTypeNames}})`;
}
