import {
  BooleanType,
  ContainerType,
  UintNumberType,
  UintBigintType,
  ListBasicType,
  ByteVectorType,
  UnionType,
  NoneType,
  BitVectorType,
  BitArray,
} from "../../../../src";
import {uintNumberByteLens, uintBigintByteLens} from "../../../../src/type/uint";
import {runViewTestCompositeSwap} from "../runViewTestCompositeSwap";

// Swap properties tests. Because swaping uses the same property names you can write many more tests
// just by declaring the property type and two values:

runViewTestCompositeSwap(new BooleanType(), true, false);

// Run for all possible byteLen
for (const byteLen of uintNumberByteLens) {
  const uintType = new UintNumberType(byteLen);
  runViewTestCompositeSwap(uintType, 1, 2);
}

for (const byteLen of uintBigintByteLens) {
  const uintType = new UintBigintType(byteLen);
  runViewTestCompositeSwap(uintType, BigInt(1), BigInt(2));
}

// Special case for Uint64Inf
const uint64NumInfType = new UintNumberType(8, {clipInfinity: true});
runViewTestCompositeSwap(uint64NumInfType, 1, 2);
runViewTestCompositeSwap(uint64NumInfType, 1, Infinity);

for (const bytes of [32, 48, 96]) {
  runViewTestCompositeSwap(new ByteVectorType(bytes), Buffer.alloc(bytes, 1), Buffer.alloc(bytes, 2));
}

// Composite childs

runViewTestCompositeSwap(new ContainerType({a: uint64NumInfType, b: uint64NumInfType}), {a: 1, b: 2}, {a: 5, b: 6});

runViewTestCompositeSwap(new ListBasicType(uint64NumInfType, 8), [1, 2], [5, 6]);

runViewTestCompositeSwap(
  new UnionType([new NoneType(), uint64NumInfType]),
  {selector: 0, value: null},
  {selector: 1, value: 0xff}
);

runViewTestCompositeSwap(new BitVectorType(4), BitArray.fromSingleBit(4, 0), BitArray.fromSingleBit(4, 1));
