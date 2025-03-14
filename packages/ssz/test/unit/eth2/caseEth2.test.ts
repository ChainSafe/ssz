import {describe, expect, it} from "vitest";
import {precomputeJsonKey} from "../../../src/type/container.js";

describe("JSON case eth2", () => {
  const fieldNameToJsonKeyCsv = getFieldNameToJsonKeyCsv();
  for (const row of fieldNameToJsonKeyCsv.trim().split("\n")) {
    const [fieldName, jsonKey] = row.split(",");
    it(fieldName, () => {
      expect(precomputeJsonKey(fieldName, undefined, "eth2")).to.equal(jsonKey);
    });
  }
});

function getFieldNameToJsonKeyCsv(): string {
  return `slot,slot
proposerIndex,proposer_index
parentRoot,parent_root
stateRoot,state_root
bodyRoot,body_root
message,message
signature,signature
epoch,epoch
root,root
pubkey,pubkey
withdrawalCredentials,withdrawal_credentials
amount,amount
depositData,deposit_data
blockNumber,block_number
index,index
depositRoot,deposit_root
depositCount,deposit_count
blockHash,block_hash
previousVersion,previous_version
currentVersion,current_version
genesisValidatorsRoot,genesis_validators_root
forkDigest,fork_digest
nextForkVersion,next_fork_version
nextForkEpoch,next_fork_epoch
blockRoots,block_roots
stateRoots,state_roots
effectiveBalance,effective_balance
slashed,slashed
activationEligibilityEpoch,activation_eligibility_epoch
activationEpoch,activation_epoch
exitEpoch,exit_epoch
withdrawableEpoch,withdrawable_epoch
beaconBlockRoot,beacon_block_root
source,source
target,target
attestingIndices,attesting_indices
data,data
aggregationBits,aggregation_bits
inclusionDelay,inclusion_delay
objectRoot,object_root
domain,domain
attestation1,attestation_1
attestation2,attestation_2
proof,proof
signedHeader1,signed_header_1
signedHeader2,signed_header_2
validatorIndex,validator_index
randaoReveal,randao_reveal
eth1Data,eth1_data
graffiti,graffiti
proposerSlashings,proposer_slashings
attesterSlashings,attester_slashings
attestations,attestations
deposits,deposits
voluntaryExits,voluntary_exits
body,body
genesisTime,genesis_time
fork,fork
latestBlockHeader,latest_block_header
historicalRoots,historical_roots
eth1DataVotes,eth1_data_votes
eth1DepositIndex,eth1_deposit_index
validators,validators
balances,balances
randaoMixes,randao_mixes
slashings,slashings
previousEpochAttestations,previous_epoch_attestations
currentEpochAttestations,current_epoch_attestations
justificationBits,justification_bits
previousJustifiedCheckpoint,previous_justified_checkpoint
currentJustifiedCheckpoint,current_justified_checkpoint
finalizedCheckpoint,finalized_checkpoint
committeeIndex,committee_index
aggregatorIndex,aggregator_index
aggregate,aggregate
selectionProof,selection_proof
finalizedRoot,finalized_root
finalizedEpoch,finalized_epoch
headRoot,head_root
headSlot,head_slot
seqNumber,seq_number
attnets,attnets
startSlot,start_slot
count,count
step,step
genesisForkVersion,genesis_fork_version
syncnets,syncnets
pubkeys,pubkeys
aggregatePubkey,aggregate_pubkey
subcommitteeIndex,subcommittee_index
contribution,contribution
syncCommitteeBits,sync_committee_bits
syncCommitteeSignature,sync_committee_signature
syncAggregate,sync_aggregate
previousEpochParticipation,previous_epoch_participation
currentEpochParticipation,current_epoch_participation
inactivityScores,inactivity_scores
currentSyncCommittee,current_sync_committee
nextSyncCommittee,next_sync_committee
header,header
attestedHeader,attested_header
nextSyncCommitteeBranch,next_sync_committee_branch
finalizedHeader,finalized_header
finalityBranch,finality_branch
syncCommitteeAggregate,sync_committee_aggregate
forkVersion,fork_version
snapshot,snapshot
validUpdates,valid_updates
parentHash,parent_hash
feeRecipient,fee_recipient
receiptRoot,receipt_root
receiptsRoot,receipts_root
logsBloom,logs_bloom
random,random
gasLimit,gas_limit
gasUsed,gas_used
timestamp,timestamp
extraData,extra_data
baseFeePerGas,base_fee_per_gas
transactions,transactions
transactionsRoot,transactions_root
executionPayload,execution_payload
totalDifficulty,total_difficulty
latestExecutionPayloadHeader,latest_execution_payload_header`;
}
