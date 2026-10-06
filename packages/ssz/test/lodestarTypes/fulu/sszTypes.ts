/**
 * Fulu types ported from lodestar `packages/types/src/fulu/sszTypes.ts`.
 * Only `BeaconState` and the types it references are ported.
 */
import {ContainerType, VectorBasicType} from "../../../src/index.ts";
import {ssz as electraSsz} from "../electra/index.ts";
import {preset} from "../params.ts";
import {ssz as primitiveSsz} from "../primitive/index.ts";

const {MIN_SEED_LOOKAHEAD, SLOTS_PER_EPOCH} = preset;

const {ValidatorIndex} = primitiveSsz;

export const ProposerLookahead = new VectorBasicType(ValidatorIndex, (MIN_SEED_LOOKAHEAD + 1) * SLOTS_PER_EPOCH);

export const BeaconState = new ContainerType(
  {
    ...electraSsz.BeaconState.fields,
    proposerLookahead: ProposerLookahead, // New in FULU:EIP7917
  },
  {typeName: "BeaconState", jsonCase: "eth2"}
);
