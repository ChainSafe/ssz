import {LeafNode, Node} from "@chainsafe/persistent-merkle-tree";
import {ByteViews} from "./abstract";
import {BasicType} from "./basic";

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * Boolean: True or False
 * - Notation: `boolean`
 */
export class BooleanType extends BasicType<boolean> {
  readonly typeName = "boolean";
  readonly byteLength = 1;
  readonly itemsPerChunk = 32;
  readonly fixedSize = 1;
  readonly minSize = 1;
  readonly maxSize = 1;

  readonly defaultValue = false;

  // Serialization + deserialization

  value_serializeToBytes(output: ByteViews, offset: number, value: boolean): number {
    output.uint8Array[offset] = value ? 1 : 0;
    return offset + 1;
  }

  value_deserializeFromBytes(data: ByteViews, start: number): boolean {
    switch (data.uint8Array[start]) {
      case 1:
        return true;
      case 0:
        return false;
      default:
        throw new Error(`Boolean: invalid value: ${data.uint8Array[start]}`);
    }
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    // TODO: Assumes LeafNode has 4 byte uints are primary unit
    output.uint8Array[offset] = (node as LeafNode).getUint(4, 0);
    return offset + 1;
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const size = end - start;
    if (size !== 1) {
      throw Error(`Boolean: invalid size ${size} expected 1`);
    }

    // TODO: Optimize and validate data
    const value = data.uint8Array[start];
    if (value > 1) {
      throw Error(`Boolean: invalid value ${value}`);
    }

    return LeafNode.fromUint32(value);
  }

  // Fast tree opts

  tree_getFromNode(leafNode: LeafNode): boolean {
    return leafNode.getUint(4, 0) === 1;
  }

  tree_setToNode(leafNode: LeafNode, value: boolean): void {
    leafNode.setUint(4, 0, value ? 1 : 0);
  }

  tree_getFromPackedNode(leafNode: LeafNode, index: number): boolean {
    const offsetBytes = index % this.itemsPerChunk;
    return leafNode.getUint(1, offsetBytes) !== 0;
  }

  tree_setToPackedNode(leafNode: LeafNode, index: number, value: boolean): void {
    const offsetBytes = index % this.itemsPerChunk;
    leafNode.setUint(1, offsetBytes, value ? 1 : 0);
  }

  // JSON

  fromJson(json: unknown): boolean {
    if (typeof json !== "boolean") {
      throw Error(`JSON invalid type ${typeof json} expected boolean`);
    }
    return json;
  }

  toJson(value: boolean): unknown {
    return value;
  }
}
