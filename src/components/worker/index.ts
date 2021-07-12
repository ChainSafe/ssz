// /* eslint-disable @typescript-eslint/ban-types */

import {expose} from "threads/worker";
import {getSSZType, createRandomValue} from "./helpers";

const worker = {
  createRandomValue(sszTypeName: string, forkName: string) {
    const type = getSSZType(sszTypeName, forkName);
    const value = createRandomValue(type);
    return value;
  },
  serialize(sszTypeName: string, forkName: string, input: object) {
    const type = getSSZType(sszTypeName, forkName);
    const serialized = type.serialize(input);
    const root = type.hashTreeRoot(input);
    return {serialized, root};
  }
}

export type SszWorker = typeof worker;

expose(worker)