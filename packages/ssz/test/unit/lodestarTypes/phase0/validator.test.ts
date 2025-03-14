import {digestNLevel} from "@chainsafe/persistent-merkle-tree";
import {describe, expect, it } from "vitest";
import {ContainerType} from "../../../../../ssz/src/type/container.js";
import {ssz} from "../../../lodestarTypes/index.js";
import {Validator} from "../../../lodestarTypes/phase0/sszTypes.js";
import {ValidatorNodeStruct, ValidatorType, validatorToChunkBytes} from "../../../lodestarTypes/phase0/validator.js";

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
      const root4 = ssz.phase0.Validator.toViewDU(validator).batchHashTreeRoot();
      expect(root2).to.be.deep.equal(root);
      expect(root3).to.be.deep.equal(root);
      expect(root4).to.be.deep.equal(root);
    }
  });
});

describe("validatorToChunkBytes", function () {
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

  it("should populate validator value to merkle bytes", () => {
    for (const validator of validators) {
      const expectedRoot0 = ValidatorNodeStruct.hashTreeRoot(validator);
      // validator has 8 fields
      const level3 = new Uint8Array(32 * 8);
      const dataView = new DataView(level3.buffer, level3.byteOffset, level3.byteLength);
      // pubkey takes 2 chunks, has to go to another level
      const level4 = new Uint8Array(32 * 2);
      validatorToChunkBytes({uint8Array: level3, dataView}, level4, validator);
      // additional slice() call make it easier to debug
      const pubkeyRoot = digestNLevel(level4, 1).slice();
      level3.set(pubkeyRoot, 0);
      const root = digestNLevel(level3, 3).slice();
      const expectedRootNode2 = Validator.value_toTree(validator);
      expect(root).to.be.deep.equals(expectedRoot0);
      expect(root).to.be.deep.equals(expectedRootNode2.root);
    }
  });
});
