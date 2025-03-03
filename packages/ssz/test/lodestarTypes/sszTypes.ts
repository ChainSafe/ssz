export * from "./primitive/sszTypes.ts";
export {ssz as phase0} from "./phase0/index.ts";
export {ssz as altair} from "./altair/index.ts";
export {ssz as bellatrix} from "./bellatrix/index.ts";
export {ssz as capella} from "./capella/index.ts";
export {ssz as deneb} from "./deneb/index.ts";

import {ssz as allForksSsz} from "./allForks/index.ts";
export const allForks = allForksSsz.allForks;
export const allForksBlinded = allForksSsz.allForksBlinded;
export const allForksExecution = allForksSsz.allForksExecution;
export const allForksBlobs = allForksSsz.allForksBlobs;
export const allForksLightClient = allForksSsz.allForksLightClient;
