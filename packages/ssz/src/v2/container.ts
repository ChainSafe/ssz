import {Node, getNodesAtDepth, subtreeFillToContents, Tree} from "@chainsafe/persistent-merkle-tree";
import {maxChunksToDepth} from "../util/tree";
import {IJsonOptions} from "../types";
import {SszErrorPath} from "../util/errorPath";
import {toExpectedCase} from "../util/json";
import {CompositeType, TreeView, TreeViewMutable, Type, ValueOf} from "./abstract";
import {getContainerTreeViewClass, getContainerTreeViewMutableClass} from "./containerTreeView";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export type ValueOfFields<Fields extends Record<string, Type<any>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

type FieldsView<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<any, any, any>
    ? // If composite, return view. MAY propagate changes updwards
      ReturnType<Fields[K]["getView"]>
    : // If basic, return struct value. Will NOT propagate changes upwards
      Fields[K]["defaultValue"];
};

type FieldsViewMutable<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K] extends CompositeType<any, any, any>
    ? // If composite, return view. MAY propagate changes updwards
      ReturnType<Fields[K]["getViewMutable"]>
    : // If basic, return struct value. Will NOT propagate changes upwards
      Fields[K]["defaultValue"];
};

type ContainerTreeViewType<Fields extends Record<string, Type<any>>> = FieldsView<Fields> & TreeView;
type ContainerTreeViewTypeConstructor<Fields extends Record<string, Type<any>>> = {
  new (type: ContainerType<Fields>, tree: Tree, inMutableMode?: boolean): ContainerTreeViewType<Fields>;
};

type ContainerTreeViewMutableType<Fields extends Record<string, Type<any>>> = FieldsViewMutable<Fields> &
  TreeViewMutable;
type ContainerTreeViewMutableTypeConstructor<Fields extends Record<string, Type<any>>> = {
  new (type: ContainerType<Fields>, node: Node, cache: unknown): ContainerTreeViewMutableType<Fields>;
};

type BytesRange = {start: number; end: number};

export interface IContainerOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  casingMap?: Record<string, string>;
  expectedCase?: IJsonOptions["case"];
  cachePermanentRootStruct?: boolean;
}

export class ContainerType<Fields extends Record<string, Type<any>>> extends CompositeType<
  ValueOfFields<Fields>,
  ContainerTreeViewType<Fields>,
  ContainerTreeViewMutableType<Fields>
> {
  // Immutable characteristics
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedLen: number | null;
  readonly minLen: number;
  readonly maxLen: number;

  /** Reverse indexing: fieldName -> index in fields */
  readonly fieldIndex: Record<keyof Fields, number>;

  // Precalculated data for faster serdes
  readonly fieldsEntries: {fieldName: keyof Fields; fieldType: Fields[keyof Fields]}[];
  readonly isFixedLen: boolean[];
  readonly fieldRangesFixedLen: BytesRange[];
  /** Offsets position relative to start of serialized Container. Length may not equal field count. */
  readonly variableOffsetsPosition: number[];
  /** End of fixed section of serialized Container */
  readonly fixedEnd: number;

  /** Cached TreeView constuctor with custom prototype for this Type's properties */
  readonly TreeView: ContainerTreeViewTypeConstructor<Fields>;
  readonly TreeViewMutable: ContainerTreeViewMutableTypeConstructor<Fields>;

  constructor(readonly fields: Fields, private readonly opts?: IContainerOptions) {
    super(opts?.cachePermanentRootStruct);

    this.maxChunkCount = Object.keys(fields).length;
    if (this.maxChunkCount === 0) {
      throw Error("fields must not be empty");
    }

    this.depth = maxChunksToDepth(this.maxChunkCount);

    // TODO: Consider de-duplicating all the field iterations in this loops. It's only run once, may not be worth it.
    this.fixedLen = getContainerFixedLen(fields);
    const [minLen, maxLen] = getMinMaxLengths(fields);
    this.minLen = minLen;
    this.maxLen = maxLen;

    // Precalculated data for faster serdes
    this.fieldsEntries = [];
    for (const fieldName of Object.keys(fields) as (keyof Fields)[]) {
      this.fieldsEntries.push({fieldName, fieldType: this.fields[fieldName]});
    }

    const {isFixedLen, fieldRangesFixedLen, variableOffsetsPosition, fixedEnd, fixedLen} = precomputeSerdesData(fields);
    this.isFixedLen = isFixedLen;
    this.fieldRangesFixedLen = fieldRangesFixedLen;
    this.variableOffsetsPosition = variableOffsetsPosition;
    this.fixedEnd = fixedEnd;
    this.fixedLen = fixedLen;

    // Reverse indexing: fieldName -> index in fields
    this.fieldIndex = {} as Record<keyof Fields, number>;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      this.fieldIndex[this.fieldsEntries[i].fieldName] = i;
    }

    this.TreeView = getContainerTreeViewClass(this);
    this.TreeViewMutable = getContainerTreeViewMutableClass(this);
  }

  get defaultValue(): ValueOfFields<Fields> {
    const obj = {} as ValueOfFields<Fields>;
    for (const [key, type] of Object.entries(this.fields)) {
      obj[key as keyof ValueOfFields<Fields>] = type.defaultValue as unknown;
    }
    return obj;
  }

  getView(tree: Tree, inMutableMode?: boolean): ContainerTreeViewType<Fields> {
    return new this.TreeView(this, tree, inMutableMode);
  }

  getViewMutable(node: Node, cache: unknown): ContainerTreeViewMutableType<Fields> {
    return new this.TreeViewMutable(this, node, cache);
  }

  // Serialization + deserialization
  // -------------------------------
  // Containers can mix fixed length and variable length data.
  //
  // Fixed part                         Variable part
  // [field1 offset][field2 data       ][field1 data               ]
  // [0x000000c]    [0xaabbaabbaabbaabb][0xffffffffffffffffffffffff]

  struct_serializedSize(value: ValueOfFields<Fields>): number {
    let totalSize = 0;
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      // Offset (4 bytes) + size
      totalSize +=
        fieldType.fixedLen === null ? 4 + fieldType.struct_serializedSize(value[fieldName]) : fieldType.fixedLen;
    }
    return totalSize;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOfFields<Fields> {
    const fieldRanges = this.getFieldRanges(data, start, end);
    const value = {} as ValueOfFields<Fields>;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      const fieldRange = fieldRanges[i];
      try {
        value[fieldName] = fieldType.struct_deserializeFromBytes(
          data,
          start + fieldRange.start,
          start + fieldRange.end
        ) as unknown;
      } catch (e) {
        throw new SszErrorPath(e as Error, fieldName as string);
      }
    }

    return value;
  }

  struct_serializeToBytes(output: Uint8Array, offset: number, value: ValueOfFields<Fields>): number {
    let fixedIndex = offset;
    let variableIndex = this.fixedEnd;

    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];
      if (fieldType.fixedLen === null) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.struct_serializeToBytes(output, variableIndex, value[fieldName]);
      } else {
        fixedIndex = fieldType.struct_serializeToBytes(output, fixedIndex, value[fieldName]);
      }
    }
    return variableIndex;
  }

  tree_serializedSize(node: Node): number {
    let totalSize = 0;
    const nodes = getNodesAtDepth(node, this.depth, 0, this.fieldsEntries.length) as Node[];
    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType} = this.fieldsEntries[i];
      const node = nodes[i];
      // Offset (4 bytes) + size
      totalSize += fieldType.fixedLen === null ? 4 + fieldType.tree_serializedSize(node) : fieldType.fixedLen;
    }
    return totalSize;
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

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    let fixedIndex = offset;
    let variableIndex = this.fixedEnd;

    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    const nodes = getNodesAtDepth(node, this.depth, 0, this.fieldsEntries.length);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldType} = this.fieldsEntries[i];
      const node = nodes[i];
      if (fieldType.fixedLen === null) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.tree_serializeToBytes(output, variableIndex, node);
      } else {
        // TODO: Previous implementation had an optimization to directly grab the node's root for basic types.
        // I've omitted this optimization since it makes un-performant assumptions about how the root is represented.
        // Consider optimizing tree_serializeToBytes() directly of types that are shorter than 32 bytes.
        fixedIndex = fieldType.tree_serializeToBytes(output, fixedIndex, node);
      }
    }
    return variableIndex;
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

  fromJson(data: unknown): ValueOfFields<Fields> {
    if (typeof data !== "object") {
      throw new Error("JSON must be of type object");
    }

    const value = {} as ValueOfFields<Fields>;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const {fieldName, fieldType} = this.fieldsEntries[i];

      const jsonKey = toExpectedCase(fieldName as string, this.opts?.expectedCase, this.opts?.casingMap);
      const jsonValue = (data as Record<string, unknown>)[jsonKey];
      if (jsonValue === undefined) {
        throw Error(`JSON expected field ${jsonKey} is undefined`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value[fieldName] = fieldType.fromJson(jsonValue);
    }

    return value;
  }

  /** Deserializer helper */
  private getFieldRanges(data: Uint8Array, start: number, end: number): BytesRange[] {
    if (this.variableOffsetsPosition.length === 0) {
      // Validate fixed length container
      if (end - start !== this.fixedEnd) {
        throw Error("Container size not equal fixed size");
      }

      return this.fieldRangesFixedLen;
    }

    // Read offsets in one pass
    const fieldRangesVarLen = getFieldRangesVarLen(data, start, end, this.fixedEnd, this.variableOffsetsPosition);

    // Merge fieldRangesFixedLen + fieldRangesVarLen in one array
    let varLenIndex = 0;
    let fixedLenIndex = 0;
    const fieldRanges: BytesRange[] = [];

    for (let i = 0; i < this.isFixedLen.length; i++) {
      fieldRanges.push(
        this.isFixedLen[i]
          ? // push from fixLen ranges ++
            this.fieldRangesFixedLen[fixedLenIndex++]
          : // push from varLen ranges ++
            fieldRangesVarLen[varLenIndex++]
      );
    }
    return fieldRanges;
  }
}

function getContainerFixedLen(fields: Record<string, Type<any>>): null | number {
  let fixedLen = 0;
  for (const fieldType of Object.values(fields)) {
    if (fieldType.fixedLen === null) {
      return null;
    } else {
      fixedLen += fieldType.fixedLen;
    }
  }
  return fixedLen;
}

function getMinMaxLengths(fields: Record<string, Type<any>>): [number, number] {
  let minLen = 0;
  let maxLen = 0;

  for (const fieldType of Object.values(fields)) {
    minLen += fieldType.minLen;
    maxLen += fieldType.maxLen;

    if (fieldType.fixedLen === null) {
      // +4 for the offset
      minLen += 4;
      maxLen += 4;
    }
  }
  return [minLen, maxLen];
}

function getFieldRangesVarLen(
  data: Uint8Array,
  start: number,
  end: number,
  fixedEnd: number,
  variableOffsetsPosition: number[]
): BytesRange[] {
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
  offsets.push(end);

  const fieldRangesVarLen: BytesRange[] = [];
  for (let i = 0; i < offsets.length; i++) {
    fieldRangesVarLen.push({start: offsets[i], end: offsets[i + 1]});
  }

  return fieldRangesVarLen;
}

function precomputeSerdesData(fields: Record<string, Type<any>>): {
  isFixedLen: boolean[];
  fieldRangesFixedLen: BytesRange[];
  variableOffsetsPosition: number[];
  fixedEnd: number;
  fixedLen: number | null;
} {
  const isFixedLen: boolean[] = [];
  const fieldRangesFixedLen: BytesRange[] = [];
  const variableOffsetsPosition: number[] = [];
  let pointerFixed = 0;

  const fieldsEntries = Array.from(Object.entries(fields));
  for (let i = 0; i < fieldsEntries.length; i++) {
    const [, fieldType] = fieldsEntries[i];
    isFixedLen.push(fieldType.fixedLen !== null);
    if (fieldType.fixedLen === null) {
      // Variable length
      variableOffsetsPosition.push(pointerFixed);
      pointerFixed += 4;
    } else {
      fieldRangesFixedLen.push({start: pointerFixed, end: pointerFixed + fieldType.fixedLen});
      pointerFixed += fieldType.fixedLen;
    }
  }

  return {
    isFixedLen,
    fieldRangesFixedLen,
    variableOffsetsPosition,
    fixedEnd: pointerFixed,
    fixedLen: variableOffsetsPosition.length === 0 ? pointerFixed : null,
  };
}
