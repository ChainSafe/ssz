import {LeafNode, subtreeFillToContents, Tree, Node, Gindex} from "@chainsafe/persistent-merkle-tree";
import {cloneHashObject} from "../../util/hash";
import {Number64UintType} from "../basic";

export function number64_getValueAtIndex(
  target: Tree,
  chunkGindex: Gindex,
  numberOffsetInChunk: number,
  elementType: Number64UintType,
): number {
  // a special optimization for uint64
  // const hashObject = this.tree_getHashObjectAtChunkIndex(target, this.getChunkIndex(index));
  const hashObject = target.getHashObject(chunkGindex);
  return elementType.struct_deserializeFromHashObject(hashObject, numberOffsetInChunk);
}

export function number64_setValueAtIndex(
  target: Tree,
  chunkGindex: Gindex,
  numberOffsetInChunk: number,
  value: number,
  elementType: Number64UintType,
  expand = false
): boolean {
  // const chunkGindex = this.getGindexAtChunkIndex(this.getChunkIndex(index));
  // a special optimization for uint64
  const hashObject = cloneHashObject(target.getHashObject(chunkGindex));
  // // 4 items per chunk
  // const offset = index % 4;
  elementType.struct_serializeToHashObject(value as number, hashObject, numberOffsetInChunk);
  target.setHashObject(chunkGindex, hashObject, expand);
  return true;
}

/**
 * delta > 0 means an increasement, delta < 0 means a decreasement
 * returns the new value
 **/
export function number64_applyUint64Delta(
  target: Tree,
  chunkGindex: Gindex,
  numberOffsetInChunk: number,
  delta: number,
  elementType: Number64UintType
): number {
  // NO NEED
  // if (!this.isNumber64UintType) {
  //   throw new Error("tree_increaseUint64 is only for Number64UintArray type");
  // }
  // const elementType = this.elementType as Number64UintType;
  // const chunkGindex = this.getGindexAtChunkIndex(this.getChunkIndex(index));
  const hashObject = cloneHashObject(target.getHashObject(chunkGindex));
  // 4 items per chunk
  // const offset = index % 4;
  let value = elementType.struct_deserializeFromHashObject(hashObject, numberOffsetInChunk);
  value += delta;
  if (value < 0) value = 0;
  elementType.struct_serializeToHashObject(value as number, hashObject, numberOffsetInChunk);
  target.setHashObject(chunkGindex, hashObject);
  return value;
}

/**
 * delta > 0 means an increasement, delta < 0 means a decreasement
 * returns the new root node and new values
 **/
export function number64_newTreeFromUint64Deltas(
  target: Tree,
  deltas: number[],
  chunkDepth: number,
  elementType: Number64UintType
): [Node, number[]] {
  // NONEED
  // if (!this.isNumber64UintType) {
  //   throw new Error("tree_newTreeFromUint64Deltas is only for Number64UintArray type");
  // }
  const length = deltas.length;
  // TODO: validate in main class
  // if (length !== this.tree_getLength(target)) {
  //   throw new Error(`Expect delta length ${this.tree_getLength(target)}, actual ${deltas.length}`);
  // }
  // const elementType = this.elementType as Number64UintType;
  let nodeIdx = 0;
  const newLeafNodes: LeafNode[] = [];
  const newValues: number[] = [];
  const chunkCount = Math.ceil(length / 4);
  const currentNodes = target.getNodesAtDepth(chunkDepth, 0, chunkCount);
  for (const node of currentNodes) {
    const hashObject = cloneHashObject(node);
    // 4 items per chunk
    for (let offset = 0; offset < 4; offset++) {
      const index = nodeIdx * 4 + offset;
      if (index >= length) break;
      let value = elementType.struct_deserializeFromHashObject(hashObject, offset) + deltas[index];
      if (value < 0) value = 0;
      newValues.push(value);
      // mutate hashObject at offset
      elementType.struct_serializeToHashObject(value, hashObject, offset);
    }
    newLeafNodes.push(new LeafNode(hashObject));
    nodeIdx++;
  }
  const newRootNode = subtreeFillToContents(newLeafNodes, chunkDepth);
  return [newRootNode, newValues];
}
