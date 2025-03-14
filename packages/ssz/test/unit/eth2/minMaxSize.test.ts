import {describe, expect, it } from "vitest";
import {Type} from "../../../src/index.js";
import {ssz} from "../../lodestarTypes/index.js";

enum ForkName {
  phase0 = "phase0",
  altair = "altair",
  bellatrix = "bellatrix",
}

describe("Get minSize and maxSize of eth2 data structures", () => {
  const sizes: Record<ForkName, Record<string, {minSize: number; maxSize: number}>> = {
    phase0: {
      AttestationSubnets: {minSize: 8, maxSize: 8},
      BeaconBlockHeader: {minSize: 112, maxSize: 112},
      BeaconBlockHeaderBigint: {minSize: 112, maxSize: 112},
      SignedBeaconBlockHeader: {minSize: 208, maxSize: 208},
      SignedBeaconBlockHeaderBigint: {minSize: 208, maxSize: 208},
      Checkpoint: {minSize: 40, maxSize: 40},
      CheckpointBigint: {minSize: 40, maxSize: 40},
      CommitteeBits: {minSize: 1, maxSize: 257},
      CommitteeIndices: {minSize: 0, maxSize: 16384},
      DepositMessage: {minSize: 88, maxSize: 88},
      DepositData: {minSize: 184, maxSize: 184},
      DepositDataRootFullList: {minSize: 0, maxSize: 137438953472},
      DepositDataRootPartialList: {minSize: 0, maxSize: 137438953472},
      DepositEvent: {minSize: 200, maxSize: 200},
      Eth1Data: {minSize: 72, maxSize: 72},
      Eth1DataVotes: {minSize: 0, maxSize: 2304},
      Eth1DataOrdered: {minSize: 80, maxSize: 80},
      Eth1Block: {minSize: 48, maxSize: 48},
      Fork: {minSize: 16, maxSize: 16},
      ForkData: {minSize: 36, maxSize: 36},
      ENRForkID: {minSize: 16, maxSize: 16},
      HistoricalBlockRoots: {minSize: 2048, maxSize: 2048},
      HistoricalStateRoots: {minSize: 2048, maxSize: 2048},
      HistoricalBatch: {minSize: 4096, maxSize: 4096},
      Validator: {minSize: 121, maxSize: 121},
      ValidatorContainer: {minSize: 121, maxSize: 121},
      ValidatorNodeStruct: {minSize: 121, maxSize: 121},
      Validators: {minSize: 0, maxSize: 133040906960896},
      Balances: {minSize: 0, maxSize: 8796093022208},
      RandaoMixes: {minSize: 2048, maxSize: 2048},
      Slashings: {minSize: 512, maxSize: 512},
      JustificationBits: {minSize: 1, maxSize: 1},
      AttestationData: {minSize: 128, maxSize: 128},
      AttestationDataBigint: {minSize: 128, maxSize: 128},
      IndexedAttestation: {minSize: 228, maxSize: 16612},
      IndexedAttestationBigint: {minSize: 228, maxSize: 16612},
      PendingAttestation: {minSize: 149, maxSize: 405},
      SigningData: {minSize: 64, maxSize: 64},
      Attestation: {minSize: 229, maxSize: 485},
      AttesterSlashing: {minSize: 464, maxSize: 33232},
      Deposit: {minSize: 1240, maxSize: 1240},
      ProposerSlashing: {minSize: 416, maxSize: 416},
      VoluntaryExit: {minSize: 16, maxSize: 16},
      SignedVoluntaryExit: {minSize: 112, maxSize: 112},
      BeaconBlockBody: {minSize: 220, maxSize: 157572},
      BeaconBlock: {minSize: 304, maxSize: 157656},
      SignedBeaconBlock: {minSize: 404, maxSize: 157756},
      EpochAttestations: {minSize: 0, maxSize: 418816},
      BeaconState: {minSize: 7057, maxSize: 141837537701009},
      CommitteeAssignment: {minSize: 20, maxSize: 16404},
      AggregateAndProof: {minSize: 337, maxSize: 593},
      SignedAggregateAndProof: {minSize: 437, maxSize: 693},
      Status: {minSize: 84, maxSize: 84},
      Goodbye: {minSize: 8, maxSize: 8},
      Ping: {minSize: 8, maxSize: 8},
      Metadata: {minSize: 16, maxSize: 16},
      BeaconBlocksByRangeRequest: {minSize: 24, maxSize: 24},
      BeaconBlocksByRootRequest: {minSize: 0, maxSize: 32768},
      Genesis: {minSize: 44, maxSize: 44},
      HistoricalBatchRoots: {minSize: 64, maxSize: 64},
      DepositsDataSnapshot: {minSize: 84, maxSize: 137438953556},
    },
    altair: {
      SyncSubnets: {minSize: 1, maxSize: 1},
      Metadata: {minSize: 17, maxSize: 17},
      SyncCommittee: {minSize: 1584, maxSize: 1584},
      SyncCommitteeMessage: {minSize: 144, maxSize: 144},
      SyncCommitteeContribution: {minSize: 145, maxSize: 145},
      ContributionAndProof: {minSize: 249, maxSize: 249},
      SignedContributionAndProof: {minSize: 345, maxSize: 345},
      SyncAggregatorSelectionData: {minSize: 16, maxSize: 16},
      SyncCommitteeBits: {minSize: 4, maxSize: 4},
      SyncAggregate: {minSize: 100, maxSize: 100},
      HistoricalBlockRoots: {minSize: 2048, maxSize: 2048},
      HistoricalStateRoots: {minSize: 2048, maxSize: 2048},
      HistoricalBatch: {minSize: 4096, maxSize: 4096},
      BeaconBlockBody: {minSize: 320, maxSize: 157672},
      BeaconBlock: {minSize: 404, maxSize: 157756},
      SignedBeaconBlock: {minSize: 504, maxSize: 157856},
      EpochParticipation: {minSize: 0, maxSize: 1099511627776},
      InactivityScores: {minSize: 0, maxSize: 8796093022208},
      BeaconState: {minSize: 10229, maxSize: 152832653144309},
      LightClientSnapshot: {minSize: 3280, maxSize: 3280},
      LightClientUpdate: {minSize: 2268, maxSize: 2268},
      LightClientStore: {minSize: 1860, maxSize: 147012},
      LightClientHeader: {minSize: 112, maxSize: 112},
      LightClientBootstrap: {minSize: 1856, maxSize: 1856},
      LightClientFinalityUpdate: {minSize: 524, maxSize: 524},
      LightClientOptimisticUpdate: {minSize: 220, maxSize: 220},
      LightClientUpdatesByRange: {minSize: 16, maxSize: 16},
    },
    bellatrix: {
      Transaction: {minSize: 0, maxSize: 1073741824},
      Transactions: {minSize: 0, maxSize: 1125899911036928},
      ExecutionPayload: {minSize: 508, maxSize: 1125899911037468},
      ExecutionPayloadHeader: {minSize: 536, maxSize: 568},
      BeaconBlockBody: {minSize: 832, maxSize: 1125899911195144},
      BeaconBlock: {minSize: 916, maxSize: 1125899911195228},
      SignedBeaconBlock: {minSize: 1016, maxSize: 1125899911195328},
      PowBlock: {minSize: 96, maxSize: 96},
      HistoricalBlockRoots: {minSize: 2048, maxSize: 2048},
      HistoricalStateRoots: {minSize: 2048, maxSize: 2048},
      HistoricalBatch: {minSize: 4096, maxSize: 4096},
      BeaconState: {minSize: 10769, maxSize: 152832653144881},
      CommonExecutionPayloadType: {minSize: 504, maxSize: 536},
      BlindedBeaconBlockBody: {minSize: 860, maxSize: 158244},
      BlindedBeaconBlock: {minSize: 944, maxSize: 158328},
      SignedBlindedBeaconBlock: {minSize: 1044, maxSize: 158428},
      ValidatorRegistrationV1: {minSize: 84, maxSize: 84},
      SignedValidatorRegistrationV1: {minSize: 180, maxSize: 180},
      BuilderBid: {minSize: 620, maxSize: 652},
      SignedBuilderBid: {minSize: 720, maxSize: 752},
      PayloadAttributes: {minSize: 40, maxSize: 40},
      SSEPayloadAttributesCommon: {minSize: 88, maxSize: 88},
      SSEPayloadAttributes: {minSize: 128, maxSize: 128},
    },
  };

  for (const fork of [ForkName.phase0, ForkName.altair, ForkName.bellatrix]) {
    const sszFork = ssz[fork];

    for (const [typeName, type] of Object.entries(sszFork)) {
      it(`${fork}.${typeName}`, () => {
        const {minSize, maxSize} = type as Type<unknown>;

        expect(minSize).to.equal(sizes[fork][typeName].minSize, "Wrong minSize");
        expect(maxSize).to.equal(sizes[fork][typeName].maxSize, "Wrong maxSize");
      });
    }
  }
});
