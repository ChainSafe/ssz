export * from "./primitive/sszTypes";
export {ssz as phase0} from "./phase0";
export {ssz as altair} from "./altair";
export {ssz as bellatrix} from "./bellatrix";
export {ssz as capella} from "./capella";
export {ssz as deneb} from "./deneb";

import {ssz as allForksSsz} from "./allForks";
export const allForks = allForksSsz.allForks;
export const allForksBlinded = allForksSsz.allForksBlinded;
export const allForksExecution = allForksSsz.allForksExecution;
export const allForksBlobs = allForksSsz.allForksBlobs;
export const allForksLightClient = allForksSsz.allForksLightClient;
