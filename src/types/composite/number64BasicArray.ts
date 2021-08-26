import {LeafNode, subtreeFillToContents, Tree, Node, Gindex} from "@chainsafe/persistent-merkle-tree";
import {cloneHashObject} from "../../util/hash";
import {Number64UintType} from "../basic";

/** For Number64UintType, it takes 64 / 8 = 8 bytes per item, each chunk has 32 bytes = 4 items */
const NUM_ITEMS_PER_CHUNK = 4;

export function number64_getValueAtIndex(
  target: Tree,
  chunkGindex: Gindex,
  numberOffsetInChunk: number,
  elementType: Number64UintType
): number {
  // a special optimization for uint64
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
  // a special optimization for uint64
  const hashObject = cloneHashObject(target.getHashObject(chunkGindex));
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
  const hashObject = cloneHashObject(target.getHashObject(chunkGindex));
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
  const length = deltas.length;
  let nodeIdx = 0;
  const newLeafNodes: LeafNode[] = [];
  const newValues: number[] = [];
  const chunkCount = Math.ceil(length / NUM_ITEMS_PER_CHUNK);
  const currentNodes = target.getNodesAtDepth(chunkDepth, 0, chunkCount);
  for (let i = 0; i < currentNodes.length; i++) {
    const node = currentNodes[i];
    const hashObject = cloneHashObject(node);
    for (let offset = 0; offset < NUM_ITEMS_PER_CHUNK; offset++) {
      const index = nodeIdx * NUM_ITEMS_PER_CHUNK + offset;
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
