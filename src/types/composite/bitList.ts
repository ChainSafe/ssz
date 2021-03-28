/* eslint-disable @typescript-eslint/camelcase */
import {BitList, Json} from "../../interface";
import {BasicListType} from "./list";
import {booleanType} from "../basic";
import {isTypeOf, Type} from "../type";
import {fromHexString, toHexString} from "../../util/byteArray";
import {iterateAtDepth, Tree} from "@chainsafe/persistent-merkle-tree";

export interface IBitListOptions {
  limit: number;
}

export const BITLIST_TYPE = Symbol.for("ssz/BitListType");

export function isBitListType<T extends BitList = BitList>(type: Type<unknown>): type is BitListType {
  return isTypeOf(type, BITLIST_TYPE);
}

export class BitListType extends BasicListType<BitList> {
  constructor(options: IBitListOptions) {
    super({elementType: booleanType, ...options});
    this._typeSymbols.add(BITLIST_TYPE);
  }
  struct_getByte(value: BitList, index: number): number {
    const firstBitIndex = index * 8;
    const lastBitIndex = Math.min(firstBitIndex + 7, value.length - 1);
    let bitstring = "0b";
    for (let i = lastBitIndex; i >= firstBitIndex; i--) {
      bitstring += value[i] ? "1" : "0";
    }
    return Number(bitstring);
  }
  struct_getLength(value: BitList): number {
    return value.length;
  }
  struct_getByteLength(value: BitList): number {
    return Math.ceil(value.length / 8);
  }
  struct_getSerializedLength(value: BitList): number {
    if (value.length % 8 === 0) {
      return this.struct_getByteLength(value) + 1;
    } else {
      return this.struct_getByteLength(value);
    }
  }
  getMaxSerializedLength(): number {
    return Math.ceil(this.limit / 8) + 1;
  }
  getMinSerializedLength(): number {
    return 1;
  }
  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): BitList {
    this.bytes_validate(data, start, end);
    const value = [];
    const toBool = (c: string): boolean => (c === "1" ? true : false);
    for (let i = start; i < end - 1; i++) {
      let bitstring = data[i].toString(2);
      bitstring = "0".repeat(8 - bitstring.length) + bitstring;
      value.push(...Array.prototype.map.call(bitstring, toBool).reverse());
    }
    const lastByte = data[end - 1];
    if (lastByte === 0) {
      throw new Error("Invalid deserialized bitlist, padding bit required");
    }
    if (lastByte === 1) {
      return value as BitList;
    }
    const lastBits = Array.prototype.map.call(lastByte.toString(2), toBool).reverse();
    const last1 = lastBits.lastIndexOf(true);
    value.push(...lastBits.slice(0, last1));
    if (value.length > this.limit) {
      throw new Error("Invalid deserialized bitlist, length greater than limit");
    }
    return value as BitList;
  }
  struct_serializeToBytes(value: BitList, output: Uint8Array, offset: number): number {
    const byteLength = this.struct_getByteLength(value);
    for (let i = 0; i < byteLength; i++) {
      output[offset + i] = this.struct_getByte(value, i);
    }
    const newOffset = offset + byteLength;
    if (value.length % 8 === 0) {
      output[newOffset] = 1;
      return newOffset + 1;
    } else {
      output[newOffset - 1] |= 1 << value.length % 8;
      return newOffset;
    }
  }
  struct_getRootAtChunkIndex(value: BitList, index: number): Uint8Array {
    const output = new Uint8Array(32);
    const byteLength = Math.min(32, this.struct_getByteLength(value) - index * 32);
    for (let i = 0; i < byteLength; i++) {
      output[i] = this.struct_getByte(value, i + index);
    }
    return output;
  }
  struct_convertFromJson(data: Json): BitList {
    const bytes = fromHexString(data as string);
    return this.struct_deserializeFromBytes(bytes, 0, bytes.length);
  }
  struct_convertToJson(value: BitList): Json {
    return toHexString(this.serialize(value));
  }
  tree_getByteLength(target: Tree): number {
    return Math.ceil(this.tree_getLength(target) / 8);
  }
  tree_getSerializedLength(target: Tree): number {
    const bitLength = this.tree_getLength(target);
    if (bitLength % 8 === 0) {
      return this.tree_getByteLength(target) + 1;
    } else {
      return this.tree_getByteLength(target);
    }
  }
  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const lastByte = data[end - 1];
    if (lastByte === 0) {
      throw new Error("Invalid deserialized bitlist, padding bit required");
    }
    const target = super.tree_deserializeFromBytes(data, start, end);
    const lastGindex = this.getGindexAtChunkIndex(Math.ceil((end - start) / 32) - 1);
    // copy chunk into new memory
    const lastChunk = new Uint8Array(32);
    lastChunk.set(target.getRoot(lastGindex));
    const lastChunkByte = ((end - start) % 32) - 1;
    let length;
    if (lastByte === 1) {
      // zero lastChunkByte
      length = (end - start - 1) * 8;
      lastChunk[lastChunkByte] = 0;
    } else {
      // mask lastChunkByte
      const lastByteBitLength = lastByte.toString(2).length - 1;
      length = (end - start - 1) * 8 + lastByteBitLength;
      const mask = 0xff >> (8 - lastByteBitLength);
      lastChunk[lastChunkByte] &= mask;
    }
    target.setRoot(lastGindex, lastChunk);
    this.tree_setLength(target, length);
    return target;
  }
  tree_serializeToBytes(target: Tree, output: Uint8Array, offset: number): number {
    const newOffset = super.tree_serializeToBytes(target, output, offset);
    const bitLength = this.tree_getLength(target);
    const size = this.tree_getSerializedLength(target);
    // set padding bit
    output[offset + size - 1] |= 1 << bitLength % 8;
    return newOffset;
  }
  getBitOffset(index: number): number {
    return index % 8;
  }
  getChunkOffset(index: number): number {
    return Math.floor((index % 256) / 8);
  }
  getChunkIndex(index: number): number {
    return Math.floor(index / 256);
  }
  tree_getChunkCount(target: Tree): number {
    return Math.ceil(this.tree_getLength(target) / 256);
  }
  *tree_iterateValues(target: Tree): IterableIterator<Tree | unknown> {
    const length = this.tree_getLength(target);
    const chunkCount = this.tree_getChunkCount(target);
    const nodeIterator = target.iterateNodesAtDepth(this.getChunkDepth(), 0, chunkCount);
    let i = 0;
    for (const node of nodeIterator) {
      const chunk = node.root;
      for (let j = 0; j < 256 && i < length; i++, j++) {
        const byte = chunk[this.getChunkOffset(i)];
        yield !!(byte & (1 << this.getBitOffset(i)));
      }
    }
  }
  tree_getValueAtIndex(target: Tree, index: number): boolean {
    const chunk = this.tree_getRootAtChunkIndex(target, this.getChunkIndex(index));
    const byte = chunk[this.getChunkOffset(index)];
    return !!(byte & (1 << this.getBitOffset(index)));
  }
  tree_setValueAtIndex(target: Tree, property: number, value: boolean, expand = false): boolean {
    const chunkGindex = this.getGindexAtChunkIndex(this.getChunkIndex(property));
    const chunk = new Uint8Array(32);
    chunk.set(target.getRoot(chunkGindex));
    const byteOffset = this.getChunkOffset(property);
    if (value) {
      chunk[byteOffset] |= 1 << this.getBitOffset(property);
    } else {
      chunk[byteOffset] &= 0xff ^ (1 << this.getBitOffset(property));
    }
    target.setRoot(chunkGindex, chunk, expand);
    return true;
  }
  getMaxChunkCount(): number {
    return Math.ceil(this.limit / 256);
  }
}
