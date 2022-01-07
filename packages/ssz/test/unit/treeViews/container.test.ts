import {expect} from "chai";
import {toHexString} from "../../../src/util/byteArray";
import {CompositeType, ValueOf, TreeView, TreeViewMutable, CompositeViewMutable} from "../../../src/v2/abstract";
import {ContainerType} from "../../../src/v2/container";
import {UintNumberType} from "../../../src/v2/uint";
import {ByteVectorType} from "../../../src/v2/byteVector";

describe("Container TreeView", () => {
  const uint64Type = new UintNumberType(8);
  const containerUintsType = new ContainerType({
    a: uint64Type,
    b: uint64Type,
  });

  runTreeViewTest({
    typeName: "containerUintsType",
    type: containerUintsType,
    treeViewToStruct: (tv) => ({a: tv.a, b: tv.b}),
    mutations: [
      {
        id: "set all properties",
        valueBefore: {a: 1, b: 2},
        valueAfter: {a: 10, b: 20},
        fn: (tv) => {
          tv.a = 10;
          tv.b = 20;
        },
      },
    ],
  });

  const byte32 = new ByteVectorType(32);
  const byte96 = new ByteVectorType(96);
  const containerBytesType = new ContainerType({
    a: byte32,
    b: byte96,
  });

  runTreeViewTest({
    typeName: "containerBytesType",
    type: containerBytesType,
    treeViewToStruct: (tv) => containerBytesType.toStructFromTreeView(tv),
    mutations: [
      {
        id: "set all properties",
        valueBefore: {a: Buffer.alloc(32, 1), b: Buffer.alloc(96, 2)},
        valueAfter: {a: Buffer.alloc(32, 10), b: Buffer.alloc(96, 20)},
        fn: (tv) => {
          tv.a = byte32.toTreeViewFromStruct(Buffer.alloc(32, 10));
          tv.b = byte96.toTreeViewFromStruct(Buffer.alloc(96, 20));
        },
      },
    ],
  });
});

export type TreeMutation<CT extends CompositeType<any, TreeView, TreeViewMutable>> = {
  id: string;
  valueBefore: ValueOf<CT>;
  valueAfter: ValueOf<CT>;
  /**
   * Allow fn() to return void, and expect tvBefore to be mutated
   */
  fn: (treeView: CompositeViewMutable<CT>) => CompositeViewMutable<CT> | void;
};

function runTreeViewTest<CT extends CompositeType<any, TreeView, TreeViewMutable>>({
  typeName,
  type,
  treeViewToStruct,
  mutations: ops,
}: {
  typeName: string;
  type: CT;
  treeViewToStruct?: (tv: CompositeViewMutable<CT>) => ValueOf<CT>;
  mutations: TreeMutation<CT>[];
}): void {
  function assertValidTvAfter(tvAfter: TreeViewMutable, valueAfter: ValueOf<CT>, message: string): void {
    expect(toHexString(tvAfter.serialize())).to.deep.equal(
      toHexString(type.serialize(valueAfter)),
      `TreeView !== valueAfter serialized - ${message}`
    );

    expect(toHexString(tvAfter.hashTreeRoot())).to.deep.equal(
      toHexString(type.hashTreeRoot(valueAfter)),
      `TreeView !== valueAfter hashTreeRoot - ${message}`
    );
  }

  describe(`${typeName} TreeView mutations`, () => {
    for (const testCase of ops) {
      const {id, valueBefore, valueAfter, fn} = testCase;

      it(`${id} mutable = false`, () => {
        const tvBefore = type.toTreeViewMutableFromStruct(valueBefore);

        const tvAfter = fn(tvBefore as CompositeViewMutable<CT>) ?? tvBefore;

        assertValidTvAfter(tvAfter as TreeViewMutable, valueAfter, "After mutation");
      });

      it(`${id} mutable = true`, () => {
        const tvBefore = type.toTreeViewMutableFromStruct(valueBefore);

        // Set to mutable, and edit
        const tvAfter = fn(tvBefore as CompositeViewMutable<CT>) ?? tvBefore;

        if (treeViewToStruct) {
          const tvAfterStruct = treeViewToStruct(tvAfter as CompositeViewMutable<CT>);
          expect(tvAfterStruct).to.deep.equal(
            valueAfter,
            "TreeView !== valueAfter struct - after mutation before commit"
          );
        }

        tvBefore.commit();
        assertValidTvAfter(tvAfter as TreeViewMutable, valueAfter, "After mutation");
      });
    }
  });
}
