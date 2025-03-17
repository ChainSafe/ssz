import {expose} from "threads/worker";
import {createRandomValue, getSSZType} from "./helpers";

const worker = {
  createRandomValue(sszTypeName: string, forkName: string) {
    const type = getSSZType(sszTypeName, forkName);
    const value = createRandomValue(type);
    return value;
  },
  serialize(sszTypeName: string, forkName: string, input: unknown) {
    const type = getSSZType(sszTypeName, forkName);
    const serialized = type.serialize(input);
    const root = type.hashTreeRoot(input);
    return {serialized, root};
  },
};

export type SszWorker = typeof worker;

expose(worker);
