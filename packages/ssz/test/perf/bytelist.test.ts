import {itBench} from "@dapplion/benchmark";
import {ByteListType, ListBasicType, UintNumberType} from "../../src";

describe("ByteListType vs BasicListType<byte>", () => {
  const limit = 256 * 2;
  const byteLs = new ByteListType(limit);
  const byteType = new UintNumberType(1);
  const basicLs = new ListBasicType(byteType, limit);

  const length = 256;
  const arr = Object.keys(Array.from({length})).map(() => 0xaa);
  const buf = Buffer.alloc(length, 0xaa);

  const tbByteLs = byteLs.toView(buf);
  const tbBasicLs = basicLs.toView(arr);
  const tbByteLsSerialized = byteLs.serialize(tbByteLs);
  const tbBasicLsSerialized = tbBasicLs.serialize();

  const ROUNDS = 10000;

  itBench("ByteListType - deserialize", () => {
    for (let i = 0; i < ROUNDS; i++) {
      byteLs.deserialize(tbByteLsSerialized);
    }
  });
  itBench("BasicListType<byte> - deserialize", () => {
    for (let i = 0; i < ROUNDS; i++) {
      basicLs.deserialize(tbBasicLsSerialized);
    }
  });

  itBench("ByteListType - serialize", () => {
    for (let i = 0; i < ROUNDS; i++) {
      byteLs.serialize(tbByteLs);
    }
  });
  itBench("BasicListType<byte> - serialize", () => {
    for (let i = 0; i < ROUNDS; i++) {
      tbBasicLs.serialize();
    }
  });

  itBench("BasicListType<byte> - tree_convertToStruct", () => {
    for (let i = 0; i < ROUNDS; i++) {
      tbBasicLs.toValue();
    }
  });
});
