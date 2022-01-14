import {LeafNode, Node, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {BasicType} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */

export class NoneType extends BasicType<null> {
  readonly typeName = "none";
  // Immutable characteristics
  readonly byteLength = 0;
  readonly itemsPerChunk = 32;
  readonly fixedSize = 0;
  readonly minSize = 0;
  readonly maxSize = 0;

  readonly defaultValue = null;

  // bytes serdes

  value_serializeToBytes(output: Uint8Array, offset: number, value: null): number {
    return offset;
  }

  value_deserializeFromBytes(data: Uint8Array, start: number): null {
    return null;
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    return offset;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    return zeroNode(0);
  }

  // Fast tree opts

  tree_getFromNode(leafNode: LeafNode): null {
    return null;
  }

  tree_setToNode(leafNode: LeafNode, value: null): void {
    return;
  }

  tree_getFromPackedNode(leafNode: LeafNode, index: number): null {
    return null;
  }

  tree_setToPackedNode(leafNode: LeafNode, index: number, value: null): void {
    return;
  }

  // JSON

  fromJson(json: unknown): null {
    if (json !== null) {
      throw Error("JSON invalid type none must be null");
    }
    return null;
  }

  toJson(value: null): unknown {
    return null;
  }
}
