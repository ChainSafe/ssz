import { BranchNode, LeafNode, Node, subtreeFillToContents } from "@chainsafe/persistent-merkle-tree";
import {ContainerType} from "../../../../../ssz/src/type/container";
import {ssz} from "../../../lodestarTypes";
import {ValidatorType} from "../../../lodestarTypes/phase0/validator";
import {ValidatorTreeViewDU} from "../../../lodestarTypes/phase0/viewDU/validator";
import { expect } from "chai";

const ValidatorContainer = new ContainerType(ValidatorType, {typeName: "Validator", jsonCase: "eth2"});

describe("Validator ssz types", function () {
  const seedValidator = {
    activationEligibilityEpoch: 10,
    activationEpoch: 11,
    exitEpoch: Infinity,
    slashed: false,
    withdrawableEpoch: 13,
    pubkey: Buffer.alloc(48, 100),
    withdrawalCredentials: Buffer.alloc(32, 100),
    effectiveBalance: 32000000000,
  };

  const validators = [
    {...seedValidator, effectiveBalance: 31000000000, slashed: false},
    {...seedValidator, effectiveBalance: 32000000000, slashed: true},
  ];

  it("should serialize and hash to the same value", () => {
    for (const validator of validators) {
      const serialized = ValidatorContainer.serialize(validator);
      const serialized2 = ssz.phase0.Validator.serialize(validator);
      const serialized3 = ssz.phase0.Validator.toViewDU(validator).serialize();
      expect(serialized2).to.be.deep.equal(serialized);
      expect(serialized3).to.be.deep.equal(serialized);

      const root = ValidatorContainer.hashTreeRoot(validator);
      const root2 = ssz.phase0.Validator.hashTreeRoot(validator);
      const root3 = ssz.phase0.Validator.toViewDU(validator).hashTreeRoot();
      expect(root2).to.be.deep.equal(root);
      expect(root3).to.be.deep.equal(root);
    }
  });

  it("ViewDU.commitToHashObject()", () => {
    // transform validator from 0 to 1
    // TODO - batch: avoid this type casting
    const viewDU = ssz.phase0.Validator.toViewDU(validators[0]) as ValidatorTreeViewDU;
    viewDU.effectiveBalance = validators[1].effectiveBalance;
    viewDU.slashed = validators[1].slashed;
    const nodes: Node[] = Array.from({length: 8}, () => LeafNode.fromZero());
    nodes[0] = new BranchNode(LeafNode.fromZero(), LeafNode.fromZero());
    viewDU.valueToTree(nodes);
    const depth = 3;
    const rootNode = subtreeFillToContents([...nodes], depth);
    rootNode.root;
    viewDU.commitToHashObject(rootNode);
    const expectedRoot = ValidatorContainer.hashTreeRoot(validators[1]);
    expect(viewDU.node.root).to.be.deep.equal(expectedRoot);
    expect(viewDU.hashTreeRoot()).to.be.deep.equal(expectedRoot);
  });
});
