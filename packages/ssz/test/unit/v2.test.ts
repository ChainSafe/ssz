import {Tree} from "@chainsafe/persistent-merkle-tree";
import {expect} from "chai";
import {fromHexString, ListType, NumberUintType, toHexString} from "../../src";
import {ListBasicType} from "../../src/v2/listBasic";
import {UintType as UintTypeV2} from "../../src/v2/uint";

describe("Array length", () => {
  const uintBytes = 1;
  const limit = 2 ** 7;
  const renderUpToGindex = 13;

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

    for (let i = 1; i < renderUpToGindex; i++) {
      try {
        console.log(i, toHexString(uint8List.tree.getNode(BigInt(i)).root));
      } catch (e) {
        console.log(i, "...");
      }
    }
  });

  it("v2", () => {
    const uint8Type = new UintTypeV2(uintBytes);
    const uint8ListType = new ListBasicType(uint8Type, limit);

    const uint8List = new Tree(uint8ListType.tree_deserializeFromBytes(serialized, 0, serialized.length));

    // const uint8List = uint8ListType.defaultTreeBacked();
    // uint8List.push(1);
    // uint8List.push(2);
    // uint8List.push(3);

    for (let i = 1; i < 25; i++) {
      try {
        console.log(i, toHexString(uint8List.getNode(BigInt(i)).root));
      } catch (e) {
        console.log(i, "...");
      }
    }

    expect(toHexString(uint8List.root)).to.equal(rootHex, "Wrong hashTreeRoot");
  });
});
