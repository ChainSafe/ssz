/* eslint-disable @typescript-eslint/no-unused-vars */
import {Tree, Node, iterateAtDepth, Gindex, LeafNode, subtreeFillToContents} from "@chainsafe/persistent-merkle-tree";

import {ArrayLike} from "../../interface";
import {BasicArrayType, BasicType, CompositeArrayType, CompositeType} from "../../types";
import {isTreeBacked, TreeHandler, PropOfCompositeTreeBacked} from "./abstract";

export class BasicArrayTreeHandler<T extends ArrayLike<unknown>> extends TreeHandler<T> {
  protected _type: BasicArrayType<T>;
  fromStructural(value: T): Tree {
    const contents: Node[] = [];
    for (const chunk of this._type.structural.chunks(value)) {
      contents.push(new LeafNode(chunk));
    }
    return new Tree(subtreeFillToContents(contents, this.depth()));
  }
  size(target: Tree): number {
    return this._type.elementType.size() * this.getLength(target);
  }
  fromBytes(data: Uint8Array, start: number, end: number): Tree {
    const target = this.defaultBacking();
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
      this.setRootAtChunk(
        target,
        i,
        chunk,
        true // expand tree as needed
      );
    }
    return target;
  }
  toBytes(target: Tree, output: Uint8Array, offset: number): number {
    const size = this.size(target);
    // Math.floor(size / 32)
    const fullChunkCount = size >> 5;
    const remainder = size % 32;
    let i = 0;
    if (fullChunkCount > 0) {
      for (const node of target.iterateNodesAtDepth(this.depth(), 0, fullChunkCount)) {
        output.set(node.root, offset + i * 32);
        i++;
      }
    }
    if (remainder) {
      output.set(this.getRootAtChunk(target, fullChunkCount).slice(0, remainder), offset + i * 32);
    }
    return offset + size;
  }
  gindexOfProperty(prop: PropertyKey): Gindex {
    return this.gindexOfChunk(this.getChunkIndex(prop as number));
  }
  typeOfProperty(prop: PropertyKey): BasicType<unknown> {
    return this._type.elementType;
  }
  getLength(target: Tree): number {
    throw new Error("Not implemented");
  }
  getChunkOffset(index: number): number {
    const elementSize = this._type.elementType.size();
    return (index % Math.ceil(32 / elementSize)) * elementSize;
  }
  getChunkIndex(index: number): number {
    return Math.floor(index / Math.ceil(32 / this._type.elementType.size()));
  }
  getValueAtIndex(target: Tree, index: number): T[number] {
    const chunk = this.getRootAtChunk(target, this.getChunkIndex(index));
    return this._type.elementType.fromBytes(chunk, this.getChunkOffset(index));
  }
  getProperty(target: Tree, property: keyof T): T[keyof T] {
    const length = this.getLength(target);
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
    return this.getValueAtIndex(target, index);
  }
  setProperty(target: Tree, property: number, value: T[number], expand = false): boolean {
    const chunkGindex = this.gindexOfChunk(this.getChunkIndex(property));
    // copy data from old chunk, use new memory to set a new chunk
    const chunk = new Uint8Array(32);
    chunk.set(target.getRoot(chunkGindex));
    this._type.elementType.toBytes(value, chunk, this.getChunkOffset(property));
    target.setRoot(chunkGindex, chunk, expand);
    return true;
  }
  set(target: Tree, property: number, value: T[number], expand = false): boolean {
    return this.setProperty(target, property, value, expand);
  }
  deleteProperty(target: Tree, property: number): boolean {
    return this.setProperty(target, property, this._type.elementType.defaultValue());
  }
  ownKeys(target: Tree): string[] {
    return Array.from({length: this.getLength(target)}, (_, i) => String(i));
  }
  *[Symbol.iterator](target: Tree): Iterable<T[number]> {
    for (let i = 0; i < this.getLength(target); i++) {
      yield this.getValueAtIndex(target, i);
    }
  }
  find(
    target: Tree,
    fn: (value: T[keyof T], index: number, array: ArrayLike<unknown>) => boolean
  ): T[keyof T] | undefined {
    const value = this.asTreeBacked(target);
    for (let i = 0; i < this.getLength(target); i++) {
      const elementValue = this.getValueAtIndex(target, i);
      if (fn(elementValue, i, value)) {
        return elementValue;
      }
    }
    return undefined;
  }
  findIndex(target: Tree, fn: (value: T[keyof T], index: number, array: ArrayLike<unknown>) => boolean): number {
    const value = this.asTreeBacked(target);
    for (let i = 0; i < this.getLength(target); i++) {
      if (fn(this.getValueAtIndex(target, i), i, value)) {
        return i;
      }
    }
    return -1;
  }
  forEach(target: Tree, fn: (value: T[keyof T], index: number, array: ArrayLike<unknown>) => void): void {
    const value = this.asTreeBacked(target);
    for (let i = 0; i < this.getLength(target); i++) {
      fn(this.getValueAtIndex(target, i), i, value);
    }
  }
  readOnlyForEach(target: Tree, fn: (value: unknown, index: number) => void): void {
    const elementType = this._type.elementType;
    const length = this.getLength(target);
    const elementSize = this._type.elementType.size();
    const elementsPerChunk = 32 / elementSize;
    if (!Number.isInteger(elementsPerChunk)) {
      throw new Error("Unable to iterate over unaligned basic array");
    }
    let i = 0;
    for (const node of target.iterateNodesAtDepth(this.depth(), 0, Math.ceil(length / elementsPerChunk))) {
      const chunk = node.root;
      for (let j = 0; j < elementsPerChunk && i < length; j++) {
        const elementValue = elementType.fromBytes(chunk, (i % elementsPerChunk) * elementSize);
        fn(elementValue, i);
        i++;
      }
    }
  }
  readOnlyMap<T>(target: Tree, fn: (value: unknown, index: number) => T): T[] {
    const elementType = this._type.elementType;
    const length = this.getLength(target);
    const elementSize = this._type.elementType.size();
    const elementsPerChunk = 32 / elementSize;
    if (!Number.isInteger(elementsPerChunk)) {
      throw new Error("Unable to iterate over unaligned basic array");
    }
    const result: T[] = [];
    let i = 0;
    for (const node of target.iterateNodesAtDepth(this.depth(), 0, Math.ceil(length / elementsPerChunk))) {
      const chunk = node.root;
      for (let j = 0; j < elementsPerChunk && i < length; j++) {
        const elementValue = elementType.fromBytes(chunk, (i % elementsPerChunk) * elementSize);
        result.push(fn(elementValue, i));
        i++;
      }
    }
    return result;
  }
}

export class CompositeArrayTreeHandler<T extends ArrayLike<object>> extends TreeHandler<T> {
  protected _type: CompositeArrayType<T>;
  fromStructural(value: T): Tree {
    const contents: Node[] = [];
    value.forEach((element) => contents.push(this._type.elementType.tree.fromStructural(element).rootNode));
    return new Tree(subtreeFillToContents(contents, this.depth()));
  }
  size(target: Tree): number {
    if (this._type.elementType.isVariableSize()) {
      let s = 0;
      for (let i = 0; i < this.getLength(target); i++) {
        s += this._type.elementType.tree.size(this.getSubtreeAtChunk(target, i)) + 4;
      }
      return s;
    } else {
      return this._type.elementType.tree.size(null) * this.getLength(target);
    }
  }
  toBytes(target: Tree, output: Uint8Array, offset: number): number {
    const length = this.getLength(target);
    if (this._type.elementType.isVariableSize()) {
      let variableIndex = offset + length * 4;
      const fixedSection = new DataView(output.buffer, output.byteOffset + offset, length * 4);
      let i = 0;
      for (const node of target.iterateNodesAtDepth(this.depth(), i, length)) {
        // write offset
        fixedSection.setUint32(i * 4, variableIndex - offset, true);
        // write serialized element to variable section
        variableIndex = this._type.elementType.tree.toBytes(new Tree(node), output, variableIndex);
        i++;
      }
      return variableIndex;
    } else {
      let index = offset;
      let i = 0;
      for (const node of target.iterateNodesAtDepth(this.depth(), i, length)) {
        index = this._type.elementType.tree.toBytes(new Tree(node), output, index);
        i++;
      }
      return index;
    }
  }
  gindexOfProperty(prop: PropertyKey): Gindex {
    return this.gindexOfChunk(prop as number);
  }
  typeOfProperty(prop: PropertyKey): CompositeType<object> {
    return this._type.elementType;
  }
  getLength(target: Tree): number {
    throw new Error("Not implemented");
  }
  getValueAtChunk(target: Tree, index: number): PropOfCompositeTreeBacked<T, number> {
    return this._type.elementType.tree.asTreeBacked(this.getSubtreeAtChunk(target, index)) as PropOfCompositeTreeBacked<
      T,
      number
    >;
  }
  getProperty<V extends keyof T>(target: Tree, property: V): PropOfCompositeTreeBacked<T, V> {
    const length = this.getLength(target);
    if (property === "length") {
      return (length as unknown) as PropOfCompositeTreeBacked<T, V>;
    }
    const index = Number(property);
    if (Number.isNaN(index as number)) {
      return undefined;
    }
    if (index >= length) {
      return undefined;
    }
    return (this.getValueAtChunk(target, index) as unknown) as PropOfCompositeTreeBacked<T, V>;
  }
  setProperty(target: Tree, property: number, value: T[number], expand = false): boolean {
    const chunkGindex = this.gindexOfChunk(property);
    if (isTreeBacked(value)) {
      target.setSubtree(chunkGindex, value.tree());
    } else {
      target.setSubtree(chunkGindex, this._type.elementType.tree.fromStructural(value), expand);
    }
    return true;
  }
  set(target: Tree, property: number, value: T[number], expand = false): boolean {
    return this.setProperty(target, property, value, expand);
  }
  deleteProperty(target: Tree, property: number): boolean {
    return this.setProperty(target, property, this._type.elementType.tree.defaultValue());
  }
  ownKeys(target: Tree): string[] {
    return Array.from({length: this.getLength(target)}, (_, i) => String(i));
  }
  *[Symbol.iterator](target: Tree): Iterable<PropOfCompositeTreeBacked<T, number>> {
    const elementTreeHandler = this._type.elementType.tree;
    for (const gindex of iterateAtDepth(this.depth(), BigInt(0), BigInt(this.getLength(target)))) {
      yield elementTreeHandler.asTreeBacked(target.getSubtree(gindex)) as PropOfCompositeTreeBacked<T, number>;
    }
  }
  find(
    target: Tree,
    fn: (value: PropOfCompositeTreeBacked<T, number>, index: number, array: ArrayLike<unknown>) => boolean
  ): PropOfCompositeTreeBacked<T, number> | undefined {
    const value = this.asTreeBacked(target);
    const elementTreeHandler = this._type.elementType.tree;
    let i = 0;
    for (const gindex of iterateAtDepth(this.depth(), BigInt(0), BigInt(this.getLength(target)))) {
      const elementValue = elementTreeHandler.asTreeBacked(target.getSubtree(gindex)) as PropOfCompositeTreeBacked<
        T,
        number
      >;
      if (fn(elementValue, i, value)) {
        return elementValue;
      }
      i++;
    }
    return undefined;
  }
  findIndex(
    target: Tree,
    fn: (value: PropOfCompositeTreeBacked<T, number>, index: number, array: ArrayLike<unknown>) => boolean
  ): number {
    const value = this.asTreeBacked(target);
    const elementTreeHandler = this._type.elementType.tree;
    let i = 0;
    for (const gindex of iterateAtDepth(this.depth(), BigInt(0), BigInt(this.getLength(target)))) {
      const elementValue = elementTreeHandler.asTreeBacked(target.getSubtree(gindex)) as PropOfCompositeTreeBacked<
        T,
        number
      >;
      if (fn(elementValue, i, value)) {
        return i;
      }
      i++;
    }
    return -1;
  }
  forEach(target: Tree, fn: (value: unknown, index: number, array: ArrayLike<object>) => void): void {
    const value = this.asTreeBacked(target);
    const elementTreeHandler = this._type.elementType.tree;
    let i = 0;
    for (const gindex of iterateAtDepth(this.depth(), BigInt(0), BigInt(this.getLength(target)))) {
      const elementValue = elementTreeHandler.asTreeBacked(target.getSubtree(gindex)) as PropOfCompositeTreeBacked<
        T,
        number
      >;
      fn(elementValue, i, value);
      i++;
    }
  }
  readOnlyForEach(target: Tree, fn: (value: unknown, index: number) => void): void {
    const elementTreeHandler = this._type.elementType.tree;
    const length = this.getLength(target);
    let i = 0;
    for (const node of target.iterateNodesAtDepth(this.depth(), 0, length)) {
      const elementValue = elementTreeHandler.asTreeBacked(new Tree(node));
      fn(elementValue, i);
      i++;
    }
  }
  readOnlyMap<T>(target: Tree, fn: (value: unknown, index: number) => T): T[] {
    const elementTreeHandler = this._type.elementType.tree;
    const length = this.getLength(target);
    const result: T[] = [];
    let i = 0;
    for (const node of target.iterateNodesAtDepth(this.depth(), 0, length)) {
      const elementValue = elementTreeHandler.asTreeBacked(new Tree(node));
      result.push(fn(elementValue, i));
      i++;
    }
    return result;
  }
}
