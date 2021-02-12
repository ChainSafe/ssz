import { Gindex } from "../gindex";
import { Node } from "../node";
import { createNodeFromSingleProof, createSingleProof } from "./single";
import { createNodeFromTreeOffsetProof, createTreeOffsetProof } from "./treeOffset";

export enum ProofType {
  single = "single",
  treeOffset = "treeOffset",
}

export interface SingleProof {
  type: ProofType.single;
  gindex: Gindex;
  leaf: Uint8Array;
  witnesses: Uint8Array[];
}
export interface TreeOffsetProof {
  type: ProofType.treeOffset;
  offsets: number[];
  leaves: Uint8Array[];
}

export type Proof = SingleProof | TreeOffsetProof;

export interface SingleProofInput {
  type: ProofType.single;
  gindex: Gindex;
}
export interface TreeOffsetProofInput {
  type: ProofType.treeOffset;
  gindices: Gindex[];
}

export type ProofInput = SingleProofInput | TreeOffsetProofInput;

export function createProof(rootNode: Node, input: ProofInput): Proof {
  switch (input.type) {
    case ProofType.single:
      const [leaf, witnesses] = createSingleProof(rootNode, input.gindex);
      return {
        type: ProofType.single,
        gindex: input.gindex,
        leaf,
        witnesses,
      };
    case ProofType.treeOffset:
      const [offsets, leaves] = createTreeOffsetProof(
        rootNode,
        input.gindices
      );
      return {
        type: ProofType.treeOffset,
        offsets,
        leaves,
      };
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
    default:
      throw new Error("Invalid proof type");
  }
}
