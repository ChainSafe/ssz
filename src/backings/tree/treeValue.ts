import {Proof, Tree} from "@chainsafe/persistent-merkle-tree";
import {ArrayLike, CompositeValue, List} from "../../interface";
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
} from "../../types";
import {byteArrayEquals} from "../../util/byteArray";
import {isTree} from "../../util/tree";
import {Path} from "../backedValue";
import {ITreeBacked, TreeBacked, ValueOf} from "./interface";

// TODO: This file is quite long and contains logic best chopped into separate files
// There exists circular dependencies here that prevent easy separation
// In this file, there's proxy logic that wraps TreeValue and TreeValue and its subclasses

type TreeValueConstructor<T extends CompositeValue> = {
  new (type: CompositeType<T>, tree: Tree): TreeValue<T>;
};

export function isTreeBacked<T extends CompositeValue>(value: unknown): value is ITreeBacked<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return value && (value as any).type && (value as any).tree && isTree((value as any).tree);
}

/**
 * Return an ES6 Proxy-wrapped tree value (ergonomic getter/setter/iteration)
 */
export function createTreeBacked<T extends CompositeValue>(type: CompositeType<T>, tree: Tree): TreeBacked<T> {
  const TreeValueClass = getTreeValueClass(type);
  return proxyWrapTreeValue(new TreeValueClass(type, tree));
}

export function getTreeValueClass<T extends CompositeValue>(type: CompositeType<T>): TreeValueConstructor<T> {
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
  } else {
    throw Error("Unknown type class");
  }
}

/**
 * Wrap a TreeValue in a Proxy that adds ergonomic getter/setter
 */
export function proxyWrapTreeValue<T extends CompositeValue>(value: TreeValue<T>): TreeBacked<T> {
  return (new Proxy(value, (TreeProxyHandler as unknown) as ProxyHandler<TreeValue<T>>) as unknown) as TreeBacked<T>;
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
    return target.setProperty(property as keyof CompositeValue, (value as unknown) as never);
  },

  ownKeys(target: TreeValue<CompositeValue>): (string | symbol)[] {
    return target.getPropertyNames() as (string | symbol)[];
  },

  getOwnPropertyDescriptor(target: TreeValue<CompositeValue>, property: PropertyKey): PropertyDescriptor | undefined {
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
    return proxyWrapTreeValue(new TreeValueClass(this.type, this.tree.clone()));
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
  abstract keys(): IterableIterator<string>;
  abstract values(): IterableIterator<ValueOf<T>>;
  abstract entries(): IterableIterator<[string, ValueOf<T>]>;
  abstract readonlyValues(): IterableIterator<ValueOf<T>>;
  abstract readonlyEntries(): IterableIterator<[string, ValueOf<T>]>;
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

  *keys(): IterableIterator<string> {
    const propNames = this.getPropertyNames();
    // pop off "length"
    propNames.pop();
    yield* propNames.map(String);
  }

  values(): IterableIterator<ValueOf<T>> {
    return this.type.tree_iterateValues(this.tree) as IterableIterator<ValueOf<T>>;
  }

  *entries(): IterableIterator<[string, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.values()) {
      yield [String(keys[i]), value];
      i++;
    }
  }

  readonlyValues(): IterableIterator<ValueOf<T>> {
    return this.type.tree_readonlyIterateValues(this.tree) as IterableIterator<ValueOf<T>>;
  }

  *readonlyEntries(): IterableIterator<[string, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.readonlyValues()) {
      yield [String(keys[i]), value];
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
    if (property === "length") {
      return this.type.tree_getProperty(this.tree, property) as ValueOf<T, P>;
    }
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

  *keys(): IterableIterator<string> {
    const propNames = this.getPropertyNames();
    // pop off "length"
    propNames.pop();
    yield* propNames.map(String);
  }

  *values(): IterableIterator<ValueOf<T>> {
    for (const tree of this.type.tree_iterateValues(this.tree)) {
      yield createTreeBacked(this.type.elementType, tree as Tree) as ValueOf<T>;
    }
  }

  *entries(): IterableIterator<[string, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.values()) {
      yield [String(keys[i]), value];
      i++;
    }
  }

  *readonlyValues(): IterableIterator<ValueOf<T>> {
    for (const tree of this.type.tree_readonlyIterateValues(this.tree)) {
      yield createTreeBacked(this.type.elementType, tree as Tree) as ValueOf<T>;
    }
  }

  *readonlyEntries(): IterableIterator<[string, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.readonlyValues()) {
      yield [String(keys[i]), value];
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
    return this.type.tree_pop(this.tree) as ValueOf<T>;
  }
}

export class CompositeListTreeValue<T extends List<Record<string, unknown>>> extends CompositeArrayTreeValue<T> {
  type: CompositeListType<T>;

  constructor(type: CompositeListType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  push(...values: ValueOf<T>[]): number {
    const convertedValues = values.map((value) =>
      isTreeBacked(value)
        ? value.tree
        : this.type.elementType.struct_convertToTree((value as unknown) as CompositeValue)
    );
    return this.type.tree_push(this.tree, ...convertedValues);
  }

  pop(): ValueOf<T> {
    return this.type.tree_pop(this.tree) as ValueOf<T>;
  }
}
export class ContainerTreeValue<T extends CompositeValue> extends TreeValue<T> {
  type: ContainerType<T>;

  constructor(type: ContainerType<T>, tree: Tree) {
    super(type, tree);
    this.type = type;
  }

  getProperty<P extends keyof T>(property: P): ValueOf<T, P> {
    if (!this.type.fields[property]) {
      return undefined as ValueOf<T, P>;
    }
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
      const propType = this.type.getPropertyType(propName);
      if (isCompositeType(propType)) {
        yield [propName as string, createTreeBacked(propType, value as Tree) as ValueOf<T>];
      } else {
        yield [propName as string, value as ValueOf<T>];
      }
      i++;
    }
  }

  *readonlyValues(): IterableIterator<ValueOf<T>> {
    for (const [_key, value] of this.readonlyEntries()) {
      yield value;
    }
  }

  *readonlyEntries(): IterableIterator<[string, ValueOf<T>]> {
    const keys = this.getPropertyNames();
    let i = 0;
    for (const value of this.type.tree_readonlyIterateValues(this.tree)) {
      const propName = keys[i] as string;
      const propType = this.type.getPropertyType(propName as keyof T);
      if (isCompositeType(propType)) {
        yield [propName, createTreeBacked(propType, value as Tree) as ValueOf<T>];
      } else {
        yield [propName, value as ValueOf<T>];
      }
      i++;
    }
  }
}
