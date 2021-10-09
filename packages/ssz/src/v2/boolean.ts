import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering */

export class BooleanType extends BasicType<boolean> {
  // Immutable characteristics
  readonly byteLength: number;
  readonly itemsPerChunk: number;

  constructor() {
    super();
    this.byteLength = 1;
    this.itemsPerChunk = 32 / this.byteLength;
  }

  get defaultValue(): boolean {
    return false;
  }

  // bytes serdes

  struct_serializeToBytes(value: boolean, output: Uint8Array, offset: number): number {
    output[offset] = value ? 1 : 0;
    return offset + 1;
  }

  struct_deserializeFromBytes(data: Uint8Array, offset: number): boolean {
    switch (data[offset]) {
      case 1:
        return true;
      case 0:
        return false;
      default:
        throw new Error(`Invalid boolean value: ${data[offset]}`);
    }
  }

  // Fast tree opts

  getValueFromNode(leafNode: LeafNode): boolean {
    return leafNode.getUint(4, 0) === 1;
  }

  setValueToNode(leafNode: LeafNode, value: boolean): void {
    leafNode.setUint(4, 0, value ? 1 : 0);
  }
}
