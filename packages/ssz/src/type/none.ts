import {LeafNode, Node, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {ByteViews} from "./abstract.js";
import {BasicType} from "./basic.js";

export class NoneType extends BasicType<null> {
  readonly typeName = "none";
  readonly byteLength = 0;
  readonly itemsPerChunk = 32;
  readonly fixedSize = 0;
  readonly minSize = 0;
  readonly maxSize = 0;

  defaultValue(): null {
    return null;
  }

  // bytes serdes

  value_serializeToBytes(_output: ByteViews, offset: number, _value: null): number {
    return offset;
  }

  value_deserializeFromBytes(_data: ByteViews, _start: number): null {
    return null;
  }

  tree_serializeToBytes(_output: ByteViews, offset: number, _node: Node): number {
    return offset;
  }

  tree_deserializeFromBytes(_data: ByteViews, _start: number, _end: number): Node {
    return zeroNode(0);
  }

  // Fast tree opts

  tree_getFromNode(_leafNode: LeafNode): null {
    return null;
  }

  tree_setToNode(_leafNode: LeafNode, _value: null): void {
    return;
  }

  tree_getFromPackedNode(_leafNode: LeafNode, _index: number): null {
    return null;
  }

  tree_setToPackedNode(_leafNode: LeafNode, _index: number, _value: null): void {
    return;
  }

  // JSON

  fromJson(json: unknown): null {
    if (json !== null) {
      throw Error("JSON invalid type none must be null");
    }
    return null;
  }

  toJson(_value: null): unknown {
    return null;
  }
}
