import {
  BitListType,
  BitVectorType,
  BooleanType,
  CompatibleUnionType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  ProgressiveBitListType,
  ProgressiveContainerType,
  ProgressiveListBasicType,
  ProgressiveListCompositeType,
  Type,
  UintBigintType,
  UintNumberType,
  VectorBasicType,
  VectorCompositeType,
} from "../../../src/index.ts";
import {UintBigintByteLen} from "../../../src/type/uint.ts";

const bool = new BooleanType();
const byte = new UintNumberType(1);
const uint8 = new UintNumberType(1);
const uint16 = new UintNumberType(2);
const uint32 = new UintNumberType(4);
const uint64 = new UintBigintType(8);
const uint128 = new UintBigintType(16);
const uint256 = new UintBigintType(32);

// class SingleFieldTestStruct(Container):
//     A: byte
const SingleFieldTestStruct = new ContainerType({
  A: byte,
});

// class SmallTestStruct(Container):
//     A: uint16
//     B: uint16
const SmallTestStruct = new ContainerType({
  A: uint16,
  B: uint16,
});

// class FixedTestStruct(Container):
//     A: uint8
//     B: uint64
//     C: uint32
const FixedTestStruct = new ContainerType({
  A: uint8,
  B: uint64,
  C: uint32,
});

// class VarTestStruct(Container):
//     A: uint16
//     B: List[uint16, 1024]
//     C: uint8
const VarTestStruct = new ContainerType({
  A: uint16,
  B: new ListBasicType(uint16, 1024),
  C: uint8,
});

// class ProgressiveTestStruct(Container):
//     A: ProgressiveList[byte]
//     B: ProgressiveList[uint64]
//     C: ProgressiveList[SmallTestStruct]
//     D: ProgressiveList[ProgressiveList[VarTestStruct]]
const ProgressiveListVarTestStruct = new ProgressiveListCompositeType(VarTestStruct);
const ProgressiveTestStruct = new ContainerType({
  A: new ProgressiveListBasicType(byte),
  B: new ProgressiveListBasicType(uint64),
  C: new ProgressiveListCompositeType(SmallTestStruct),
  D: new ProgressiveListCompositeType(ProgressiveListVarTestStruct),
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
  A: uint16,
  B: new ListBasicType(uint16, 128),
  C: uint8,
  D: new BitListType(256),
  E: VarTestStruct,
  F: new VectorCompositeType(FixedTestStruct, 4),
  G: new VectorCompositeType(VarTestStruct, 2),
});

// class BitsStruct(Container):
//     A: Bitlist[5]
//     B: Bitvector[2]
//     C: Bitvector[1]
//     D: Bitlist[6]
//     E: Bitvector[8]
const BitsStruct = new ContainerType({
  A: new BitListType(5),
  B: new BitVectorType(2),
  C: new BitVectorType(1),
  D: new BitListType(6),
  E: new BitVectorType(8),
});

// class ProgressiveBitsStruct(Container):
//     A: Bitvector[256]
//     B: Bitlist[256]
//     C: ProgressiveBitlist
//     D: Bitvector[257]
//     E: Bitlist[257]
//     F: ProgressiveBitlist
//     G: Bitvector[1280]
//     H: Bitlist[1280]
//     I: ProgressiveBitlist
//     J: Bitvector[1281]
//     K: Bitlist[1281]
//     L: ProgressiveBitlist
const ProgressiveBitsStruct = new ContainerType({
  A: new BitVectorType(256),
  B: new BitListType(256),
  C: new ProgressiveBitListType(),
  D: new BitVectorType(257),
  E: new BitListType(257),
  F: new ProgressiveBitListType(),
  G: new BitVectorType(1280),
  H: new BitListType(1280),
  I: new ProgressiveBitListType(),
  J: new BitVectorType(1281),
  K: new BitListType(1281),
  L: new ProgressiveBitListType(),
});

// class ProgressiveSingleFieldContainerTestStruct(ProgressiveContainer(active_fields=[1])):
//     A: byte
const ProgressiveSingleFieldContainerTestStruct = new ProgressiveContainerType({A: byte}, [true]);

// class ProgressiveSingleListContainerTestStruct(ProgressiveContainer(active_fields=[0, 0, 0, 0, 1])):
//     C: ProgressiveBitlist
const ProgressiveSingleListContainerTestStruct = new ProgressiveContainerType({C: new ProgressiveBitListType()}, [
  false,
  false,
  false,
  false,
  true,
]);

// class ProgressiveVarTestStruct(ProgressiveContainer(active_fields=[1, 0, 1, 0, 1])):
//     A: byte
//     B: List[uint16, 123]
//     C: ProgressiveBitlist
const ProgressiveVarTestStruct = new ProgressiveContainerType(
  {
    A: byte,
    B: new ListBasicType(uint16, 123),
    C: new ProgressiveBitListType(),
  },
  [true, false, true, false, true]
);

// class ProgressiveComplexTestStruct(
//     ProgressiveContainer(
//         active_fields=[1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1]
//     )
// ):
//     A: byte
//     B: List[uint16, 123]
//     C: ProgressiveBitlist
//     D: ProgressiveList[uint64]
//     E: ProgressiveList[SmallTestStruct]
//     F: ProgressiveList[ProgressiveList[VarTestStruct]]
//     G: List[ProgressiveSingleFieldContainerTestStruct, 10]
//     H: ProgressiveList[ProgressiveVarTestStruct]
const ProgressiveComplexTestStruct = new ProgressiveContainerType(
  {
    A: byte,
    B: new ListBasicType(uint16, 123),
    C: new ProgressiveBitListType(),
    D: new ProgressiveListBasicType(uint64),
    E: new ProgressiveListCompositeType(SmallTestStruct),
    F: new ProgressiveListCompositeType(ProgressiveListVarTestStruct),
    G: new ListCompositeType(ProgressiveSingleFieldContainerTestStruct, 10),
    H: new ProgressiveListCompositeType(ProgressiveVarTestStruct),
  },
  [
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
  ]
);

const containerTypes = {
  SingleFieldTestStruct,
  SmallTestStruct,
  FixedTestStruct,
  VarTestStruct,
  ComplexTestStruct,
  ProgressiveTestStruct,
  BitsStruct,
  ProgressiveBitsStruct,
};

const progressiveContainerTypes = {
  ProgressiveSingleFieldContainerTestStruct,
  ProgressiveSingleListContainerTestStruct,
  ProgressiveVarTestStruct,
  ProgressiveComplexTestStruct,
};

// CompatibleUnion({1: ProgressiveSingleFieldContainerTestStruct})
const CompatibleUnionA = new CompatibleUnionType({
  1: ProgressiveSingleFieldContainerTestStruct,
});

// CompatibleUnion({2: ProgressiveSingleListContainerTestStruct, 3: ProgressiveVarTestStruct})
const CompatibleUnionBC = new CompatibleUnionType({
  2: ProgressiveSingleListContainerTestStruct,
  3: ProgressiveVarTestStruct,
});

// CompatibleUnion({
//     1: ProgressiveSingleFieldContainerTestStruct,
//     2: ProgressiveSingleListContainerTestStruct,
//     3: ProgressiveVarTestStruct,
//     4: ProgressiveSingleFieldContainerTestStruct,
// })
const CompatibleUnionABCA = new CompatibleUnionType({
  1: ProgressiveSingleFieldContainerTestStruct,
  2: ProgressiveSingleListContainerTestStruct,
  3: ProgressiveVarTestStruct,
  4: ProgressiveSingleFieldContainerTestStruct,
});

const compatibleUnionTypes = {
  CompatibleUnionA,
  CompatibleUnionBC,
  CompatibleUnionABCA,
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
      if (elementType === undefined) throw Error(`No vecElementType for ${elementTypeStr}: '${testCase}'`);
      const length = parseInt(lengthStr);
      if (Number.isNaN(length)) throw Error(`Bad length ${length}: '${testCase}'`);
      return new VectorBasicType(elementType, length);
    }

    // `bitlist_{limit}`
    // {limit}: the list limit, in bits, of the bitlist.
    case "bitlist": {
      // Consider case `bitlist_no_delimiter_empty`
      const limit = testCase.includes("no_delimiter") ? 1024 : parseSecondNum(testCase, "limit");
      // TODO: memoize
      return new BitListType(limit);
    }

    // `bitvec_{length}`
    // {length}: the length, in bits, of the bitvector.
    case "bitvector": {
      // TODO: memoize
      return new BitVectorType(parseSecondNum(testCase, "length"));
    }

    // `proglist_{element type}_{mode}_{length}`
    // {element type}: bool, uint8, uint16, uint32, uint64, uint128, uint256
    case "basic_progressive_list": {
      const match = testCase.match(/proglist_([^\W_]+)_/);
      const [, elementTypeStr] = match || [];
      const elementType = vecElementTypes[elementTypeStr as keyof typeof vecElementTypes];
      if (elementType === undefined)
        throw Error(`No progressive list elementType for ${elementTypeStr}: '${testCase}'`);
      return new ProgressiveListBasicType(elementType);
    }

    // A progressive bitlist has no limit variations.
    case "progressive_bitlist":
      return new ProgressiveBitListType();

    // A boolean has no type variations. Instead, file names just plainly describe the contents for debugging.
    case "boolean":
      return bool;

    // {container name}
    // {container name}: Any of the container names listed below (excluding the `(Container)` python super type)
    case "containers": {
      const match = testCase.match(/([^\W_]+)/);
      const containerName = (match || [])[1];
      const containerType = containerTypes[containerName as keyof typeof containerTypes];
      if (containerType === undefined) throw Error(`No containerType for ${containerName}`);
      return containerType;
    }

    // {container name}
    // {container name}: Any of the progressive container names listed above.
    case "progressive_containers": {
      const match = testCase.match(/([^\W_]+)/);
      const containerName = (match || [])[1];
      const containerType = progressiveContainerTypes[containerName as keyof typeof progressiveContainerTypes];
      if (containerType === undefined) throw Error(`No progressiveContainerType for ${containerName}`);
      return containerType;
    }

    // {compatible union name}
    // {compatible union name}: Any of the compatible union names listed above.
    case "compatible_unions": {
      const match = testCase.match(/([^\W_]+)/);
      const compatibleUnionName = (match || [])[1];
      const compatibleUnionType = compatibleUnionTypes[compatibleUnionName as keyof typeof compatibleUnionTypes];
      if (compatibleUnionType === undefined) throw Error(`No compatibleUnionType for ${compatibleUnionName}`);
      return compatibleUnionType;
    }

    // `uint_{size}`
    // {size}: the uint size: 8, 16, 32, 64, 128 or 256.
    case "uints": {
      // TODO: memoize
      return new UintBigintType((parseSecondNum(testCase, "size") / 8) as UintBigintByteLen);
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
  if (Number.isNaN(num)) throw Error(`Bad ${id} ${str}`);
  return num;
}
