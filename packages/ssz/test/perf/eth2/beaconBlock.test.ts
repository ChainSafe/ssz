import {bench, describe, setBenchOpts} from "@chainsafe/benchmark";
import {BitArray, toHexString} from "../../../src/index.js";
import {ValueWithCachedPermanentRoot, symbolCachedPermanentRoot} from "../../../src/util/merkleize.js";
import {deneb, ssz} from "../../lodestarTypes/index.js";
import {preset} from "../../lodestarTypes/params.js";
const {MAX_ATTESTATIONS, MAX_DEPOSITS, MAX_VOLUNTARY_EXITS, MAX_BLS_TO_EXECUTION_CHANGES} = preset;

describe("Benchmark BeaconBlock.hashTreeRoot()", () => {
  setBenchOpts({
    minMs: 10_000,
  });

  const block = ssz.deneb.BeaconBlock.defaultValue();
  for (let i = 0; i < MAX_ATTESTATIONS; i++) {
    block.body.attestations.push({
      aggregationBits: BitArray.fromBoolArray(Array.from({length: 64}, () => true)),
      data: {
        slot: 1,
        index: 1,
        beaconBlockRoot: Buffer.alloc(32, 1),
        source: {
          epoch: 1,
          root: Buffer.alloc(32, 1),
        },
        target: {
          epoch: 1,
          root: Buffer.alloc(32, 1),
        },
      },
      signature: Buffer.alloc(96, 1),
    });
  }
  for (let i = 0; i < MAX_DEPOSITS; i++) {
    block.body.deposits.push({
      proof: ssz.phase0.Deposit.fields.proof.defaultValue(),
      data: {
        pubkey: Buffer.alloc(48, 1),
        withdrawalCredentials: Buffer.alloc(32, 1),
        amount: 32 * 1e9,
        signature: Buffer.alloc(96, 1),
      },
    });
  }
  for (let i = 0; i < MAX_VOLUNTARY_EXITS; i++) {
    block.body.voluntaryExits.push({
      signature: Buffer.alloc(96, 1),
      message: {
        epoch: 1,
        validatorIndex: 1,
      },
    });
  }
  // common data on mainnet as of Jun 2024
  const numTransaction = 200;
  const transactionLen = 500;
  for (let i = 0; i < numTransaction; i++) {
    block.body.executionPayload.transactions.push(Buffer.alloc(transactionLen, 1));
  }
  for (let i = 0; i < MAX_BLS_TO_EXECUTION_CHANGES; i++) {
    block.body.blsToExecutionChanges.push({
      signature: Buffer.alloc(96, 1),
      message: {
        validatorIndex: 1,
        fromBlsPubkey: Buffer.alloc(48, 1),
        toExecutionAddress: Buffer.alloc(20, 1),
      },
    });
  }

  const root = ssz.deneb.BeaconBlock.hashTreeRoot(block);
  console.log("BeaconBlock.hashTreeRoot() root", toHexString(root));
  bench({
    id: `Deneb BeaconBlock.hashTreeRoot(), numTransaction=${numTransaction}`,
    beforeEach: () => {
      clearCachedRoots(block);
      return block;
    },
    fn: (block: deneb.BeaconBlock) => {
      ssz.deneb.BeaconBlock.hashTreeRoot(block);
    },
  });
});

function clearCachedRoots(block: deneb.BeaconBlock): void {
  (block as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot] = undefined;
  (block.body as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot] = undefined;
  const attestations = block.body.attestations;
  for (const attestation of attestations) {
    (attestation.data as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot] = undefined;
  }
  for (const exit of block.body.voluntaryExits) {
    (exit as ValueWithCachedPermanentRoot)[symbolCachedPermanentRoot] = undefined;
  }
}
