import {Type} from "../../../src/v2/abstract";
import {BitVectorType} from "../../../src/v2/bitVector";
import {BitListType} from "../../../src/v2/bitList";
import {ContainerType} from "../../../src/v2/container";
import {ListBasicType} from "../../../src/v2/listBasic";
import {VectorBasicType} from "../../../src/v2/vectorBasic";
import {BooleanType} from "../../../src/v2/boolean";
import {UintBigintType} from "../../../src/v2/uint";
import {VectorCompositeType} from "../../../src/v2/vectorComposite";

const bool = new BooleanType();
const byte = new UintBigintType(1);
const uint8 = new UintBigintType(1);
const uint16 = new UintBigintType(2);
const uint32 = new UintBigintType(4);
const uint64 = new UintBigintType(8);
const uint128 = new UintBigintType(16);
const uint256 = new UintBigintType(32);

/* eslint-disable @typescript-eslint/naming-convention */

// class SingleFieldTestStruct(Container):
//     A: byte
const SingleFieldTestStruct = new ContainerType({
  a: byte,
});

// class SmallTestStruct(Container):
//     A: uint16
//     B: uint16
const SmallTestStruct = new ContainerType({
  a: uint16,
  b: uint16,
});

// class FixedTestStruct(Container):
//     A: uint8
//     B: uint64
//     C: uint32
const FixedTestStruct = new ContainerType({
  a: uint8,
  b: uint64,
  c: uint32,
});

// class VarTestStruct(Container):
//     A: uint16
//     B: List[uint16, 1024]
//     C: uint8
const VarTestStruct = new ContainerType({
  a: uint16,
  b: new ListBasicType(uint16, 1024),
  c: uint8,
});

// class ComplexTestStruct(Container):
//     A: uint16
//     B: List[uint16, 128]
//     C: uint8
//     D: Bytes[256]
//     E: VarTestStruct
//     F: Vector[FixedTestStruct, 4]
//     G: Vector[VarTestStruct, 2]
const ComplexTestStruct = new ContainerType({
  a: uint16,
  b: new ListBasicType(uint16, 128),
  c: uint8,
  d: new BitListType(256),
  e: VarTestStruct,
  f: new VectorCompositeType(FixedTestStruct, 4),
  g: new VectorCompositeType(VarTestStruct, 2),
});

// class BitsStruct(Container):
//     A: Bitlist[5]
//     B: Bitvector[2]
//     C: Bitvector[1]
//     D: Bitlist[6]
//     E: Bitvector[8]
const BitsStruct = new ContainerType({
  a: new BitListType(5),
  b: new BitVectorType(2),
  c: new BitVectorType(1),
  d: new BitListType(6),
  e: new BitVectorType(8),
});

const containerTypes = {
  SingleFieldTestStruct,
  SmallTestStruct,
  FixedTestStruct,
  VarTestStruct,
  ComplexTestStruct,
  BitsStruct,
};

const vecElementTypes = {
  bool,
  uint8,
  uint16,
  uint32,
  uint64,
  uint128,
  uint256,
};

export function getTestType(testType: string, testCase: string): Type<unknown> {
  switch (testType) {
    // `vec_{element type}_{length}`
    // {element type}: bool, uint8, uint16, uint32, uint64, uint128, uint256
    // {length}: an unsigned integer
    case "basic_vector": {
      const match = testCase.match(/vec_([^\W_]+)_([0-9]+)/);
      const [, elementTypeStr, lengthStr] = match || [];
      const elementType = vecElementTypes[elementTypeStr as keyof typeof vecElementTypes];
      if (!elementType) throw Error(`No vecElementType for ${elementTypeStr}: '${testCase}'`);
      const length = parseInt(lengthStr);
      if (isNaN(length)) throw Error(`Bad length ${length}: '${testCase}'`);
      return new VectorBasicType(elementType, length);
    }

    // `bitlist_{limit}`
    // {limit}: the list limit, in bits, of the bitlist.
    case "bitlist": {
      // Consider case `bitlist_no_delimiter_empty`
      const limit = testCase.includes("no_delimiter") ? 0 : parseSecondNum(testCase, "limit");
      // TODO: memoize
      return new BitListType(limit);
    }

    // `bitvec_{length}`
    // {length}: the length, in bits, of the bitvector.
    case "bitvector": {
      // TODO: memoize
      return new BitVectorType(parseSecondNum(testCase, "length"));
    }

    // A boolean has no type variations. Instead, file names just plainly describe the contents for debugging.
    case "boolean":
      return bool;

    // {container name}
    // {container name}: Any of the container names listed below (excluding the `(Container)` python super type)
    case "containers": {
      const match = testCase.match(/([^\W_]+)/);
      const containerName = (match || [])[1];
      const containerType = containerTypes[containerName as keyof typeof containerTypes];
      if (!containerType) throw Error(`No containerType for ${containerName}`);
      return containerType;
    }

    // `uint_{size}`
    // {size}: the uint size: 8, 16, 32, 64, 128 or 256.
    case "uints": {
      // TODO: memoize
      return new UintBigintType(parseSecondNum(testCase, "size") / 8);
    }

    default:
      throw Error(`Unknown testType ${testType}`);
  }
}

/**
 * Parse second num in a underscore string: `uint_8_`, returns 8
 */
function parseSecondNum(str: string, id: string): number {
  const match = str.match(/[^\W_]+_([0-9]+)/);
  const num = parseInt((match || [])[1]);
  if (isNaN(num)) throw Error(`Bad ${id} ${str}`);
  return num;
}
