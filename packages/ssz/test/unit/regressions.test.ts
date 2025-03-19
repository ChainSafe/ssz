import {describe, expect, it} from "vitest";
import {
  BitArray,
  BitListType,
  BitVectorType,
  BooleanType,
  ContainerType,
  ListBasicType,
  UintBigintType,
  ValueOf,
  VectorBasicType,
  fromHexString,
  toHexString,
} from "../../src/index.js";
import {uint32NumType, uint64NumType} from "../utils/primitiveTypes.js";

const VALIDATOR_REGISTRY_LIMIT = 1099511627776;
// Compilation of various issues from SSZ and Lodestar libs

describe("Regressions / known issues", () => {
  it("SyncCommitteeBits hashTreeRoot consistency", () => {
    const SyncCommitteeBits = new BitVectorType(512);
    const bitStr =
      "00001110011100101010100110111001111011110111001110110010101000010010011110000110001101111100100100011011001001010000111010010011100100111010111101110110001000000011011001011000011101010111111011000110000101100111111000110011110010010110101011111110111010101111110010011111101001011110001101111110111001100110110001100010100010101110110010100100001011000101101000011010111010111000100100101000101100001100011001110100100111110011100111001100101001011011111001111010111011000100100000010000000111010010100000000111";
    const bitArray = BitArray.fromBitLen(512);
    for (let i = 0; i < 512; i++) {
      bitArray.set(i, bitStr.charAt(i) !== "0");
    }

    const rootByStruct = SyncCommitteeBits.hashTreeRoot(bitArray);
    const bytes = SyncCommitteeBits.serialize(bitArray);
    const rootByTreeBacked = SyncCommitteeBits.deserializeToViewDU(bytes).hashTreeRoot();
    expect(toHexString(rootByStruct)).to.be.equal(toHexString(rootByTreeBacked), "Inconsistent hashTreeRoot");
    const rootByBatch = SyncCommitteeBits.deserializeToViewDU(bytes).batchHashTreeRoot();
    expect(toHexString(rootByStruct)).to.be.equal(toHexString(rootByBatch), "Inconsistent hashTreeRoot");
  });

  it("converts bit arrays to tree", () => {
    const CommitteeBits = new BitListType(2048);
    const CommitteeBitsVector = new BitVectorType(2048);

    // Set a bitArray to all true
    const bitArray = new BitArray(Buffer.alloc(2048 / 8, 0xff), 2048);

    expect(() => CommitteeBits.toViewDU(bitArray)).to.not.throw();
    expect(() => CommitteeBitsVector.toViewDU(bitArray)).to.not.throw();
  });

  it("converts Uint8Array to tree", () => {
    const CommitteeBits = new BitListType(32);
    const CommitteeBitsVector = new BitVectorType(32);
    const validBytes = fromHexString("0xffffffff");

    expect(() => CommitteeBits.deserializeToViewDU(validBytes)).to.not.throw();
    expect(() => CommitteeBitsVector.deserializeToViewDU(validBytes)).to.not.throw();

    const invalidBytes = fromHexString("0xffffffffff");
    const CommitteeBitsVector2 = new BitVectorType(33);
    // all bits after length should be 0 so this should throw error
    expect(() => CommitteeBitsVector2.deserializeToViewDU(invalidBytes)).toThrow("BitVector: nonzero bits past length");
  });

  it("converts basic vector and list from json", () => {
    const Vec = new VectorBasicType(uint32NumType, 4);
    const Lis = new ListBasicType(uint32NumType, 4);
    const arr = [1, 2, 3, 4];
    const json = arr.map(String);

    expect(Vec.fromJson(json)).to.deep.equal(arr);
    expect(Lis.fromJson(json)).to.deep.equal(arr);
  });

  it("should hash active validation indexes correctly as in final_updates_minimal.yaml", () => {
    const validatorIndexes = [];
    for (let i = 0; i < 64; i++) {
      validatorIndexes.push(i);
    }

    const type = new ListBasicType(uint64NumType, VALIDATOR_REGISTRY_LIMIT);
    // This is the logic to calculate activeIndexRoots in processFinalUpdates
    const hash = Buffer.from(type.hashTreeRoot(validatorIndexes)).toString("hex");
    expect(hash).to.equal("ba1031ba1a5daab0d49597cfa8664ce2b4c9b4db6ca69fbef51e0a9a325a3b63");
  });
});

// Proves resolution of issues from report
// https://gist.github.com/asanso/034adcd01216fe7e27c478a50b9da29a
describe("@asanso - Lodestar SSZ vulnerability report", () => {
  const booleanType = new BooleanType();
  const uintBn64 = new UintBigintType(8);

  it("Valid use case", () => {
    // Creates a "Example" SSZ data type
    const Example = new ContainerType({
      foo: booleanType,
      bar: new ListBasicType(booleanType, 8),
      baz: new ListBasicType(booleanType, 8),
      qux: booleanType,
    });

    // Now you can perform different operations on Example objects
    const ex: ValueOf<typeof Example> = {foo: true, bar: [true], baz: [true], qux: false};

    const serialized = Example.serialize(ex); // serialize the object to a byte array
    // By shifting the second offset one byte, the element of bar is deserialized as baz
    serialized[5] -= 1;

    // OK
    expect(Example.deserialize(serialized)).to.deep.equal({foo: true, bar: [], baz: [true, true], qux: false});
  });

  it("POC not multiple", () => {
    // Creates a "Example" SSZ data type
    const Example = new ContainerType({
      foo: booleanType,
      bar: new ListBasicType(uintBn64, 2),
      baz: new ListBasicType(uintBn64, 2),
    });

    // Now you can perform different operations on Example objects
    const ex: ValueOf<typeof Example> = {foo: true, bar: [0x01n], baz: [0x02n]};

    const serialized: Uint8Array = Example.serialize(ex); // serialize the object to a byte array
    // By shifting the second offset one byte, now the offset is invalid, because not a multiple of uintBn64 bytelen
    serialized[5] -= 1;

    // NOK
    expect(() => Example.deserialize(serialized)).toThrow("not multiple of");
  });

  it("POC not multiple not monomorhic", () => {
    // Creates a "Example" SSZ data type
    const Example = new ContainerType({
      foo: booleanType,
      bar: new ListBasicType(uintBn64, 2),
      baz: new ListBasicType(uintBn64, 2),
    });

    // Now you can perform different operations on Example objects
    const ex: ValueOf<typeof Example> = {foo: true, bar: [0x01n], baz: [0x02n]};
    //ex.coq =[0x03n]

    const serialized: Uint8Array = Example.serialize(ex); // serialize the object to a byte array
    // 0x01090000001100000001000000000000000200000000000000
    // 00 - 01 - foo value
    // 01 - 09000000 bar offset 9
    // 05 - 11000000 baz offset 17
    // 09 - 0100000000000000 bar value 9 -> 17
    // 17 - 0200000000000000 baz value 17 -> 25

    serialized[5] = 0x0a;
    serialized[10] = 0x07;
    // 0x01090000000a00000001070000000000000200000000000000
    // 00 - 01 - foo value
    // 01 - 09000000 bar offset 9
    // 05 - 0a000000 baz offset 10 - Invalid, bar size must be multiple of 8
    // 09 - 01 bar value 9:10
    // 10 - 070000000000000200000000000000 baz value 10:25
    expect(() => Example.deserialize(serialized)).toThrow("not multiple of");
  });

  it("adding single byte at the end", () => {
    // Creates a "Example" SSZ data type
    const VarTestStruct = new ContainerType({
      a: new UintBigintType(2),
      b: new ListBasicType(new UintBigintType(2), 1024),
      c: new UintBigintType(1),
    });

    // Now you can perform different operations on Example objects
    const ex: ValueOf<typeof VarTestStruct> = {a: 1n, b: [2n], c: 3n};

    const serialized: Uint8Array = VarTestStruct.serialize(ex); // serialize the object to a byte array
    // 0x010007000000030200
    // 00 - 0100 - a value
    // 02 - 07000000 - b offset 7
    // 06 - 03 - c value
    // 07 - 0200 - b value 7:9

    const serializedExtraByte = new Uint8Array([...serialized, 0x01]);
    // 0x01000700000003020001
    // 00 - 0100 - a value
    // 02 - 07000000 - b offset 7
    // 06 - 03 - c value
    // 07 - 020001 - b value 7:10 -  Invalid, not multiple of Uint16

    // NOK
    // THIS SHOULD FAIL ==> a single byte is added at the end when instead elementType: new BigIntUintType({byteLength: 2}),
    expect(() => VarTestStruct.deserialize(serializedExtraByte)).toThrow("not multiple of");
  });
});
