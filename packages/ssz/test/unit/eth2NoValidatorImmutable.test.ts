import {expect} from "chai";
import {ContainerNodeStructType, fromHexString, ListCompositeType, toHexString, ValueOf} from "../../src";
import * as sszPhase0 from "../lodestarTypes/phase0/sszTypes";

describe("Eth2 state without validator immutable data", () => {
  it("Serialize and read state without validator immutable data", () => {
    const Validators = new ListCompositeType(sszPhase0.ValidatorNodeStruct, 2048);

    const ValidatorNoImmutable = new ContainerNodeStructType(sszPhase0.ValidatorNodeStruct.fields, {
      ...sszPhase0.ValidatorNodeStruct.opts,
      onlySerializeFields: [
        "effectiveBalance",
        "slashed",
        "activationEligibilityEpoch",
        "activationEpoch",
        "exitEpoch",
        "withdrawableEpoch",
      ],
    });
    const ValidatorsNoImmutable = new ListCompositeType(ValidatorNoImmutable, 2048);

    const validator: ValueOf<typeof sszPhase0.Validator> = {
      pubkey: Buffer.alloc(48, 0xaa),
      withdrawalCredentials: Buffer.alloc(32, 0xbb),
      effectiveBalance: 32e9,
      slashed: false,
      activationEligibilityEpoch: 1e6,
      activationEpoch: 1e6,
      exitEpoch: Infinity,
      withdrawableEpoch: Infinity,
    };
    const validators = [validator];
    const validatorsImmutableData = validators.map((v) => ({
      pubkey: v.pubkey,
      withdrawalCredentials: v.withdrawalCredentials,
    }));

    const validatorSerializedHex =
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00405973070000000040420f000000000040420f0000000000ffffffffffffffffffffffffffffffff";
    expect(toHexString(Validators.serialize(validators))).to.equal(
      validatorSerializedHex,
      "Wrong serialized Validators"
    );

    const validatorNoImmutableSerializedHex =
      "0x00405973070000000040420f000000000040420f0000000000ffffffffffffffffffffffffffffffff";
    expect(toHexString(ValidatorsNoImmutable.serialize(validators))).to.equal(
      validatorNoImmutableSerializedHex,
      "Wrong serialized ValidatorsNoImmutable"
    );

    // Deserialize and inject data
    const validatorsNoImmutableViewDU = ValidatorsNoImmutable.deserializeToViewDU(
      fromHexString(validatorNoImmutableSerializedHex)
    );

    expect(validatorsNoImmutableViewDU.get(0).withdrawalCredentials).to.equal(
      undefined,
      "withdrawalCredentials should be undefined before injecting data"
    );

    // expect(toHexString(validatorsNoImmutableViewDU.hashTreeRoot())).to.not.equal(
    //   toHexString(Validators.hashTreeRoot(validators)),
    //   "Root must not be equal before injecting data"
    // );

    const validatorsNoImmutableViewDUValues = validatorsNoImmutableViewDU.getAllReadonlyValues();
    for (let i = 0; i < validatorsImmutableData.length; i++) {
      validatorsNoImmutableViewDUValues[i].pubkey = validatorsImmutableData[i].pubkey;
      validatorsNoImmutableViewDUValues[i].withdrawalCredentials = validatorsImmutableData[i].withdrawalCredentials;
    }

    expect(validatorsNoImmutableViewDU.get(0).withdrawalCredentials).to.equal(
      validatorsImmutableData[0].withdrawalCredentials,
      "withdrawalCredentials should be the existing value after injecting data"
    );

    expect(toHexString(validatorsNoImmutableViewDU.hashTreeRoot())).to.equal(
      toHexString(Validators.hashTreeRoot(validators)),
      "Wrong root after injecting data"
    );
  });
});
