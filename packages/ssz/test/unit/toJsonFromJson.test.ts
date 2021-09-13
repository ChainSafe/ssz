import {expect} from "chai";
import {BooleanType, ContainerType, ListCompositeType, Type, ValueOf} from "../../src";

describe("json serialization", function () {
  const runJsonTest = getRunJsonTest();

  const bool = new BooleanType();
  const SimpleCamelCase = new ContainerType({someValue: bool, someOtherValue: bool}, {jsonCase: "snake"});
  const SimpleNoTransform = new ContainerType({someValue: bool, someOtherValue: bool});

  const RandomSnake = new ContainerType({someValueRandOM: bool, someOtherValue1Random2: bool}, {jsonCase: "snake"});
  const RandomNoTransform = new ContainerType({someValueRandOM: bool, someOtherValue1Random2: bool});

  const eth2Fields = {
    eth1Data: bool,
    signedHeader1: bool,
    signedHeader2: bool,
    attestation1: bool,
    attestation2: bool,
  };

  const Eth2FieldsSnakeCase = new ContainerType(eth2Fields, {jsonCase: "snake"});
  const Eth2FieldsCasingMap = new ContainerType(eth2Fields, {
    casingMap: {
      eth1Data: "eth1_data",
      signedHeader1: "signed_header_1",
      signedHeader2: "signed_header_2",
      attestation1: "attestation_1",
      attestation2: "attestation_2",
    },
  });

  const ComplexCamelCaseFieldObject = new ContainerType(
    {
      someValue: bool,
      someOtherValue: bool,
      container: SimpleCamelCase,
    },
    {jsonCase: "snake"}
  );

  runJsonTest(
    "SimpleCamelCase",
    SimpleCamelCase,
    {someValue: false, someOtherValue: true},
    {some_value: false, some_other_value: true}
  );

  runJsonTest(
    "SimpleNoTransform",
    SimpleNoTransform,
    {someValue: false, someOtherValue: true},
    {someValue: false, someOtherValue: true}
  );

  runJsonTest(
    "RandomSnake",
    RandomSnake,
    {someValueRandOM: false, someOtherValue1Random2: true},
    {some_value_rand_o_m: false, some_other_value1_random2: true}
  );

  runJsonTest(
    "RandomNoTransform",
    RandomNoTransform,
    {someValueRandOM: false, someOtherValue1Random2: true},
    {someValueRandOM: false, someOtherValue1Random2: true}
  );

  runJsonTest(
    "Eth2FieldsSnakeCase",
    Eth2FieldsSnakeCase,
    {eth1Data: true, signedHeader1: false, signedHeader2: false, attestation1: true, attestation2: false},
    {eth1_data: true, signed_header1: false, signed_header2: false, attestation1: true, attestation2: false}
  );

  runJsonTest(
    "Eth2FieldsCasingMap",
    Eth2FieldsCasingMap,
    {eth1Data: true, signedHeader1: false, signedHeader2: false, attestation1: true, attestation2: false},
    {eth1_data: true, signed_header_1: false, signed_header_2: false, attestation_1: true, attestation_2: false}
  );

  runJsonTest(
    "ListCompositeType(SimpleCamelCase)",
    new ListCompositeType(SimpleCamelCase, 2),
    [{someValue: false, someOtherValue: true}],
    [{some_value: false, some_other_value: true}]
  );

  runJsonTest(
    "ComplexCamelCaseFieldObject",
    ComplexCamelCaseFieldObject,
    {someValue: false, someOtherValue: true, container: {someValue: false, someOtherValue: true}},
    {some_value: false, some_other_value: true, container: {some_value: false, some_other_value: true}}
  );
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getRunJsonTest() {
  const runJsonTestFn = function runJsonTest<T extends Type<unknown>>(
    id: string,
    type: T,
    value: ValueOf<T>,
    json: unknown,
    opts?: {only?: boolean; skip?: boolean}
  ): void {
    // eslint-disable-next-line no-only-tests/no-only-tests
    const itFn = (opts?.only ? it.only : opts?.skip ? it.skip : it) as Mocha.TestFunction;

    itFn(id, function () {
      expect(type.toJson(value)).to.deep.equal(json, "Wrong json");
      expect(type.fromJson(json)).to.deep.equal(value, "Wrong value");
    });
  };

  const runJsonTest = runJsonTestFn as typeof runJsonTestFn & {
    only: typeof runJsonTestFn;
    skip: typeof runJsonTestFn;
  };

  runJsonTest.only = function runJsonTest(a, b, c, d, opts = {}): void {
    opts.only = true;
    runJsonTestFn(a, b, c, d, opts);
  } as typeof runJsonTestFn;

  runJsonTest.skip = function runJsonTest(a, b, c, d, opts = {}): void {
    opts.skip = true;
    runJsonTestFn(a, b, c, d, opts);
  } as typeof runJsonTestFn;

  return runJsonTest;
}
