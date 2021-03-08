import {Proof, Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeValue, ArrayLike, List} from "../interface";
import {
  BasicArrayType,
  BasicListType,
  CompositeArrayType,
  CompositeListType,
  CompositeType,
  ContainerType,
  isBasicType,
  isCompositeType,
  isContainerType,
  isListType,
  isVectorType,
} from "../types";
import {isTree} from "../util/tree";
import {byteArrayEquals} from "../util/byteArray";
import {Path} from "./backedValue";

export function isTreeBacked<T extends CompositeValue>(value: unknown): value is ITreeBacked<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return value && (value as any).type && (value as any).tree && isTree((value as any).tree);
}

export type KeyOf = string | number;
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

  keys(): IterableIterator<KeyOf>;
  values(): IterableIterator<ValueOf<T>>;
  entries(): IterableIterator<[KeyOf, ValueOf<T>]>;
}

/**
 * Return an ES6 Proxy-wrapped tree value (ergonomic getter/setter/iteration)
 */
export function createTreeBacked<T extends CompositeValue>(type: CompositeType<T>, tree: Tree): TreeBacked<T> {
  const TreeValueClass = getTreeValueClass(type);
  return proxyWrapTreeValue(new TreeValueClass(type, tree));
}

type TreeValueConstructor<T> = {
  new (type: CompositeType<T>, tree: Tree): TreeValue<T>;
};

export function getTreeValueClass<T extends CompositeValue>(
  type: CompositeType<T>
): {new (type: CompositeType<T>, tree: Tree): TreeValue<T>} {
  if (isListType(type)) {
    if (isBasicType(type.elementType)) {
      return (BasicListTreeValue as unknown) as TreeValueConstructor<T>;
    } else {
      return (CompositeListTreeValue as unknown) as TreeValueConstructor<T>;
    }
  } else if (isVectorType(type)) {
    if (isBasicType(type.elementType)) {
      return (BasicArrayTreeValue as unknown) as TreeValueConstructor<T>;
    } else {
      return (CompositeArrayTreeValue as unknown) as TreeValueConstructor<T>;
    }
  } else if (isContainerType(type)) {
    return (ContainerTreeValue as unknown) as TreeValueConstructor<T>;
  }
}

/**
 * Wrap a TreeValue in a Proxy that adds ergonomic getter/setter
 */
export function proxyWrapTreeValue<T extends CompositeValue>(value: TreeValue<T>): TreeBacked<T> {
  return (new Proxy(value, TreeProxyHandler as unknown) as unknown) as TreeBacked<T>;
}

/**
 * Proxy handler that adds ergonomic get/set and exposes TreeValue methods
 */
export const TreeProxyHandler: ProxyHandler<TreeValue<CompositeValue>> = {
  get(target: TreeValue<CompositeValue>, property: PropertyKey): unknown {
    if (property in target) {
      return target[property as keyof TreeValue<CompositeValue>];
    } else {
      return target.getProperty(property as keyof CompositeValue);
    }
  },
  set(target: TreeValue<CompositeValue>, property: PropertyKey, value: unknown): boolean {
    return target.setProperty(property as keyof CompositeValue, (value as unknown) as ITreeBacked<never>);
  },
  ownKeys(target: TreeValue<CompositeValue>): (string | number | symbol)[] {
    return target.getPropertyNames();
  },
  getOwnPropertyDescriptor(target: TreeValue<CompositeValue>, property: PropertyKey): PropertyDescriptor {
    if (target.type.getPropertyType(property as keyof CompositeValue)) {
      return {
        configurable: true,
        enumerable: true,
        writable: true,
      };
    } else {
      return undefined;
    }
  },
};

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
  abstract keys(): IterableIterator<KeyOf>;
  abstract values(): IterableIterator<ValueOf<T>>;
  abstract entries(): IterableIterator<[KeyOf, ValueOf<T>]>;
}

export class BasicArrayTreeValue<T extends ArrayLike<unknown>> extends TreeValue<T> {
  type: BasicArrayType<T>;

  constructor(type: BasicArrayType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  getProperty<P extends keyof T>(property: P): ValueOf<T, P> {
    return this.type.tree_getProperty(this.tree, property) as ValueOf<T, P>;
  }
  setProperty<P extends keyof T>(property: P, value: ValueOf<T, P>): boolean {
    return this.type.tree_setProperty(this.tree, property as number, value);
  }
  *keys(): IterableIterator<KeyOf> {
    const propNames = this.getPropertyNames();
    // pop off "length"
    propNames.pop();
    yield* propNames;
  }
  values(): IterableIterator<ValueOf<T>> {
    return this.type.tree_iterateValues(this.tree) as IterableIterator<ValueOf<T>>;
  }
  *entries(): IterableIterator<[KeyOf, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.values()) {
      yield [keys[i], value];
      i++;
    }
  }
}

export class CompositeArrayTreeValue<T extends ArrayLike<unknown>> extends TreeValue<T> {
  type: CompositeArrayType<T>;

  constructor(type: CompositeArrayType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  getProperty<P extends keyof T>(property: P): ValueOf<T, P> {
    return createTreeBacked(this.type.elementType, this.type.tree_getProperty(this.tree, property) as Tree) as ValueOf<
      T,
      P
    >;
  }
  setProperty<P extends keyof T>(property: P, value: ValueOf<T, P>): boolean {
    return this.type.tree_setProperty(
      this.tree,
      property as number,
      isTreeBacked(value)
        ? value.tree
        : this.type.elementType.struct_convertToTree((value as unknown) as CompositeValue)
    );
  }
  *keys(): IterableIterator<KeyOf> {
    const propNames = this.getPropertyNames();
    // pop off "length"
    propNames.pop();
    yield* propNames;
  }
  values(): IterableIterator<ValueOf<T>> {
    return this.type.tree_iterateValues(this.tree) as IterableIterator<ValueOf<T>>;
  }
  *entries(): IterableIterator<[KeyOf, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.values()) {
      yield [keys[i], value];
      i++;
    }
  }
}

export class BasicListTreeValue<T extends List<unknown>> extends BasicArrayTreeValue<T> {
  type: BasicListType<T>;

  constructor(type: BasicListType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  push(...values: ValueOf<T>[]): number {
    return this.type.tree_push(this.tree, ...values);
  }
  pop(): ValueOf<T> {
    return this.type.tree_pop(this.tree);
  }
}

export class CompositeListTreeValue<T extends List<object>> extends CompositeArrayTreeValue<T> {
  type: CompositeListType<T>;

  constructor(type: CompositeListType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  push(...values: ValueOf<T>[]): number {
    const convertedValues = Array.from({length: values.length}, (_, i) => {
      const value = values[i];
      return isTreeBacked(value)
        ? value.tree
        : this.type.elementType.struct_convertToTree((value as unknown) as CompositeValue);
    });
    return this.type.tree_push(this.tree, ...convertedValues);
  }
  pop(): ValueOf<T> {
    return this.type.tree_pop(this.tree);
  }
}

export class ContainerTreeValue<T extends CompositeValue> extends TreeValue<T> {
  type: ContainerType<T>;

  constructor(type: ContainerType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  getProperty<P extends keyof T>(property: P): ValueOf<T, P> {
    const propType = this.type.getPropertyType(property);
    const propValue = this.type.tree_getProperty(this.tree, property);
    if (isCompositeType(propType)) {
      return (createTreeBacked(propType, propValue as Tree) as unknown) as ValueOf<T, P>;
    } else {
      return propValue as ValueOf<T, P>;
    }
  }
  setProperty<P extends keyof T>(property: P, value: ValueOf<T, P>): boolean {
    const propType = this.type.getPropertyType(property);
    if (isCompositeType(propType)) {
      if (isTreeBacked(value)) {
        return this.type.tree_setProperty(this.tree, property, value.tree);
      } else {
        return this.type.tree_setProperty(
          this.tree,
          property,
          propType.struct_convertToTree((value as unknown) as CompositeValue)
        );
      }
    } else {
      return this.type.tree_setProperty(this.tree, property, value);
    }
  }
  *keys(): IterableIterator<KeyOf> {
    yield* this.getPropertyNames();
  }
  *values(): IterableIterator<ValueOf<T>> {
    for (const [_key, value] of this.entries()) {
      yield value;
    }
  }
  *entries(): IterableIterator<[KeyOf, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.type.tree_iterateValues(this.tree)) {
      const propName = keys[i];
      const propType = this.type.getPropertyType(propName);
      if (isCompositeType(propType)) {
        yield [propName, (createTreeBacked(propType, value as Tree) as unknown) as T[keyof T]];
      } else {
        yield [keys[i], value as T[keyof T]];
      }
      i++;
    }
  }
}
