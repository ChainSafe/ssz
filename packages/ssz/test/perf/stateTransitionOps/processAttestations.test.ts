import {itBench} from "@dapplion/benchmark";
import {MutableVector} from "@chainsafe/persistent-ts";
import {VALIDATOR_REGISTRY_LIMIT} from "@chainsafe/lodestar-params";
import {ArrayBasicTreeView, ListBasicTreeViewDU} from "../../../src/v2/arrayTreeView";
import {ListBasicType} from "../../../src/v2/listBasic";
import {UintNumberType} from "../../../src/v2/uint";
import {NumberUintType, ListType, TreeBacked, List} from "../../../src";

describe("processAttestations", () => {
  const vc = 250_000;
  const attesterShare = 32;
  const attesterIndices: number[] = [];
  const statusArr: number[] = [];

  const uint8Type = new NumberUintType({byteLength: 1});
  const epochStatusesType = new ListType({elementType: uint8Type, limit: VALIDATOR_REGISTRY_LIMIT});

  const uint8TypeV2 = new UintNumberType(1);
  const epochStatusesTypeV2 = new ListBasicType(uint8TypeV2, VALIDATOR_REGISTRY_LIMIT);

  before("Compute attesterIndices", () => {
    for (let i = 0; i < vc; i += Math.floor(2 * attesterShare * Math.random())) {
      attesterIndices.push(i);
    }
    for (let i = 0; i < vc; i++) {
      statusArr.push(0x03);
    }
  });

  itBench<MutableVector<number>, MutableVector<number>>({
    id: "get epochStatuses - MutableVector",
    before: () => MutableVector.from(statusArr),
    beforeEach: (epochStatuses) => epochStatuses,
    fn: (epochStatuses) => {
      for (let i = 0; i < attesterIndices.length; i++) {
        epochStatuses.get(attesterIndices[i]);
      }
    },
  });

  itBench<ArrayBasicTreeView<UintNumberType>, ArrayBasicTreeView<UintNumberType>>({
    id: "get epochStatuses - ListTreeView",
    before: () => {
      const epochStatuses = epochStatusesTypeV2.toView(statusArr);
      // Populate read cache
      epochStatuses.getAll();
      return epochStatuses;
    },
    beforeEach: (epochStatuses) => epochStatuses,
    fn: (epochStatuses) => {
      for (let i = 0; i < attesterIndices.length; i++) {
        epochStatuses.get(attesterIndices[i]);
      }
    },
  });

  itBench<TreeBacked<List<number>>, TreeBacked<List<number>>>({
    id: "get epochStatuses - Tree",
    before: () => {
      return epochStatusesType.createTreeBackedFromStruct(statusArr);
    },
    beforeEach: (epochStatuses) => epochStatuses,
    fn: (epochStatuses) => {
      for (let i = 0; i < attesterIndices.length; i++) {
        epochStatuses[attesterIndices[i]];
      }
    },
  });

  // TODO: To optimize more:
  // - For setNodes() computing all the bitstrings takes ~3ms. Changing setNodes() to work with indexes
  //   and a fix level would speed up by 25% processAttestations
  // - setNodes() still takes 3-4ms (discounting bitstring creation). Review why it takes so much,
  //   maybe the instantiation of so many BranchNode classes? Initializing all the h values to 0?
  //   consider not setting them at constructor time and doing it latter. Does it increase performance? Memory?
  //   - Creating 250_000 / 32 `new LeafNode(leafNode)` takes 0.175 ms, so no.
  itBench<ListBasicTreeViewDU<UintNumberType>, ListBasicTreeViewDU<UintNumberType>>({
    id: "set epochStatuses - ListTreeView",
    before: () => {
      const epochStatuses = epochStatusesTypeV2.deserializeToViewDU(epochStatusesTypeV2.serialize(statusArr));
      // Populate read cache
      epochStatuses.getAll();
      return epochStatuses;
    },
    beforeEach: (epochStatuses) => epochStatuses,
    fn: (epochStatuses) => {
      for (let i = 0; i < attesterIndices.length; i++) {
        epochStatuses.set(attesterIndices[i], 0x07);
      }
      epochStatuses.commit();
    },
  });

  itBench<ListBasicTreeViewDU<UintNumberType>, ListBasicTreeViewDU<UintNumberType>>({
    id: "set epochStatuses - ListTreeView - set()",
    before: () => {
      const epochStatuses = epochStatusesTypeV2.deserializeToViewDU(epochStatusesTypeV2.serialize(statusArr));
      // Populate read cache
      epochStatuses.getAll();
      return epochStatuses;
    },
    beforeEach: (epochStatuses) => epochStatuses,
    fn: (epochStatuses) => {
      for (let i = 0; i < attesterIndices.length; i++) {
        epochStatuses.set(attesterIndices[i], 0x07);
      }
    },
  });

  itBench<ListBasicTreeViewDU<UintNumberType>, ListBasicTreeViewDU<UintNumberType>>({
    id: "set epochStatuses - ListTreeView - commit()",
    before: () => {
      const epochStatuses = epochStatusesTypeV2.deserializeToViewDU(epochStatusesTypeV2.serialize(statusArr));
      // Populate read cache
      epochStatuses.getAll();
      return epochStatuses;
    },
    beforeEach: (epochStatuses) => {
      for (let i = 0; i < attesterIndices.length; i++) {
        epochStatuses.set(attesterIndices[i], 0x07);
      }
      return epochStatuses;
    },
    fn: (epochStatuses) => {
      epochStatuses.commit();
    },
  });

  itBench<TreeBacked<List<number>>, TreeBacked<List<number>>>({
    id: "set epochStatuses - Tree",
    before: () => {
      return epochStatusesType.createTreeBackedFromStruct(statusArr);
    },
    beforeEach: (epochStatuses) => epochStatuses.clone(),
    fn: (epochStatuses) => {
      for (let i = 0; i < attesterIndices.length; i++) {
        epochStatuses[attesterIndices[i]] = 0x07;
      }
    },
  });

  // after(async function () {
  //   this.timeout(3000_000);
  //   await new Promise((r) => setTimeout(r, 3000_000));
  // });
});

// function processAttestations() {
//   epochStatuses
// }
