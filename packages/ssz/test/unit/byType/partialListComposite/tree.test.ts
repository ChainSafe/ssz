import {describe, expect, it} from "vitest";
import {ContainerType, ListCompositeType, UintNumberType} from "../../../../src/index.js";
import {PartialListCompositeType} from "../../../../src/type/partialListComposite.js";

const uint64NumInfType = new UintNumberType(8, {clipInfinity: true});
const containerUintsType = new ContainerType(
  {a: uint64NumInfType, b: uint64NumInfType},
  {typeName: "Container(uint64)"}
);

const maxItem = 16;
const fullListType = new ListCompositeType(containerUintsType, maxItem, {typeName: "ListCompositeType(Container)"});
const partialListType = new PartialListCompositeType(containerUintsType, maxItem, {
  typeName: "PartialListCompositeType(Container)",
});

/**
 * This PartialListCompositeType needs a snapshot to initialized so we can't use the runViewTestMutation() function
 * Also serialize(), toViewDU() does not work for this type.
 */

describe("PartialListCompositeType ViewDU", () => {
  const fullList = fullListType.defaultViewDU();
  for (let i = 0; i < maxItem; i++) {
    fullList.push(containerUintsType.toViewDU({a: i, b: i * 2}));
  }

  describe("push then compare value", () => {
    for (let snapshotCount = 1; snapshotCount <= maxItem; snapshotCount++) {
      it(`snapshotCount=${snapshotCount}`, () => {
        const snapshot = fullList.toSnapshot(snapshotCount);
        const partialList = partialListType.toPartialViewDU(snapshot);
        expect(partialList.hashTreeRoot()).to.deep.equal(fullList.sliceTo(snapshotCount - 1).hashTreeRoot());
        expect(partialList.toValue()).to.deep.equal(new Array(snapshotCount));

        for (let i = snapshotCount; i < maxItem; i++) {
          partialList.push(fullList.get(i));
          partialList.commit();
          const expectedValue = Array.from({length: i + 1}, (_, j) =>
            j < snapshotCount ? undefined : {a: j, b: j * 2}
          );
          expect(partialList.toValue()).to.deep.equal(expectedValue);
          const fullListToI = fullList.sliceTo(i);
          expect(partialList.length).to.equal(fullListToI.length);
          expect(partialList.hashTreeRoot()).to.deep.equal(fullListToI.hashTreeRoot());
        }
      });
    }
  });

  describe("push then get snapshot", () => {
    for (let snapshotCount = 1; snapshotCount <= maxItem; snapshotCount++) {
      it(`snapshotCount=${snapshotCount}`, () => {
        const snapshot = fullList.toSnapshot(snapshotCount);
        const partialList = partialListType.toPartialViewDU(snapshot);
        expect(partialList.hashTreeRoot()).to.deep.equal(fullList.sliceTo(snapshotCount - 1).hashTreeRoot());
        expect(partialList.toValue()).to.deep.equal(new Array(snapshotCount));

        for (let i = snapshotCount; i < maxItem; i++) {
          partialList.push(fullList.get(i));
          partialList.commit();
          for (let j = snapshotCount; j <= i; j++) {
            expect(partialList.toSnapshot(j)).to.deep.equal(fullList.toSnapshot(j));
          }
        }
      });
    }
  });

  describe("push then sliceTo()", () => {
    for (let snapshotCount = 1; snapshotCount <= maxItem; snapshotCount++) {
      it(`snapshotCount=${snapshotCount}`, () => {
        const snapshot = fullList.toSnapshot(snapshotCount);
        const partialList = partialListType.toPartialViewDU(snapshot);
        expect(partialList.hashTreeRoot()).to.deep.equal(fullList.sliceTo(snapshotCount - 1).hashTreeRoot());
        expect(partialList.toValue()).to.deep.equal(new Array(snapshotCount));

        for (let i = snapshotCount; i < maxItem; i++) {
          partialList.push(fullList.get(i));
          partialList.commit();
          const fullListToI = fullList.sliceTo(i);
          expect(partialList.length).to.equal(fullListToI.length);
          for (let j = snapshotCount; j <= i; j++) {
            const list1 = partialList.sliceTo(j);
            const list2 = fullListToI.sliceTo(j);
            expect(list1.hashTreeRoot()).to.deep.equal(list2.hashTreeRoot());
          }
        }
      });
    }
  });

  describe("push then sliceFrom()", () => {
    for (let snapshotCount = 1; snapshotCount <= maxItem; snapshotCount++) {
      it(`snapshotCount=${snapshotCount}`, () => {
        const snapshot = fullList.toSnapshot(snapshotCount);
        const partialList = partialListType.toPartialViewDU(snapshot);
        expect(partialList.hashTreeRoot()).to.deep.equal(fullList.sliceTo(snapshotCount - 1).hashTreeRoot());
        expect(partialList.toValue()).to.deep.equal(new Array(snapshotCount));

        for (let i = snapshotCount; i < maxItem; i++) {
          partialList.push(fullList.get(i));
          partialList.commit();
          const fullListToI = fullList.sliceTo(i);
          expect(partialList.length).to.equal(fullListToI.length);
          for (let j = snapshotCount; j <= i; j++) {
            const list1 = partialList.sliceFrom(j);
            const list2 = fullListToI.sliceFrom(j);
            const value1 = list1.toValue();
            const value2 = list2.toValue();
            expect(value1).to.deep.equal(value2);
            expect(list1.hashTreeRoot()).to.deep.equal(list2.hashTreeRoot());
          }
        }
      });
    }
  });

  describe("push then clone() and set()", () => {
    for (let snapshotCount = 1; snapshotCount <= maxItem; snapshotCount++) {
      it(`snapshotCount=${snapshotCount}`, () => {
        const snapshot = fullList.toSnapshot(snapshotCount);
        const partialList = partialListType.toPartialViewDU(snapshot);
        expect(partialList.hashTreeRoot()).to.deep.equal(fullList.sliceTo(snapshotCount - 1).hashTreeRoot());
        expect(partialList.toValue()).to.deep.equal(new Array(snapshotCount));

        for (let i = snapshotCount; i < maxItem; i++) {
          partialList.push(fullList.get(i));
          partialList.commit();
          const fullListToI = fullList.sliceTo(i);
          expect(partialList.length).to.equal(fullListToI.length);
          for (let j = snapshotCount; j <= i; j++) {
            const list1 = partialList.clone();
            list1.set(j, containerUintsType.toViewDU({a: -1, b: -1}));
            list1.commit();
            const list2 = fullListToI.clone();
            list2.set(j, containerUintsType.toViewDU({a: -1, b: -1}));
            list2.commit();
            expect(list1.hashTreeRoot()).to.deep.equal(list2.hashTreeRoot());
          }
        }
      });
    }
  });
});
