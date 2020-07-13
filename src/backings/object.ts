import {BitList, BitVector, ByteVector, List, Vector} from "../interface";

export type ObjBackedify<T> = {
  [K in keyof T]: T[K] extends object ? ObjBacked<T[K]> : T[K];
};

export type IObjBacked<T extends object> = {
  [K in keyof T]: T[K] extends BitList
    ? boolean[]
    : T[K] extends BitVector
    ? boolean[]
    : T[K] extends ByteVector
    ? Uint8Array
    : T[K] extends List<unknown>
    ? T[K][number][]
    : T[K] extends Vector<unknown>
    ? T[K][number][]
    : T[K];
};

/**
 * Wrap an ssz type to explicitly be backed by primitive javascript objects
 */
export type ObjBacked<T extends object> = IObjBacked<T> & ObjBackedify<T>;
