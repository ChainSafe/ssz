import {
  CamelCaseFieldObject,
  ComplexCamelCaseFieldObject,
  RandomTransformFieldObject,
  NoTransformFieldObject,
  SlashingTransformFieldObject,
} from "./objects";
import {expect} from "chai";
import {CompositeListType} from "../../src/types/composite";

describe("json serialization", function () {
  it("should do round trip - container", function () {
    const test = {someValue: 4, someOtherValue: true};
    const json = CamelCaseFieldObject.toJson(test);
    const result = CamelCaseFieldObject.fromJson(json);
    expect(CamelCaseFieldObject.equals(result, test)).to.be.true;
  });

  it("should deserialize without case transformation", function () {
    const test = {someValue_RandOM: 4, someOtherValue_1Random2: true};
    const json = {someValue_RandOM: 4, someOtherValue_1Random2: true};
    const result = NoTransformFieldObject.fromJson(json, {case: "notransform"});
    expect(NoTransformFieldObject.equals(test, result)).to.be.true;
  });

  it("should deserialize from snake case with numbers", function () {
    const test = {someValueRandOM: 4, someOtherValue1Random2: true};
    const json = {some_value_rand_om: 4, some_other_value_1_random_2: true};
    const result = RandomTransformFieldObject.fromJson(json, {case: "snake"});
    expect(RandomTransformFieldObject.equals(test, result)).to.be.true;
  });

  it("should deserialize from snake case", function () {
    const test = {someValue: 4, someOtherValue: true};
    const json = {some_value: 4, some_other_value: true};
    const result = CamelCaseFieldObject.fromJson(json, {case: "snake"});
    expect(CamelCaseFieldObject.equals(test, result)).to.be.true;
  });

  it("test eth2 spec slashing fields from snake case", function () {
    const test = {signedHeader1: 4, signedHeader2: 5, attestation1: true, attestation2: false};
    const json = {signed_header_1: 4, signed_header_2: 5, attestation_1: true, attestation_2: false};
    const result = SlashingTransformFieldObject.fromJson(json, {case: "snake"});
    expect(SlashingTransformFieldObject.equals(test, result)).to.be.true;
    const back = SlashingTransformFieldObject.toJson(result, {case: "snake"});
    expect(back).to.be.deep.equal(json);
  });

  it("test eth2 spec slashing fields from constant case ", function () {
    const test = {signedHeader1: 4, signedHeader2: 5, attestation1: true, attestation2: false};
    const json = {SIGNED_HEADER_1: 4, SIGNED_HEADER_2: 5, ATTESTATION_1: true, ATTESTATION_2: false};
    const result = SlashingTransformFieldObject.fromJson(json, {case: "constant"});
    expect(SlashingTransformFieldObject.equals(test, result)).to.be.true;
    const back = SlashingTransformFieldObject.toJson(result, {case: "constant"});
    expect(back).to.be.deep.equal(json);
  });

  it("should deserialize array of containers from snake case", function () {
    const CamelCaseObjectArray = new CompositeListType({
      elementType: CamelCaseFieldObject,
      limit: 2,
    });
    const test = {someValue: 4, someOtherValue: true};
    const json = {some_value: 4, some_other_value: true};
    const result = CamelCaseObjectArray.fromJson([json, json], {case: "snake"});
    expect(CamelCaseObjectArray.equals([test, test], result)).to.be.true;
  });

  it("should deserialize complex from snake case", function () {
    const innerTest = {someValue: 4, someOtherValue: true};
    const test = {someValue: 4, someOtherValue: true, container: innerTest};
    const innerJson = {some_value: 4, some_other_value: true};
    const json = {some_value: 4, some_other_value: true, container: innerJson};
    const result = ComplexCamelCaseFieldObject.fromJson(json, {case: "snake"});
    expect(ComplexCamelCaseFieldObject.equals(test, result)).to.be.true;
  });

  it("should serialize to snake case", function () {
    const test = {someValue: 4, someOtherValue: true};
    const json = {some_value: 4, some_other_value: true};
    const result = CamelCaseFieldObject.toJson(test, {case: "snake"});
    expect(result).to.be.deep.equal(json);
  });

  it("should serialize array of containers to snake case", function () {
    const CamelCaseObjectArray = new CompositeListType({
      elementType: CamelCaseFieldObject,
      limit: 2,
    });
    const test = {someValue: 4, someOtherValue: true};
    const json = {some_value: 4, some_other_value: true};
    const result = CamelCaseObjectArray.toJson([test, test], {case: "snake"});
    expect(result).to.be.deep.equal([json, json]);
  });

  it("should serialize complex object to snake case", function () {
    const innerTest = {someValue: 4, someOtherValue: true};
    const test = {someValue: 4, someOtherValue: true, container: innerTest};
    const innerJson = {some_value: 4, some_other_value: true};
    const json = {some_value: 4, some_other_value: true, container: innerJson};
    const result = ComplexCamelCaseFieldObject.toJson(test, {case: "snake"});
    expect(result).to.be.deep.equal(json);
  });
});
