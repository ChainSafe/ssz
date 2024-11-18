import {expect} from "chai";
import {toHexString} from "../../../src/util/byteArray";
import type {CompositeType, ValueOf, TreeViewDU, CompositeViewDU} from "../../../src";

export type TreeMutation<CT extends CompositeType<unknown, unknown, unknown>> = {
  id: string;
  valueBefore: ValueOf<CT>;
  valueAfter: ValueOf<CT>;
  /** Don't run TreeView test */
  skipTreeView?: boolean;
  /** Don't run TreeViewDU test */
  skipTreeViewDU?: boolean;
  /** Skip ViewDU clone mutability tests */
  skipCloneMutabilityViewDU?: boolean;
  /**
   * Allow fn() to return void, and expect tvBefore to be mutated
   */
  fn: (treeView: CompositeViewDU<CT>) => CompositeViewDU<CT> | void;
  /** Extra assertions to run after fn() */
  assertFn?: (treeView: CompositeViewDU<CT>) => void;
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
  function assertValidView(view: TreeViewDU<CT>, value: ValueOf<CT>, message: string, batchHash: boolean): void {
    expect(type.toJson(view.toValue())).to.deep.equal(type.toJson(value), `Wrong json - ${message}`);

    expect(toHexString(view.serialize())).to.equal(toHexString(type.serialize(value)), `Wrong serialized - ${message}`);

    if (batchHash) {
      expect(toHexString(view.batchHashTreeRoot())).to.equal(
        toHexString(type.hashTreeRoot(value)),
        `Wrong batchHashTreeRoot - ${message}`
      );
    } else {
      expect(toHexString(view.hashTreeRoot())).to.equal(
        toHexString(type.hashTreeRoot(value)),
        `Wrong hashTreeRoot - ${message}`
      );
    }
  }

  // eslint-disable-next-line no-only-tests/no-only-tests
  const describeFn = (opts?.only ? describe.only : opts?.skip ? describe.skip : describe) as Mocha.SuiteFunction;

  describeFn(`${type.typeName} TreeView mutations`, () => {
    for (const testCase of ops) {
      const {id, valueBefore, valueAfter, skipTreeView, skipTreeViewDU, skipCloneMutabilityViewDU, fn, assertFn} =
        testCase;

      // Skip tests if ONLY_ID is set
      const onlyId = process.env.ONLY_ID;

      const treeViewId = `${id} - TreeView`;
      if ((!onlyId || treeViewId.includes(onlyId)) && !skipTreeView) {
        it(treeViewId, () => {
          const tvBefore = type.toView(valueBefore);

          const tvAfter = fn(tvBefore as CompositeViewDU<CT>) ?? tvBefore;

          assertValidView(tvAfter as TreeViewDU<CT>, valueAfter, "after mutation", false);

          if (assertFn) assertFn(tvAfter as CompositeViewDU<CT>);
        });
      }

      for (const batchHash of [false, true]) {
        const treeViewDUId = `${id} - TreeViewDU, batchHash = ${batchHash}`;
        if ((!onlyId || treeViewDUId.includes(onlyId)) && !skipTreeViewDU) {
          it(treeViewDUId, () => {
            const tvBefore = type.toViewDU(valueBefore) as TreeViewDU<CT>;

            // Set to mutable, and edit
            const tvAfter = (fn(tvBefore as CompositeViewDU<CT>) ?? tvBefore) as CompositeViewDU<CT>;

            if (treeViewToStruct) {
              const tvAfterStruct = treeViewToStruct(tvAfter);
              expect(type.toJson(tvAfterStruct)).to.deep.equal(
                type.toJson(valueAfter),
                "Wrong value after mutation before commit"
              );
            }

            if (assertFn) assertFn(tvAfter as CompositeViewDU<CT>);

            type.commitViewDU(tvAfter);
            assertValidView(tvAfter as TreeViewDU<CT>, valueAfter, "after mutation", batchHash);

            if (assertFn) assertFn(tvAfter as CompositeViewDU<CT>);

            if (!skipCloneMutabilityViewDU) {
              // Ensure correct mutability of clone and caches
              // Set to mutable, and edit
              const tvBefore2 = type.toViewDU(valueBefore) as TreeViewDU<CT>;
              const tvAfter2 = (fn(tvBefore2 as CompositeViewDU<CT>) ?? tvBefore2) as CompositeViewDU<CT>;
              // Drop changes
              (tvAfter2 as TreeViewDU<CT>).clone();
              // Assert same value as before
              assertValidView(tvAfter2 as TreeViewDU<CT>, valueBefore, "dropped mutation", batchHash);
            }
          });
        }
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
