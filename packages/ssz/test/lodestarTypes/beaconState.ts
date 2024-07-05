import {byteArrayIntoHashObject} from "@chainsafe/as-sha256";
import {executeHashComputations, digestNLevel} from "@chainsafe/persistent-merkle-tree";
import {BranchNodeStruct, ContainerType, ValueOfFields} from "../../src";
import {ByteViews, HashComputationMeta, Type} from "../../src/type/abstract";
import {ContainerOptions} from "../../src/type/container";
import {ValidatorNodeStruct, ValidatorType, validatorToChunkBytes} from "./phase0/validator";

type Validator = ValueOfFields<typeof ValidatorType>;
/**
 * Given a level3 of validators have 8 chunks, we can hash 4 validators at a time
 */
const PARALLEL_FACTOR = 4;
/**
 * Allocate memory once for batch hash validators.
 */
// each level 3 of validator has 8 chunks, each chunk has 32 bytes
const batchLevel3Bytes = new Uint8Array(PARALLEL_FACTOR * 8 * 32);
const level3ByteViewsArr: ByteViews[] = [];
for (let i = 0; i < PARALLEL_FACTOR; i++) {
  const uint8Array = batchLevel3Bytes.subarray(i * 8 * 32, (i + 1) * 8 * 32);
  const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
  level3ByteViewsArr.push({uint8Array, dataView});
}
// each level 4 of validator has 2 chunks for pubkey, each chunk has 32 bytes
const batchLevel4Bytes = new Uint8Array(PARALLEL_FACTOR * 2 * 32);
const level4BytesArr: Uint8Array[] = [];
for (let i = 0; i < PARALLEL_FACTOR; i++) {
  level4BytesArr.push(batchLevel4Bytes.subarray(i * 2 * 32, (i + 1) * 2 * 32));
}
const pubkeyRoots: Uint8Array[] = [];
for (let i = 0; i < PARALLEL_FACTOR; i++) {
  pubkeyRoots.push(batchLevel4Bytes.subarray(i * 32, (i + 1) * 32));
}

const validatorRoots: Uint8Array[] = [];
for (let i = 0; i < PARALLEL_FACTOR; i++) {
  validatorRoots.push(batchLevel3Bytes.subarray(i * 32, (i + 1) * 32));
}

const temporaryRoot = new Uint8Array(32);


/**
 * BeaconStateType: BeaconState is a container type that represents the BeaconState struct.
 * This supports computing validators hashTreeRoot in batch.
 */
export class BeaconStateType<Fields extends Record<string, Type<unknown>>> extends ContainerType<Fields> {
  constructor(readonly fields: Fields, readonly opts?: ContainerOptions<Fields>) {
    super(fields, opts);
  }

  /**
   * Compute roots of validators in batch using preallocated memory. Need to digest at level 4 then level 3.
   * 0                                                root
   *                               /                                         \
   * 1                        10                                                11
   *                   /                 \                                 /             \
   * 2            20                          21                     22                    23
   *           /       \                  /       \             /       \             /         \
   * 3      pub         with         eff         sla        act         act         exit        with
   *      /     \
   * 4 pub0      pub1
   */
  executeHashComputationMeta(hashComps: HashComputationMeta): void {
    // BranchNodeStructs are not computed in batch, they are at the lowest level so need to be computed first
    const branchNodeStructs = hashComps.bottomNodes as BranchNodeStruct<Validator>[];
    const validators = branchNodeStructs.map((node: BranchNodeStruct<Validator>) => node.value);

    const endBatch = validators.length - (validators.length % PARALLEL_FACTOR);
    // commit every 16 validators in batch
    for (let i = 0; i < endBatch; i++) {
      if (i % PARALLEL_FACTOR === 0) {
        batchLevel3Bytes.fill(0);
        batchLevel4Bytes.fill(0);
      }
      const indexInBatch = i % PARALLEL_FACTOR;
      validatorToChunkBytes(level3ByteViewsArr[indexInBatch], level4BytesArr[indexInBatch], validators[i]);

      if (indexInBatch === PARALLEL_FACTOR - 1) {
        // hash level 4, this is populated to pubkeyRoots
        digestNLevel(batchLevel4Bytes, 1);
        for (let j = 0; j < PARALLEL_FACTOR; j++) {
          level3ByteViewsArr[j].uint8Array.set(pubkeyRoots[j], 0);
        }
        // hash level 3, this is populated to validatorRoots
        digestNLevel(batchLevel3Bytes, 3);
        // commit all validators in this batch
        for (let j = PARALLEL_FACTOR - 1; j >= 0; j--) {
          const indexInBatch = (i - j) % PARALLEL_FACTOR;
          byteArrayIntoHashObject(validatorRoots[indexInBatch], 0, branchNodeStructs[i - j]);
        }
      }
    }

    // commit the remaining validators, we can do in batch too but don't want to create new Uint8Array views
    // it's not much different to commit one by one
    for (let i = endBatch; i < branchNodeStructs.length; i++) {
      ValidatorNodeStruct.hashTreeRootInto(validators[i], temporaryRoot, 0);
      byteArrayIntoHashObject(temporaryRoot, 0, branchNodeStructs[i]);
    }

    executeHashComputations(hashComps.byLevel);
  }
}
