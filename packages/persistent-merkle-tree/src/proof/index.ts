import {Gindex} from "../gindex.ts";
import {Node} from "../node.ts";
import {createCompactMultiProof, createNodeFromCompactMultiProof} from "./compactMulti.ts";
import {createMultiProof, createNodeFromMultiProof} from "./multi.ts";
import {createNodeFromSingleProof, createSingleProof} from "./single.ts";
import {
  computeTreeOffsetProofSerializedLength,
  createNodeFromTreeOffsetProof,
  createTreeOffsetProof,
  deserializeTreeOffsetProof,
  serializeTreeOffsetProof,
} from "./treeOffset.ts";

export {computeDescriptor, descriptorToBitlist} from "./compactMulti.ts";

export enum ProofType {
  single = "single",
  treeOffset = "treeOffset",
  multi = "multi",
  compactMulti = "compactMulti",
}

/**
 * Serialized proofs are prepended with a single byte, denoting their type
 */
export const ProofTypeSerialized = [
  ProofType.single, // 0
  ProofType.treeOffset, // 1
  ProofType.multi, // 2
  ProofType.compactMulti, // 3
];

/**
 * A common merkle proof.
 * A proof for a single leaf in a tree.
 */
export interface SingleProof {
  type: ProofType.single;
  gindex: Gindex;
  leaf: Uint8Array;
  witnesses: Uint8Array[];
}
/**
 * A proof for multiple leaves in a tree.
 *
 * See https://github.com/protolambda/eth-merkle-trees/blob/master/tree_offsets.md
 */
export interface TreeOffsetProof {
  type: ProofType.treeOffset;
  offsets: number[];
  leaves: Uint8Array[];
}

/**
 * A proof for multiple leaves in a tree.
 *
 * See https://github.com/ethereum/consensus-specs/blob/dev/ssz/merkle-proofs.md#merkle-multiproofs
 */
export interface MultiProof {
  type: ProofType.multi;
  leaves: Uint8Array[];
  witnesses: Uint8Array[];
  gindices: Gindex[];
}

export interface CompactMultiProof {
  type: ProofType.compactMulti;
  leaves: Uint8Array[];
  descriptor: Uint8Array;
}

export type Proof = SingleProof | TreeOffsetProof | MultiProof | CompactMultiProof;

export interface SingleProofInput {
  type: ProofType.single;
  gindex: Gindex;
}
export interface TreeOffsetProofInput {
  type: ProofType.treeOffset;
  gindices: Gindex[];
}

export interface MultiProofInput {
  type: ProofType.multi;
  gindices: Gindex[];
}

export interface CompactMultiProofInput {
  type: ProofType.compactMulti;
  descriptor: Uint8Array;
}

export type ProofInput = SingleProofInput | TreeOffsetProofInput | MultiProofInput | CompactMultiProofInput;

export function createProof(rootNode: Node, input: ProofInput): Proof {
  switch (input.type) {
    case ProofType.single: {
      const [leaf, witnesses] = createSingleProof(rootNode, input.gindex);
      return {
        type: ProofType.single,
        gindex: input.gindex,
        leaf,
        witnesses,
      };
    }
    case ProofType.treeOffset: {
      const [offsets, leaves] = createTreeOffsetProof(rootNode, input.gindices);
      return {
        type: ProofType.treeOffset,
        offsets,
        leaves,
      };
    }
    case ProofType.multi: {
      const [leaves, witnesses, gindices] = createMultiProof(rootNode, input.gindices);
      return {
        type: ProofType.multi,
        leaves,
        witnesses,
        gindices,
      };
    }
    case ProofType.compactMulti: {
      const leaves = createCompactMultiProof(rootNode, input.descriptor);
      return {
        type: ProofType.compactMulti,
        leaves,
        descriptor: input.descriptor,
      };
    }
    default:
      throw new Error("Invalid proof type");
  }
}

export function createNodeFromProof(proof: Proof): Node {
  switch (proof.type) {
    case ProofType.single:
      return createNodeFromSingleProof(proof.gindex, proof.leaf, proof.witnesses);
    case ProofType.treeOffset:
      return createNodeFromTreeOffsetProof(proof.offsets, proof.leaves);
    case ProofType.multi:
      return createNodeFromMultiProof(proof.leaves, proof.witnesses, proof.gindices);
    case ProofType.compactMulti:
      return createNodeFromCompactMultiProof(proof.leaves, proof.descriptor);
    default:
      throw new Error("Invalid proof type");
  }
}

export function serializeProof(proof: Proof): Uint8Array {
  switch (proof.type) {
    case ProofType.single:
    case ProofType.multi:
      throw new Error("Not implemented");
    case ProofType.treeOffset: {
      const output = new Uint8Array(1 + computeTreeOffsetProofSerializedLength(proof.offsets, proof.leaves));
      output[0] = ProofTypeSerialized.indexOf(ProofType.treeOffset);
      serializeTreeOffsetProof(output, 1, proof.offsets, proof.leaves);
      return output;
    }
    default:
      throw new Error("Invalid proof type");
  }
}

export function deserializeProof(data: Uint8Array): Proof {
  const proofType = ProofTypeSerialized[data[0]];
  if (!proofType) {
    throw new Error("Invalid proof type");
  }
  switch (proofType) {
    case ProofType.single:
    case ProofType.multi:
      throw new Error("Not implemented");
    case ProofType.treeOffset: {
      const [offsets, leaves] = deserializeTreeOffsetProof(data, 1);
      return {
        type: ProofType.treeOffset,
        offsets,
        leaves,
      };
    }
    default:
      throw new Error("Invalid proof type");
  }
}
