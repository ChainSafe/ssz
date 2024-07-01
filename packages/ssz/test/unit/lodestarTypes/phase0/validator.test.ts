import {digestNLevelUnsafe} from "@chainsafe/persistent-merkle-tree";
import {ContainerType} from "../../../../../ssz/src/type/container";
import {ssz} from "../../../lodestarTypes";
import {ValidatorType} from "../../../lodestarTypes/phase0/validator";
import {ValidatorTreeViewDU} from "../../../lodestarTypes/phase0/viewDU/validator";
import {expect} from "chai";

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
    // same logic to viewDU.commit();
    // validator has 8 nodes at level 3
    const singleLevel3Bytes = new Uint8Array(8 * 32);
    const singleLevel3ByteView = {uint8Array: singleLevel3Bytes, dataView: new DataView(singleLevel3Bytes.buffer)};
    // validator has 2 nodes at level 4 (pubkey has 48 bytes = 2 * nodes)
    const singleLevel4Bytes = new Uint8Array(2 * 32);
    viewDU.valueToMerkleBytes(singleLevel3ByteView, singleLevel4Bytes);
    // level 4 hash
    const pubkeyRoot = digestNLevelUnsafe(singleLevel4Bytes, 1);
    if (pubkeyRoot.length !== 32) {
      throw new Error(`Invalid pubkeyRoot length, expect 32, got ${pubkeyRoot.length}`);
    }
    singleLevel3ByteView.uint8Array.set(pubkeyRoot, 0);
    // level 3 hash
    const validatorRoot = digestNLevelUnsafe(singleLevel3ByteView.uint8Array, 3);
    if (validatorRoot.length !== 32) {
      throw new Error(`Invalid validatorRoot length, expect 32, got ${validatorRoot.length}`);
    }
    viewDU.commitToRoot(validatorRoot);
    const expectedRoot = ValidatorContainer.hashTreeRoot(validators[1]);
    expect(viewDU.node.root).to.be.deep.equal(expectedRoot);
    expect(viewDU.hashTreeRoot()).to.be.deep.equal(expectedRoot);
  });
});
