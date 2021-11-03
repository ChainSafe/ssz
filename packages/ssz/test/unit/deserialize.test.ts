import {assert, expect} from "chai";
import {describe, it} from "mocha";
import {booleanType, byteType, ContainerType, Type, UnionType} from "../../src";
import {NoneType} from "../../src/types/basic/none";
import {number16Type, number16Vector6Type, SimpleObject, VariableSizeSimpleObject} from "./objects";

describe("deserialize", () => {
  const invalidDataTestCases: {
    value: string;
    type: Type<any>;
    expectedError: string;
  }[] = [
    {value: "", type: number16Type, expectedError: "Data is empty"},
    {value: "00", type: number16Type, expectedError: "Data length of 1 is too small, expect 2"},
    {value: "", type: number16Vector6Type, expectedError: "Data is empty"},
    {value: "00", type: number16Vector6Type, expectedError: "Incorrect data length 1, expect 12"},
    {value: "", type: SimpleObject, expectedError: "Data is empty"},
    {value: "00", type: SimpleObject, expectedError: "Incorrect data length 1, expect 3"},
    {value: "00", type: VariableSizeSimpleObject, expectedError: "Data length 1 is too small, expect at least 7"},
  ];
  for (const {type, value, expectedError} of invalidDataTestCases) {
    it(`should throw error deserializing invalid data for ${type.constructor.name}`, () => {
      try {
        type.deserialize(Buffer.from(value, "hex"));
        assert.fail("Expect error here");
      } catch (e) {
        expect((e as Error).message).to.be.equal(expectedError);
      }
    });
  }
});

interface ITestType {
  foo: number;
  bar: boolean;
}

type UnionObject =
  | {
      selector: 0;
      value: undefined;
    }
  | {
      selector: 1;
      value: ITestType;
    };

const testType = new ContainerType<ITestType>({
  fields: {
    foo: byteType,
    bar: booleanType,
  },
});

describe("type inference", () => {
  it("should detect the return type of ContainerType", () => {
    const input: ITestType = {
      foo: 1,
      bar: true,
    };
    const bytes = testType.serialize(input);
    const output = testType.deserialize(bytes);
    assert(output.bar == true);
  });

  it("should detect the return type of UnionType", () => {
    const unionType = new UnionType<UnionObject>({types: [new NoneType(), testType]});
    const input: UnionObject = {
      selector: 1,
      value: {
        foo: 1,
        bar: true,
      },
    };
    const bytes = unionType.serialize(input);
    const output = unionType.deserialize(bytes);
    if (output.selector === 0) {
      throw Error("expect selector 1");
    }
    assert(output.value.bar === true);
    assert(output.value.foo === 1);
  });
});
