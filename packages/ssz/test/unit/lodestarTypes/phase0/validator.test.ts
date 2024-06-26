import { BranchNode, LeafNode, Node, digestNLevelUnsafe, subtreeFillToContents } from "@chainsafe/persistent-merkle-tree";
import {ContainerType} from "../../../../../ssz/src/type/container";
import {ssz} from "../../../lodestarTypes";
import {ValidatorType} from "../../../lodestarTypes/phase0/validator";
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

});
