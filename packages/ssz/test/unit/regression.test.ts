import {expect} from "chai";

import {
  VectorType,
  ByteVectorType,
  NumberUintType,
  BitListType,
  BitVectorType,
  ListType,
  fromHexString,
  toHexString,
  BitList,
} from "../../src";

/* eslint-disable max-len */

describe("known issues", () => {
  it("SyncCommitteeBits hashTreeRoot consistency", function () {
    const SyncCommitteeBits = new BitVectorType({
      length: 512,
    });
    const biStr =
      "00001110011100101010100110111001111011110111001110110010101000010010011110000110001101111100100100011011001001010000111010010011100100111010111101110110001000000011011001011000011101010111111011000110000101100111111000110011110010010110101011111110111010101111110010011111101001011110001101111110111001100110110001100010100010101110110010100100001011000101101000011010111010111000100100101000101100001100011001110100100111110011100111001100101001011011111001111010111011000100100000010000000111010010100000000111";
    const arr = Array.from({length: 512}, (_, i) => (biStr.charAt(i) === "0" ? false : true));
    const rootByStruct = SyncCommitteeBits.hashTreeRoot(arr);
    const bytes = SyncCommitteeBits.serialize(arr);
    const rootByTreeBacked = SyncCommitteeBits.createTreeBackedFromBytes(bytes).hashTreeRoot();
    expect(toHexString(rootByStruct)).to.be.equal(toHexString(rootByTreeBacked), "Inconsistent hashTreeRoot");
  });

  it("default value of composite vector should be correct", () => {
    const Vec = new VectorType({
      elementType: new ByteVectorType({length: 4}),
      length: 4,
    });
    expect(Vec.defaultValue().length).to.equal(Vec.length);
  });

  it("far future epoch from json", function () {
    const Number = new NumberUintType({byteLength: 8});
    const maxBigInt = Number.struct_getMaxBigInt();
    const farFutureEpoch = Number.fromJson(maxBigInt.toString());
    expect(farFutureEpoch).to.be.equal(Infinity);
  });

  it("too large number from json", function () {
    const Number = new NumberUintType({byteLength: 4});
    expect(() => Number.fromJson("18446744073709551616")).to.throw();
  });

  it("converts bit arrays to tree", function () {
    const CommitteeBits = new BitListType({limit: 2048});
    const CommitteeBitsVector = new BitVectorType({length: 2048});
    const bits = Array.from({length: 2048}, () => true) as BitList;

    expect(() => CommitteeBits.createTreeBackedFromStruct(bits)).to.not.throw();
    expect(() => CommitteeBitsVector.createTreeBackedFromStruct(bits)).to.not.throw();
  });

  it("converts Uint8Array to tree", function () {
    const CommitteeBits = new BitListType({limit: 32});
    const CommitteeBitsVector = new BitVectorType({length: 32});
    const validBytes = fromHexString("0xffffffff");

    expect(() => CommitteeBits.createTreeBackedFromBytes(validBytes)).to.not.throw();
    expect(() => CommitteeBitsVector.createTreeBackedFromBytes(validBytes)).to.not.throw();

    const invalidBytes = fromHexString("0xffffffffff");
    const CommitteeBitsVector2 = new BitVectorType({length: 33});
    // all bits after length should be 0 so this should throw error
    expect(() => CommitteeBitsVector2.createTreeBackedFromBytes(invalidBytes)).to.throw(
      "Invalid deserialized bitvector length"
    );
  });

  it("converts basic vector and list from json", function () {
    const Vec = new VectorType({
      elementType: new NumberUintType({byteLength: 4}),
      length: 4,
    });
    const Lis = new ListType({
      elementType: new NumberUintType({byteLength: 4}),
      limit: 4,
    });
    const arr = [1, 2, 3, 4];
    const json = arr.map(String);

    expect(Vec.fromJson(json)).to.deep.equal(arr);
    expect(Lis.fromJson(json)).to.deep.equal(arr);
  });
});
