import {LeafNode, Node} from "@chainsafe/persistent-merkle-tree";
import {BasicType} from "../abstract";

/* eslint-disable @typescript-eslint/member-ordering */

export class UintNumberType extends BasicType<number> {
  // Immutable characteristics
  readonly byteLength: number;
  readonly itemsPerChunk: number;
  readonly fixedLen: number;
  readonly minLen: number;
  readonly maxLen: number;

  constructor(byteLength: number, readonly infinityWhenBig?: boolean, readonly setBitwise?: boolean) {
    super();
    this.byteLength = byteLength;
    this.itemsPerChunk = 32 / this.byteLength;
    this.fixedLen = byteLength;
    this.minLen = byteLength;
    this.maxLen = byteLength;
  }

  readonly defaultValue: number = 0;

  // Serialization + deserialization

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): number {
    const size = end - start;
    if (size !== this.byteLength) {
      throw Error(`Invalid size ${size} expected ${this.byteLength}`);
    }

    let isInfinity = true;
    let output = 0;
    for (let i = 0; i < this.byteLength; i++) {
      output += data[start + i] * 2 ** (8 * i);
      if (data[start + i] !== 0xff) {
        isInfinity = false;
      }
    }
    if (this.infinityWhenBig && isInfinity) {
      return Infinity;
    }
    return output;
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: number): number {
    if (this.byteLength > 6 && value === Infinity) {
      for (let i = offset; i < offset + this.byteLength; i++) {
        output[i] = 0xff;
      }
    } else {
      let v = value;
      const MAX_BYTE = 0xff;
      for (let i = 0; i < this.byteLength; i++) {
        output[offset + i] = v & MAX_BYTE;
        v = Math.floor(v / 256);
      }
    }
    return offset + this.byteLength;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const size = end - start;
    if (size !== this.byteLength) {
      throw Error(`Invalid size ${size} expected ${this.byteLength}`);
    }

    // TODO: Optimize
    const chunk = new Uint8Array(32);
    chunk.set(data.slice(start, end));
    return new LeafNode(chunk);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    (node as LeafNode).writeToBytes(output, offset, this.byteLength);
    return offset + this.byteLength;
  }

  // Fast Tree access

  tree_getFromNode(leafNode: LeafNode): number {
    return leafNode.getUint(this.byteLength, 0);
  }

  /** Mutates node to set value */
  tree_setToNode(leafNode: LeafNode, value: number): void {
    this.tree_setToPackedNode(leafNode, 0, value);
  }

  /** EXAMPLE of `tree_getFromNode` */
  tree_getFromPackedNode(leafNode: LeafNode, index: number): number {
    const offsetBytes = this.byteLength * (index % this.itemsPerChunk);
    return leafNode.getUint(this.byteLength, offsetBytes);
  }

  /** Mutates node to set value */
  tree_setToPackedNode(leafNode: LeafNode, index: number, value: number): void {
    const offsetBytes = this.byteLength * (index % this.itemsPerChunk);

    // TODO: Benchmark the cost of this if, and consider using a different class
    if (this.setBitwise) {
      leafNode.bitwiseOrUint(this.byteLength, offsetBytes, value);
    } else {
      leafNode.setUint(this.byteLength, offsetBytes, value);
    }
  }

  // JSON

  fromJson(data: unknown): number {
    if (typeof data !== "number") {
      throw Error(`JSON invalid type ${typeof data} expected number`);
    }
    return data;
  }
}

export class UintBigintType extends BasicType<bigint> {
  // Immutable characteristics
  readonly byteLength: number;
  readonly itemsPerChunk: number;
  readonly fixedLen: number;
  readonly minLen: number;
  readonly maxLen: number;

  constructor(byteLength: number, readonly setBitwise?: boolean) {
    super();
    this.byteLength = byteLength;
    this.itemsPerChunk = 32 / this.byteLength;
    this.fixedLen = byteLength;
    this.minLen = byteLength;
    this.maxLen = byteLength;
  }

  readonly defaultValue = BigInt(0);

  // Serialization + deserialization

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): bigint {
    const size = end - start;
    if (size !== this.byteLength) {
      throw Error(`Invalid size ${size} expected ${this.byteLength}`);
    }

    let output = BigInt(0);
    for (let i = 0; i < this.byteLength; i++) {
      output += BigInt(data[start + i] * 2 ** (8 * i));
    }

    return output;
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: bigint): number {
    let v = value;
    // TODO: Not-optimized, copy pasted from UintNumberType
    const MAX_BYTE = BigInt(0xff);
    for (let i = 0; i < this.byteLength; i++) {
      output[offset + i] = Number(v & MAX_BYTE);
      v = v / BigInt(256);
    }

    return offset + this.byteLength;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const size = end - start;
    if (size !== this.byteLength) {
      throw Error(`Invalid size ${size} expected ${this.byteLength}`);
    }

    // TODO: Optimize
    const chunk = new Uint8Array(32);
    chunk.set(data.slice(start, end));
    return new LeafNode(chunk);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    (node as LeafNode).writeToBytes(output, offset, this.byteLength);
    return offset + this.byteLength;
  }

  // Fast Tree access

  tree_getFromNode(leafNode: LeafNode): bigint {
    return leafNode.getUintBigint(this.byteLength, 0);
  }

  /** Mutates node to set value */
  tree_setToNode(leafNode: LeafNode, value: bigint): void {
    this.tree_setToPackedNode(leafNode, 0, value);
  }

  /** EXAMPLE of `tree_getFromNode` */
  tree_getFromPackedNode(leafNode: LeafNode, index: number): bigint {
    const offsetBytes = this.byteLength * (index % this.itemsPerChunk);
    return leafNode.getUintBigint(this.byteLength, offsetBytes);
  }

  /** Mutates node to set value */
  tree_setToPackedNode(leafNode: LeafNode, index: number, value: bigint): void {
    const offsetBytes = this.byteLength * (index % this.itemsPerChunk);
    // TODO: Not-optimized, copy pasted from UintNumberType
    leafNode.setUintBigint(this.byteLength, offsetBytes, value);
  }

  // JSON

  fromJson(data: unknown): bigint {
    if (typeof data === "bigint") {
      return data;
    } else if (typeof data === "string" || typeof data === "number") {
      return BigInt(data);
    } else {
      throw Error(`JSON invalid type ${typeof data} expected bigint`);
    }
  }
}
