import {expect} from "chai";
import {ContainerType, UintNumberType} from "../../src";

describe("cachePermanentRootStruct", () => {
  it("should cache permanent root struct", () => {
    const byteType = new UintNumberType(1);
    const type = new ContainerType({a: byteType, b: byteType}, {cachePermanentRootStruct: true});
    const value = type.defaultValue();

    expect(type["getCachedPermanentRoot"](value)).to.equal(undefined, "Should not have cached root");

    const root = type.hashTreeRoot(value);
    const root2 = type.hashTreeRoot(value);
    // previously this is the same reference, since we move to merkleizeInto() it is not anymore
    // this should not be an issue anyway
    expect(root).to.deep.equal(root2, "Second hashTreeRoot should return the same Uint8Array");

    expect(type["getCachedPermanentRoot"](value)).to.deep.equal(root, "Should have cached root");
  });
});
