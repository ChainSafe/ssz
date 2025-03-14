import {Gindex, GindexBitstring, convertGindexToBitstring} from "../gindex.js";
import {BranchNode, LeafNode, Node} from "../node.js";
import {computeProofBitstrings} from "./util.js";

export function computeDescriptor(indices: Gindex[]): Uint8Array {
  // include all helper indices
  const proofBitstrings = new Set<GindexBitstring>();
  const pathBitstrings = new Set<GindexBitstring>();
  for (const leafIndex of indices) {
    const leafBitstring = convertGindexToBitstring(leafIndex);
    proofBitstrings.add(leafBitstring);
    const {branch, path} = computeProofBitstrings(leafBitstring);
    path.delete(leafBitstring);
    for (const pathIndex of path) {
      pathBitstrings.add(pathIndex);
    }
    for (const branchIndex of branch) {
      proofBitstrings.add(branchIndex);
    }
  }
  for (const pathIndex of pathBitstrings) {
    proofBitstrings.delete(pathIndex);
  }

  // sort gindex bitstrings in-order
  const allBitstringsSorted = Array.from(proofBitstrings).sort((a, b) => a.localeCompare(b));

  // convert gindex bitstrings into descriptor bitstring
  let descriptorBitstring = "";
  for (const gindexBitstring of allBitstringsSorted) {
    for (let i = 0; i < gindexBitstring.length; i++) {
      if (gindexBitstring[gindexBitstring.length - 1 - i] === "1") {
        descriptorBitstring += "1".padStart(i + 1, "0");
        break;
      }
    }
  }

  // append zero bits to byte-alignt
  if (descriptorBitstring.length % 8 !== 0) {
    descriptorBitstring = descriptorBitstring.padEnd(
      8 - (descriptorBitstring.length % 8) + descriptorBitstring.length,
      "0"
    );
  }

  // convert descriptor bitstring to bytes
  const descriptor = new Uint8Array(descriptorBitstring.length / 8);
  for (let i = 0; i < descriptor.length; i++) {
    descriptor[i] = Number("0b" + descriptorBitstring.substring(i * 8, (i + 1) * 8));
  }
  return descriptor;
}

function getBit(bitlist: Uint8Array, bitIndex: number): boolean {
  const bit = bitIndex % 8;
  const byteIdx = Math.floor(bitIndex / 8);
  const byte = bitlist[byteIdx];
  switch (bit) {
    case 0:
      return (byte & 0b1000_0000) !== 0;
    case 1:
      return (byte & 0b0100_0000) !== 0;
    case 2:
      return (byte & 0b0010_0000) !== 0;
    case 3:
      return (byte & 0b0001_0000) !== 0;
    case 4:
      return (byte & 0b0000_1000) !== 0;
    case 5:
      return (byte & 0b0000_0100) !== 0;
    case 6:
      return (byte & 0b0000_0010) !== 0;
    case 7:
      return (byte & 0b0000_0001) !== 0;
    default:
      throw new Error("unreachable");
  }
}

export function descriptorToBitlist(descriptor: Uint8Array): boolean[] {
  const bools: boolean[] = [];
  const maxBitLength = descriptor.length * 8;
  let count0 = 0;
  let count1 = 0;
  for (let i = 0; i < maxBitLength; i++) {
    const bit = getBit(descriptor, i);
    bools.push(bit);
    if (bit) {
      count1++;
    } else {
      count0++;
    }
    if (count1 > count0) {
      i++;
      if (i + 7 < maxBitLength) {
        throw new Error("Invalid descriptor: too many bytes");
      }
      for (; i < maxBitLength; i++) {
        const bit = getBit(descriptor, i);
        if (bit) {
          throw new Error("Invalid descriptor: too many 1 bits");
        }
      }
      return bools;
    }
  }
  throw new Error("Invalid descriptor: not enough 1 bits");
}

export function nodeToCompactMultiProof(node: Node, bitlist: boolean[], bitIndex: number): Uint8Array[] {
  if (bitlist[bitIndex]) {
    return [node.root];
  } else {
    const left = nodeToCompactMultiProof(node.left, bitlist, bitIndex + 1);
    const right = nodeToCompactMultiProof(node.right, bitlist, bitIndex + left.length * 2);
    return [...left, ...right];
  }
}

/**
 * Create a Node given a validated bitlist, leaves, and a pointer into the bitlist and leaves
 *
 * Recursive definition
 */
export function compactMultiProofToNode(
  bitlist: boolean[],
  leaves: Uint8Array[],
  pointer: {bitIndex: number; leafIndex: number}
): Node {
  if (bitlist[pointer.bitIndex++]) {
    return LeafNode.fromRoot(leaves[pointer.leafIndex++]);
  } else {
    return new BranchNode(
      compactMultiProofToNode(bitlist, leaves, pointer),
      compactMultiProofToNode(bitlist, leaves, pointer)
    );
  }
}

export function createCompactMultiProof(rootNode: Node, descriptor: Uint8Array): Uint8Array[] {
  return nodeToCompactMultiProof(rootNode, descriptorToBitlist(descriptor), 0);
}

export function createNodeFromCompactMultiProof(leaves: Uint8Array[], descriptor: Uint8Array): Node {
  const bools = descriptorToBitlist(descriptor);
  if (bools.length !== leaves.length * 2 - 1) {
    throw new Error("Invalid multiproof: invalid number of leaves");
  }
  return compactMultiProofToNode(bools, leaves, {bitIndex: 0, leafIndex: 0});
}
