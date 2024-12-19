import {itBench} from "@dapplion/benchmark";
import {MutableVector} from "@chainsafe/persistent-ts";
import {ListBasicType, UintNumberType, CompositeViewDU} from "../../../src/index.js";

describe("processAttestations", () => {
  const vc = 250_000;
  const attesterShare = 32;
  const attesterIndices: number[] = [];
  const statusArr: number[] = [];

  const VALIDATOR_REGISTRY_LIMIT = 1099511627776;
  const uint8Type = new UintNumberType(1);
  const epochStatusesType = new ListBasicType(uint8Type, VALIDATOR_REGISTRY_LIMIT);

  // Helper types
  type Statuses = typeof epochStatusesType;
  type StatusesViewDU = CompositeViewDU<Statuses>;

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

  itBench<StatusesViewDU, StatusesViewDU>({
    id: "get epochStatuses - ViewDU",
    before: () => {
      const epochStatuses = epochStatusesType.toViewDU(statusArr);
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

  // TODO: To optimize more:
  // - For setNodes() computing all the bitstrings takes ~3ms. Changing setNodes() to work with indexes
  //   and a fix level would speed up by 25% processAttestations
  // - setNodes() still takes 3-4ms (discounting bitstring creation). Review why it takes so much,
  //   maybe the instantiation of so many BranchNode classes? Initializing all the h values to 0?
  //   consider not setting them at constructor time and doing it latter. Does it increase performance? Memory?
  //   - Creating 250_000 / 32 `new LeafNode(leafNode)` takes 0.175 ms, so no.
  itBench<StatusesViewDU, StatusesViewDU>({
    id: "set epochStatuses - ListTreeView",
    before: () => {
      const epochStatuses = epochStatusesType.deserializeToViewDU(epochStatusesType.serialize(statusArr));
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

  itBench<StatusesViewDU, StatusesViewDU>({
    id: "set epochStatuses - ListTreeView - set()",
    before: () => {
      const epochStatuses = epochStatusesType.deserializeToViewDU(epochStatusesType.serialize(statusArr));
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

  itBench<StatusesViewDU, StatusesViewDU>({
    id: "set epochStatuses - ListTreeView - commit()",
    before: () => {
      const epochStatuses = epochStatusesType.deserializeToViewDU(epochStatusesType.serialize(statusArr));
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

  // after(async function () {
  //   this.timeout(3000_000);
  //   await new Promise((r) => setTimeout(r, 3000_000));
  // });
});

// function processAttestations() {
//   epochStatuses
// }
