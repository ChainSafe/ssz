import {expect} from "chai";
import {ByteVector, ByteVectorType, ContainerType, NumberUintType, IContainerOptions, ListType} from "../../src";

describe("Eth2.0 type generators", () => {
  it("Should compile", () => {
    // This test does not run any code but ensures the SSZ types are enforced at compile time
    interface SampleType {
      a: number;
      b: ByteVector;
      subType: {
        a: number;
        b: ByteVector;
      };
      list: ByteVector[];
    }

    const Number64 = new NumberUintType({byteLength: 8});
    const Bytes32 = new ByteVectorType({length: 32});

    const subType = new ContainerType({
      fields: {
        a: Number64,
        b: Bytes32,
      },
    });

    const badSubType = new ContainerType({
      fields: {
        b: Bytes32,
      },
    });

    const rootList = new ListType<ByteVector[]>({elementType: Bytes32, limit: 1});
    const numList = new ListType<number[]>({elementType: Number64, limit: 1});

    const goodType = new ContainerType<SampleType>({
      fields: {
        a: Number64,
        b: Bytes32,
        subType: subType,
        list: rootList,
      },
    });

    // Illegal type, the subType does not implement an expected property
    const missingProperty = new ContainerType<SampleType>({
      // @ts-expect-error
      fields: {
        b: Bytes32,
        subType: subType,
        list: rootList,
      },
    });

    // Illegal type, Declares an extra property
    const undeclaredExtraProperty = new ContainerType<SampleType>({
      fields: {
        a: Number64,
        b: Bytes32,
        subType: subType,
        list: rootList,
        // @ts-expect-error
        extraProperty: Number64,
      },
    });

    // Illegal type, composite subtype does not implement an expected property
    const wrongSubpropertyComposite = new ContainerType<SampleType>({
      fields: {
        a: Number64,
        b: Bytes32,
        // @ts-expect-error
        subType: badSubType,
        list: rootList,
      },
    });

    // Illegal type, a ListType does not have the expected element type
    const wrongSubpropertyList = new ContainerType<SampleType>({
      fields: {
        a: Number64,
        b: Bytes32,
        subType: subType,
        // @ts-expect-error
        list: numList,
      },
    });

    // Illegal type, the ListType elementType does not match
    const wrongElementType = new ListType<number[]>({
      // @ts-expect-error
      elementType: Bytes32,
      limit: 1,
    });

    // Do something with the values to prevent unused variable errors
    expect([
      goodType,
      missingProperty,
      undeclaredExtraProperty,
      wrongSubpropertyComposite,
      wrongSubpropertyList,
      wrongElementType,
    ]).to.be.ok;
  });
});
