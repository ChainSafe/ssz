import {describe, expect, it} from "vitest";
import {ContainerType, UintNumberType} from "../../src/index.js";

describe("cachePermanentRootStruct", () => {
  it("should cache permanent root struct", () => {
    const byteType = new UintNumberType(1);
    const type = new ContainerType({a: byteType, b: byteType}, {cachePermanentRootStruct: true});
    const value = type.defaultValue();

    expect(type["getCachedPermanentRoot"](value)).to.equal(undefined, "Should not have cached root");

    const root = type.hashTreeRoot(value);
    const root2 = type.hashTreeRoot(value);
    expect(root).to.equal(root2, "Second hashTreeRoot should return the same Uint8Array");

    expect(type["getCachedPermanentRoot"](value)).to.equal(root, "Should have cached root");
  });
});
