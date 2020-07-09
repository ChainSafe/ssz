/* eslint-disable @typescript-eslint/no-unused-vars */
import {Vector, Json} from "../../interface";
import {BasicVectorType, CompositeVectorType} from "../../types";
import {BasicArrayStructuralHandler, CompositeArrayStructuralHandler} from "./array";

export class BasicVectorStructuralHandler<T extends Vector<unknown>> extends BasicArrayStructuralHandler<T> {
  _type: BasicVectorType<T>;
  constructor(type: BasicVectorType<T>) {
    super();
    this._type = type;
  }
  defaultValue(): T {
    return (Array.from({length: this._type.length}, () => {
      return this._type.elementType.defaultValue();
    }) as unknown) as T;
  }
  getLength(value: T): number {
    return this._type.length;
  }
  getMaxLength(): number {
    return this._type.length;
  }
  getMinLength(): number {
    return this._type.length;
  }
  validateBytes(data: Uint8Array, start: number, end: number): void {
    super.validateBytes(data, start, end);
    if ((end - start) / this._type.elementType.size() !== this._type.length) {
      throw new Error("Incorrect deserialized vector length");
    }
  }
  fromBytes(data: Uint8Array, start: number, end: number): T {
    this.validateBytes(data, start, end);
    return super.fromBytes(data, start, end);
  }
  assertValidValue(value: unknown): asserts value is T {
    const actualLength = (value as T).length;
    const expectedLength = this.getLength(value as T);
    if (actualLength !== expectedLength) {
      throw new Error(`Invalid vector length: expected ${expectedLength}, actual ${actualLength}`);
    }
    // @ts-ignore
    super.assertValidValue(value);
  }
  fromJson(data: Json): T {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON vector: expected an Array");
    }
    const expectedLength = this._type.length;
    if (data.length !== expectedLength) {
      throw new Error(`Invalid JSON vector length: expected ${expectedLength}, actual ${data.length}`);
    }
    return super.fromJson(data);
  }
}

export class CompositeVectorStructuralHandler<T extends Vector<object>> extends CompositeArrayStructuralHandler<T> {
  _type: CompositeVectorType<T>;
  constructor(type: CompositeVectorType<T>) {
    super();
    this._type = type;
  }
  defaultValue(): T {
    return (Array.from({length: this._type.length}, () => {
      return this._type.elementType.structural.defaultValue();
    }) as unknown) as T;
  }
  getLength(value: T): number {
    return this._type.length;
  }
  getMaxLength(): number {
    return this._type.length;
  }
  getMinLength(): number {
    return this._type.length;
  }
  fromBytes(data: Uint8Array, start: number, end: number): T {
    this.validateBytes(data, start, end);
    const value = super.fromBytes(data, start, end);
    if (value.length !== this._type.length) {
      throw new Error("Incorrect deserialized vector length");
    }
    return value;
  }
  assertValidValue(value: unknown): asserts value is T {
    const actualLength = (value as T).length;
    const expectedLength = this.getLength(value as T);
    if (actualLength !== expectedLength) {
      throw new Error(`Invalid vector length: expected ${expectedLength}, actual ${actualLength}`);
    }
    // @ts-ignore
    super.assertValidValue(value);
  }
  fromJson(data: Json): T {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON vector: expected an Array");
    }
    const expectedLength = this._type.length;
    if (data.length !== expectedLength) {
      throw new Error(`Invalid JSON vector length: expected ${expectedLength}, actual ${data.length}`);
    }
    return super.fromJson(data);
  }
}
