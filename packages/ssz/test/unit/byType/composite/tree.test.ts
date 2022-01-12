import {
  BooleanType,
  ContainerType,
  UintNumberType,
  UintBigintType,
  ListBasicType,
  ByteVectorType,
} from "../../../../src";
import {runViewTestCompositeSwap} from "../runViewTestCompositeSwap";

describe("TreeView swap properties", () => {
  const uint64Type = new UintNumberType(8, true);
  const containerUintsType = new ContainerType({
    a: uint64Type,
    b: uint64Type,
  });

  // Swap properties tests. Because swaping uses the same property names you can write many more tests
  // just by declaring the property type and two values:

  runViewTestCompositeSwap(new BooleanType(), true, false);
  runViewTestCompositeSwap(uint64Type, 1, 2);
  runViewTestCompositeSwap(uint64Type, 1, Infinity);
  runViewTestCompositeSwap(new UintBigintType(8), BigInt(1), BigInt(2));
  for (const bytes of [32, 48, 96]) {
    runViewTestCompositeSwap(new ByteVectorType(bytes), Buffer.alloc(bytes, 1), Buffer.alloc(bytes, 2));
  }

  // Composite childs
  runViewTestCompositeSwap(containerUintsType, {a: 1, b: 2}, {a: 5, b: 6});
  runViewTestCompositeSwap(new ListBasicType(uint64Type, 8), [1, 2], [5, 6]);
});
