import {expect} from "chai";
import {toHexString} from "../../../src/util/byteArray";
import {CompositeType, ValueOf, TreeViewDU, CompositeViewDU} from "../../../src";

export type TreeMutation<CT extends CompositeType<unknown, unknown, unknown>> = {
  id: string;
  valueBefore: ValueOf<CT>;
  valueAfter: ValueOf<CT>;
  /**
   * Allow fn() to return void, and expect tvBefore to be mutated
   */
  fn: (treeView: CompositeViewDU<CT>) => CompositeViewDU<CT> | void;
};

const runViewTestMutationFn = function runViewTestMutation<CT extends CompositeType<unknown, unknown, unknown>>(
  {
    type,
    treeViewToStruct,
    mutations: ops,
  }: {
    type: CT;
    treeViewToStruct?: (tv: CompositeViewDU<CT>) => ValueOf<CT>;
    mutations: TreeMutation<CT>[];
  },
  opts?: {only?: boolean; skip?: boolean}
): void {
  function assertValidTvAfter(tvAfter: TreeViewDU<CT>, valueAfter: ValueOf<CT>, message: string): void {
    expect(type.toJson(tvAfter.toValue())).to.deep.equal(type.toJson(valueAfter), `Wrong json - ${message}`);

    expect(toHexString(tvAfter.serialize())).to.equal(
      toHexString(type.serialize(valueAfter)),
      `Wrong serialized - ${message}`
    );

    expect(toHexString(tvAfter.hashTreeRoot())).to.equal(
      toHexString(type.hashTreeRoot(valueAfter)),
      `Wrong hashTreeRoot - ${message}`
    );
  }

  // eslint-disable-next-line no-only-tests/no-only-tests
  const describeFn = (opts?.only ? describe.only : opts?.skip ? describe.skip : describe) as Mocha.SuiteFunction;

  describeFn(`${type.typeName} TreeView mutations`, () => {
    for (const testCase of ops) {
      const {id, valueBefore, valueAfter, fn} = testCase;

      // Skip tests if ONLY_ID is set
      const onlyId = process.env.ONLY_ID;

      const treeViewId = `${id} - TreeView`;
      if (!onlyId || treeViewId.includes(onlyId)) {
        it(treeViewId, () => {
          const tvBefore = type.toView(valueBefore);

          const tvAfter = fn(tvBefore as CompositeViewDU<CT>) ?? tvBefore;

          assertValidTvAfter(tvAfter as TreeViewDU<CT>, valueAfter, "After mutation");
        });
      }

      const treeViewDUId = `${id} - TreeViewDU`;
      if (!onlyId || treeViewDUId.includes(onlyId)) {
        it(treeViewDUId, () => {
          const tvBefore = type.toViewDU(valueBefore) as TreeViewDU<CT>;

          // Set to mutable, and edit
          const tvAfter = fn(tvBefore as CompositeViewDU<CT>) ?? tvBefore;

          if (treeViewToStruct) {
            const tvAfterStruct = treeViewToStruct(tvAfter as CompositeViewDU<CT>);
            expect(type.toJson(tvAfterStruct)).to.deep.equal(
              type.toJson(valueAfter),
              "Wrong value after mutation before commit"
            );
          }

          type.commitViewDU(tvAfter);
          assertValidTvAfter(tvAfter as TreeViewDU<CT>, valueAfter, "After mutation");
        });
      }
    }
  });
};

export const runViewTestMutation = runViewTestMutationFn as typeof runViewTestMutationFn & {
  only: typeof runViewTestMutationFn;
  skip: typeof runViewTestMutationFn;
};

runViewTestMutation.only = function runViewTestMutation(args, opts = {}): void {
  opts.only = true;
  runViewTestMutationFn(args, opts);
} as typeof runViewTestMutationFn;

runViewTestMutation.skip = function runViewTestMutation(args, opts = {}): void {
  opts.skip = true;
  runViewTestMutationFn(args, opts);
} as typeof runViewTestMutationFn;
