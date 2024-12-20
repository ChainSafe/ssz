import fs from "node:fs";
import url from "node:url";
import path from "node:path";
import jsyaml from "js-yaml";
import {expect} from "chai";
import {ContainerType, ListCompositeType} from "../../../src/index.js";
import {ssz} from "../../lodestarTypes/index.js";
import {DepositDataRootFullList, DepositDataRootPartialList} from "../../lodestarTypes/phase0/sszTypes.js";
import {ListCompositeTreeViewDU} from "../../../src/viewDU/listComposite.js";

const EIP4881TestDataArrayItem = new ContainerType(
  {
    depositData: ssz.phase0.DepositData,
    depositDataRoot: ssz.Root,
    eth1Data: ssz.phase0.Eth1Data,
    blockHeight: ssz.UintNum64,
    snapshot: ssz.phase0.DepositsDataSnapshot,
  },
  {typeName: "EIP4881TestDataArrayItem", jsonCase: "eth2"}
);

// test data contains 512 items
const EIP4881TestDataArray = new ListCompositeType(EIP4881TestDataArrayItem, 1024);

describe("EIP-4881", function () {
  this.timeout(60 * 1000);

  const ymlStr = fs.readFileSync(path.join(path.dirname(url.fileURLToPath(import.meta.url)), "test_data.yaml"), "utf8");
  const json = jsyaml.load(ymlStr) as unknown[];
  expect(json.length).to.be.equal(512);
  const testData = EIP4881TestDataArray.fromJson(json);
  expect(testData.length).to.be.equal(512);

  const testCases: {name: string; viewDU: ListCompositeTreeViewDU<typeof ssz.Root>}[] = [
    {
      name: "DepositDataRootFullList",
      viewDU: DepositDataRootFullList.defaultViewDU(),
    },
    {
      name: "DepositDataRootPartialList",
      viewDU: DepositDataRootPartialList.defaultPartialViewDU(),
    },
  ];

  for (const {name, viewDU: depositRootTree} of testCases) {
    it(`${name}.toSnapshot()`, () => {
      for (let i = 0; i < testData.length; i++) {
        const {depositData, eth1Data, blockHeight, snapshot, depositDataRoot} = testData[i];

        // validate depositDataRoot
        expect(ssz.phase0.DepositData.hashTreeRoot(depositData)).to.be.deep.equal(depositDataRoot);
        depositRootTree.push(depositDataRoot);

        // validate eth1Data
        expect(eth1Data.depositRoot).to.be.deep.equal(depositRootTree.hashTreeRoot());
        expect(eth1Data.depositCount).to.be.equal(depositRootTree.length);

        const blockHash = eth1Data.blockHash;
        const {finalized, depositRoot, depositCount, executionBlockHash, executionBlockHeight} = snapshot;

        // validate snapshot data
        expect(executionBlockHash).to.be.deep.equal(blockHash);
        expect(executionBlockHeight).to.be.equal(blockHeight);
        expect(depositRoot).to.be.deep.equal(depositRootTree.hashTreeRoot());

        // validate actual snapshot
        const actualSnapshot = depositRootTree.toSnapshot(i + 1);
        expect(actualSnapshot.finalized).to.be.deep.equal(finalized);
        expect(actualSnapshot.root).to.be.deep.equal(depositRoot);
        expect(actualSnapshot.count).to.be.equal(depositCount);
      }
    });
  }

  it("snapshot to PartialListCompositeTreeViewDU", () => {
    const fullTree = DepositDataRootFullList.defaultViewDU();

    for (let i = 0; i < testData.length; i++) {
      const {snapshot, depositDataRoot} = testData[i];
      const partialTree = DepositDataRootPartialList.toPartialViewDU({
        finalized: snapshot.finalized,
        root: snapshot.depositRoot,
        count: snapshot.depositCount,
      });

      fullTree.push(depositDataRoot);
      expect(partialTree.hashTreeRoot()).to.be.deep.equal(fullTree.hashTreeRoot());

      // grow the tree since then
      const newFullTree = fullTree.clone();
      for (let j = i + 1; j < testData.length; j++) {
        newFullTree.push(testData[j].depositDataRoot);
        partialTree.push(testData[j].depositDataRoot);

        // validate root
        expect(partialTree.hashTreeRoot()).to.be.deep.equal(newFullTree.hashTreeRoot());

        // validate snapshot
        const actualSnapshot = partialTree.toSnapshot(j + 1);
        expect(actualSnapshot).to.be.deep.equal(newFullTree.toSnapshot(j + 1));
        const expectedSnapshot = testData[j].snapshot;
        expect(actualSnapshot).to.be.deep.equal({
          finalized: expectedSnapshot.finalized,
          root: expectedSnapshot.depositRoot,
          count: expectedSnapshot.depositCount,
        });
      }
    }
  });
});
