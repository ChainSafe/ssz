import {ssz} from "./test/lodestarTypes";
import {preset} from "./test/lodestarTypes/params";
import {BitArray} from "./src";
const {MAX_ATTESTATIONS, MAX_DEPOSITS, MAX_VOLUNTARY_EXITS, MAX_BLS_TO_EXECUTION_CHANGES} = preset;

// Bun: bun ./deserialize_beacon_block_perf_test.ts
// BeaconBlock.deserialize() time 0.11 ms
// NodeJS: npm install -g tsx && tsx ./deserialize_beacon_block_perf_test.ts
// BeaconBlock.deserialize() time 0.25 ms
// deno --allow-env --unstable-sloppy-imports ./deserialize_beacon_block_perf_test.ts
// BeaconBlock.deserialize() time 0.719 ms
const block = ssz.deneb.BeaconBlock.defaultValue();

for (let i = 0; i < MAX_ATTESTATIONS; i++) {
  block.body.attestations.push({
    aggregationBits: BitArray.fromBoolArray(Array.from({length: 64}, () => true)),
    data: {
      slot: 1,
      index: 1,
      beaconBlockRoot: new Uint8Array(32).fill(1),
      source: {
        epoch: 1,
        root: new Uint8Array(32).fill(1),
      },
      target: {
        epoch: 1,
        root: new Uint8Array(32).fill(1),
      },
    },
    signature: new Uint8Array(96).fill(1),
  });
}
for (let i = 0; i < MAX_DEPOSITS; i++) {
  block.body.deposits.push({
    proof: ssz.phase0.Deposit.fields.proof.defaultValue(),
    data: {
      pubkey: new Uint8Array(48).fill(1),
      withdrawalCredentials: new Uint8Array(32).fill(1),
      amount: 32 * 1e9,
      signature: new Uint8Array(96).fill(1),
    },
  });
}
for (let i = 0; i < MAX_VOLUNTARY_EXITS; i++) {
  block.body.voluntaryExits.push({
    signature: new Uint8Array(96).fill(1),
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
  block.body.executionPayload.transactions.push(new Uint8Array(transactionLen).fill(1));
}
for (let i = 0; i < MAX_BLS_TO_EXECUTION_CHANGES; i++) {
  block.body.blsToExecutionChanges.push({
    signature: new Uint8Array(96).fill(1),
    message: {
      validatorIndex: 1,
      fromBlsPubkey: new Uint8Array(48).fill(1),
      toExecutionAddress: new Uint8Array(20).fill(1),
    },
  });
}

const serialized = ssz.deneb.BeaconBlock.serialize(block);

// deserialized 1000 times
const start = Date.now();
for (let i = 0; i < 1000; i++) {
  ssz.deneb.BeaconBlock.deserialize(serialized);
}
console.log("BeaconBlock.deserialize() time", (Date.now() - start) / 1000, "ms");