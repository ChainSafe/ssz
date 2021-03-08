/* eslint-disable @typescript-eslint/camelcase */
import {Json, ObjectLike} from "../../interface";
import {CompositeType, isCompositeType} from "./abstract";
import {IJsonOptions, isTypeOf, Type} from "../type";
import {Gindex, LeafNode, Node, subtreeFillToContents, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {SszErrorPath} from "../../util/errorPath";
import {toExpectedCase} from "../../util/json";

export interface IContainerOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, Type<any>>;
}

export const CONTAINER_TYPE = Symbol.for("ssz/ContainerType");

export function isContainerType<T extends ObjectLike = ObjectLike>(type: Type<unknown>): type is ContainerType<T> {
  return isTypeOf(type, CONTAINER_TYPE);
}

export class ContainerType<T extends ObjectLike = ObjectLike> extends CompositeType<T> {
  // ES6 ensures key order is chronological
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, Type<any>>;
  constructor(options: IContainerOptions) {
    super();
    this.fields = {...options.fields};
    this._typeSymbols.add(CONTAINER_TYPE);
  }
  struct_defaultValue(): T {
    const obj = {} as T;
    Object.entries(this.fields).forEach(([fieldName, fieldType]) => {
      obj[fieldName as keyof T] = fieldType.struct_defaultValue() as T[keyof T];
    });
    return obj;
  }
  struct_getSerializedLength(value: T): number {
    let s = 0;
    Object.entries(this.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.hasVariableSerializedLength()) {
        s += fieldType.struct_getSerializedLength(value[fieldName]) + 4;
      } else {
        s += fieldType.struct_getSerializedLength(null);
      }
    });
    return s;
  }
  getMaxSerializedLength(): number {
    const fixedSize = Object.values(this.fields).reduce(
      (total, fieldType) => total + (fieldType.hasVariableSerializedLength() ? 4 : fieldType.getMaxSerializedLength()),
      0
    );
    const maxDynamicSize = Object.values(this.fields).reduce(
      (total, fieldType) => (total += fieldType.hasVariableSerializedLength() ? fieldType.getMaxSerializedLength() : 0),
      0
    );
    return fixedSize + maxDynamicSize;
  }
  getMinSerializedLength(): number {
    const fixedSize = Object.values(this.fields).reduce(
      (total, fieldType) => total + (fieldType.hasVariableSerializedLength() ? 4 : fieldType.getMinSerializedLength()),
      0
    );
    const minDynamicSize = Object.values(this.fields).reduce(
      (total, fieldType) => (total += fieldType.hasVariableSerializedLength() ? fieldType.getMinSerializedLength() : 0),
      0
    );
    return fixedSize + minDynamicSize;
  }

  struct_assertValidValue(value: unknown): asserts value is T {
    Object.entries(this.fields).forEach(([fieldName, fieldType]) => {
      try {
        // @ts-ignore
        fieldType.struct_assertValidValue((value as T)[fieldName]);
      } catch (e) {
        throw new Error(`Invalid field ${fieldName}: ${e.message}`);
      }
    });
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
    Object.entries(this.fields).forEach(([fieldName, fieldType]) => {
      newValue[fieldName as keyof T] = fieldType.struct_clone(value[fieldName]);
    });
    return newValue;
  }
  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    let currentIndex = start;
    let nextIndex = currentIndex;
    const value = {} as T;
    // Since variable-sized values can be interspersed with fixed-sized values, we precalculate
    // the offset indices so we can more easily deserialize the fields in once pass
    // first we get the fixed sizes
    const fixedSizes: (number | false)[] = Object.values(this.fields).map(
      (fieldType) => !fieldType.hasVariableSerializedLength() && fieldType.struct_getSerializedLength(null)
    );
    // with the fixed sizes, we can read the offsets, and store for our single pass
    const offsets: number[] = [];
    const fixedSection = new DataView(data.buffer, data.byteOffset);
    const fixedEnd = fixedSizes.reduce((index: number, size) => {
      if (size === false) {
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
    Object.entries(this.fields).forEach(([fieldName, fieldType], i) => {
      try {
        const fieldSize = fixedSizes[i];
        if (fieldSize === false) {
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
    });
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
    let variableIndex =
      offset +
      Object.values(this.fields).reduce(
        (total, fieldType) =>
          total + (fieldType.hasVariableSerializedLength() ? 4 : fieldType.struct_getSerializedLength(null)),
        0
      );
    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    let fixedIndex = offset;
    Object.entries(this.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.hasVariableSerializedLength()) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.toBytes(value[fieldName], output, variableIndex);
      } else {
        fixedIndex = fieldType.toBytes(value[fieldName], output, fixedIndex);
      }
    });
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
    Object.entries(this.fields).forEach(([fieldName, fieldType]) => {
      const expectedCase = options ? options.case : null;
      const expectedFieldName = toExpectedCase(fieldName, expectedCase);
      if ((data as Record<string, Json>)[expectedFieldName] === undefined) {
        throw new Error(`Invalid JSON container field: expected field ${expectedFieldName} is undefined`);
      }
      value[fieldName as keyof T] = fieldType.fromJson((data as Record<string, Json>)[expectedFieldName], options);
    });
    return value;
  }
  struct_convertToJson(value: T, options?: IJsonOptions): Json {
    const data = {} as Record<string, Json>;
    const expectedCase = options ? options.case : null;
    Object.entries(this.fields).forEach(([fieldName, fieldType]) => {
      data[toExpectedCase(fieldName, expectedCase)] = fieldType.toJson(value[fieldName as keyof T], options);
    });
    return data;
  }
  struct_convertToTree(value: T): Tree {
    return new Tree(
      subtreeFillToContents(
        Object.entries(this.fields).map(([fieldName, fieldType]) => {
          if (!isCompositeType(fieldType)) {
            const chunk = new Uint8Array(32);
            fieldType.toBytes(value[fieldName], chunk, 0);
            return new LeafNode(chunk);
          } else {
            return fieldType.struct_convertToTree(value[fieldName]).rootNode;
          }
        }),
        this.getChunkDepth()
      )
    );
  }
  struct_getPropertyNames(): (string | number)[] {
    return Object.keys(this.fields);
  }
  bytes_getVariableOffsets(target: Uint8Array): [number, number][] {
    const offsets: [number, number][] = [];
    // variable-sized values can be interspersed with fixed-sized values
    // variable-sized value indices are serialized as offsets, indices deeper in the byte array
    let currentIndex = 0;
    let nextIndex = 0;
    const fixedSection = new DataView(target.buffer, target.byteOffset);
    const fixedOffsets: [number, number][] = [];
    const variableOffsets: number[] = [];
    let variableIndex = 0;
    Object.values(this.fields).forEach((fieldType, i) => {
      if (fieldType.hasVariableSerializedLength()) {
        const offset = fixedSection.getUint32(currentIndex, true);
        if (offset > target.length) {
          throw new Error("Offset out of bounds");
        }
        variableOffsets.push(offset);
        currentIndex = nextIndex = currentIndex + 4;
        variableIndex++;
      } else {
        nextIndex = currentIndex + fieldType.struct_getSerializedLength(null);
        fixedOffsets[i] = [currentIndex, nextIndex];
        currentIndex = nextIndex;
      }
    });
    variableOffsets.push(target.length);
    variableIndex = 0;
    Object.values(this.fields).forEach((fieldType, i) => {
      if (fieldType.hasVariableSerializedLength()) {
        if (variableOffsets[variableIndex] > variableOffsets[variableIndex + 1]) {
          throw new Error("Offsets must be increasing");
        }
        offsets.push([variableOffsets[variableIndex], variableOffsets[variableIndex + 1]]);
        variableIndex++;
      } else {
        offsets.push(fixedOffsets[i]);
      }
    });
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
    Object.entries(this.fields).forEach(([fieldName, fieldType], i) => {
      if (!isCompositeType(fieldType)) {
        const chunk = this.tree_getRootAtChunkIndex(target, i);
        value[fieldName as keyof T] = fieldType.struct_deserializeFromBytes(chunk, 0);
      } else {
        const subtree = this.tree_getSubtreeAtChunkIndex(target, i);
        value[fieldName as keyof T] = fieldType.tree_convertToStruct(subtree) as T[keyof T];
      }
    });
    return value;
  }
  tree_getSerializedLength(target: Tree): number {
    let s = 0;
    Object.values(this.fields).forEach((fieldType, i) => {
      if (fieldType.hasVariableSerializedLength()) {
        s +=
          (fieldType as CompositeType<T[keyof T]>).tree_getSerializedLength(
            this.tree_getSubtreeAtChunkIndex(target, i)
          ) + 4;
      } else {
        s += fieldType.struct_getSerializedLength(null);
      }
    });
    return s;
  }
  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const target = this.tree_defaultValue();
    const offsets = this.bytes_getVariableOffsets(new Uint8Array(data.buffer, data.byteOffset + start, end - start));
    Object.values(this.fields).forEach((fieldType, i) => {
      const [currentOffset, nextOffset] = offsets[i];
      if (!isCompositeType(fieldType)) {
        // view of the chunk, shared buffer from `data`
        const dataChunk = new Uint8Array(
          data.buffer,
          data.byteOffset + start + currentOffset,
          nextOffset - currentOffset
        );
        const chunk = new Uint8Array(32);
        // copy chunk into new memory
        chunk.set(dataChunk);
        this.tree_setRootAtChunkIndex(target, i, chunk);
      } else {
        this.tree_setSubtreeAtChunkIndex(
          target,
          i,
          fieldType.tree_deserializeFromBytes(data, start + currentOffset, start + nextOffset)
        );
      }
    });
    return target;
  }

  tree_serializeToBytes(target: Tree, output: Uint8Array, offset: number): number {
    let variableIndex =
      offset +
      Object.values(this.fields).reduce(
        (total, fieldType) =>
          total + (fieldType.hasVariableSerializedLength() ? 4 : fieldType.struct_getSerializedLength(null)),
        0
      );
    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    let fixedIndex = offset;
    let i = 0;
    const fieldTypes = Object.values(this.fields);
    for (const node of target.iterateNodesAtDepth(this.getChunkDepth(), i, fieldTypes.length)) {
      const fieldType = fieldTypes[i];
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
      i++;
    }
    return variableIndex;
  }
  getPropertyGindex(prop: PropertyKey): Gindex {
    const chunkIndex = Object.keys(this.fields).findIndex((fieldName) => fieldName === prop);
    if (chunkIndex === -1) {
      throw new Error("Invalid container field name");
    }
    return this.getGindexAtChunkIndex(chunkIndex);
  }
  getPropertyType(prop: PropertyKey): Type<unknown> {
    const type = this.fields[prop as string];
    if (!type) {
      throw new Error("Invalid container field name");
    }
    return type;
  }
  tree_getPropertyNames(): (string | number)[] {
    return Object.keys(this.fields);
  }
  tree_getProperty(target: Tree, prop: PropertyKey): Tree | unknown {
    const chunkIndex = Object.keys(this.fields).findIndex((fieldName) => fieldName === prop);
    if (chunkIndex === -1) {
      return undefined;
    }
    const fieldType = this.fields[prop as string];
    if (!isCompositeType(fieldType)) {
      const chunk = this.tree_getRootAtChunkIndex(target, chunkIndex);
      return fieldType.struct_deserializeFromBytes(chunk, 0);
    } else {
      return this.tree_getSubtreeAtChunkIndex(target, chunkIndex);
    }
  }
  tree_setProperty(target: Tree, property: PropertyKey, value: Tree | unknown): boolean {
    const chunkIndex = Object.keys(this.fields).findIndex((fieldName) => fieldName === property);
    if (chunkIndex === -1) {
      throw new Error("Invalid container field name");
    }
    const chunkGindex = this.getGindexAtChunkIndex(chunkIndex);
    const fieldType = this.fields[property as string];
    if (!isCompositeType(fieldType)) {
      const chunk = new Uint8Array(32);
      fieldType.struct_serializeToBytes(value, chunk, 0);
      target.setRoot(chunkGindex, chunk);
      return true;
    } else {
      target.setSubtree(chunkGindex, value as Tree);
      return true;
    }
  }
  tree_deleteProperty(target: Tree, prop: PropertyKey): boolean {
    const chunkIndex = Object.keys(this.fields).findIndex((fieldName) => fieldName === prop);
    if (chunkIndex === -1) {
      throw new Error("Invalid container field name");
    }
    const fieldType = this.fields[prop as string];
    if (!isCompositeType(fieldType)) {
      return this.tree_setProperty(target, prop, fieldType.struct_defaultValue());
    } else {
      return this.tree_setProperty(target, prop, fieldType.tree_defaultValue());
    }
  }
  *tree_iterateValues(target: Tree): IterableIterator<Tree | unknown> {
    const chunkIterator = target.iterateNodesAtDepth(this.getChunkDepth(), 0, this.getMaxChunkCount());
    for (const propType of Object.values(this.fields)) {
      const {value, done} = chunkIterator.next();
      if (done) {
        return;
      } else {
        if (!isCompositeType(propType)) {
          yield propType.struct_deserializeFromBytes(value.root as Uint8Array, 0);
        } else {
          yield new Tree(value);
        }
      }
    }
  }

  hasVariableSerializedLength(): boolean {
    return Object.values(this.fields).some((fieldType) => fieldType.hasVariableSerializedLength());
  }
  getMaxChunkCount(): number {
    return Object.keys(this.fields).length;
  }
}
