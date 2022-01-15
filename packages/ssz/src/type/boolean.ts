import {LeafNode, Node, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType, ByteViews} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering */

export class BooleanType extends BasicType<boolean> {
  readonly typeName = "boolean";
  // Immutable characteristics
  readonly byteLength = 1;
  readonly itemsPerChunk = 32;
  readonly fixedSize = 1;
  readonly minSize = 1;
  readonly maxSize = 1;

  readonly defaultValue = false;

  // bytes serdes

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
        throw new Error(`Invalid boolean value: ${data.uint8Array[start]}`);
    }
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    (node as LeafNode).writeToBytes(output, offset, 1);
    return offset + 1;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const size = end - start;
    if (size !== 1) {
      throw Error(`Invalid size ${size} expected 1`);
    }

    // TODO: Optimize and validate data
    const leafNode = new LeafNode(zeroNode(0));
    leafNode.setUint(4, 0, data[start]);
    return leafNode;
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
