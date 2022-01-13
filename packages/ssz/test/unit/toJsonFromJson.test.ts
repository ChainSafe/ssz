import {expect} from "chai";
import {BooleanType, ContainerType, ListCompositeType, Type, ValueOf} from "../../src";
import {JsonOptions} from "../../src/type/abstract";

describe("json serialization", function () {
  const runJsonTest = getRunJsonTest();

  const bool = new BooleanType();
  const CamelCaseFieldObject = new ContainerType({someValue: bool, someOtherValue: bool});
  const NoTransformFieldObject = new ContainerType({someValue_RandOM: bool, someOtherValue_1Random2: bool});
  const NoTransformFieldObjectWithDeclaredExpectedCase = new ContainerType(
    {someValue_RandOM: bool, someOtherValue_1Random2: bool},
    {case: "notransform"}
  );
  const RandomTransformFieldObject = new ContainerType({
    someValueRandOM: bool,
    someOtherValue1Random2: bool,
  });

  const SlashingTransformFieldObject = new ContainerType({
    eth1Data: bool,
    signedHeader1: bool,
    signedHeader2: bool,
    attestation1: bool,
    attestation2: bool,
  });

  const WithCasingDeclarationFieldObject = new ContainerType(
    {
      eth1Data: bool,
      signedHeader1: bool,
      signedHeader2: bool,
      attestation1: bool,
      attestation2: bool,
    },
    {
      casingMap: {
        signedHeader1: "signed_header_1",
        signedHeader2: "signed_header_2",
        attestation1: "attestation_1",
        attestation2: "attestation_2",
      },
    }
  );

  const ComplexCamelCaseFieldObject = new ContainerType({
    someValue: bool,
    someOtherValue: bool,
    container: CamelCaseFieldObject,
  });

  runJsonTest(
    "should do round trip - container",
    CamelCaseFieldObject,
    {someValue: false, someOtherValue: true},
    {someValue: false, someOtherValue: true}
  );

  runJsonTest(
    "should deserialize without case transformation",
    NoTransformFieldObject,
    {someValue_RandOM: false, someOtherValue_1Random2: true},
    {someValue_RandOM: false, someOtherValue_1Random2: true},
    {case: "notransform"}
  );

  runJsonTest(
    "should deserialize/deserialize without case transformation with notransform declared expectedCase",
    NoTransformFieldObjectWithDeclaredExpectedCase,
    {someValue_RandOM: false, someOtherValue_1Random2: true},
    {someValue_RandOM: false, someOtherValue_1Random2: true}
  );

  runJsonTest(
    "should deserialize from snake case with numbers",
    RandomTransformFieldObject,
    {someValueRandOM: false, someOtherValue1Random2: true},
    {some_value_rand_o_m: false, some_other_value1_random2: true},
    {case: "snake"}
  );

  runJsonTest(
    "should deserialize from snake case",
    CamelCaseFieldObject,
    {someValue: false, someOtherValue: true},
    {some_value: false, some_other_value: true},
    {case: "snake"}
  );

  runJsonTest(
    "test eth2 spec slashing fields from snake case",
    SlashingTransformFieldObject,
    {eth1Data: true, signedHeader1: false, signedHeader2: false, attestation1: true, attestation2: false},
    {eth1_data: true, signed_header_1: false, signed_header_2: false, attestation_1: true, attestation_2: false},
    {
      case: "snake",
      casingMap: {
        signedHeader1: "signed_header_1",
        signedHeader2: "signed_header_2",
        attestation1: "attestation_1",
        attestation2: "attestation_2",
      },
    }
  );

  runJsonTest(
    "test eth2 spec with casing declared",
    WithCasingDeclarationFieldObject,
    {eth1Data: true, signedHeader1: false, signedHeader2: false, attestation1: true, attestation2: false},
    {eth1_data: true, signed_header_1: false, signed_header_2: false, attestation_1: true, attestation_2: false},
    {case: "snake"}
  );

  runJsonTest(
    "test eth2 spec slashing fields from constant case ",
    SlashingTransformFieldObject,
    {eth1Data: true, signedHeader1: false, signedHeader2: false, attestation1: true, attestation2: false},
    {ETH1_DATA: true, SIGNED_HEADER_1: false, SIGNED_HEADER_2: false, ATTESTATION_1: true, ATTESTATION_2: false},
    {
      case: "constant",
      casingMap: {
        signedHeader1: "SIGNED_HEADER_1",
        signedHeader2: "SIGNED_HEADER_2",
        attestation1: "ATTESTATION_1",
        attestation2: "ATTESTATION_2",
      },
    }
  );

  runJsonTest(
    "should deserialize array of containers from snake case",
    new ListCompositeType(CamelCaseFieldObject, 2),
    [{someValue: false, someOtherValue: true}],
    [{some_value: false, some_other_value: true}],
    {case: "snake"}
  );

  runJsonTest(
    "should deserialize complex from snake case",
    ComplexCamelCaseFieldObject,
    {someValue: false, someOtherValue: true, container: {someValue: false, someOtherValue: true}},
    {some_value: false, some_other_value: true, container: {some_value: false, some_other_value: true}},
    {case: "snake"}
  );

  runJsonTest(
    "should serialize to snake case",
    CamelCaseFieldObject,
    {someValue: false, someOtherValue: true},
    {some_value: false, some_other_value: true},
    {case: "snake"}
  );

  runJsonTest(
    "should serialize array of containers to snake case",
    new ListCompositeType(CamelCaseFieldObject, 2),
    [{someValue: false, someOtherValue: true}],
    [{some_value: false, some_other_value: true}],
    {case: "snake"}
  );

  runJsonTest(
    "should serialize complex object to snake case",
    ComplexCamelCaseFieldObject,
    {someValue: false, someOtherValue: true, container: {someValue: false, someOtherValue: true}},
    {some_value: false, some_other_value: true, container: {some_value: false, some_other_value: true}},
    {case: "snake"}
  );
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getRunJsonTest() {
  const runJsonTestFn = function runJsonTest<T extends Type<unknown>>(
    id: string,
    type: T,
    value: ValueOf<T>,
    json: unknown,
    jsonOpts?: JsonOptions,
    opts?: {only?: boolean; skip?: boolean}
  ): void {
    // eslint-disable-next-line no-only-tests/no-only-tests
    const itFn = (opts?.only ? it.only : opts?.skip ? it.skip : it) as Mocha.TestFunction;

    itFn(id, function () {
      expect(type.toJson(value, jsonOpts)).to.deep.equal(json, "Wrong json");
      expect(type.fromJson(json, jsonOpts)).to.deep.equal(value, "Wrong value");
    });
  };

  const runJsonTest = runJsonTestFn as typeof runJsonTestFn & {
    only: typeof runJsonTestFn;
    skip: typeof runJsonTestFn;
  };

  runJsonTest.only = function runJsonTest(a, b, c, d, e, opts = {}): void {
    opts.only = true;
    runJsonTestFn(a, b, c, d, e, opts);
  } as typeof runJsonTestFn;

  runJsonTest.skip = function runJsonTest(a, b, c, d, e, opts = {}): void {
    opts.skip = true;
    runJsonTestFn(a, b, c, d, e, opts);
  } as typeof runJsonTestFn;

  return runJsonTest;
}
