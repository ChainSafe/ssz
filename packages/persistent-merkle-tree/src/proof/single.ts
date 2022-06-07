import {BranchNode, LeafNode, Node} from "../node";
import {Gindex, gindexIterator} from "../gindex";

export const ERR_INVALID_NAV = "Invalid tree navigation";

export function createSingleProof(rootNode: Node, index: Gindex): [Uint8Array, Uint8Array[]] {
  const witnesses: Uint8Array[] = [];
  let node = rootNode;
  for (const i of gindexIterator(index)) {
    if (i) {
      if (node.isLeaf()) throw new Error(ERR_INVALID_NAV);
      witnesses.push(node.left.root);
      node = node.right;
    } else {
      if (node.isLeaf()) throw new Error(ERR_INVALID_NAV);
      witnesses.push(node.right.root);
      node = node.left;
    }
  }
  return [node.root, witnesses.reverse()];
}

export function createNodeFromSingleProof(gindex: Gindex, leaf: Uint8Array, witnesses: Uint8Array[]): Node {
  let node: Node = LeafNode.fromRoot(leaf);
  const w = witnesses.slice().reverse();
  while (gindex > 1) {
    const sibling = LeafNode.fromRoot(w.pop() as Uint8Array);
    if (gindex % BigInt(2) === BigInt(0)) {
      node = new BranchNode(node, sibling);
    } else {
      node = new BranchNode(sibling, node);
    }
    gindex = gindex / BigInt(2);
  }
  return node;
}

export function computeSingleProofSerializedLength(witnesses: Uint8Array[]): number {
  return 1 + 2 + witnesses.length * 32;
}

export function serializeSingleProof(
  output: Uint8Array,
  byteOffset: number,
  gindex: Gindex,
  leaf: Uint8Array,
  witnesses: Uint8Array[]
): void {
  const writer = new DataView(output.buffer, output.byteOffset, output.byteLength);
  writer.setUint16(byteOffset, Number(gindex), true);
  const leafStartIndex = byteOffset + 2;
  output.set(leaf, leafStartIndex);
  const witCountStartIndex = leafStartIndex + 32;
  writer.setUint16(witCountStartIndex, witnesses.length, true);
  const witnessesStartIndex = witCountStartIndex + 2;
  for (let i = 0; i < witnesses.length; i++) {
    output.set(witnesses[i], i * 32 + witnessesStartIndex);
  }
}

export function deserializeSingleProof(data: Uint8Array, byteOffset: number): [Gindex, Uint8Array, Uint8Array[]] {
  const reader = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const gindex = reader.getUint16(byteOffset, true);
  const leafStartIndex = byteOffset + 2;
  const leaf = data.subarray(leafStartIndex, 32 + leafStartIndex);
  const witCountStartIndex = leafStartIndex + 32;
  const witCount = reader.getUint16(witCountStartIndex, true);
  const witnessesStartIndex = witCountStartIndex + 2;
  const witnesses = Array.from({length: witCount}, (_, i) =>
    data.subarray(i * 32 + witnessesStartIndex, (i + 1) * 32 + witnessesStartIndex)
  );
  return [BigInt(gindex), leaf, witnesses];
}
