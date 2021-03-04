import {Tree} from "@chainsafe/persistent-merkle-tree";

import {BitVector} from "../../interface";
import {BitVectorType} from "../../types";
import {BasicVectorTreeHandler} from "./vector";

export class BitVectorTreeHandler extends BasicVectorTreeHandler<BitVector> {
  _type: BitVectorType;
  constructor(type: BitVectorType) {
    super(type);
    this._type = type;
  }
  getByteLength(target: Tree): number {
    return Math.ceil(this.getLength(target) / 8);
  }
  size(target: Tree): number {
    return this.getByteLength(target);
  }
  fromBytes(data: Uint8Array, start: number, end: number): Tree {
    // mask last byte to ensure it doesn't go over length
    const lastByte = data[end - 1];
    const mask = (0xff << this._type.length % 8) & 0xff;
    if (lastByte & mask) {
      throw new Error("Invalid deserialized bitvector length");
    }
    return super.fromBytes(data, start, end);
  }
  getBitOffset(index: number): number {
    return index % 8;
  }
  getChunkOffset(index: number): number {
    // Math.floor((index % 256) / 8);
    return (index & 0xff) >> 3;
  }
  getChunkIndex(index: number): number {
    // Math.floor(index / 256);
    return index >> 8;
  }
  getValueAtIndex(target: Tree, index: number): boolean {
    const chunk = this.getRootAtChunk(target, this.getChunkIndex(index));
    const byte = chunk[this.getChunkOffset(index)];
    return !!(byte & (1 << this.getBitOffset(index)));
  }
  setProperty(target: Tree, property: number, value: boolean): boolean {
    const chunkGindex = this.gindexOfChunk(this.getChunkIndex(property));
    const chunk = new Uint8Array(32);
    chunk.set(target.getRoot(chunkGindex));
    const byteOffset = this.getChunkOffset(property);
    if (value) {
      chunk[byteOffset] |= 1 << this.getBitOffset(property);
    } else {
      chunk[byteOffset] &= 0xff ^ (1 << this.getBitOffset(property));
    }
    target.setRoot(chunkGindex, chunk);
    return true;
  }
  readOnlyForEach(target: Tree, fn: (value: unknown, index: number) => void): void {
    const length = this.getLength(target);
    const elementsPerChunk = 256;
    let i = 0;
    for (const node of target.iterateNodesAtDepth(this.depth(), 0, Math.ceil(length / elementsPerChunk))) {
      const chunk = node.root;
      for (let j = 0; j < elementsPerChunk && i < length; j++) {
        const byte = chunk[this.getChunkOffset(i)];
        const elementValue = !!(byte & (1 << this.getBitOffset(i)));
        fn(elementValue, i);
        i++;
      }
    }
  }
  readOnlyMap<T>(target: Tree, fn: (value: unknown, index: number) => T): T[] {
    const length = this.getLength(target);
    const elementsPerChunk = 256;
    const result: T[] = [];
    let i = 0;
    for (const node of target.iterateNodesAtDepth(this.depth(), 0, Math.ceil(length / elementsPerChunk))) {
      const chunk = node.root;
      for (let j = 0; j < elementsPerChunk && i < length; j++) {
        const byte = chunk[this.getChunkOffset(i)];
        const elementValue = !!(byte & (1 << this.getBitOffset(i)));
        result.push(fn(elementValue, i));
        i++;
      }
    }
    return result;
  }
}
