import {LeafNode, Node, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering */

export class BooleanType extends BasicType<boolean> {
  // Immutable characteristics
  readonly byteLength = 1;
  readonly fixedLen = 1;
  readonly minLen = 1;
  readonly maxLen = 1;

  readonly defaultValue = false;

  // bytes serdes

  value_deserializeFromBytes(data: Uint8Array, start: number): boolean {
    switch (data[start]) {
      case 1:
        return true;
      case 0:
        return false;
      default:
        throw new Error(`Invalid boolean value: ${data[start]}`);
    }
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: boolean): number {
    output[offset] = value ? 1 : 0;
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

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    (node as LeafNode).writeToBytes(output, offset, 1);
    return offset + 1;
  }

  // Fast tree opts

  tree_getFromNode(leafNode: LeafNode): boolean {
    return leafNode.getUint(4, 0) === 1;
  }

  tree_setToNode(leafNode: LeafNode, value: boolean): void {
    leafNode.setUint(4, 0, value ? 1 : 0);
  }

  tree_getFromPackedNode(): never {
    throw Error("Not implemented");
  }

  tree_setToPackedNode(): never {
    throw Error("Not implemented");
  }

  // JSON

  fromJson(data: unknown): boolean {
    if (typeof data !== "boolean") {
      throw Error(`JSON invalid type ${typeof data} expected boolean`);
    }
    return data;
  }
}
