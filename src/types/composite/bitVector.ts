import {BitVector, Json} from "../../interface";
import {BasicVectorType} from "./vector";
import {booleanType} from "../basic";
import {isTypeOf, Type} from "../type";
import {fromHexString, toHexString, getByteBits} from "../../util/byteArray";
import {Tree} from "@chainsafe/persistent-merkle-tree";

export interface IBitVectorOptions {
  length: number;
}

export const BITVECTOR_TYPE = Symbol.for("ssz/BitVectorType");

export function isBitVectorType(type: Type<unknown>): type is BitVectorType {
  return isTypeOf(type, BITVECTOR_TYPE);
}

export class BitVectorType extends BasicVectorType<BitVector> {
  constructor(options: IBitVectorOptions) {
    super({elementType: booleanType, ...options});
    this._typeSymbols.add(BITVECTOR_TYPE);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_getLength(value: BitVector): number {
    return this.length;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_getByteLength(value: BitVector): number {
    return Math.ceil(this.length / 8);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_getSerializedLength(value: BitVector): number {
    return Math.ceil(this.length / 8);
  }

  getMaxSerializedLength(): number {
    return this.struct_getSerializedLength(null);
  }

  getMinSerializedLength(): number {
    return this.struct_getSerializedLength(null);
  }

  struct_getChunkCount(value: BitVector): number {
    return Math.ceil(this.struct_getLength(value) / 256);
  }

  struct_getByte(value: BitVector, index: number): number {
    const firstBitIndex = index * 8;
    const lastBitIndex = Math.min(firstBitIndex + 7, value.length - 1);
    let bitstring = "0b";
    for (let i = lastBitIndex; i >= firstBitIndex; i--) {
      bitstring += value[i] ? "1" : "0";
    }
    return Number(bitstring);
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): BitVector {
    this.bytes_validate(data, start, end);
    if (end - start !== this.size(null)) {
      throw new Error("Invalid bitvector: length not equal to vector length");
    }
    const value = [];
    for (let i = start; i < end - 1; i++) {
      value.push(...getByteBits(data, i));
    }
    const lastBitLength = this.length % 8;
    if (!lastBitLength) {
      // vector takes up the whole byte, no need for checks
      value.push(...getByteBits(data, end - 1));
    } else {
      const lastBits = getByteBits(data, end - 1);
      if (lastBits.slice(lastBitLength).some((b) => b)) {
        throw new Error("Invalid bitvector: nonzero bits past length");
      }
      value.push(...lastBits.slice(0, lastBitLength));
    }
    return value as BitVector;
  }

  struct_serializeToBytes(value: BitVector, output: Uint8Array, offset: number): number {
    const byteLength = this.struct_getByteLength(value);
    for (let i = 0; i < byteLength; i++) {
      output[offset + i] = this.struct_getByte(value, i);
    }
    return offset + byteLength;
  }

  struct_getRootAtChunkIndex(value: BitVector, index: number): Uint8Array {
    const output = new Uint8Array(32);
    const byteLength = Math.min(32, this.struct_getByteLength(value) - index);
    for (let i = 0; i < byteLength; i++) {
      output[i] = this.struct_getByte(value, i + index);
    }
    return output;
  }

  struct_convertFromJson(data: Json): BitVector {
    const bytes = fromHexString(data as string);
    return this.fromBytes(bytes, 0, bytes.length);
  }

  struct_convertToJson(value: BitVector): Json {
    return toHexString(this.serialize(value));
  }

  tree_getByteLength(target: Tree): number {
    return Math.ceil(this.tree_getLength(target) / 8);
  }

  tree_getSerializedLength(target: Tree): number {
    return this.tree_getByteLength(target);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    // mask last byte to ensure it doesn't go over length
    const lastByte = data[end - 1];
    const mask = (0xff << this.length % 8) & 0xff;
    if (lastByte & mask) {
      throw new Error("Invalid deserialized bitvector length");
    }
    return super.tree_deserializeFromBytes(data, start, end);
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

  tree_setProperty(target: Tree, property: number, value: boolean): boolean {
    const chunkGindex = this.getGindexAtChunkIndex(this.getChunkIndex(property));
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

  getMaxChunkCount(): number {
    return Math.ceil(this.length / 256);
  }
}
