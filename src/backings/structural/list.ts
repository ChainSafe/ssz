import {List, Json, ObjectLike} from "../../interface";
import {BasicListType, CompositeListType, IJsonOptions} from "../../types";
import {mixInLength} from "../../util/compat";
import {BasicArrayStructuralHandler, CompositeArrayStructuralHandler} from "./array";

export class BasicListStructuralHandler<T extends List<unknown>> extends BasicArrayStructuralHandler<T> {
  _type: BasicListType<T>;
  constructor(type: BasicListType<T>) {
    super();
    this._type = type;
  }
  defaultValue(): T {
    return ([] as unknown) as T;
  }
  getLength(value: T): number {
    return value.length;
  }
  getMaxLength(): number {
    return this._type.limit;
  }
  getMinLength(): number {
    return 0;
  }
  validateBytes(data: Uint8Array, start: number, end: number): void {
    super.validateBytes(data, start, end);
    if (end - start > this.maxSize()) {
      throw new Error("Deserialized list length greater than limit");
    }
  }
  fromBytes(data: Uint8Array, start: number, end: number): T {
    this.validateBytes(data, start, end);
    return super.fromBytes(data, start, end);
  }
  nonzeroChunkCount(value: T): number {
    return Math.ceil((value.length * this._type.elementType.size()) / 32);
  }
  hashTreeRoot(value: T): Uint8Array {
    return mixInLength(super.hashTreeRoot(value), value.length);
  }
  fromJson(data: Json): T {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON list: expected an Array");
    }
    const maxLength = this._type.limit;
    if (data.length > maxLength) {
      throw new Error(`Invalid JSON list: length ${data.length} greater than limit ${maxLength}`);
    }
    return super.fromJson(data);
  }
}

export class CompositeListStructuralHandler<T extends List<ObjectLike>> extends CompositeArrayStructuralHandler<T> {
  _type: CompositeListType<T>;
  constructor(type: CompositeListType<T>) {
    super();
    this._type = type;
  }
  defaultValue(): T {
    return ([] as unknown) as T;
  }
  getLength(value: T): number {
    return value.length;
  }
  getMaxLength(): number {
    return this._type.limit;
  }
  getMinLength(): number {
    return 0;
  }
  fromBytes(data: Uint8Array, start: number, end: number): T {
    this.validateBytes(data, start, end);
    const value = super.fromBytes(data, start, end);
    if (value.length > this._type.limit) {
      throw new Error("Deserialized list length greater than limit");
    }
    return value;
  }
  nonzeroChunkCount(value: T): number {
    return value.length;
  }
  hashTreeRoot(value: T): Uint8Array {
    return mixInLength(super.hashTreeRoot(value), value.length);
  }
  fromJson(data: Json, options?: IJsonOptions): T {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON list: expected an Array");
    }
    const maxLength = this._type.limit;
    if (data.length > maxLength) {
      throw new Error(`Invalid JSON list: length ${data.length} greater than limit ${maxLength}`);
    }
    return super.fromJson(data, options);
  }
}
