import {CompositeValue, List, ObjectLike} from "../../interface";
import {Node, BranchNode, Tree, hashObjectToUint8Array} from "@chainsafe/persistent-merkle-tree";
import {CompositeArrayTreeValue, TreeProxyHandler, TreeValue} from "../../backings/tree/treeValue";
import {TreeBacked, ValueOf} from "../../backings";
import {HashObject} from "@chainsafe/as-sha256";
import {ContainerType} from "./container";

/**
 * Container that when represented as a Tree its children's data is represented as a struct, not a tree.
 *
 * This approach is usefull for memory efficiency of data that is not modified often, for example the validators
 * registry in Ethereum consensus `state.validators`. The tradeoff is that getting the hash, are proofs is more
 * expensive because the tree has to be recreated every time.
 */
export class ContainerLeafNodeStructType<T extends ObjectLike = ObjectLike> extends ContainerType<T> {
  /** Method to allow the Node to merkelize the struct */
  toFullTree(value: T): Tree {
    return super.struct_convertToTree(value);
  }

  /** Overrides to return BranchNodeStruct instead of regular Tree */

  createTreeBacked(tree: Tree): TreeBacked<T> {
    const value = new ContainerLeafNodeStructTreeValue(this, tree);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (new Proxy(value, TreeProxyHandler as any) as unknown) as TreeBacked<T>;
  }

  // struct_defaultValue   -> these comments acknowledge that this functions do not need to be overwritten
  // struct_getSerializedLength
  // getMaxSerializedLength
  // getMinSerializedLength
  // struct_assertValidValue
  // struct_equals
  // struct_clone
  // struct_deserializeFromBytes
  // struct_serializeToBytes
  // struct_getRootAtChunkIndex
  // struct_convertFromJson
  // struct_convertToJson

  struct_convertToTree(value: T): Tree {
    const node = new BranchNodeStruct(this, value);
    return new Tree(node);
  }

  // struct_convertToTree
  // struct_getPropertyNames
  // bytes_getVariableOffsets

  tree_defaultNode(): Node {
    return new BranchNodeStruct(this, this.struct_defaultValue());
  }

  tree_convertToStruct(target: Tree): T {
    return (target.rootNode as BranchNodeStruct<T>).value;
  }

  // tree_getSerializedLength

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const value = this.struct_deserializeFromBytes(data, start, end);
    const node = new BranchNodeStruct(this, value);
    return new Tree(node);
  }

  tree_serializeToBytes(target: Tree, output: Uint8Array, offset: number): number {
    const {value} = target.rootNode as BranchNodeStruct<T>;
    return this.struct_serializeToBytes(value, output, offset);
  }

  // getPropertyGindex
  // getPropertyType
  // tree_getPropertyNames

  tree_getProperty(target: Tree, property: PropertyKey): Tree | unknown {
    return (target.rootNode as BranchNodeStruct<T>).value[property as keyof T];
  }

  tree_setProperty(target: Tree, property: PropertyKey, value: Tree | unknown): boolean {
    const {value: prevNodeValue} = target.rootNode as BranchNodeStruct<T>;

    // TODO: Should this check for valid field name? Benchmark the cost
    const newNodeValue = {...prevNodeValue, [property]: value} as T;
    target.rootNode = new BranchNodeStruct(this, newNodeValue);

    return true;
  }

  tree_deleteProperty(target: Tree, prop: PropertyKey): boolean {
    const chunkIndex = Object.keys(this.fields).findIndex((fieldName) => fieldName === prop);
    if (chunkIndex === -1) {
      throw new Error("Invalid container field name");
    }
    const fieldType = this.fields[prop as string];
    return this.tree_setProperty(target, prop, fieldType.struct_defaultValue());
  }

  *tree_iterateValues(target: Tree): IterableIterator<Tree | unknown> {
    yield* Object.values((target.rootNode as BranchNodeStruct<T>).value);
  }

  *tree_readonlyIterateValues(target: Tree): IterableIterator<Tree | unknown> {
    return yield* this.tree_iterateValues(target);
  }

  tree_getValues(target: Tree): (Tree | unknown)[] {
    return Array.from(Object.values((target.rootNode as BranchNodeStruct<T>).value));
  }

  tree_readonlyGetValues(target: Tree): (Tree | unknown)[] {
    return this.tree_getValues(target);
  }

  // hasVariableSerializedLength
  // getFixedSerializedLength
  // getMaxChunkCount
  // tree_getLeafGindices
}

/**
 * BranchNode whose children's data is represented as a struct, not a tree.
 *
 * This approach is usefull for memory efficiency of data that is not modified often, for example the validators
 * registry in Ethereum consensus `state.validators`. The tradeoff is that getting the hash, are proofs is more
 * expensive because the tree has to be recreated every time.
 */
export class BranchNodeStruct<T> extends Node {
  constructor(readonly type: ContainerLeafNodeStructType<T>, readonly value: T) {
    super();
  }

  get rootHashObject(): HashObject {
    if (this.h0 === null) {
      const tree = this.type.toFullTree(this.value);
      super.applyHash(tree.rootNode.rootHashObject);
    }
    return this;
  }

  get root(): Uint8Array {
    return hashObjectToUint8Array(this.rootHashObject);
  }

  isLeaf(): boolean {
    return false;
  }

  get left(): Node {
    const tree = this.type.toFullTree(this.value);
    return tree.rootNode.left;
  }

  get right(): Node {
    const tree = this.type.toFullTree(this.value);
    return tree.rootNode.right;
  }

  rebindLeft(left: Node): Node {
    return new BranchNode(left, this.right);
  }

  rebindRight(right: Node): Node {
    return new BranchNode(this.left, right);
  }
}

/**
 * Custom TreeValue to be used in `ContainerLeafNodeStructType`.
 *
 * It skips extra work done in `ContainerTreeValue` since all data is represented as struct and should be returned
 * as struct, not as TreeBacked.
 */
export class ContainerLeafNodeStructTreeValue<T extends CompositeValue> extends TreeValue<T> {
  type: ContainerType<T>;

  constructor(type: ContainerType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  getProperty<P extends keyof T>(property: P): ValueOf<T, P> {
    return this.type.tree_getProperty(this.tree, property) as ValueOf<T, P>;
  }

  setProperty<P extends keyof T>(property: P, value: ValueOf<T, P>): boolean {
    return this.type.tree_setProperty(this.tree, property, value);
  }

  *keys(): IterableIterator<string> {
    yield* this.getPropertyNames() as string[];
  }

  *values(): IterableIterator<ValueOf<T>> {
    for (const [_key, value] of this.entries()) {
      yield value;
    }
  }

  *entries(): IterableIterator<[string, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.type.tree_iterateValues(this.tree)) {
      const propName = keys[i] as keyof T;
      yield [propName as string, value as ValueOf<T>];
      i++;
    }
  }

  *readonlyValues(): IterableIterator<ValueOf<T>> {
    return yield* this.values();
  }

  *readonlyEntries(): IterableIterator<[string, ValueOf<T>]> {
    return yield* this.entries();
  }

  keysArray(): string[] {
    return this.getPropertyNames() as string[];
  }
  valuesArray(): ValueOf<T>[] {
    return this.type.tree_getValues(this.tree) as ValueOf<T>[];
  }
  entriesArray(): [string, ValueOf<T>][] {
    const keys = this.getPropertyNames();
    const values = this.type.tree_getValues(this.tree);
    return keys.map((key, i) => [key as string, values[i] as ValueOf<T>]);
  }
  readonlyValuesArray(): ValueOf<T>[] {
    return this.valuesArray();
  }
  readonlyEntriesArray(): [string, ValueOf<T>][] {
    return this.entriesArray();
  }
}

/**
 * Custom readonlyValues to return non-tree backed values, but the raw struct inside BranchNodeStruct nodes.
 *
 * This function allows very efficient reads and iteration over the entire validators registry in Lodestar.
 */
export function readonlyValuesListOfLeafNodeStruct<T extends CompositeValue>(objArr: List<T>): T[] {
  const treeValue = (objArr as unknown) as CompositeArrayTreeValue<T[]>;
  const {tree, type} = treeValue;
  const nodes = tree.getNodesAtDepth(type.getChunkDepth(), 0, type.tree_getChunkCount(tree));

  const values: T[] = [];
  for (let i = 0, len = nodes.length; i < len; i++) {
    const value = (nodes[i] as BranchNodeStruct<T>).value;
    if (value === undefined) {
      throw Error("node is not a BranchNodeStruct");
    }
    values.push(value);
  }

  return values;
}
