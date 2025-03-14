import {Tree} from "@chainsafe/persistent-merkle-tree";
import {describe, expect, it} from "vitest";
import {ContainerNodeStructType, ContainerType, ListCompositeType} from "../../../src/index.js";
import {TreeDataTypeCode, treePartialToJsonPaths} from "../../../src/util/proof/treePartialToJsonPaths.js";
import {treePostProcessFromProofNode} from "../../../src/util/proof/treePostProcessFromProofNode.js";
import {bytes32Type, uint16NumType} from "../../utils/primitiveTypes.js";

describe("Create proof of Array of Objects", () => {
  const SimpleObject = new ContainerType({a: uint16NumType, b: uint16NumType}, {typeName: "SimpleObject"});
  const ArrayObject = new ContainerType({list: new ListCompositeType(SimpleObject, 100)}, {typeName: "ArrayObject"});

  it("should include all leaves of path to composite type", () => {
    const parentObj = ArrayObject.defaultView();
    const simpleObj = SimpleObject.defaultView();

    parentObj.list.push(simpleObj);
    const proof = parentObj.createProof([["list", 0]]);

    const parentObjFromProof = ArrayObject.createFromProof(proof, parentObj.hashTreeRoot());

    expect(parentObjFromProof.list.get(0).toValue()).to.deep.equal(parentObj.list.get(0).toValue());
    expect(parentObjFromProof.list.toValue()).to.deep.equal(parentObj.list.toValue());
  });

  it("Verify proof", () => {
    const parentObj = ArrayObject.defaultView();
    const simpleObj = SimpleObject.defaultView();

    parentObj.list.push(simpleObj);
    const proof = parentObj.createProof([["list", 0]]);

    const root = parentObj.hashTreeRoot();
    root[0]++; // Change the root to invalidate the proof (++ overflows)
    expect(() => ArrayObject.createFromProof(proof, root)).toThrow();
  });

  it("Prevent navigation beyond basic types", () => {
    const simpleObj = SimpleObject.defaultView();
    expect(() => simpleObj.createProof([["a", 0]])).toThrow();
  });
});

describe("Create proof of NodeStruct", () => {
  const SimpleObject = new ContainerNodeStructType({a: uint16NumType, b: uint16NumType}, {typeName: "SimpleObject"});
  const ArrayObject = new ContainerType(
    {a: uint16NumType, list: new ListCompositeType(SimpleObject, 100), c: bytes32Type},
    {typeName: "ArrayObject"}
  );

  it("should include all leaves of path to composite type", () => {
    const parentObj = ArrayObject.defaultView();
    parentObj.a = 0xff;
    parentObj.c = Buffer.alloc(32, 0xff);

    parentObj.list.push(SimpleObject.toView({a: 0x1001, b: 0x1002}));
    parentObj.list.push(SimpleObject.defaultView());
    parentObj.list.push(SimpleObject.toView({a: 0x1201, b: 0x1202}));

    const proof = parentObj.createProof([
      ["list", 0],
      ["list", 2],
      // ["c"]
    ]);

    const treeFromProof = Tree.createFromProof(proof);

    const treeDataType = treePartialToJsonPaths(treeFromProof.rootNode, ArrayObject);
    expect(treeDataType).deep.equal({
      type: TreeDataTypeCode.partial,
      jsonPaths: [["a"], ["list", 0], ["list", 2]],
    });

    const parentObjFromProofPre = ArrayObject.createFromProof(proof, parentObj.hashTreeRoot());
    const parentObjFromProof = ArrayObject.getView(
      new Tree(treePostProcessFromProofNode(parentObjFromProofPre.node, parentObjFromProofPre.type))
    );

    expect(parentObjFromProof.list.get(0).toValue()).to.deep.equal(parentObj.list.get(0).toValue(), "wrong list.0");
    expect(parentObjFromProof.list.get(2).toValue()).to.deep.equal(parentObj.list.get(2).toValue(), "wrong list.2");
  });
});
