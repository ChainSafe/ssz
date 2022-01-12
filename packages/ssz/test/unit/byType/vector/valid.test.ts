import {ContainerType, VectorBasicType, VectorCompositeType, UintNumberType, ByteVectorType} from "../../../../src";
import {runTypeTestValid} from "../runTypeTestValid";

const rootType = new ByteVectorType(32);
const uint64Type = new UintNumberType(8);
const zeroHash = Buffer.alloc(32, 0);

runTypeTestValid({
  type: new VectorBasicType(uint64Type, 4),
  defaultValue: [0, 0, 0, 0],
  values: [
    {
      id: "4 values",
      serialized: "0xa086010000000000400d030000000000e093040000000000801a060000000000",
      json: ["100000", "200000", "300000", "400000"],
      root: "0xa086010000000000400d030000000000e093040000000000801a060000000000",
    },
  ],
});

runTypeTestValid({
  type: new VectorCompositeType(rootType, 4),
  defaultValue: [zeroHash, zeroHash, zeroHash, zeroHash],
  values: [
    {
      id: "4 roots",
      serialized:
        "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      json: [
        "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
        "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      ],
      root: "0x56019bafbc63461b73e21c6eae0c62e8d5b8e05cb0ac065777dc238fcf9604e6",
    },
  ],
});

runTypeTestValid({
  type: new VectorCompositeType(new ContainerType({a: uint64Type, b: uint64Type}), 4),
  defaultValue: [
    {a: 0, b: 0},
    {a: 0, b: 0},
    {a: 0, b: 0},
    {a: 0, b: 0},
  ],
  values: [
    {
      id: "4 values",
      serialized:
        "0x0000000000000000000000000000000040e2010000000000f1fb0900000000004794030000000000f8ad0b00000000004e46050000000000ff5f0d0000000000",
      json: [
        {a: "0", b: "0"},
        {a: "123456", b: "654321"},
        {a: "234567", b: "765432"},
        {a: "345678", b: "876543"},
      ],
      root: "0xb1a797eb50654748ba239010edccea7b46b55bf740730b700684f48b0c478372",
    },
  ],
});
