import {itBench} from "@dapplion/benchmark";
import {hashTwoObjects, uint8ArrayToHashObject} from "@chainsafe/persistent-merkle-tree";
import * as sszPhase0 from "../../lodestarTypes/phase0/sszTypes";
import * as sszAltair from "../../lodestarTypes/altair/sszTypes";
import {
  getAttestation,
  getOnce,
  getRandomState,
  getSignedAggregateAndProof,
  getSyncCommitteeMessage,
  getSignedContributionAndProof,
  getSignedBeaconBlockPhase0,
  getValidator,
} from "../../utils/generateEth2Objs";
import {
  CompositeType,
  isCompositeType,
  TreeView,
  TreeViewDU,
  ValueOf,
  CompositeView,
  CompositeViewDU,
  hash64,
} from "../../../src";
import {CompositeTypeAny} from "../../../src/type/composite";

describe("HashTreeRoot frequent eth2 objects", () => {
  itBenchHashTreeRoot(sszPhase0.Attestation, getAttestation(0));
  itBenchHashTreeRoot(sszPhase0.SignedAggregateAndProof, getSignedAggregateAndProof(0));
  itBenchHashTreeRoot(sszAltair.SyncCommitteeMessage, getSyncCommitteeMessage(0));
  itBenchHashTreeRoot(sszAltair.SignedContributionAndProof, getSignedContributionAndProof(0));
  itBenchHashTreeRoot(sszPhase0.SignedBeaconBlock, getSignedBeaconBlockPhase0(0));
  itBenchHashTreeRoot(sszPhase0.Validator, getValidator(0));

  function itBenchHashTreeRoot<T extends CompositeType<unknown, TreeView<CompositeTypeAny>, unknown>>(
    type: T,
    value: ValueOf<T>
  ): void {
    itBench({
      id: `hashTreeRoot ${type.typeName} - struct`,
      beforeEach: () => type.clone(value),
      fn: (value) => {
        type.hashTreeRoot(value);
      },
    });

    itBench({
      id: `hashTreeRoot ${type.typeName} - tree`,
      beforeEach: () => type.toView(value) as CompositeView<T>,
      fn: (view) => {
        view.hashTreeRoot();
      },
    });
  }

  for (const validatorCount of [300_000]) {
    // Compute once for all benchmarks only if run
    const getStateVc = getOnce(() => getRandomState(validatorCount));
    const getStateViewDU = getOnce(() => sszAltair.BeaconState.toViewDU(getStateVc()));

    itBench<CompositeViewDU<typeof sszAltair.BeaconState>, Uint8Array>({
      id: `BeaconState vc ${validatorCount} - hashTreeRoot tree`,
      before: () => getStateViewDU().serialize(),
      beforeEach: (bytes) => sszAltair.BeaconState.deserializeToViewDU(bytes),
      fn: (state) => {
        state.hashTreeRoot();
      },
    });

    for (const {fieldName, fieldType} of sszAltair.BeaconState.fieldsEntries) {
      // Only benchmark big data structures
      if (fieldType.maxSize < 10e6 || !isCompositeType(fieldType)) {
        continue;
      }

      itBench<TreeViewDU<CompositeTypeAny>, Uint8Array>({
        id: `BeaconState.${fieldName} vc ${validatorCount} - hashTreeRoot tree`,
        before: () => (getStateViewDU()[fieldName] as TreeViewDU<any>).serialize(),
        beforeEach: (bytes) => fieldType.deserializeToViewDU(bytes) as TreeViewDU<CompositeTypeAny>,
        fn: (fieldView) => {
          fieldView.hashTreeRoot();
        },
      });
    }
  }
});

describe("HashTreeRoot individual components", () => {
  // Average performance of SHA256 is 0.750 us/hash, 1.25 us/hash64
  // Hashing 300_000 validators takes
  // 8 * 300_000 + 300_000 = 2_700_000 hashes or 3.375s best possible time
  //
  // Validator requires 8 hash64
  //
  // pubkey
  // pubkey + wc
  // ef + sl
  // acEE + acE
  // eE + wE
  // d2 i0+i1
  // d2 i2+i3
  // d1 i0+i1
  //
  // pubkey: BLSPubkey,
  // withdrawalCredentials: Bytes32,
  // effectiveBalance: UintNum64,
  // slashed: Boolean,
  // activationEligibilityEpoch: Epoch,
  // activationEpoch: Epoch,
  // exitEpoch: Epoch,
  // withdrawableEpoch: Epoch,

  // hash64 calls per eth2 object
  // - aggregationBits bitLen = 120
  // - 90 attestations per block, all other ops empty
  //
  // Attestation                | 18
  // SignedAggregateAndProof    | 28
  // SyncCommitteeMessage       | 6
  // SignedContributionAndProof | 19
  // SignedBeaconBlock          | 1740
  // Validator                  | 8

  for (const count of [18, 1740, 2_700_000]) {
    const buf = Buffer.alloc(32, 0xaa);
    const ho = uint8ArrayToHashObject(buf);

    itBench(`hash64 x${count}`, () => {
      for (let i = 0; i < count; i++) hash64(buf, buf);
    });

    itBench(`hashTwoObjects x${count}`, () => {
      for (let i = 0; i < count; i++) hashTwoObjects(ho, ho);
    });
  }

  // Optimizing Attestation
  // struct  27.64500 us/op
  // tree    20.27000 us/op
  // hash64  22.78400 us/op
});
