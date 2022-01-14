import {Node, getNodesAtDepth, subtreeFillToContents, Tree} from "@chainsafe/persistent-merkle-tree";
import Case from "case";
import {maxChunksToDepth} from "../util/merkleize";
import {SszErrorPath} from "../util/errorPath";
import {Type, ValueOf} from "./abstract";
import {CompositeType} from "./composite";
import {getContainerTreeViewClass} from "../view/container";
import {ValueOfFields, FieldEntry, ContainerTreeViewType, ContainerTreeViewTypeConstructor} from "../view/container";
import {
  getContainerTreeViewDUClass,
  ContainerTreeViewDUType,
  ContainerTreeViewDUTypeConstructor,
} from "../viewDU/container";

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

type KeyCase =
  | "snake"
  | "constant"
  | "camel"
  | "header"
  //Same as squish
  | "pascal";

type CasingMap<Fields extends Record<string, unknown>> = Partial<{[K in keyof Fields]: string}>;

export class ContainerType<Fields extends Record<string, Type<unknown>>> extends CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  ContainerTreeViewDUType<Fields>
> {
  readonly typeName: string;
  // Immutable characteristics
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedSize: number | null;
  readonly minSize: number;
  readonly maxSize: number;

  // Precomputed data for faster serdes
  readonly fieldsEntries: FieldEntry<Fields>[];
  protected readonly isFixedLen: boolean[];
  protected readonly fieldRangesFixedLen: BytesRange[];
  /** Offsets position relative to start of serialized Container. Length may not equal field count. */
  protected readonly variableOffsetsPosition: number[];
  /** End of fixed section of serialized Container */
  protected readonly fixedEnd: number;

  /** Cached TreeView constuctor with custom prototype for this Type's properties */
  protected readonly TreeView: ContainerTreeViewTypeConstructor<Fields>;
  protected readonly TreeViewDU: ContainerTreeViewDUTypeConstructor<Fields>;

  constructor(readonly fields: Fields, readonly opts?: ContainerOptions<Fields>) {
    super(opts?.cachePermanentRootStruct);

    this.typeName = opts?.typeName ?? "Container";

    this.maxChunkCount = Object.keys(fields).length;
    if (this.maxChunkCount === 0) {
      throw Error("fields must not be empty");
    }

    this.depth = maxChunksToDepth(this.maxChunkCount);

    // Precalculated data for faster serdes
    this.fieldsEntries = [];
    for (const fieldName of Object.keys(fields) as (keyof Fields)[]) {
      this.fieldsEntries.push({
        fieldName,
        fieldType: this.fields[fieldName],
        jsonKey: precomputeJsonKey(fieldName, opts?.casingMap, opts?.jsonCase),
      });
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
  }

  get defaultValue(): ValueOfFields<Fields> {
    const obj = {} as ValueOfFields<Fields>;
    for (const [key, type] of Object.entries(this.fields)) {
      obj[key as keyof ValueOfFields<Fields>] = type.defaultValue as ValueOf<Fields[keyof Fields]>;
    }
    return obj;
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
    let totalSize = 0;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      // Offset (4 bytes) + size
      totalSize +=
        fieldType.fixedSize === null ? 4 + fieldType.value_serializedSize(value[fieldName]) : fieldType.fixedSize;
    }
    return totalSize;
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: ValueOfFields<Fields>): number {
    let fixedIndex = offset;
    let variableIndex = offset + this.fixedEnd;

    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      if (fieldType.fixedSize === null) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.value_serializeToBytes(output, variableIndex, value[fieldName]);
      } else {
        fixedIndex = fieldType.value_serializeToBytes(output, fixedIndex, value[fieldName]);
      }
    }
    return variableIndex;
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOfFields<Fields> {
    const fieldRanges = this.getFieldRanges(data, start, end);
    const value = {} as ValueOfFields<Fields>;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      const fieldRange = fieldRanges[i];
      try {
        value[fieldName] = fieldType.value_deserializeFromBytes(
          data,
          start + fieldRange.start,
          start + fieldRange.end
        ) as ValueOf<Fields[keyof Fields]>;
      } catch (e) {
        throw new SszErrorPath(e as Error, fieldName as string);
      }
    }

    return value;
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

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    let fixedIndex = offset;
    let variableIndex = offset + this.fixedEnd;

    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    const nodes = getNodesAtDepth(node, this.depth, 0, this.fieldsEntries.length);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType} = this.fieldsEntries[i];
      const node = nodes[i];
      if (fieldType.fixedSize === null) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.tree_serializeToBytes(output, variableIndex, node);
      } else {
        fixedIndex = fieldType.tree_serializeToBytes(output, fixedIndex, node);
      }
    }
    return variableIndex;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const fieldRanges = this.getFieldRanges(data, start, end);
    const nodes: Node[] = [];

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType} = this.fieldsEntries[i];
      const fieldRange = fieldRanges[i];
      nodes.push(fieldType.tree_deserializeFromBytes(data, start + fieldRange.start, start + fieldRange.end));
    }

    return subtreeFillToContents(nodes, this.depth);
  }

  // Merkleization

  protected getRoots(struct: ValueOfFields<Fields>): Uint8Array {
    const roots = new Uint8Array(32 * this.fieldsEntries.length);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      const root = fieldType.hashTreeRoot(struct[fieldName]);
      roots.set(root, 32 * i);
    }

    return roots;
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

  /**
   * Deserializer helper: Returns the bytes ranges of all fields, both variable and fixed size.
   * Fields may not be contiguous in the serialized bytes, so the returned ranges are [start, end].
   * - For fixed size fields re-uses the pre-computed values this.fieldRangesFixedLen
   * - For variable size fields does a first pass over the fixed section to read offsets
   */
  private getFieldRanges(data: Uint8Array, start: number, end: number): BytesRange[] {
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
    offsets.push(end);

    // Merge fieldRangesFixedLen + offsets in one array
    let variableIdx = 0;
    let fixedIdx = 0;
    const fieldRanges: BytesRange[] = [];

    for (let i = 0; i < this.isFixedLen.length; i++) {
      if (this.isFixedLen[i]) {
        // push from fixLen ranges ++
        fieldRanges.push(this.fieldRangesFixedLen[fixedIdx++]);
      } else {
        // push from varLen ranges ++
        fieldRanges.push({start: offsets[variableIdx], end: offsets[variableIdx + 1]});
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
  data: Uint8Array,
  start: number,
  end: number,
  fixedEnd: number,
  variableOffsetsPosition: number[]
): number[] {
  if (variableOffsetsPosition.length === 0) {
    return [];
  }

  // Since variable-sized values can be interspersed with fixed-sized values, we precalculate
  // the offset indices so we can more easily deserialize the fields in once pass first we get the fixed sizes
  // Note: `fixedSizes[i] = null` if that field has variable length

  const size = end - start;
  const fixedSection = new DataView(data.buffer, data.byteOffset + start, fixedEnd);

  // with the fixed sizes, we can read the offsets, and store for our single pass
  const offsets: number[] = [];
  for (let i = 0; i < variableOffsetsPosition.length; i++) {
    const offset = fixedSection.getUint32(variableOffsetsPosition[i], true);

    // Validate offsets. If the list is empty the offset points to the end of the buffer, offset == size
    if (offset > size) {
      throw new Error("Offset out of bounds");
    }
    if (i === 0) {
      if (offset !== fixedEnd) {
        throw new Error("Not all variable bytes consumed");
      }
    } else {
      if (offset < offsets[i - 1]) {
        throw new Error("Offsets must be increasing");
      }
    }

    offsets.push(offset);
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
function precomputeJsonKey<Fields extends Record<string, Type<unknown>>>(
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
