import {itBench} from "@dapplion/benchmark";
import {ByteListType, BasicListType, byteType} from "../../src";

describe("ByteListType vs BasicListType<byte>", () => {
  const limit = 2 + 100 + Math.floor(Math.random() * 1000);
  const byteLs = new ByteListType({limit});
  const basicLs = new BasicListType({elementType: byteType, limit});

  const length = Math.min(1 + Math.floor(Math.random() * limit), limit - 1 - 100);
  const struct = Object.keys(Array.from({length})).map(() => Math.floor(Math.random() * 255));

  const tbByteLs = byteLs.createTreeBackedFromStruct(struct);
  const tbBasicLs = basicLs.createTreeBackedFromStruct(struct);
  const tbByteLsSerialized = byteLs.serialize(tbByteLs);
  const tbBasicLsSerialized = basicLs.serialize(tbBasicLs);

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
      basicLs.serialize(tbBasicLs);
    }
  });

  itBench("ByteListType - tree_convertToStruct", () => {
    for (let i = 0; i < ROUNDS; i++) {
      byteLs.tree_convertToStruct(tbByteLs.tree);
    }
  });
  itBench("BasicListType<byte> - tree_convertToStruct", () => {
    for (let i = 0; i < ROUNDS; i++) {
      basicLs.tree_convertToStruct(tbBasicLs.tree);
    }
  });
});
