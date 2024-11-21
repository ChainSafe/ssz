import {expect} from "chai";
import {ByteListType} from "../../../../src";

describe("ByteListValue", () => {
  const type = new ByteListType(1024);

  it("should zero out the last sha256 block if it's over value.length", () => {
    const value = Buffer.alloc(65, 1);
    const expectedRoot = type.hashTreeRoot(value);
    // now hash another value which make the cached blocks non zero
    type.hashTreeRoot(Buffer.alloc(1024, 2));
    const actualRoot = type.hashTreeRoot(value);
    expect(actualRoot).to.deep.equal(expectedRoot);
  });

  it("should increase blockArray size if needed", () => {
    const value0 = Buffer.alloc(65, 1);
    const expectedRoot0 = type.hashTreeRoot(value0);
    const value1 = Buffer.alloc(1024, 3);
    const expectedRoot1 = type.hashTreeRoot(value1);
    // now increase block array size
    type.hashTreeRoot(Buffer.alloc(1024, 2));

    // hash again
    expect(type.hashTreeRoot(value0)).to.deep.equal(expectedRoot0);
    expect(type.hashTreeRoot(value1)).to.deep.equal(expectedRoot1);
  });
});
