import { expect } from "chai";
import { CommitteeBits, PendingAttestation } from "./objects";

describe("convertToTree", function () {
  it("create a new tree from tree backed properties", function () {
    const bitList = Array.from({length: 128}, () => true);
    const bitListTree = CommitteeBits.createTreeBackedFromStruct(bitList);
    const pendingAttestation = {
      aggregationBits: bitList,
    };
    const pendingAttestation2 = {
      aggregationBits: bitListTree,
    };
    const pendingAttestationTree = PendingAttestation.struct_convertToTree(pendingAttestation);
    const pendingAttestationTree2 = PendingAttestation.struct_convertToTree(pendingAttestation2);
    expect(pendingAttestationTree.root).to.be.deep.equal(pendingAttestationTree2.root);
    const MAX_TRY = 1000;
    const from = process.hrtime.bigint();
    for (let i = 0; i < MAX_TRY; i++) {
      PendingAttestation.struct_convertToTree(pendingAttestation2);
    }
    const to = process.hrtime.bigint();
    const timeInMs = Number((to - from) / BigInt(1000000));
    expect(timeInMs).to.be.lt(20, `convertToTree ${MAX_TRY} times should be less than 20ms`);
  });
});
