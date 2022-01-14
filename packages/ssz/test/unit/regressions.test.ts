import {expect} from "chai";
import {number64Type} from "./testTypes";
import {
  VectorBasicType,
  ListBasicType,
  UintNumberType,
  BitListType,
  BitVectorType,
  fromHexString,
  toHexString,
  BitArray,
} from "../../src";

// Compilation of various issues from SSZ and Lodestar libs

/* eslint-disable max-len */

describe("Regressions / known issues", () => {
  it("SyncCommitteeBits hashTreeRoot consistency", function () {
    const SyncCommitteeBits = new BitVectorType(512);
    const bitStr =
      "00001110011100101010100110111001111011110111001110110010101000010010011110000110001101111100100100011011001001010000111010010011100100111010111101110110001000000011011001011000011101010111111011000110000101100111111000110011110010010110101011111110111010101111110010011111101001011110001101111110111001100110110001100010100010101110110010100100001011000101101000011010111010111000100100101000101100001100011001110100100111110011100111001100101001011011111001111010111011000100100000010000000111010010100000000111";
    const bitArray = BitArray.fromBitLen(512);
    for (let i = 0; i < 512; i++) {
      bitArray.set(i, bitStr.charAt(i) === "0" ? false : true);
    }

    const rootByStruct = SyncCommitteeBits.hashTreeRoot(bitArray);
    const bytes = SyncCommitteeBits.serialize(bitArray);
    const rootByTreeBacked = SyncCommitteeBits.deserializeToViewDU(bytes).hashTreeRoot();
    expect(toHexString(rootByStruct)).to.be.equal(toHexString(rootByTreeBacked), "Inconsistent hashTreeRoot");
  });

  it("converts bit arrays to tree", function () {
    const CommitteeBits = new BitListType(2048);
    const CommitteeBitsVector = new BitVectorType(2048);

    // Set a bitArray to all true
    const bitArray = new BitArray(Buffer.alloc(2048 / 8, 0xff), 2048);

    expect(() => CommitteeBits.toViewDU(bitArray)).to.not.throw();
    expect(() => CommitteeBitsVector.toViewDU(bitArray)).to.not.throw();
  });

  it("converts Uint8Array to tree", function () {
    const CommitteeBits = new BitListType(32);
    const CommitteeBitsVector = new BitVectorType(32);
    const validBytes = fromHexString("0xffffffff");

    expect(() => CommitteeBits.deserializeToViewDU(validBytes)).to.not.throw();
    expect(() => CommitteeBitsVector.deserializeToViewDU(validBytes)).to.not.throw();

    const invalidBytes = fromHexString("0xffffffffff");
    const CommitteeBitsVector2 = new BitVectorType(33);
    // all bits after length should be 0 so this should throw error
    expect(() => CommitteeBitsVector2.deserializeToViewDU(invalidBytes)).to.throw(
      "BitVector: nonzero bits past length"
    );
  });

  it("converts basic vector and list from json", function () {
    const Vec = new VectorBasicType(new UintNumberType(4), 4);
    const Lis = new ListBasicType(new UintNumberType(4), 4);
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

    const VALIDATOR_REGISTRY_LIMIT = 1099511627776;
    const type = new ListBasicType(number64Type, VALIDATOR_REGISTRY_LIMIT);
    // This is the logic to calculate activeIndexRoots in processFinalUpdates
    const hash = Buffer.from(type.hashTreeRoot(validatorIndexes)).toString("hex");
    expect(hash).to.equal("ba1031ba1a5daab0d49597cfa8664ce2b4c9b4db6ca69fbef51e0a9a325a3b63");
  });
});
