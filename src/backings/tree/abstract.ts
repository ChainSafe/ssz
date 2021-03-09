import {Proof, Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeValue} from "../../interface";
import {CompositeType} from "../../types";
import {byteArrayEquals} from "../../util/byteArray";
import {Path} from "../backedValue";
import {ITreeBacked, TreeBacked, ValueOf} from "./interface";
import {isTreeBacked, proxyWrapTreeValue} from "./proxy";

/**
 * Convenience wrapper around a type and tree
 */
export abstract class TreeValue<T extends CompositeValue> implements ITreeBacked<T> {
  type: CompositeType<T>;
  tree: Tree;

  constructor(type: CompositeType<T>, tree: Tree) {
    this.type = type;
    this.tree = tree;
  }

  clone(): TreeBacked<T> {
    const TreeValueClass = Object.getPrototypeOf(this).constructor as {new (...args: unknown[]): TreeValue<T>};
    return proxyWrapTreeValue(new TreeValueClass(this.tree.clone(), this.type));
  }
  valueOf(): T {
    return this.type.tree_convertToStruct(this.tree);
  }
  equals(other: T): boolean {
    if (isTreeBacked(other)) {
      return byteArrayEquals(this.hashTreeRoot(), other.hashTreeRoot());
    } else {
      return this.type.struct_equals(this as T, other);
    }
  }
  size(): number {
    return this.type.tree_getSerializedLength(this.tree);
  }
  toStruct(): T {
    return this.type.tree_convertToStruct(this.tree);
  }
  toBytes(output: Uint8Array, offset: number): number {
    return this.type.tree_serializeToBytes(this.tree, output, offset);
  }
  serialize(): Uint8Array {
    const output = new Uint8Array(this.type.tree_getSerializedLength(this.tree));
    this.toBytes(output, 0);
    return output;
  }
  hashTreeRoot(): Uint8Array {
    return this.tree.root;
  }
  createProof(paths: Path[]): Proof {
    return this.type.tree_createProof(this.tree, paths);
  }
  getPropertyNames(): (string | number)[] {
    return this.type.tree_getPropertyNames(this.tree);
  }
  [Symbol.iterator](): IterableIterator<ValueOf<T>> {
    return this.values();
  }
  abstract getProperty<P extends keyof T>(property: P): ValueOf<T, P>;
  abstract setProperty<P extends keyof T>(property: P, value: ValueOf<T, P>): boolean;
  abstract keys(): IterableIterator<keyof T>;
  abstract values(): IterableIterator<ValueOf<T>>;
  abstract entries(): IterableIterator<[keyof T, ValueOf<T>]>;
}
