// Adapted from https://github.com/prysmaticlabs/prysm/blob/master/shared/ssz/encode_test.go#L296
import {
  BigIntUintType,
  BitVectorType,
  BitListType,
  ByteVectorType,
  ContainerType,
  NumberUintType,
  byteType,
  ListType,
  VectorType,
  BooleanType,
  Number64UintType,
} from "../../src";
import {NoneType} from "../../src/types_old/basic/none";
import {UnionType} from "../../src/types_old/composite/union";

export const bytes2Type = new ByteVectorType({length: 2});
export const bytes4Type = new ByteVectorType({length: 4});
export const bytes8Type = new ByteVectorType({length: 8});
export const bytes32Type = new ByteVectorType({length: 32});

export const byteVector100Type = new ByteVectorType({length: 100});

export const bitList100Type = new BitListType({limit: 100});
export const bitVector100Type = new BitVectorType({length: 100});

export const bigint16Type = new BigIntUintType({byteLength: 2});
export const bigint64Type = new BigIntUintType({byteLength: 8});
export const bigint128Type = new BigIntUintType({byteLength: 16});
export const bigint256Type = new BigIntUintType({byteLength: 32});

export const number16Type = new NumberUintType({byteLength: 2});
export const number32Type = new NumberUintType({byteLength: 4});
export const number64Type = new NumberUintType({byteLength: 8});
export const number64Type2 = new Number64UintType();

export const number16Vector6Type = new VectorType({elementType: number16Type, length: 6});
export const number16List100Type = new ListType({elementType: number16Type, limit: 100});
export const bigint16List100Type = new ListType({elementType: bigint16Type, limit: 100});

export const SimpleObject = new ContainerType({
  fields: {
    b: number16Type,
    a: byteType,
  },
});

export const VariableSizeSimpleObject = new ContainerType({
  fields: {
    b: number16Type,
    a: byteType,
    list: number16List100Type,
  },
});

export const CamelCaseFieldObject = new ContainerType({
  fields: {
    someValue: new NumberUintType({byteLength: 4}),
    someOtherValue: new BooleanType(),
  },
});

export const NoTransformFieldObject = new ContainerType({
  fields: {
    someValue_RandOM: new NumberUintType({byteLength: 4}),
    someOtherValue_1Random2: new BooleanType(),
  },
});

export const NoTransformFieldObjectWithDeclaredExpectedCase = new ContainerType({
  fields: {
    someValue_RandOM: new NumberUintType({byteLength: 4}),
    someOtherValue_1Random2: new BooleanType(),
  },
  expectedCase: "notransform",
});

export const RandomTransformFieldObject = new ContainerType({
  fields: {
    someValueRandOM: new NumberUintType({byteLength: 4}),
    someOtherValue1Random2: new BooleanType(),
  },
});

export const SlashingTransformFieldObject = new ContainerType({
  fields: {
    eth1Data: new NumberUintType({byteLength: 4}),
    signedHeader1: new NumberUintType({byteLength: 4}),
    signedHeader2: new NumberUintType({byteLength: 4}),
    attestation1: new BooleanType(),
    attestation2: new BooleanType(),
  },
});

export const WithCasingDeclarationFieldObject = new ContainerType({
  fields: {
    eth1Data: new NumberUintType({byteLength: 4}),
    signedHeader1: new NumberUintType({byteLength: 4}),
    signedHeader2: new NumberUintType({byteLength: 4}),
    attestation1: new BooleanType(),
    attestation2: new BooleanType(),
  },
  casingMap: {
    signedHeader1: "signed_header_1",
    signedHeader2: "signed_header_2",
    attestation1: "attestation_1",
    attestation2: "attestation_2",
  },
});

export const ComplexCamelCaseFieldObject = new ContainerType({
  fields: {
    someValue: new NumberUintType({byteLength: 4}),
    someOtherValue: new BooleanType(),
    container: CamelCaseFieldObject,
  },
});

export const InnerObject = new ContainerType({
  fields: {
    v: number16Type,
  },
});

export const OuterObject = new ContainerType({
  fields: {
    v: byteType,
    subV: InnerObject,
  },
});

export const ArrayObject = new ContainerType({
  fields: {
    v: new ListType({
      elementType: SimpleObject,
      limit: 100,
    }),
  },
});

export const ArrayObject2 = new ListType({
  elementType: OuterObject,
  limit: 100,
});

export const UnionObject = new UnionType({types: [new NoneType(), SimpleObject, number16Type]});
export const balancesType = new ListType({elementType: number64Type, limit: 100});
