import {expect} from "chai";
import * as src from "../../src";

describe("isFooType", () => {
  const cases: {
    type: src.Type<any>;
    isType: ((t: src.Type<any>) => boolean) | ((t: src.Type<any>) => boolean)[];
    isntType?: ((t: src.Type<any>) => boolean) | ((t: src.Type<any>) => boolean)[];
  }[] = [
    {
      type: new src.NumberUintType({byteLength: 4}),
      isType: [
        src.isUintType,
        src.isNumberUintType,
      ],
      isntType: [
        src.isBigIntUintType,
        src.isContainerType,
      ]
    },
    {
      type: new src.BigIntUintType({byteLength: 4}),
      isType: [
        src.isUintType,
        src.isBigIntUintType,
      ],
      isntType: [
        src.isNumberUintType,
        src.isContainerType,
      ]
    },
    {
      type: new src.BooleanType(),
      isType: src.isBooleanType,
      isntType: src.isNumberUintType,
    },
    {
      type: new src.VectorType({
        elementType: new src.NumberUintType({byteLength: 4}),
        length: 4,
      }),
      isType: src.isVectorType,
    },
    {
      type: new src.ListType({
        elementType: new src.NumberUintType({byteLength: 4}),
        limit: 4,
      }),
      isType: src.isListType,
    },
    {
      type: new src.BitVectorType({
        length: 4,
      }),
      isType: [
        src.isVectorType,
        src.isBitVectorType,
      ],
    },
    {
      type: new src.BitListType({
        limit: 4,
      }),
      isType: [
        src.isListType,
        src.isBitListType,
      ],
    },
    {
      type: new src.ByteVectorType({
        length: 4,
      }),
      isType: [
        src.isVectorType,
        src.isByteVectorType,
      ],
    },
    {
      type: new src.ContainerType({
        fields: {
          foo: new src.NumberUintType({byteLength: 4})
        },
      }),
      isType: src.isContainerType,
    },
  ];
  for (const {type, isType, isntType} of cases) {
    for (const _isType of (Array.isArray(isType) ? isType : [isType])) {
      it(`${type.constructor.name} should match ${_isType.name}`, () => {
        expect(_isType(type)).to.be.true;
      });
    }
    if (!isntType) {
      return;
    }
    for (const _isntType of (Array.isArray(isntType) ? isntType : [isntType])) {
      it(`${type.constructor.name} should not match ${_isntType.name}`, () => {
        expect(_isntType(type)).to.be.false;
      });
    }
  }
});
