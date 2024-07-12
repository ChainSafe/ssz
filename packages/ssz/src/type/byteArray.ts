import {concatGindices, Gindex, Node, toGindex, Tree} from "@chainsafe/persistent-merkle-tree";
import {fromHexString, toHexString, byteArrayEquals} from "../util/byteArray";
import {ByteViews} from "./abstract";
import {CompositeType, LENGTH_GINDEX} from "./composite";

export type ByteArray = Uint8Array;

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * ByteArray: ordered array collection of byte values
 * - Value: `Uint8Array`
 * - View: `Uint8Array`
 * - ViewDU: `Uint8Array`
 *
 * ByteArray is an immutable value which is represented by a Uint8Array for memory efficiency and performance.
 * Note: Consumers of this type MUST never mutate the `Uint8Array` representation of a ByteArray.
 */
export abstract class ByteArrayType extends CompositeType<ByteArray, ByteArray, ByteArray> {
  readonly isViewMutable = false;

  defaultValue(): ByteArray {
    // Since it's a byte array the minSize is bytes is the default size
    return new Uint8Array(this.minSize);
  }

  getView(tree: Tree): ByteArray {
    return this.getViewDU(tree.rootNode);
  }

  getViewDU(node: Node): ByteArray {
    return this.tree_toValue(node);
  }

  commitView(view: ByteArray): Node {
    return this.commitViewDU(view).node;
  }

  // TODO - batch
  commitViewDU(view: ByteArray): {node: Node; change: boolean} {
    const uint8Array = new Uint8Array(this.value_serializedSize(view));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, view);
    const node = this.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
    return {node, change: true};
  }

  cacheOfViewDU(): unknown {
    return;
  }

  // Over-write to prevent serialize + deserialize
  toView(value: ByteArray): ByteArray {
    return value;
  }

  toViewDU(value: ByteArray): ByteArray {
    return value;
  }

  // Serialization + deserialization (only value is generic)

  value_serializeToBytes(output: ByteViews, offset: number, value: ByteArray): number {
    output.uint8Array.set(value, offset);
    return offset + value.length;
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ByteArray {
    this.assertValidSize(end - start);
    return Uint8Array.prototype.slice.call(data.uint8Array, start, end);
  }

  value_toTree(value: ByteArray): Node {
    // this saves 1 allocation of Uint8Array
    const dataView = new DataView(value.buffer, value.byteOffset, value.byteLength);
    return this.tree_deserializeFromBytes({uint8Array: value, dataView}, 0, value.length);
  }

  // Merkleization

  protected getChunkBytes(value: ByteArray): Uint8Array {
    // reallocate this.merkleBytes if needed
    if (value.length > this.chunkBytesBuffer.length) {
      const chunkCount = Math.ceil(value.length / 32);
      const chunkBytes = chunkCount * 32;
      // pad 1 chunk if maxChunkCount is not even
      this.chunkBytesBuffer = chunkCount % 2 === 1 ? new Uint8Array(chunkBytes + 32) : new Uint8Array(chunkBytes);
    }
    return getChunkBytes(value, this.chunkBytesBuffer);
  }

  // Proofs

  getPropertyGindex(): null {
    // Stop navigating below this type. Must only request complete data
    return null;
  }

  getPropertyType(): never {
    throw Error("Must only request ByteArray complete data");
  }

  getIndexProperty(): never {
    throw Error("Must only request ByteArray complete data");
  }

  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    return {node, done: true};
  }

  tree_getLeafGindices(rootGindex: bigint, rootNode?: Node): Gindex[] {
    const byteLen = this.tree_getByteLen(rootNode);
    const chunkCount = Math.ceil(byteLen / 32);
    const startIndex = concatGindices([rootGindex, toGindex(this.depth, BigInt(0))]);
    const gindices = new Array<Gindex>(chunkCount);
    for (let i = 0, gindex = startIndex; i < chunkCount; i++, gindex++) {
      gindices[i] = gindex;
    }

    // include the length chunk
    if (this.isList) {
      gindices.push(concatGindices([rootGindex, LENGTH_GINDEX]));
    }

    return gindices;
  }

  abstract tree_getByteLen(node?: Node): number;

  // JSON

  fromJson(json: unknown): ByteArray {
    const value = fromHexString(json as string);
    this.assertValidSize(value.length);
    return value;
  }

  toJson(value: ByteArray): unknown {
    return toHexString(value);
  }

  // ByteArray is immutable
  clone(value: ByteArray): ByteArray {
    return value;
  }

  equals(a: Uint8Array, b: Uint8Array): boolean {
    return byteArrayEquals(a, b);
  }

  protected abstract assertValidSize(size: number): void;
}

export function getChunkBytes(data: Uint8Array, merkleBytesBuffer: Uint8Array): Uint8Array {
  if (data.length > merkleBytesBuffer.length) {
    throw new Error(`data length ${data.length} exceeds merkleBytesBuffer length ${merkleBytesBuffer.length}`);
  }

  merkleBytesBuffer.set(data);
  const valueLen = data.length;
  const chunkByteLen = Math.ceil(valueLen / 64) * 64;
  // all padding bytes must be zero, this is similar to set zeroHash(0)
  merkleBytesBuffer.subarray(valueLen, chunkByteLen).fill(0);
  return merkleBytesBuffer.subarray(0, chunkByteLen);
}
