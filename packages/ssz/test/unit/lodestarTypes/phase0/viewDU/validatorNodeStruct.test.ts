import { Node, BranchNode, LeafNode, subtreeFillToContents, getNodesAtDepth } from "@chainsafe/persistent-merkle-tree";
import { validatorToTree } from "../../../../lodestarTypes/phase0/viewDU/validatorNodeStruct";
import { HashObject, hashObjectToByteArray } from "@chainsafe/as-sha256";
import { ValidatorNodeStruct } from "../../../../lodestarTypes/phase0/validator";
import { expect } from "chai";
import { Validator } from "../../../../lodestarTypes/phase0/sszTypes";

describe("validatorNodeStruct", () => {
  it("should populate validator value to tree", () => {
    const seedValidator = {
      activationEligibilityEpoch: 10,
      activationEpoch: 11,
      exitEpoch: Infinity,
      slashed: false,
      withdrawableEpoch: 13,
      pubkey: Buffer.alloc(48, 100),
      withdrawalCredentials: Buffer.alloc(32, 100),
    };

    const validators = [
      {...seedValidator, effectiveBalance: 31000000000, slashed: false},
      {...seedValidator, effectiveBalance: 32000000000, slashed: true},
    ];

    const nodes: Node[] = Array.from({length: 8}, () => LeafNode.fromZero());
    nodes[0] = new BranchNode(LeafNode.fromZero(), LeafNode.fromZero());
    for (const validator of validators) {
      validatorToTree(nodes, validator);
      const depth = 3;
      const rootNode = subtreeFillToContents([...nodes], depth);
      rootNode.root;
      const root = new Uint8Array(32);
      hashObjectToByteArray(rootNode, root, 0);
      const expectedRootNode = Validator.value_toTree(validator);
      const expectedNodes = getNodesAtDepth(expectedRootNode, depth, 0, 8);
      expect(expectedNodes.length).to.be.equal(8);
      for (let i = 0; i < 8; i++) {
        expectEqualNode(nodes[i].rootHashObject, expectedNodes[i].rootHashObject, `node ${i}`);
      }
      expect(root).to.be.deep.equals(ValidatorNodeStruct.hashTreeRoot(validator));
    }
  });
});

function expectEqualNode(node1: HashObject, node2: HashObject, message: string) {
  expect(node1.h0 >>> 0).to.be.equal(node2.h0 >>> 0, `${message} h0`);
  expect(node1.h1 >>> 0).to.be.equal(node2.h1 >>> 0, `${message} h1`);
  expect(node1.h2 >>> 0).to.be.equal(node2.h2 >>> 0, `${message} h2`);
  expect(node1.h3 >>> 0).to.be.equal(node2.h3 >>> 0, `${message} h3`);
  expect(node1.h4 >>> 0).to.be.equal(node2.h4 >>> 0, `${message} h4`);
  expect(node1.h5 >>> 0).to.be.equal(node2.h5 >>> 0, `${message} h5`);
  expect(node1.h6 >>> 0).to.be.equal(node2.h6 >>> 0, `${message} h6`);
  expect(node1.h7 >>> 0).to.be.equal(node2.h7 >>> 0, `${message} h7`);
}
