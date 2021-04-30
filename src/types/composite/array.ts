/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/camelcase */
import {ArrayLike, CompositeValue, Json} from "../../interface";
import {IJsonOptions, Type} from "../type";
import {CompositeType} from "./abstract";
import {SszErrorPath} from "../../util/errorPath";
import {Gindex, iterateAtDepth, LeafNode, Node, subtreeFillToContents, Tree} from "@chainsafe/persistent-merkle-tree";
import {isTreeBacked} from "../../backings/tree/treeValue";

type ArrayElementType<T extends ArrayLike<unknown>> = ReturnType<Type<T[0]>["defaultValue"]> extends T[0]
  ? Type<T[0]>
  : never;

export interface IArrayOptions<T extends ArrayLike<unknown>> {
  elementType: ArrayElementType<T>;
}

export abstract class BasicArrayType<T extends ArrayLike<unknown>> extends CompositeType<T> {
  elementType: ArrayElementType<T>;
  constructor(options: IArrayOptions<T>) {
    super();
    this.elementType = options.elementType;
  }
  abstract struct_getLength(value: T): number;
  abstract getMaxLength(): number;
  abstract getMinLength(): number;
  struct_getSerializedLength(value: T): number {
    return this.elementType.struct_getSerializedLength() * this.struct_getLength(value);
  }

  getMaxSerializedLength(): number {
    return this.getMaxLength() * this.elementType.getMaxSerializedLength();
  }

  getMinSerializedLength(): number {
    return this.getMinLength() * this.elementType.getMinSerializedLength();
  }

  struct_assertValidValue(value: unknown): asserts value is T {
    for (let i = 0; i < this.struct_getLength(value as T); i++) {
      try {
        this.elementType.struct_assertValidValue((value as T)[i]);
      } catch (e) {
        throw new Error(`Invalid element ${i}: ${e.message}`);
      }
    }
  }

  struct_equals(value1: T, value2: T): boolean {
    if (this.struct_getLength(value1) !== this.struct_getLength(value2)) {
      return false;
    }
    for (let i = 0; i < this.struct_getLength(value1); i++) {
      if (!this.elementType.struct_equals(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  }

  struct_clone(value: T): T {
    const newValue = this.struct_defaultValue();
    for (let i = 0; i < this.struct_getLength(value); i++) {
      newValue[i] = this.elementType.struct_clone(value[i]);
    }
    return newValue;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    const elementSize = this.elementType.struct_getSerializedLength();
    return (Array.from({length: (end - start) / elementSize}, (_, i) =>
      this.elementType.struct_deserializeFromBytes(data, start + i * elementSize)
    ) as unknown) as T;
  }

  struct_serializeToBytes(value: T, output: Uint8Array, offset: number): number {
    const length = this.struct_getLength(value);
    let index = offset;
    for (let i = 0; i < length; i++) {
      index = this.elementType.struct_serializeToBytes(value[i], output, index);
    }
    return index;
  }

  struct_getRootAtChunkIndex(value: T, index: number): Uint8Array {
    const output = new Uint8Array(32);
    const itemSize = this.elementType.struct_getSerializedLength();
    const itemsInChunk = Math.floor(32 / itemSize);
    const firstIndex = index * itemsInChunk;
    // not inclusive
    const lastIndex = Math.min(this.struct_getLength(value), firstIndex + itemsInChunk);
    // i = array index, grows by 1
    // j = data offset, grows by itemSize
    for (let i = firstIndex, j = 0; i < lastIndex; i++, j += itemSize) {
      this.elementType.struct_serializeToBytes(value[i], output, j);
    }
    return output;
  }

  struct_getPropertyNames(value: T): (string | number)[] {
    const length = this.struct_getLength(value);
    return (Array.from({length}, (_, i) => i) as (string | number)[]).concat(["length"]);
  }

  struct_convertFromJson(data: Json[]): T {
    return (Array.from({length: data.length}, (_, i) => this.elementType.fromJson(data[i])) as unknown) as T;
  }

  struct_convertToJson(value: T): Json {
    return Array.from({length: this.struct_getLength(value)}, (_, i) =>
      this.elementType.struct_convertToJson(value[i])
    );
  }

  struct_convertToTree(value: T): Tree {
    if (isTreeBacked<T>(value)) return value.tree.clone();
    const contents: Node[] = [];
    for (const chunk of this.struct_yieldChunkRoots(value)) {
      contents.push(new LeafNode(chunk));
    }
    return new Tree(subtreeFillToContents(contents, this.getChunkDepth()));
  }

  tree_convertToStruct(target: Tree): T {
    const value = this.struct_defaultValue();
    const length = this.tree_getLength(target);
    for (let i = 0; i < length; i++) {
      value[i] = this.tree_getValueAtIndex(target, i);
    }
    return value;
  }

  abstract tree_getLength(target: Tree): number;
  tree_getSerializedLength(target: Tree): number {
    return this.elementType.struct_getSerializedLength() * this.tree_getLength(target);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const target = this.tree_defaultValue();
    const byteLength = end - start;
    const chunkCount = Math.ceil(byteLength / 32);
    for (let i = 0; i < chunkCount; i++) {
      // view of the chunk, shared buffer from `data`
      const dataChunk = new Uint8Array(
        data.buffer,
        data.byteOffset + start + i * 32,
        Math.min(32, byteLength - i * 32)
      );
      // copy chunk into new memory
      const chunk = new Uint8Array(32);
      chunk.set(dataChunk);
      this.tree_setRootAtChunkIndex(
        target,
        i,
        chunk,
        true // expand tree as needed
      );
    }
    return target;
  }

  tree_serializeToBytes(target: Tree, output: Uint8Array, offset: number): number {
    const size = this.tree_getSerializedLength(target);
    const fullChunkCount = Math.floor(size / 32);
    const remainder = size % 32;
    let i = 0;
    if (fullChunkCount > 0) {
      for (const node of target.iterateNodesAtDepth(this.getChunkDepth(), 0, fullChunkCount)) {
        output.set(node.root, offset + i * 32);
        i++;
      }
    }
    if (remainder) {
      output.set(this.tree_getRootAtChunkIndex(target, fullChunkCount).slice(0, remainder), offset + i * 32);
    }
    return offset + size;
  }

  getPropertyGindex(prop: PropertyKey): Gindex {
    return this.getGindexAtChunkIndex(this.getChunkIndex(prop as number));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPropertyType(prop: PropertyKey): ArrayElementType<T> {
    return this.elementType;
  }

  *tree_iterateValues(target: Tree): IterableIterator<Tree | unknown> {
    const length = this.tree_getLength(target);
    if (length === 0) {
      return;
    }
    const elementSize = this.elementType.struct_getSerializedLength();
    if (32 % elementSize !== 0) {
      throw new Error("cannot handle a non-chunk-alignable elementType");
    }
    let left = length;
    for (const node of target.iterateNodesAtDepth(this.getChunkDepth(), 0, this.tree_getChunkCount(target))) {
      const chunk = node.root;
      for (let offset = 0; offset < 32; offset += elementSize) {
        yield this.elementType.struct_deserializeFromBytes(chunk, offset);
        left--;
        if (left === 0) {
          return;
        }
      }
    }
  }

  *tree_readonlyIterateValues(target: Tree): IterableIterator<Tree | unknown> {
    yield* this.tree_iterateValues(target);
  }

  getChunkOffset(index: number): number {
    const elementSize = this.elementType.struct_getSerializedLength();
    return (index % Math.ceil(32 / elementSize)) * elementSize;
  }

  getChunkIndex(index: number): number {
    return Math.floor(index / Math.ceil(32 / this.elementType.struct_getSerializedLength()));
  }

  tree_getValueAtIndex(target: Tree, index: number): T[number] {
    const chunk = this.tree_getRootAtChunkIndex(target, this.getChunkIndex(index));
    return this.elementType.struct_deserializeFromBytes(chunk, this.getChunkOffset(index));
  }

  tree_setValueAtIndex(target: Tree, index: number, value: T[number], expand = false): boolean {
    const chunkGindex = this.getGindexAtChunkIndex(this.getChunkIndex(index));
    // copy data from old chunk, use new memory to set a new chunk
    const chunk = new Uint8Array(32);
    chunk.set(target.getRoot(chunkGindex));
    this.elementType.struct_serializeToBytes(value, chunk, this.getChunkOffset(index));
    target.setRoot(chunkGindex, chunk, expand);
    return true;
  }

  tree_getProperty(target: Tree, property: keyof T): T[keyof T] {
    const length = this.tree_getLength(target);
    if (property === "length") {
      return length as T[keyof T];
    }
    const index = Number(property);
    if (Number.isNaN(index as number)) {
      return undefined;
    }
    if (index >= length) {
      return undefined;
    }
    return this.tree_getValueAtIndex(target, index);
  }

  tree_setProperty(target: Tree, property: number, value: T[number], expand = false): boolean {
    return this.tree_setValueAtIndex(target, property as number, value, expand);
  }

  tree_deleteProperty(target: Tree, property: number): boolean {
    return this.tree_setProperty(target, property, this.elementType.struct_defaultValue());
  }

  tree_getPropertyNames(target: Tree): string[] {
    return Array.from({length: this.tree_getLength(target)}, (_, i) => String(i)).concat("length");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bytes_getVariableOffsets(target: Uint8Array): [number, number][] {
    return [];
  }
}

export abstract class CompositeArrayType<T extends ArrayLike<unknown>> extends CompositeType<T> {
  elementType: CompositeType<CompositeValue>;

  constructor(options: IArrayOptions) {
    super();
    this.elementType = (options.elementType as unknown) as CompositeType<CompositeValue>;
  }

  abstract struct_getLength(value: T): number;
  abstract getMaxLength(): number;
  abstract getMinLength(): number;

  struct_getSerializedLength(value: T): number {
    if (this.elementType.hasVariableSerializedLength()) {
      let s = 0;
      for (let i = 0; i < this.struct_getLength(value); i++) {
        s += this.elementType.struct_getSerializedLength(value[i] as CompositeValue) + 4;
      }
      return s;
    } else {
      return this.elementType.struct_getSerializedLength(null) * this.struct_getLength(value);
    }
  }

  getMaxSerializedLength(): number {
    if (this.elementType.hasVariableSerializedLength()) {
      return this.getMaxLength() * 4 + this.getMaxLength() * this.elementType.getMaxSerializedLength();
    } else {
      return this.getMaxLength() * this.elementType.getMaxSerializedLength();
    }
  }

  getMinSerializedLength(): number {
    if (this.elementType.hasVariableSerializedLength()) {
      return this.getMinLength() * 4 + this.getMinLength() * this.elementType.getMinSerializedLength();
    } else {
      return this.getMinLength() * this.elementType.getMinSerializedLength();
    }
  }

  struct_assertValidValue(value: unknown): asserts value is T {
    for (let i = 0; i < this.struct_getLength(value as T); i++) {
      try {
        this.elementType.struct_assertValidValue((value as T)[i]);
      } catch (e) {
        throw new Error(`Invalid element ${i}: ${e.message}`);
      }
    }
  }

  struct_equals(value1: T, value2: T): boolean {
    if (this.struct_getLength(value1) !== this.struct_getLength(value2)) {
      return false;
    }
    for (let i = 0; i < this.struct_getLength(value1); i++) {
      if (!this.elementType.struct_equals(value1[i] as CompositeValue, value2[i] as CompositeValue)) {
        return false;
      }
    }
    return true;
  }

  struct_clone(value: T): T {
    const newValue = this.struct_defaultValue();
    for (let i = 0; i < this.struct_getLength(value); i++) {
      newValue[i] = this.elementType.struct_clone(value[i] as CompositeValue);
    }
    return newValue;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    if (start === end) {
      return ([] as unknown) as T;
    }
    if (this.elementType.hasVariableSerializedLength()) {
      const value = [];
      // all elements variable-sized
      // indices contain offsets
      let currentIndex = start;
      let nextIndex;
      // data exists between offsets
      const fixedSection = new DataView(data.buffer, data.byteOffset);
      const firstOffset = start + fixedSection.getUint32(start, true);
      let currentOffset = firstOffset;
      let nextOffset;
      while (currentIndex < firstOffset) {
        if (currentOffset > end) {
          throw new Error("Offset out of bounds");
        }
        nextIndex = currentIndex + 4;
        nextOffset = nextIndex === firstOffset ? end : start + fixedSection.getUint32(nextIndex, true);
        if (currentOffset > nextOffset) {
          throw new Error("Offsets must be increasing");
        }
        try {
          value.push(this.elementType.struct_deserializeFromBytes(data, currentOffset, nextOffset));
        } catch (e) {
          throw new SszErrorPath(e, value.length);
        }
        currentIndex = nextIndex;
        currentOffset = nextOffset;
      }
      if (firstOffset !== currentIndex) {
        throw new Error("First offset skips variable data");
      }
      return (value as unknown) as T;
    } else {
      const elementSize = this.elementType.struct_getSerializedLength(null);
      return (Array.from({length: (end - start) / elementSize}, (_, i) =>
        this.elementType.struct_deserializeFromBytes(data, start + i * elementSize, start + (i + 1) * elementSize)
      ) as unknown) as T;
    }
  }

  struct_serializeToBytes(value: T, output: Uint8Array, offset: number): number {
    const length = this.struct_getLength(value);
    if (this.elementType.hasVariableSerializedLength()) {
      let variableIndex = offset + length * 4;
      const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
      for (let i = 0; i < length; i++) {
        // write offset
        fixedSection.setUint32(i * 4, variableIndex - offset, true);
        // write serialized element to variable section
        variableIndex = this.elementType.struct_serializeToBytes(value[i] as CompositeValue, output, variableIndex);
      }
      return variableIndex;
    } else {
      let index = offset;
      for (let i = 0; i < length; i++) {
        index = this.elementType.struct_serializeToBytes(value[i] as CompositeValue, output, index);
      }
      return index;
    }
  }

  struct_getRootAtChunkIndex(value: T, index: number): Uint8Array {
    return this.elementType.hashTreeRoot(value[index] as CompositeValue);
  }

  struct_getPropertyNames(value: T): (string | number)[] {
    const length = this.struct_getLength(value);
    return (Array.from({length}, (_, i) => i) as (string | number)[]).concat(["length"]);
  }

  struct_convertFromJson(data: Json[], options?: IJsonOptions): T {
    return (Array.from({length: data.length}, (_, i) =>
      this.elementType.struct_convertFromJson(data[i], options)
    ) as unknown) as T;
  }

  struct_convertToJson(value: T, options?: IJsonOptions): Json {
    return Array.from({length: this.struct_getLength(value)}, (_, i) =>
      this.elementType.struct_convertToJson(value[i] as CompositeValue, options)
    );
  }

  struct_convertToTree(value: T): Tree {
    if (isTreeBacked<T>(value)) return value.tree.clone();
    const contents: Node[] = [];
    for (const element of value) {
      contents.push(this.elementType.struct_convertToTree(element as CompositeValue).rootNode);
    }
    return new Tree(subtreeFillToContents(contents, this.getChunkDepth()));
  }

  tree_convertToStruct(target: Tree): T {
    const value = this.struct_defaultValue();
    const length = this.tree_getLength(target);
    for (let i = 0; i < length; i++) {
      value[i] = this.elementType.tree_convertToStruct(this.tree_getSubtreeAtChunkIndex(target, i));
    }
    return value;
  }

  abstract tree_getLength(target: Tree): number;
  tree_getSerializedLength(target: Tree): number {
    if (this.elementType.hasVariableSerializedLength()) {
      let s = 0;
      for (let i = 0; i < this.tree_getLength(target); i++) {
        s += this.elementType.tree_getSerializedLength(this.tree_getSubtreeAtChunkIndex(target, i)) + 4;
      }
      return s;
    } else {
      return this.elementType.tree_getSerializedLength(null) * this.tree_getLength(target);
    }
  }

  tree_serializeToBytes(target: Tree, output: Uint8Array, offset: number): number {
    const length = this.tree_getLength(target);
    if (this.elementType.hasVariableSerializedLength()) {
      let variableIndex = offset + length * 4;
      const fixedSection = new DataView(output.buffer, output.byteOffset + offset, length * 4);
      let i = 0;
      for (const node of target.iterateNodesAtDepth(this.getChunkDepth(), i, length)) {
        // write offset
        fixedSection.setUint32(i * 4, variableIndex - offset, true);
        // write serialized element to variable section
        variableIndex = this.elementType.tree_serializeToBytes(new Tree(node), output, variableIndex);
        i++;
      }
      return variableIndex;
    } else {
      let index = offset;
      let i = 0;
      for (const node of target.iterateNodesAtDepth(this.getChunkDepth(), i, length)) {
        index = this.elementType.tree_serializeToBytes(new Tree(node), output, index);
        i++;
      }
      return index;
    }
  }

  getPropertyGindex(prop: PropertyKey): Gindex {
    return this.getGindexAtChunkIndex(prop as number);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPropertyType(prop: PropertyKey): CompositeType<CompositeValue> {
    return this.elementType;
  }

  tree_getProperty<V extends keyof T>(target: Tree, property: V): Tree | unknown {
    const length = this.tree_getLength(target);
    if (property === "length") {
      return length as unknown;
    }
    const index = Number(property);
    if (Number.isNaN(index as number)) {
      return undefined;
    }
    if (index >= length) {
      return undefined;
    }
    return this.tree_getSubtreeAtChunkIndex(target, index);
  }

  tree_setProperty(target: Tree, property: number, value: Tree, expand = false): boolean {
    this.tree_setSubtreeAtChunkIndex(target, property, value, expand);
    return true;
  }

  tree_deleteProperty(target: Tree, property: number): boolean {
    return this.tree_setProperty(target, property, this.elementType.tree_defaultValue());
  }

  tree_getPropertyNames(target: Tree): (string | number)[] {
    return (Array.from({length: this.tree_getLength(target)}, (_, i) => i) as (string | number)[]).concat(["length"]);
  }

  *tree_iterateValues(target: Tree): IterableIterator<Tree | unknown> {
    for (const gindex of iterateAtDepth(this.getChunkDepth(), BigInt(0), BigInt(this.tree_getLength(target)))) {
      yield target.getSubtree(gindex);
    }
  }

  *tree_readonlyIterateValues(target: Tree): IterableIterator<Tree | unknown> {
    for (const node of target.iterateNodesAtDepth(this.getChunkDepth(), 0, this.tree_getLength(target))) {
      yield new Tree(node);
    }
  }

  bytes_getVariableOffsets(target: Uint8Array): [number, number][] {
    if (this.elementType.hasVariableSerializedLength()) {
      if (target.length === 0) {
        return [];
      }
      const offsets: [number, number][] = [];
      // all elements are variable-sized
      // indices contain offsets, which are indices deeper in the byte array
      const fixedSection = new DataView(target.buffer, target.byteOffset);
      const firstOffset = fixedSection.getUint32(0, true);
      let currentOffset = firstOffset;
      let nextOffset;
      let currentIndex = 0;
      let nextIndex = 0;
      while (currentIndex < firstOffset) {
        if (currentOffset > target.length) {
          throw new Error("Offset out of bounds");
        }
        nextIndex = currentIndex + 4;
        nextOffset = nextIndex === firstOffset ? target.length : fixedSection.getUint32(nextIndex, true);
        if (currentOffset > nextOffset) {
          throw new Error("Offsets must be increasing");
        }
        offsets.push([currentOffset, nextOffset]);
        currentIndex = nextIndex;
        currentOffset = nextOffset;
      }
      if (firstOffset !== currentIndex) {
        throw new Error("First offset skips variable data");
      }
      return offsets;
    } else {
      return [];
    }
  }
}
