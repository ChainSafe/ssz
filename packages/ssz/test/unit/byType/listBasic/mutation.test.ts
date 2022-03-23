import {expect} from "chai";
import {ListBasicType, UintNumberType} from "../../../../src";

describe("BasicList", () => {
  it("TreeView edit mutate and transfer", () => {
    const uintBytes = 1;
    const limit = 64;
    const len = 4;

    const uint8Type = new UintNumberType(uintBytes);
    const uint8ListType = new ListBasicType(uint8Type, limit);

    const uint8ListTree = uint8ListType.defaultView();
    const uint8ListStruct: number[] = [];

    // Populate tree
    for (let i = 0; i < len; i++) {
      uint8ListTree.push(0);
      uint8ListStruct.push(0);
    }
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after mutate");

    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after commit");

    // Mutate one value
    uint8ListTree.set(0, 1);
    uint8ListStruct[0] = 1;
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set[0]");

    // Mutate one value and commit
    uint8ListTree.set(1, 2);
    uint8ListStruct[1] = 2;
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set[1] mutable");
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set[1] commit");

    const uint8ListTree2 = uint8ListTree.clone();
    const uint8ListStruct2 = [...uint8ListStruct];

    // Ensure changes don't propagate from cloned value
    uint8ListTree2.set(0, 3);
    uint8ListStruct2[0] = 3;
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set in cloned");
    expect(uint8ListTree2.getAll()).to.deep.equal(uint8ListStruct2, "Wrong cloned value after set in cloned");

    // Ensure changes don't propagate to cloned value
    uint8ListTree.set(0, 4);
    uint8ListStruct[0] = 4;
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set in source");
    expect(uint8ListTree2.getAll()).to.deep.equal(uint8ListStruct2, "Wrong cloned value after set in source");
  });

  it("TreeViewDU edit mutate and transfer", () => {
    const uintBytes = 1;
    const limit = 64;
    const len = 4;

    const uint8Type = new UintNumberType(uintBytes);
    const uint8ListType = new ListBasicType(uint8Type, limit);

    const uint8ListTree = uint8ListType.defaultViewDU();
    const uint8ListStruct: number[] = [];

    // Populate tree
    for (let i = 0; i < len; i++) {
      uint8ListTree.push(0);
      uint8ListStruct.push(0);
    }
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after mutate");

    uint8ListTree.commit();
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after commit");

    // Mutate one value
    uint8ListTree.set(0, 1);
    uint8ListStruct[0] = 1;
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set[0]");

    // Mutate one value and commit
    uint8ListTree.set(1, 2);
    uint8ListStruct[1] = 2;
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set[1] mutable");
    uint8ListTree.commit();
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set[1] commit");

    const uint8ListTree2 = uint8ListTree.clone();
    const uint8ListStruct2 = [...uint8ListStruct];

    // Ensure changes don't propagate from cloned value
    uint8ListTree2.set(0, 3);
    uint8ListStruct2[0] = 3;
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set in cloned");
    expect(uint8ListTree2.getAll()).to.deep.equal(uint8ListStruct2, "Wrong cloned value after set in cloned");

    // Ensure changes don't propagate to cloned value
    uint8ListTree.set(0, 4);
    uint8ListStruct[0] = 4;
    expect(uint8ListTree.getAll()).to.deep.equal(uint8ListStruct, "Wrong value after set in source");
    expect(uint8ListTree2.getAll()).to.deep.equal(uint8ListStruct2, "Wrong cloned value after set in source");
  });
});
