import {Gindex} from "../gindex";
import {Node} from "../node";
import {createMultiProof, createNodeFromMultiProof} from "./multi";
import {createNodeFromSingleProof, createSingleProof} from "./single";
import {
  computeTreeOffsetProofSerializedLength,
  createNodeFromTreeOffsetProof,
  createTreeOffsetProof,
  deserializeTreeOffsetProof,
  serializeTreeOffsetProof,
} from "./treeOffset";
import {allocUnsafe} from "./util";

export enum ProofType {
  single = "single",
  treeOffset = "treeOffset",
  multi = "multi",
}

/**
 * Serialized proofs are prepended with a single byte, denoting their type
 */
export const ProofTypeSerialized = [
  ProofType.single, // 0
  ProofType.treeOffset, // 1
  ProofType.multi, // 2
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

export type Proof = SingleProof | TreeOffsetProof | MultiProof;

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

export type ProofInput = SingleProofInput | TreeOffsetProofInput | MultiProofInput;

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
      const output = allocUnsafe(1 + computeTreeOffsetProofSerializedLength(proof.offsets, proof.leaves));
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
