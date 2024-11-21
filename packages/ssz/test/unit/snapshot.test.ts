import {describe, it, expect} from "vitest";
import {ByteVectorType} from "../../src/type/byteVector.js";
import {ListCompositeType} from "../../src/index.js";
import {PartialListCompositeType} from "../../src/type/partialListComposite.js";
import {Tree, toGindex} from "@chainsafe/persistent-merkle-tree";

describe("snapshot", () => {
  const depth = 4;
  const maxItems = Math.pow(2, depth);
  const rootType = new ByteVectorType(32);
  const listType = new ListCompositeType(rootType, maxItems);
  const partialListType = new PartialListCompositeType(rootType, maxItems);
  const fullList = listType.defaultViewDU();

  for (let i = 0; i < maxItems; i++) {
    fullList.push(Buffer.alloc(32, i));
  }
  fullList.commit();

  for (let snapshotCount = 0; snapshotCount <= maxItems; snapshotCount++) {
    // toSnapshot uses sliceTo, it's good to test sliceFrom too
    it(`toSnapshot and fromSnapshot then sliceTo/sliceFrom with snapshotCount ${snapshotCount}`, () => {
      const snapshot = fullList.toSnapshot(snapshotCount);
      const partialList = partialListType.toPartialViewDU(snapshot);

      // 1st step - check if the restored root node is the same
      expect(partialList.hashTreeRoot()).to.deep.equal(fullList.sliceTo(snapshotCount - 1).hashTreeRoot());

      // 2nd step - grow the tree
      for (let i = snapshotCount; i < maxItems; i++) {
        partialList.push(fullList.get(i));
        partialList.commit();
        const fullListToI = fullList.sliceTo(i);
        expect(partialList.hashTreeRoot()).to.deep.equal(fullListToI.hashTreeRoot());

        // also sliceTo() works
        for (let j = snapshotCount - 1; j <= i; j++) {
          expect(partialList.sliceTo(j).hashTreeRoot()).to.deep.equal(fullList.sliceTo(j).hashTreeRoot());
        }

        // also sliceFrom() works
        expect(partialList.sliceFrom(snapshotCount).hashTreeRoot()).to.deep.equal(
          fullListToI.sliceFrom(snapshotCount).hashTreeRoot()
        );
      }
    });

    it(`toSnapshot and fromSnapshot then subsequent toSnapshot calls with snapshotCount ${snapshotCount}`, () => {
      const snapshot = fullList.toSnapshot(snapshotCount);
      const partialList = partialListType.toPartialViewDU(snapshot);

      // 1st step - check if the restored root node is the same
      expect(partialList.hashTreeRoot()).to.deep.equal(fullList.sliceTo(snapshotCount - 1).hashTreeRoot());

      // 2nd step - grow the tree
      for (let i = snapshotCount; i < maxItems; i++) {
        partialList.push(fullList.get(i));
        partialList.commit();

        // confirm toSnapshot() works
        for (let j = snapshotCount; j <= i; j++) {
          const snapshot2 = partialList.toSnapshot(j);
          const partialList2 = partialListType.toPartialViewDU(snapshot2);
          // sliceTo() is inclusive
          const fullListToJ = fullList.sliceTo(j - 1);
          expect(partialList2.length).to.equal(fullListToJ.length);
          expect(partialList2.hashTreeRoot()).to.deep.equal(fullListToJ.hashTreeRoot());
        }

        // confirm getSingleProof() works
        // sliceTo() is inclusive
        const fullListToI = fullList.sliceTo(i);
        expect(partialList.length).to.be.equal(fullListToI.length);
        expect(partialList.hashTreeRoot()).to.deep.equal(fullListToI.hashTreeRoot());
        const partialTree = new Tree(partialList.node);
        const fullTree = new Tree(fullListToI.node);
        for (let j = snapshotCount; j <= i; j++) {
          // 1 more depth for the length
          const gindex = toGindex(depth + 1, BigInt(j));
          expect(partialTree.getSingleProof(gindex)).to.deep.equal(fullTree.getSingleProof(gindex));
        }
      }
    });
  }
});
