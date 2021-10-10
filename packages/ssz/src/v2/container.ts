import {LeafNode, Tree} from "@chainsafe/persistent-merkle-tree";
import {SszErrorPath} from "../util/errorPath";
import {BasicType, CompositeType, TreeView, Type, ValueOf} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

type ValueOfFields<Fields extends Record<string, Type<any>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

type ViewOfFields<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K]["isBasic"] extends true ? Fields[K]["defaultValue"] : ReturnType<Fields[K]["getView"]>;
};

export class ContainerType<Fields extends Record<string, Type<any>>> extends Type<ValueOfFields<Fields>> {
  // Immutable characteristics
  readonly itemsPerChunk = 1;
  readonly isBasic = false;
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedLen: number | null;
  readonly minLen: number;
  readonly maxLen: number;
  // Precalculated data for faster serdes
  readonly fieldsEntries: [keyof Fields, Fields[keyof Fields]][];
  readonly isFixedLen: boolean[];
  readonly fieldRangesFixedLen: [number, number][];
  /** Offsets position relative to start of serialized Container. Length may not equal field count. */
  readonly variableOffsetsPosition: number[];
  /** End of fixed section of serialized Container */
  readonly fixedEnd: number;

  readonly fieldsFixedLen: (number | null)[] = [];

  constructor(readonly fields: Fields) {
    super();

    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 1;
    this.maxChunkCount = Object.keys(fields).length;
    // TODO: Review math
    this.depth = 1 + Math.ceil(Math.log2(this.maxChunkCount));

    // TODO: Consider de-duplicating all the field iterations in this loops. It's only run once, may not be worth it.
    this.fixedLen = getContainerFixedLen(fields);
    const [minLen, maxLen] = getMinMaxLengths(fields);
    this.minLen = minLen;
    this.maxLen = maxLen;

    // Precalculated data for faster serdes
    this.fieldsEntries = Array.from(Object.entries(fields)) as [keyof Fields, Fields[keyof Fields]][];
    const {isFixedLen, fieldRangesFixedLen, variableOffsetsPosition, fixedEnd, fixedLen} = precomputeSerdesData(fields);
    this.isFixedLen = isFixedLen;
    this.fieldRangesFixedLen = fieldRangesFixedLen;
    this.variableOffsetsPosition = variableOffsetsPosition;
    this.fixedEnd = fixedEnd;
    this.fixedLen = fixedLen;
  }

  get defaultValue(): ValueOfFields<Fields> {
    const obj = {} as ValueOfFields<Fields>;
    for (const [key, type] of Object.entries(this.fields)) {
      obj[key as keyof ValueOfFields<Fields>] = type.defaultValue as unknown;
    }
    return obj;
  }

  // Serialization + deserialization
  // -------------------------------
  // Containers can mix fixed length and variable length data.
  //
  // Fixed part                         Variable part
  // [field1 offset][field2 data       ][field1 data               ]
  // [0x000000c]    [0xaabbaabbaabbaabb][0xffffffffffffffffffffffff]

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOfFields<Fields> {
    const fieldRanges = this.getFieldRanges(data, start, end);
    const value = {} as ValueOfFields<Fields>;

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const [fieldName, fieldType] = this.fieldsEntries[i];
      const [startField, endField] = fieldRanges[i];
      try {
        value[fieldName] = fieldType.struct_deserializeFromBytes(data, start + startField, start + endField) as unknown;
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
      const [fieldName, fieldType] = this.fieldsEntries[i];
      if (fieldType.fixedLen === null) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.struct_serializeToBytes(output, value[fieldName], variableIndex);
      } else {
        fixedIndex = fieldType.struct_serializeToBytes(output, value[fieldName], fixedIndex);
      }
    }
    return variableIndex;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const fieldRanges = this.getFieldRanges(data, start, end);
    const target = new Tree();

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const [, fieldType] = this.fieldsEntries[i];
      const [startField, endField] = fieldRanges[i];

      // Basic element will always take a single chunk / LeafNode
      if (fieldType.isBasic) {
        // view of the chunk, shared buffer from `data`
        const dataChunk = new Uint8Array(data.buffer, data.byteOffset + start + startField, endField - startField);
        const chunk = new Uint8Array(32);
        // copy chunk into new memory
        chunk.set(dataChunk);
        target.setRoot(gindex, chunk);
      }

      // Composite elements may take more than one chunk
      else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const compositeType = fieldType as CompositeType<any>;
        target.setSubtree(gindex, compositeType.tree_deserializeFromBytes(data, start + startField, start + endField));
      }
    }
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, tree: Tree): number {
    let fixedIndex = offset;
    let variableIndex = this.fixedEnd;

    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    const nodes = tree.getNodesAtDepth(this.depth, 0, this.fieldsEntries.length);

    for (let i = 0; i < this.fieldsEntries.length; i++) {
      const [, fieldType] = this.fieldsEntries[i];
      const node = nodes[i];
      if (fieldType.fixedLen === null) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.tree_serializeToBytes(output, variableIndex, new Tree(node));
      } else {
        // TODO: Previous implementation had an optimization to directly grab the node's root for basic types.
        // I've omitted this optimization since it makes un-performant assumptions about how the root is represented.
        // Consider optimizing tree_serializeToBytes() directly of types that are shorter than 32 bytes.
        fixedIndex = fieldType.tree_serializeToBytes(output, fixedIndex, new Tree(node));
      }
    }
    return variableIndex;
  }

  getView(tree: Tree): ViewOfFields<Fields> {
    return getContainerTreeView<Fields>(this, tree, false);
  }

  /** Deserializer helper */
  private getFieldRanges(data: Uint8Array, start: number, end: number): [number, number][] {
    if (this.variableOffsetsPosition.length === 0) {
      return this.fieldRangesFixedLen;
    }

    // Read offsets in one pass
    const fieldRangesVarLen = getFieldRangesVarLen(data, start, end, this.fixedEnd, this.variableOffsetsPosition);

    // Merge fieldRangesFixedLen + fieldRangesVarLen in one array
    let varLenIndex = 0;
    let fixedLenIndex = 0;
    const fieldRanges: [number, number][] = [];

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

export class ContainerTreeView<Fields extends Record<string, Type<any>>> implements TreeView {
  private readonly fieldViews: ViewOfFields<Fields>;
  private readonly fieldBasicLeafNodes: {[K in keyof Fields]: LeafNode};
  private readonly dirtyNodes = new Set<string>();

  constructor(protected type: ContainerType<Fields>, protected tree: Tree, private inMutableMode = false) {}

  toMutable(): void {
    this.inMutableMode = true;
  }

  commit(): void {
    if (this.dirtyNodes.size === 0) {
      return;
    }

    // TODO: Use fast setNodes() method
    for (const key of this.dirtyNodes) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, this.fieldBasicLeafNodes[key]);
    }

    for (const [key, view] of Object.entries(this.fieldViews)) {
      (view as TreeView).commit();
    }

    this.inMutableMode = false;
  }
}

function getContainerTreeView<Fields extends Record<string, Type<any>>>(
  type: ContainerType<Fields>,
  tree: Tree,
  inMutableMode: boolean
): ViewOfFields<Fields> {
  const view = new ContainerTreeView(type, tree, inMutableMode);

  const propertyDescriptors: PropertyDescriptorMap = {};
  for (const [key, keyType] of Object.entries(type.fields)) {
    const gindex = type.getGindexBitStringAtChunkIndex(i);
    if (keyType.isBasic) {
      propertyDescriptors[key] = {
        configurable: false,
        enumerable: true,
        get: function () {
          const leafNode = tree.getNode(gindex) as LeafNode;
          return (keyType as BasicType<any>).getValueFromNode(leafNode) as unknown;
        },
        set: function (value) {
          const leafNode = tree.getNode(gindex) as LeafNode;
          (keyType as BasicType<any>).setValueToNode(leafNode, 0, value);
        },
      };
    } else {
      propertyDescriptors[key] = {
        configurable: false,
        enumerable: true,
        get: function () {
          // In current ssz it returns a Tree with its hook
          const keyTree = tree.getSubtree(gindex);
          return (keyType as CompositeType<any>).getView(keyTree, view["inMutableMode"]) as unknown;
        },
        set: function (value) {},
      };
    }
  }

  return Object.create(view, propertyDescriptors) as {[K in keyof Fields]: ValueOf<Fields[K]>};
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
): [number, number][] {
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

    // Validate offsets
    if (offset >= size) {
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

  const fieldRangesVarLen: [number, number][] = [];
  for (let i = 0; i < offsets.length; i++) {
    fieldRangesVarLen.push([offsets[i], offsets[i + 1]]);
  }

  return fieldRangesVarLen;
}

function precomputeSerdesData(fields: Record<string, Type<any>>): {
  isFixedLen: boolean[];
  fieldRangesFixedLen: [number, number][];
  variableOffsetsPosition: number[];
  fixedEnd: number;
  fixedLen: number | null;
} {
  const isFixedLen: boolean[] = [];
  const fieldRangesFixedLen: [number, number][] = [];
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
      fieldRangesFixedLen.push([pointerFixed, pointerFixed + fieldType.fixedLen]);
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
