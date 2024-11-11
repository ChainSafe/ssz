import {describe, it, expect} from "vitest";
import {ListBasicType, UintNumberType} from "../../../../src";

describe("To hit 100% coverage", () => {
  const listBasic = new ListBasicType(new UintNumberType(1), 4);

  it("listBasic.getPropertyGindex('bad-string')", () => {
    expect(() => listBasic.getPropertyGindex("bad-string")).toThrow();
  });

  it("listBasic.tree_getLeafGindices() with no node", () => {
    expect(() => listBasic.tree_getLeafGindices(0n)).toThrow();
  });
});
