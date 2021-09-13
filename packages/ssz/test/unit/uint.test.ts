import {expect} from "chai";
import {NumberUintType} from "../../src/types/basic/uint";
import {ContainerType} from "../../src/types/composite/container";

describe("uint type", () => {
  it("Fast get uint from hashObject", () => {
    const uint256Type = new NumberUintType({byteLength: 32});
    const containerType = new ContainerType<{a: number}>({
      fields: {
        a: uint256Type,
      },
    });

    const value = 1234567890;
    const tb = containerType.defaultTreeBacked();
    tb.a = value;

    expect(tb.tree.rootNode.h0).to.equal(value, "tb.tree.rootNode.h0 does not equal value");
  });
});
