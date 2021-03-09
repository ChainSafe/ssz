import {Proof, Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeValue} from "../../interface";
import {CompositeType} from "../../types";
import {Path} from "../backedValue";

export type ValueOf<T extends CompositeValue, V extends keyof T = keyof T> = ITreeBacked<T[V]> | T[V];

export type TreeBacked<T extends CompositeValue> = ITreeBacked<T> & T;

/**
 * The ITreeBacked interface gives convenient access to a `CompositeType` + `Tree` as a wrapper object
 *
 * This is an alternative way of calling `tree_*` methods of the type
 */
export interface ITreeBacked<T extends CompositeValue> {
  type: CompositeType<T>;
  /**
   * The merkle tree backing
   */
  tree: Tree;

  /**
   * Equality
   *
   * If both values are tree-backed, use equality by merkle root, else structural equality
   */
  equals(other: T): boolean;
  /**
   * Clone / Copy
   */
  clone(): TreeBacked<T>;

  /**
   * Serialized byte length
   */
  size(): number;
  /**
   * Low-level serialization
   *
   * Serializes to a pre-allocated Uint8Array
   */
  toBytes(output: Uint8Array, offset: number): number;
  /**
   * Serialization
   */
  serialize(): Uint8Array;

  /**
   * Merkleization
   */
  hashTreeRoot(): Uint8Array;

  createProof(paths: Path[]): Proof;

  keys(): IterableIterator<keyof T>;
  values(): IterableIterator<ValueOf<T>>;
  entries(): IterableIterator<[keyof T, ValueOf<T>]>;
}
