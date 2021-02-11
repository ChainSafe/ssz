import { Gindex } from "../gindex";
import { Node } from "../node";
import { createNodeFromTreeOffsetProof, createTreeOffsetProof } from "./treeOffset";

export enum ProofType {
  single = "single",
  treeOffset = "treeOffset",
}

export interface TreeOffsetProof {
  type: ProofType.treeOffset;
  offsets: number[];
  leaves: Uint8Array[];
}

export type Proof = TreeOffsetProof;

export interface TreeOffsetProofInput {
  type: ProofType.treeOffset;
  gindices: Gindex[];
}

export type ProofInput = TreeOffsetProofInput;

export function createProof(rootNode: Node, input: ProofInput): Proof {
  switch (input.type) {
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
    case ProofType.treeOffset:
      return createNodeFromTreeOffsetProof(proof.offsets, proof.leaves);
    default:
      throw new Error("Invalid proof type");
  }
}
