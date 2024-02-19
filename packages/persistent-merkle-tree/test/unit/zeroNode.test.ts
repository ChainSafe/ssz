import {expect} from "chai";
import {zeroNode} from "../../src/zeroNode";
import {hasher} from "../../src";

describe("zeroNode", () => {
  const zeros = [new Uint8Array(32)];
  for (let i = 1; i < 32; i++) {
    zeros.push(hasher.digest64(zeros[i - 1], zeros[i - 1]));
  }

  it("should return the same zero node for the same depth", () => {
    const zeroNode0 = zeroNode(0);
    const zeroNode1 = zeroNode(0);
    expect(zeroNode0).to.equal(zeroNode1);
    expect(zeroNode0.root).to.deep.equal(zeros[0]);
  });

  it("should return valid hashes at various levels", () => {
    for (let i = 0; i < 32; i++) {
      const zeroNodeI = zeroNode(i);
      expect(zeroNodeI.root, `error in ${i}`).to.deep.equal(zeros[i]);
    }
  });
});
