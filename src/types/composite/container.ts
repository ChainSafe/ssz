import {Json, ObjectLike} from "../../interface";
import {CompositeType, isCompositeType} from "./abstract";
import {IJsonOptions, isTypeOf, Type} from "../type";
import {
  concatGindices,
  getGindicesAtDepth,
  Gindex,
  iterateAtDepth,
  Node,
  subtreeFillToContents,
  Tree,
  zeroNode,
} from "@chainsafe/persistent-merkle-tree";
import {SszErrorPath} from "../../util/errorPath";
import {toExpectedCase} from "../../util/json";
import {isTreeBacked} from "../../backings/tree/treeValue";
import {basicTypeToLeafNode} from "../../util/basic";
import {Number64UintType, NumberUintType} from "../basic";
import {newHashObject} from "../../util/hash";

export interface IContainerOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, Type<any>>;
}

export const CONTAINER_TYPE = Symbol.for("ssz/ContainerType");

export function isContainerType<T extends ObjectLike = ObjectLike>(type: Type<unknown>): type is ContainerType<T> {
  return isTypeOf(type, CONTAINER_TYPE);
}
type FieldInfo = {
  isBasic: boolean;
  gindex: bigint;
};

export class ContainerType<T extends ObjectLike = ObjectLike> extends CompositeType<T> {
  // ES6 ensures key order is chronological
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, Type<any>>;
  /**
   * This caches FieldInfo by field name so that we don't have to query this same data in a lot of apis.
   * This helps speed up 30% with a simple test of increasing state.slot from 0 to 1_000_000 as shown in the
   * performance test of uint.test.ts.
   **/
  fieldInfos: Map<string, FieldInfo>;

  constructor(options: IContainerOptions) {
    super();
    this.fields = {...options.fields};
    this._typeSymbols.add(CONTAINER_TYPE);
    this.fieldInfos = new Map<string, FieldInfo>();
    let chunkIndex = 0;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      this.fieldInfos.set(fieldName, {
        isBasic: !isCompositeType(fieldType),
        gindex: this.getGindexAtChunkIndex(chunkIndex),
      });
      chunkIndex++;
    }
  }

  struct_defaultValue(): T {
    const obj = {} as T;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      obj[fieldName as keyof T] = fieldType.struct_defaultValue() as T[keyof T];
    }
    return obj;
  }

  struct_getSerializedLength(value: T): number {
    let s = 0;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      const fixedLen = fieldType.getFixedSerializedLength();
      if (fixedLen === null) {
        s += fieldType.struct_getSerializedLength(value[fieldName]) + 4;
      } else {
        s += fixedLen;
      }
    }
    return s;
  }

  getMaxSerializedLength(): number {
    let maxSize = 0;
    for (const fieldType of Object.values(this.fields)) {
      const fieldFixedLen = fieldType.getFixedSerializedLength();
      if (fieldFixedLen === null) {
        // +4 for the offset
        maxSize += 4 + fieldType.getMaxSerializedLength();
      } else {
        maxSize += fieldFixedLen;
      }
    }
    return maxSize;
  }

  getMinSerializedLength(): number {
    let maxSize = 0;
    for (const fieldType of Object.values(this.fields)) {
      const fieldFixedLen = fieldType.getFixedSerializedLength();
      if (fieldFixedLen === null) {
        // +4 for the offset
        maxSize += 4 + fieldType.getMinSerializedLength();
      } else {
        maxSize += fieldFixedLen;
      }
    }
    return maxSize;
  }

  struct_assertValidValue(value: unknown): asserts value is T {
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      try {
        ((fieldType as unknown) as T).struct_assertValidValue((value as T)[fieldName]);
      } catch (e) {
        throw new Error(`Invalid field ${fieldName}: ${e.message}`);
      }
    }
  }

  struct_equals(value1: T, value2: T): boolean {
    this.struct_assertValidValue(value1);
    this.struct_assertValidValue(value2);
    return Object.entries(this.fields).every(([fieldName, fieldType]) => {
      return fieldType.struct_equals(value1[fieldName], value2[fieldName]);
    });
  }

  struct_clone(value: T): T {
    const newValue = {} as T;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      newValue[fieldName as keyof T] = fieldType.struct_clone(value[fieldName]);
    }
    return newValue;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    let currentIndex = start;
    let nextIndex = currentIndex;
    const value = {} as T;

    // Since variable-sized values can be interspersed with fixed-sized values, we precalculate
    // the offset indices so we can more easily deserialize the fields in once pass first we get the fixed sizes
    // Note: `fixedSizes[i] = null` if that field has variable length
    const fixedSizes = Object.values(this.fields).map((fieldType) => fieldType.getFixedSerializedLength());

    // with the fixed sizes, we can read the offsets, and store for our single pass
    const offsets: number[] = [];
    const fixedSection = new DataView(data.buffer, data.byteOffset);
    const fixedEnd = fixedSizes.reduce((index: number, size) => {
      if (size === null) {
        offsets.push(start + fixedSection.getUint32(index, true));
        return index + 4;
      } else {
        return index + size;
      }
    }, start);
    offsets.push(end);
    if (fixedEnd !== offsets[0]) {
      throw new Error("Not all variable bytes consumed");
    }

    let offsetIndex = 0;
    for (const [i, [fieldName, fieldType]] of Object.entries(this.fields).entries()) {
      try {
        const fieldSize = fixedSizes[i];
        if (fieldSize === null) {
          // variable-sized field
          if (offsets[offsetIndex] > end) {
            throw new Error("Offset out of bounds");
          }
          if (offsets[offsetIndex] > offsets[offsetIndex + 1]) {
            throw new Error("Offsets must be increasing");
          }
          value[fieldName as keyof T] = (fieldType as CompositeType<T[keyof T]>).struct_deserializeFromBytes(
            data,
            offsets[offsetIndex],
            offsets[offsetIndex + 1]
          );
          offsetIndex++;
          currentIndex += 4;
        } else {
          // fixed-sized field
          nextIndex = currentIndex + fieldSize;
          value[fieldName as keyof T] = fieldType.struct_deserializeFromBytes(data, currentIndex, nextIndex);
          currentIndex = nextIndex;
        }
      } catch (e) {
        throw new SszErrorPath(e, fieldName);
      }
    }

    if (offsets.length > 1) {
      if (offsetIndex !== offsets.length - 1) {
        throw new Error("Not all variable bytes consumed");
      }
      if (currentIndex !== offsets[0]) {
        throw new Error("Not all fixed bytes consumed");
      }
    } else {
      if (currentIndex !== end) {
        throw new Error("Not all fixed bytes consumed");
      }
    }
    return value;
  }

  struct_serializeToBytes(value: T, output: Uint8Array, offset: number): number {
    let variableIndex = offset;
    for (const fieldType of Object.values(this.fields)) {
      const fixedLen = fieldType.getFixedSerializedLength();
      variableIndex += fixedLen === null ? 4 : fixedLen;
    }

    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    let fixedIndex = offset;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      if (fieldType.hasVariableSerializedLength()) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.toBytes(value[fieldName], output, variableIndex);
      } else {
        fixedIndex = fieldType.toBytes(value[fieldName], output, fixedIndex);
      }
    }
    return variableIndex;
  }

  struct_getRootAtChunkIndex(value: T, index: number): Uint8Array {
    const fieldName = Object.keys(this.fields)[index];
    const fieldType = this.fields[fieldName];
    return fieldType.struct_hashTreeRoot(value[fieldName]);
  }

  struct_convertFromJson(data: Json, options?: IJsonOptions): T {
    if (typeof data !== "object") {
      throw new Error("Invalid JSON container: expected Object");
    }
    const value = {} as T;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      const expectedCase = options && options.case;
      const expectedFieldName = toExpectedCase(fieldName, expectedCase);
      if ((data as Record<string, Json>)[expectedFieldName] === undefined) {
        throw new Error(`Invalid JSON container field: expected field ${expectedFieldName} is undefined`);
      }
      value[fieldName as keyof T] = fieldType.fromJson((data as Record<string, Json>)[expectedFieldName], options);
    }
    return value;
  }

  struct_convertToJson(value: T, options?: IJsonOptions): Json {
    const data = {} as Record<string, Json>;
    const expectedCase = options && options.case;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      data[toExpectedCase(fieldName, expectedCase)] = fieldType.toJson(value[fieldName as keyof T], options);
    }
    return data;
  }

  struct_convertToTree(value: T): Tree {
    if (isTreeBacked<T>(value)) return value.tree.clone();
    return new Tree(
      subtreeFillToContents(
        Object.entries(this.fields).map(([fieldName, fieldType]) => {
          if (!isCompositeType(fieldType)) {
            return basicTypeToLeafNode(fieldType, value[fieldName]);
          } else {
            return fieldType.struct_convertToTree(value[fieldName]).rootNode;
          }
        }),
        this.getChunkDepth()
      )
    );
  }

  struct_getPropertyNames(): string[] {
    return Object.keys(this.fields);
  }

  bytes_getVariableOffsets(target: Uint8Array): [number, number][] {
    const types = Object.values(this.fields);
    const offsets: [number, number][] = [];
    // variable-sized values can be interspersed with fixed-sized values
    // variable-sized value indices are serialized as offsets, indices deeper in the byte array
    let currentIndex = 0;
    let nextIndex = 0;
    const fixedSection = new DataView(target.buffer, target.byteOffset);
    const fixedOffsets: [number, number][] = [];
    const variableOffsets: number[] = [];
    let variableIndex = 0;
    for (const [i, fieldType] of types.entries()) {
      const fixedLen = fieldType.getFixedSerializedLength();
      if (fixedLen === null) {
        const offset = fixedSection.getUint32(currentIndex, true);
        if (offset > target.length) {
          throw new Error("Offset out of bounds");
        }
        variableOffsets.push(offset);
        currentIndex = nextIndex = currentIndex + 4;
        variableIndex++;
      } else {
        nextIndex = currentIndex + fixedLen;
        fixedOffsets[i] = [currentIndex, nextIndex];
        currentIndex = nextIndex;
      }
    }

    variableOffsets.push(target.length);
    variableIndex = 0;
    for (const [i, fieldType] of types.entries()) {
      if (fieldType.hasVariableSerializedLength()) {
        if (variableOffsets[variableIndex] > variableOffsets[variableIndex + 1]) {
          throw new Error("Offsets must be increasing");
        }
        offsets.push([variableOffsets[variableIndex], variableOffsets[variableIndex + 1]]);
        variableIndex++;
      } else {
        offsets.push(fixedOffsets[i]);
      }
    }
    return offsets;
  }

  tree_defaultNode(): Node {
    if (!this._defaultNode) {
      this._defaultNode = subtreeFillToContents(
        Object.values(this.fields).map((fieldType) => {
          if (!isCompositeType(fieldType)) {
            return zeroNode(0);
          } else {
            return fieldType.tree_defaultNode();
          }
        }),
        this.getChunkDepth()
      );
    }
    return this._defaultNode;
  }

  tree_convertToStruct(target: Tree): T {
    const value = {} as T;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      const fieldInfo = this.fieldInfos.get(fieldName)!;
      if (fieldInfo.isBasic) {
        const chunk = target.getRoot(fieldInfo.gindex);
        value[fieldName as keyof T] = fieldType.struct_deserializeFromBytes(chunk, 0);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const compositeType = fieldType as CompositeType<any>;
        const subtree = target.getSubtree(fieldInfo.gindex);
        value[fieldName as keyof T] = compositeType.tree_convertToStruct(subtree) as T[keyof T];
      }
    }
    return value;
  }

  tree_getSerializedLength(target: Tree): number {
    let s = 0;
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      const fixedLen = fieldType.getFixedSerializedLength();
      if (fixedLen === null) {
        s +=
          (fieldType as CompositeType<T[keyof T]>).tree_getSerializedLength(
            target.getSubtree(this.fieldInfos.get(fieldName)!.gindex)
          ) + 4;
      } else {
        s += fixedLen;
      }
    }
    return s;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const target = this.tree_defaultValue();
    const offsets = this.bytes_getVariableOffsets(new Uint8Array(data.buffer, data.byteOffset + start, end - start));
    for (const [i, [fieldName, fieldType]] of Object.entries(this.fields).entries()) {
      const [currentOffset, nextOffset] = offsets[i];
      const {isBasic, gindex} = this.fieldInfos.get(fieldName)!;
      if (isBasic) {
        // view of the chunk, shared buffer from `data`
        const dataChunk = new Uint8Array(
          data.buffer,
          data.byteOffset + start + currentOffset,
          nextOffset - currentOffset
        );
        const chunk = new Uint8Array(32);
        // copy chunk into new memory
        chunk.set(dataChunk);
        target.setRoot(gindex, chunk);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const compositeType = fieldType as CompositeType<any>;
        target.setSubtree(
          gindex,
          compositeType.tree_deserializeFromBytes(data, start + currentOffset, start + nextOffset)
        );
      }
    }
    return target;
  }

  tree_serializeToBytes(target: Tree, output: Uint8Array, offset: number): number {
    let variableIndex = offset;
    for (const fieldType of Object.values(this.fields)) {
      const fixedLen = fieldType.getFixedSerializedLength();
      variableIndex += fixedLen === null ? 4 : fixedLen;
    }

    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    let fixedIndex = offset;
    const fieldTypes = Object.values(this.fields);
    const nodes = target.getNodesAtDepth(this.getChunkDepth(), 0, fieldTypes.length);
    for (let i = 0; i < fieldTypes.length; i++) {
      const fieldType = fieldTypes[i];
      const node = nodes[i];
      if (!isCompositeType(fieldType)) {
        const s = fieldType.struct_getSerializedLength();
        output.set(node.root.slice(0, s), fixedIndex);
        fixedIndex += s;
      } else if (fieldType.hasVariableSerializedLength()) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.tree_serializeToBytes(new Tree(node), output, variableIndex);
      } else {
        fixedIndex = fieldType.tree_serializeToBytes(new Tree(node), output, fixedIndex);
      }
    }
    return variableIndex;
  }

  getPropertyGindex(prop: PropertyKey): Gindex {
    const fieldInfo = this.fieldInfos.get(prop as string);
    if (!fieldInfo) {
      throw new Error(`Invalid container field name: ${String(prop)}`);
    }
    return fieldInfo.gindex;
  }

  getPropertyType(prop: PropertyKey): Type<unknown> {
    const type = this.fields[prop as string];
    if (!type) {
      throw new Error(`Invalid container field name: ${String(prop)}`);
    }
    return type;
  }

  tree_getPropertyNames(): (string | number)[] {
    return Object.keys(this.fields);
  }

  tree_getProperty(target: Tree, prop: PropertyKey): Tree | unknown {
    const fieldType = this.fields[prop as string];
    const fieldInfo = this.fieldInfos.get(prop as string);
    if (!fieldInfo) {
      return undefined;
    }
    if (fieldInfo.isBasic) {
      // Number64Uint wants to work on HashObject to improve performance
      if ((fieldType as NumberUintType).struct_deserializeFromHashObject) {
        const hashObject = target.getHashObject(fieldInfo.gindex);
        return (fieldType as Number64UintType).struct_deserializeFromHashObject(hashObject, 0);
      }
      const chunk = target.getRoot(fieldInfo.gindex);
      return fieldType.struct_deserializeFromBytes(chunk, 0);
    } else {
      return target.getSubtree(fieldInfo.gindex);
    }
  }

  tree_setProperty(target: Tree, property: PropertyKey, value: Tree | unknown): boolean {
    const fieldType = this.fields[property as string];
    const fieldInfo = this.fieldInfos.get(property as string);
    if (!fieldInfo) {
      throw new Error("Invalid container field name");
    }
    if (fieldInfo.isBasic) {
      // Number64Uint wants to work on HashObject to improve performance
      if ((fieldType as Number64UintType).struct_serializeToHashObject) {
        const hashObject = newHashObject();
        (fieldType as Number64UintType).struct_serializeToHashObject(value as number, hashObject, 0);
        target.setHashObject(fieldInfo.gindex, hashObject);
        return true;
      }
      const chunk = new Uint8Array(32);
      fieldType.struct_serializeToBytes(value, chunk, 0);
      target.setRoot(fieldInfo.gindex, chunk);
      return true;
    } else {
      target.setSubtree(fieldInfo.gindex, value as Tree);
      return true;
    }
  }

  tree_deleteProperty(target: Tree, prop: PropertyKey): boolean {
    const fieldInfo = this.fieldInfos.get(prop as string);
    if (!fieldInfo) {
      throw new Error("Invalid container field name");
    }
    const fieldType = this.fields[prop as string];
    if (fieldInfo.isBasic) {
      return this.tree_setProperty(target, prop, fieldType.struct_defaultValue());
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const compositeType = fieldType as CompositeType<any>;
      return this.tree_setProperty(target, prop, compositeType.tree_defaultValue());
    }
  }

  *tree_iterateValues(target: Tree): IterableIterator<Tree | unknown> {
    const gindexIterator = iterateAtDepth(this.getChunkDepth(), BigInt(0), BigInt(this.getMaxChunkCount()))[
      Symbol.iterator
    ]();
    for (const propType of Object.values(this.fields)) {
      const {value, done} = gindexIterator.next();
      if (done) {
        return;
      } else {
        if (!isCompositeType(propType)) {
          yield propType.struct_deserializeFromBytes(value.root as Uint8Array, 0);
        } else {
          yield target.getSubtree(value);
        }
      }
    }
  }

  *tree_readonlyIterateValues(target: Tree): IterableIterator<Tree | unknown> {
    const fieldTypes = Object.values(this.fields);
    const nodes = target.getNodesAtDepth(this.getChunkDepth(), 0, fieldTypes.length);
    for (let i = 0; i < fieldTypes.length; i++) {
      const fieldType = fieldTypes[i];
      const node = nodes[i];
      if (!isCompositeType(fieldType)) {
        yield fieldType.struct_deserializeFromBytes(node.root, 0);
      } else {
        yield new Tree(node);
      }
    }
  }

  tree_getValues(target: Tree): (Tree | unknown)[] {
    const fieldTypes = Object.values(this.fields);
    const gindices = getGindicesAtDepth(this.getChunkDepth(), 0, fieldTypes.length);
    const values = [];
    for (let i = 0; i < fieldTypes.length; i++) {
      const fieldType = fieldTypes[i];
      if (!isCompositeType(fieldType)) {
        values.push(fieldType.struct_deserializeFromBytes(target.getRoot(gindices[i]), 0));
      } else {
        values.push(target.getSubtree(gindices[i]));
      }
    }
    return values;
  }

  tree_readonlyGetValues(target: Tree): (Tree | unknown)[] {
    const fieldTypes = Object.values(this.fields);
    const nodes = target.getNodesAtDepth(this.getChunkDepth(), 0, fieldTypes.length);
    const values = [];
    for (let i = 0; i < fieldTypes.length; i++) {
      const fieldType = fieldTypes[i];
      const node = nodes[i];
      if (!isCompositeType(fieldType)) {
        values.push(fieldType.struct_deserializeFromBytes(node.root, 0));
      } else {
        values.push(new Tree(node));
      }
    }
    return values;
  }

  hasVariableSerializedLength(): boolean {
    return Object.values(this.fields).some((fieldType) => fieldType.hasVariableSerializedLength());
  }

  getFixedSerializedLength(): null | number {
    let fixedLen = 0;
    for (const fieldType of Object.values(this.fields)) {
      const fieldFixedLen = fieldType.getFixedSerializedLength();
      if (fieldFixedLen === null) {
        return null;
      } else {
        fixedLen += fieldFixedLen;
      }
    }
    return fixedLen;
  }

  getMaxChunkCount(): number {
    return Object.keys(this.fields).length;
  }

  tree_getLeafGindices(target?: Tree, root: Gindex = BigInt(1)): Gindex[] {
    const gindices: Gindex[] = [];
    for (const [fieldName, fieldType] of Object.entries(this.fields)) {
      const {gindex: fieldGindex, isBasic} = this.fieldInfos.get(fieldName)!;
      const extendedFieldGindex = concatGindices([root, fieldGindex]);
      if (isBasic) {
        gindices.push(extendedFieldGindex);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const compositeType = fieldType as CompositeType<any>;
        if (fieldType.hasVariableSerializedLength()) {
          if (!target) {
            throw new Error("variable type requires tree argument to get leaves");
          }
          gindices.push(...compositeType.tree_getLeafGindices(target.getSubtree(fieldGindex), extendedFieldGindex));
        } else {
          gindices.push(...compositeType.tree_getLeafGindices(undefined, extendedFieldGindex));
        }
      }
    }
    return gindices;
  }
}
