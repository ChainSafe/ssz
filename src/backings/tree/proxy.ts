import {Tree} from "@chainsafe/persistent-merkle-tree";
import {CompositeValue} from "../../interface";
import {CompositeType, isBasicType, isContainerType, isListType, isVectorType} from "../../types";
import {isTree} from "../../util/tree";
import {TreeValue} from "./abstract";
import {BasicArrayTreeValue, CompositeArrayTreeValue} from "./array";
import {ContainerTreeValue} from "./container";
import {ITreeBacked, TreeBacked} from "./interface";
import {BasicListTreeValue, CompositeListTreeValue} from "./list";

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
  ownKeys(target: TreeValue<CompositeValue>): (string | symbol)[] {
    return target.getPropertyNames() as (string | symbol)[];
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
