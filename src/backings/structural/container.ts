import {ObjectLike, Json} from "../../interface";
import {ContainerType, CompositeType, Type, IJsonOptions, BasicType} from "../../types";
import {StructuralHandler} from "./abstract";
import {toExpectedCase} from "../utils";
import {SszErrorPath} from "../../util/errorPath";

export class ContainerStructuralHandler<T extends Record<string, unknown>> extends StructuralHandler<T> {
  _type: ContainerType<T>;
  constructor(type: ContainerType<T>) {
    super();
    this._type = type;
  }
  defaultValue(): T {
    const obj = {} as T;
    Object.entries(this._type.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.isBasic()) {
        obj[fieldName as keyof T] = fieldType.defaultValue() as T[keyof T];
      } 
      if( fieldType.isComposite()) {
        obj[fieldName as keyof T] = fieldType.structural.defaultValue() as T[keyof T];
      }
    });
    return obj;
  }
  size(value: T): number {
    let s = 0;
    Object.entries(this._type.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.isVariableSize()) {
        s += fieldType.size(value[fieldName]) + 4;
      } else {
        s += fieldType.size(null);
      }
    });
    return s;
  }
  maxSize(): number {
    const fixedSize = Object.values(this._type.fields).reduce(
      (total, fieldType) => total + (fieldType.isVariableSize() ? 4 : fieldType.maxSize()),
      0
    );
    const maxDynamicSize = Object.values(this._type.fields).reduce(
      (total, fieldType) => (total += fieldType.isVariableSize() ? fieldType.maxSize() : 0),
      0
    );
    return fixedSize + maxDynamicSize;
  }
  minSize(): number {
    const fixedSize = Object.values(this._type.fields).reduce(
      (total, fieldType) => total + (fieldType.isVariableSize() ? 4 : fieldType.minSize()),
      0
    );
    const minDynamicSize = Object.values(this._type.fields).reduce(
      (total, fieldType) => (total += fieldType.isVariableSize() ? fieldType.minSize() : 0),
      0
    );
    return fixedSize + minDynamicSize;
  }
  assertValidValue(value: unknown): asserts value is T {
    Object.entries(this._type.fields).forEach(([fieldName, fieldType]) => {
      try {
        if (fieldType.isBasic()) {
          // @ts-ignore
          fieldType.assertValidValue(value[fieldName]);
        }
        if(fieldType.isComposite()){
          // @ts-ignore
          fieldType.structural.assertValidValue(value[fieldName]);
        }
      } catch (e) {
        throw new Error(`Invalid field ${fieldName}: ${e.message}`);
      }
    });
  }
  equals(value1: T, value2: T): boolean {
    this.assertValidValue(value1);
    this.assertValidValue(value2);
    return Object.entries(this._type.fields).every(([fieldName, fieldType]) => {
      if (fieldType.isBasic()) {
        return fieldType.equals(value1[fieldName], value2[fieldName]);
      } 
      if(fieldType.isComposite()) {
        return fieldType.structural.equals(value1[fieldName] as ObjectLike, value2[fieldName] as ObjectLike);
      }
    });
  }
  clone(value: T): T {
    const newValue = {} as T;
    Object.entries(this._type.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.isBasic()) {
        newValue[fieldName as keyof T] = fieldType.clone(value[fieldName]) as T[keyof T];
      } 
      if(fieldType.isComposite()) {
        newValue[fieldName as keyof T] = fieldType.structural.clone(value[fieldName] as ObjectLike) as T[keyof T];
      }
    });
    return newValue;
  }
  fromBytes(data: Uint8Array, start: number, end: number): T {
    this.validateBytes(data, start, end);
    let currentIndex = start;
    let nextIndex = currentIndex;
    const value = {} as T;
    // Since variable-sized values can be interspersed with fixed-sized values, we precalculate
    // the offset indices so we can more easily deserialize the fields in once pass
    // first we get the fixed sizes
    const fixedSizes: (number | false)[] = Object.values(this._type.fields).map(
      (fieldType) => !fieldType.isVariableSize() && fieldType.size(null)
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
    Object.entries(this._type.fields).forEach(([fieldName, fieldType], i) => {
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
          value[fieldName as keyof T] = (fieldType as CompositeType<T>).structural.fromBytes(
            data,
            offsets[offsetIndex],
            offsets[offsetIndex + 1]
          ) as T[keyof T];
          offsetIndex++;
          currentIndex += 4;
        } else {
          // fixed-sized field
          nextIndex = currentIndex + fieldSize;
          if (fieldType.isBasic()) {
            value[fieldName as keyof T] = fieldType.fromBytes(data, currentIndex)  as T[keyof T];
          } 
          if(fieldType.isComposite()) {
            value[fieldName as keyof T] = fieldType.structural.fromBytes(data, currentIndex, nextIndex) as T[keyof T];
          }
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
  toBytes(value: T, output: Uint8Array, offset: number): number {
    let variableIndex =
      offset +
      Object.values(this._type.fields).reduce(
        (total, fieldType) => total + (fieldType.isVariableSize() ? 4 : fieldType.size(null)),
        0
      );
    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    let fixedIndex = offset;
    Object.entries(this._type.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.isVariableSize() && fieldType.isComposite()) {
        // write offset
        fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
        fixedIndex += 4;
        // write serialized element to variable section
        variableIndex = fieldType.toBytes(value[fieldName] as ObjectLike, output, variableIndex);
      } else {
        fixedIndex = fieldType.toBytes(value[fieldName] as ObjectLike, output, fixedIndex);
      }
    });
    return variableIndex;
  }
  chunk(value: T, index: number): Uint8Array {
    const fieldName = Object.keys(this._type.fields)[index];
    const fieldType = this._type.fields[fieldName];
    return fieldType.hashTreeRoot(value[fieldName]);
  }
  fromJson(data: Json, options?: IJsonOptions): T {
    if (typeof data !== "object") {
      throw new Error("Invalid JSON container: expected Object");
    }
    const value = {} as T;
    Object.entries(this._type.fields).forEach(([fieldName, fieldType]) => {
      const expectedCase = options ? options.case : null;
      const expectedFieldName = toExpectedCase(fieldName, expectedCase);
      if ((data as Record<string, Json>)[expectedFieldName] === undefined) {
        throw new Error(`Invalid JSON container field: expected field ${expectedFieldName} is undefined`);
      }
      value[fieldName as keyof T] = fieldType.fromJson((data as Record<string, Json>)[expectedFieldName], options) as T[keyof T];
    });
    return value;
  }
  toJson(value: T, options?: IJsonOptions): Json {
    const data = {} as Record<string, Json>;
    const expectedCase = options ? options.case : null;
    Object.entries(this._type.fields).forEach(([fieldName, fieldType]) => {
      data[toExpectedCase(fieldName, expectedCase)] = fieldType.toJson(value[fieldName as keyof T], options);
    });
    return data;
  }
}
