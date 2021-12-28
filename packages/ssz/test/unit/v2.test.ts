import {Tree} from "@chainsafe/persistent-merkle-tree";
import {expect} from "chai";
import {ListType, NumberUintType, toHexString} from "../../src";
import {ContainerType} from "../../src/v2/container";
import {ListBasicType} from "../../src/v2/listBasic";
import {UintNumberType as UintTypeV2} from "../../src/v2/uint";

describe("BasicList", () => {
  it("edit mutate and transfer", () => {
    const uintBytes = 1;
    const limit = 64;
    const len = 4;

    const uint8Type = new UintTypeV2(uintBytes);
    const uint8ListType = new ListBasicType(uint8Type, limit);

    const uint8ListTree = uint8ListType.toTreeViewFromStruct(uint8ListType.defaultValue);
    const uint8ListStruct: number[] = [];

    // Populate tree
    uint8ListTree.toMutable();
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
    uint8ListTree.toMutable();
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

describe("Array length", () => {
  const uintBytes = 1;
  const limit = 2 ** 7;

  let serialized: Uint8Array;
  let serializedHex: string; // "0x010203";
  let rootHex: string; // "0x051d548c97f71eb85e97a73f33b034c795e6dbd251fc4845dd293f68e1ed853a";

  it("v1", () => {
    const uint8Type = new NumberUintType({byteLength: uintBytes});
    const uint8ListType = new ListType({elementType: uint8Type, limit});

    const uint8List = uint8ListType.defaultTreeBacked();
    uint8List.push(1);
    uint8List.push(2);
    uint8List.push(3);
    uint8List.push(4);

    serialized = uint8List.serialize();
    serializedHex = toHexString(serialized);
    rootHex = toHexString(uint8List.hashTreeRoot());
    serializedHex;

    // for (let i = 1; i < renderUpToGindex; i++) {
    //   try {
    //     console.log(i, toHexString(uint8List.tree.getNode(BigInt(i)).root));
    //   } catch (e) {
    //     console.log(i, "...");
    //   }
    // }
  });

  it("v2", () => {
    const uint8Type = new UintTypeV2(uintBytes);
    const uint8ListType = new ListBasicType(uint8Type, limit);

    const uint8List = new Tree(uint8ListType.tree_deserializeFromBytes(serialized, 0, serialized.length));

    // const uint8List = uint8ListType.defaultTreeBacked();
    // uint8List.push(1);
    // uint8List.push(2);
    // uint8List.push(3);

    // for (let i = 1; i < 25; i++) {
    //   try {
    //     console.log(i, toHexString(uint8List.getNode(BigInt(i)).root));
    //   } catch (e) {
    //     console.log(i, "...");
    //   }
    // }

    expect(toHexString(uint8List.root)).to.equal(rootHex, "Wrong hashTreeRoot");
  });
});

describe("Container views", () => {
  it("Do", () => {
    const uint32Type = new UintTypeV2(4);
    const uint32ListType = new ListBasicType(uint32Type, 2 ** 7);
    const stateType = new ContainerType({
      slot: uint32Type,
      balances: uint32ListType,
      genesisTime: uint32Type,
    });

    const stateStruct: typeof stateType.defaultValue = {
      slot: 8,
      balances: [1, 2, 3, 4, 5, 6, 7, 8],
      genesisTime: 9,
    };

    const serialized = stateType.serialize(stateStruct);
    const view = stateType.deserializeToTreeView(serialized);

    console.log(view.balances.get(5), toHexString(view.node.root));
    view.balances.set(5, 123);
    console.log(view.balances.get(5), toHexString(view.node.root));
  });
});
