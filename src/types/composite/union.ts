import {BranchNode, concatGindices, Gindex, LeafNode, Node, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {isTreeBacked} from "../../backings";
import {CompositeValue, Json, ObjectLike, Union} from "../../interface";
import {basicTypeToLeafNode} from "../../util/basic";
import {isNoneType} from "../basic/none";
import {byteType, number32Type} from "../basic/wellKnown";
import {IJsonOptions, isTypeOf, Type} from "../type";
import {CompositeType, isCompositeType} from "./abstract";

export interface IUnionOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  types: Type<any>[];
}

/**
 * SSZ Union includes the selector (index of type) in the tree
 * This selector is always in the same index in the tree
 * ```
 *   1
 *  / \
 * 2   3 // <-here
 * ```
 */
export const SELECTOR_GINDEX = BigInt(3);

/**
 * The value gindex in the tree.
 * ```
 *           1
 *          / \
 * here -> 2   3
 * ```
 */
export const VALUE_GINDEX = BigInt(2);

export const UNION_TYPE = Symbol.for("ssz/UnionType");

export function isUnionType<T extends Union<unknown>>(type: Type<unknown>): type is UnionType<T> {
  return isTypeOf(type, UNION_TYPE);
}

export class UnionType<T extends Union<unknown>> extends CompositeType<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  types: Type<any>[];

  constructor(options: IUnionOptions) {
    super();
    this.types = [...options.types];
    this._typeSymbols.add(UNION_TYPE);
  }

  struct_assertValidValue(wrappedValue: unknown): asserts wrappedValue is T {
    const {selector, value} = wrappedValue as Union<unknown>;
    if (!(selector >= 0)) {
      throw new Error("Invalid selector " + selector);
    }
    if (value === null) {
      // May have None as first type option
      if (selector !== 0) {
        throw new Error(`Invalid selector ${selector} for null value`);
      }
      if (!isNoneType(this.types[selector])) {
        throw new Error("None value of Union type must have None as first type option");
      }
    } else {
      try {
        ((this.types[selector] as unknown) as ObjectLike).struct_assertValidValue(value);
      } catch (e) {
        throw new Error(`Invalid value ${value} for selector ${selector}`);
      }
    }
  }

  struct_equals(value1: T, value2: T): boolean {
    this.struct_assertValidValue(value1);
    this.struct_assertValidValue(value2);
    if (value1.selector !== value2.selector) {
      return false;
    }
    return this.types[value1.selector].struct_equals(value1.value, value2.value);
  }

  struct_defaultValue(): T {
    return {selector: 0, value: this.types[0].defaultValue()} as T;
  }

  tree_defaultNode(): Node {
    if (!this._defaultNode) {
      const defaultType = this.types[0];
      const defaultValueNode = isCompositeType(defaultType) ? defaultType.tree_defaultNode() : zeroNode(0);
      // mix_in_selector
      this._defaultNode = new BranchNode(defaultValueNode, zeroNode(0));
    }
    return this._defaultNode;
  }

  struct_clone(wrappedValue: T): T {
    const {selector, value} = wrappedValue;
    return {
      selector,
      value: this.types[selector].struct_clone(value),
    } as T;
  }

  struct_convertToJson(wrappedValue: T, options?: IJsonOptions): Json {
    const {selector, value} = wrappedValue;
    return {
      selector,
      value: this.types[selector].struct_convertToJson(value, options),
    };
  }

  struct_convertFromJson(json: Json, options?: IJsonOptions): T {
    const {selector, value} = json as {[property: string]: Json};

    if (selector === null || (selector !== null && !(selector >= 0))) {
      throw new Error("Invalid JSON Union: invalid selector" + selector);
    }
    return ({
      selector,
      value: this.types[selector as number].struct_convertFromJson(value, options),
    } as unknown) as T;
  }

  struct_convertToTree(wrappedValue: T): Tree {
    if (isTreeBacked<T>(wrappedValue)) return wrappedValue.tree.clone();
    const {selector, value} = wrappedValue;
    const type = this.types[selector];
    const valueNode = isCompositeType(type)
      ? type.struct_convertToTree(value as CompositeValue).rootNode
      : basicTypeToLeafNode(type, value);
    // mix_in_selector
    const selectorNode = basicTypeToLeafNode(number32Type, selector);
    return new Tree(new BranchNode(valueNode, selectorNode));
  }

  tree_convertToStruct(target: Tree): T {
    const selector = number32Type.struct_deserializeFromBytes(target.getRoot(SELECTOR_GINDEX), 0);
    const type = this.types[selector];
    let value: unknown;
    if (isCompositeType(type)) {
      value = type.tree_convertToStruct(target.getSubtree(VALUE_GINDEX));
    } else {
      value = type.struct_deserializeFromBytes(target.getRoot(VALUE_GINDEX), 0);
    }
    return {
      selector,
      value,
    } as T;
  }

  struct_serializeToBytes(wrappedValue: T, output: Uint8Array, offset: number): number {
    const {selector, value} = wrappedValue;
    const index = byteType.struct_serializeToBytes(selector, output, offset);
    return this.types[selector].struct_serializeToBytes(value, output, index);
  }

  tree_serializeToBytes(target: Tree, output: Uint8Array, offset: number): number {
    const selectorRoot = target.getRoot(SELECTOR_GINDEX);
    // selector takes 1 byte
    output.set(selectorRoot.slice(0, 1), offset);
    const selector = number32Type.struct_deserializeFromBytes(selectorRoot, 0);
    const type = this.types[selector];
    if (isCompositeType(type)) {
      return type.tree_serializeToBytes(target.getSubtree(VALUE_GINDEX), output, offset + 1);
    } else {
      const valueRoot = target.getRoot(VALUE_GINDEX);
      const s = type.struct_getSerializedLength();
      output.set(valueRoot.slice(0, s), offset + 1);
      // 1 byte for selector, s bytes for value
      return offset + 1 + s;
    }
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    // 1st byte is for selector
    const selector = byteType.fromBytes(data, start);
    const type = this.types[selector];
    // remainning bytes are for value
    const value = type.struct_deserializeFromBytes(data, start + 1, end);
    return {selector, value} as T;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    this.bytes_validate(data, start, end);
    // 1st byte is for selector
    const selector = byteType.fromBytes(data, start);
    const type = this.types[selector];
    // remainning bytes are for value
    let valueNode: Node;
    if (isCompositeType(type)) {
      valueNode = type.tree_deserializeFromBytes(data, start + 1, end).rootNode;
    } else {
      const chunk = new Uint8Array(32);
      chunk.set(data.slice(start + 1, end));
      valueNode = new LeafNode(chunk);
    }
    const selectorNode = basicTypeToLeafNode(number32Type, selector);
    return new Tree(new BranchNode(valueNode, selectorNode));
  }

  getMinSerializedLength(): number {
    return 1 + Math.min(...this.types.map((type) => type.getMinSerializedLength()));
  }

  getMaxSerializedLength(): number {
    return 1 + Math.max(...this.types.map((type) => type.getMaxSerializedLength()));
  }

  struct_getSerializedLength(wrappedValue: T): number {
    const {selector, value} = wrappedValue;
    return 1 + this.types[selector].struct_getSerializedLength(value);
  }

  tree_getSerializedLength(target: Tree): number {
    const type = this.getType(target);
    if (isCompositeType(type)) {
      return 1 + type.tree_getSerializedLength(target.getSubtree(VALUE_GINDEX));
    } else {
      return 1 + type.struct_getSerializedLength();
    }
  }

  hasVariableSerializedLength(): boolean {
    // Is always considered a variable-length type, even if all type options have an equal fixed-length.
    return true;
  }

  getFixedSerializedLength(): null | number {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bytes_getVariableOffsets(target: Uint8Array): [number, number][] {
    // this method is only needed for Vectors, containers, lists
    throw new Error("Not applicable for Union");
  }

  getMaxChunkCount(): number {
    // 1 for value, 1 for selector
    return 2;
  }

  /** This is just to compliant to the parent, we're not likely to use it. */
  struct_getRootAtChunkIndex(wrappedValue: T, index: number): Uint8Array {
    if (index !== 0 && index !== 1) {
      throw new Error(`Invalid index ${index} for Union type`);
    }
    const {selector, value} = wrappedValue;
    if (index === 1) return basicTypeToLeafNode(number32Type, selector).root;
    return this.types[selector].struct_hashTreeRoot(value);
  }

  struct_getPropertyNames(): (string | number)[] {
    return ["value", "selector"];
  }

  tree_getPropertyNames(): (string | number)[] {
    return ["value", "selector"];
  }

  getPropertyGindex(property: PropertyKey): Gindex {
    switch (property) {
      case "value":
        return VALUE_GINDEX;
      case "selector":
        return SELECTOR_GINDEX;
      default:
        throw new Error(`Invalid property ${String(property)} for Union type`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPropertyType(property: PropertyKey): Type<unknown> {
    // a Union has multiple types
    throw new Error("Not applicable for Union type");
  }

  /** Union can only extract type from a Tree */
  getPropertyTypeFromTree(target: Tree, property: PropertyKey): Type<unknown> {
    switch (property) {
      case "value":
        return this.getType(target);
      case "selector":
        return byteType;
      default:
        throw new Error(`Invalid property ${String(property)} for Union type`);
    }
  }

  tree_getProperty(target: Tree, property: PropertyKey): unknown {
    switch (property) {
      case "value":
        return target.getSubtree(VALUE_GINDEX);
      case "selector":
        return number32Type.struct_deserializeFromBytes(target.getRoot(SELECTOR_GINDEX), 0);
      default:
        throw new Error(`Invalid property ${String(property)} for Union type`);
    }
  }

  tree_setProperty(target: Tree, property: PropertyKey, value: unknown): boolean {
    if (property !== "value") {
      throw new Error(`Invalid property ${String(property)} to set for Union type`);
    }
    const type = this.getType(target);
    if (isCompositeType(type)) {
      target.setSubtree(VALUE_GINDEX, type.struct_convertToTree(value as T));
    } else {
      const chunk = new Uint8Array(32);
      type.struct_serializeToBytes(value, chunk, 0);
      target.setRoot(VALUE_GINDEX, chunk);
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tree_deleteProperty(tree: Tree, property: PropertyKey): boolean {
    throw new Error("Method not implemented for Union type");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tree_iterateValues(tree: Tree): IterableIterator<unknown> {
    throw new Error("Method not implemented for Union type");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tree_readonlyIterateValues(tree: Tree): IterableIterator<unknown> {
    throw new Error("Method not implemented for Union type");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tree_getValues(tree: Tree): unknown[] {
    throw new Error("Method not implemented for Union type");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tree_readonlyGetValues(tree: Tree): unknown[] {
    throw new Error("Method not implemented for Union type");
  }

  tree_getLeafGindices(target: Tree, root: Gindex = BigInt(1)): Gindex[] {
    const gindices: Gindex[] = [concatGindices([root, SELECTOR_GINDEX])];
    const type = this.getType(target);
    const extendedFieldGindex = concatGindices([root, VALUE_GINDEX]);
    if (isCompositeType(type)) {
      gindices.push(...type.tree_getLeafGindices(target.getSubtree(VALUE_GINDEX), extendedFieldGindex));
    } else {
      gindices.push(extendedFieldGindex);
    }
    return gindices;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getType(target: Tree): Type<any> {
    const selectorRoot = target.getRoot(SELECTOR_GINDEX);
    const selector = number32Type.struct_deserializeFromBytes(selectorRoot, 0);
    return this.types[selector];
  }
}
