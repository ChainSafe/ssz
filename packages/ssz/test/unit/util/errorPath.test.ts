import {describe, expect, it} from "vitest";

import {ContainerType, ListBasicType, ListCompositeType, Type} from "../../../src/index.ts";
import {byteType} from "../../utils/primitiveTypes.ts";

const SimpleObject = new ContainerType({
  b: byteType,
  a: byteType,
  c: new ListBasicType(byteType, 100),
});

const ArrayObject = new ContainerType({
  v: new ListCompositeType(SimpleObject, 100),
});

// ErrorPath functionality is disabled
describe.skip("error path", () => {
  const testCases: {
    value: string;
    type: Type<any>;
    expected: any;
  }[] = [
    {
      value: "04000000080000000f0000000201060000000504030400000005",
      type: ArrayObject,
      expected: {
        v: [
          {b: 2, a: 1, c: [5]},
          {b: 4, a: 3, c: [5]},
        ],
      },
    },
  ];

  for (const {type, value} of testCases) {
    it(`should print the error path deserializing ${type.constructor.name}`, () => {
      expect(() => type.deserialize(Buffer.from(value, "hex"))).toThrow("v: Offset out of bounds");
    });
  }
});
