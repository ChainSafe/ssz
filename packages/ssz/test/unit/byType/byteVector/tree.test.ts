import {expect} from "chai";
import {ByteVectorType, ContainerType} from "../../../../src/index.js";

describe("ByteVectorType proofs", () => {
  const rootType = new ByteVectorType(32);
  const containerRootType = new ContainerType({root: rootType});

  it("Not allow navigating beyond this type", () => {
    expect(() => rootType.getPropertyType()).to.throw();
    expect(() => rootType.getIndexProperty()).to.throw();

    const containerRoot = containerRootType.defaultViewDU();
    const proof = containerRoot.createProof([["root", 0]]);
    const proofAll = containerRoot.createProof([["root"]]);
    expect(proof).to.deep.equal(proofAll, "Proof for byte index 0 must equal proof for all data");
  });
});
