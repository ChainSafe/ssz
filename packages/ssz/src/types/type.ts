/* eslint-disable @typescript-eslint/member-ordering */

import {Json} from "../interface";
export interface IJsonOptions {
  case:
    | "snake"
    | "constant"
    | "camel"
    | "param"
    | "header"
    | "pascal" //Same as squish
    | "dot"
    | "notransform";
  casingMap?: Record<string, string>;
}

/**
 * Check if `type` is an instance of `typeSymbol` type
 *
 * Used by various isFooType functions
 */
export function isTypeOf(type: Type<unknown>, typeSymbol: symbol): boolean {
  return type._typeSymbols.has(typeSymbol);
}

/**
 * A Type is either a BasicType of a CompositeType
 */
export abstract class Type<T> {
  /**
   * Symbols used to track the identity of a type
   *
   * Used by various isFooType functions
   */
  _typeSymbols: Set<symbol>;

  constructor() {
    this._typeSymbols = new Set();
  }

  abstract struct_assertValidValue(value: unknown): asserts value is T;
  abstract struct_defaultValue(): T;
  abstract struct_clone(value: T): T;
  abstract struct_equals(value1: T, value2: T): boolean;
  abstract struct_getSerializedLength(value?: T): number;
  abstract struct_deserializeFromBytes(data: Uint8Array, start: number, end?: number): T;
  abstract struct_serializeToBytes(value: T, output: Uint8Array, offset: number): number;
  abstract struct_hashTreeRoot(value: T): Uint8Array;
  abstract struct_convertFromJson(data: Json, options?: IJsonOptions): T;
  abstract struct_convertToJson(value: T, options?: IJsonOptions): Json;

  /**
   * Valid value assertion
   */
  assertValidValue(value: unknown): asserts value is T {
    return this.struct_assertValidValue(value);
  }

  /**
   * Default constructor
   */
  defaultValue(): T {
    return this.struct_defaultValue();
  }

  /**
   * Clone / copy
   */
  clone(value: T): T {
    return this.struct_clone(value);
  }

  /**
   * Equality
   */
  equals(value1: T, value2: T): boolean {
    return this.struct_equals(value1, value2);
  }

  // Serialization / Deserialization

  /**
   * Check if type has a variable number of elements (or subelements)
   *
   * For basic types, this is always false
   */
  abstract hasVariableSerializedLength(): boolean;

  /**
   * if hasVariableSerializedLength() === true, returns null. Otherwise returns a length value
   */
  abstract getFixedSerializedLength(): null | number;

  /**
   * Maximal serialized byte length
   */
  abstract getMaxSerializedLength(): number;

  /**
   * Minimal serialized byte length
   */
  abstract getMinSerializedLength(): number;

  /**
   * Serialized byte length
   */
  size(value?: T): number {
    return this.struct_getSerializedLength(value);
  }

  /**
   * Low-level deserialization
   */
  fromBytes(data: Uint8Array, start: number, end?: number): T {
    return this.struct_deserializeFromBytes(data, start, end);
  }
  /**
   * Deserialization
   */
  deserialize(data: Uint8Array): T {
    return this.fromBytes(data, 0, data.length);
  }

  /**
   * Low-level serialization
   *
   * Serializes to a pre-allocated Uint8Array
   */
  toBytes(value: T, output: Uint8Array, offset: number): number {
    return this.struct_serializeToBytes(value, output, offset);
  }

  /**
   * Serialization
   */
  serialize(value: T): Uint8Array {
    const output = new Uint8Array(this.size(value));
    this.toBytes(value, output, 0);
    return output;
  }

  /**
   * Merkleization
   */
  hashTreeRoot(value: T): Uint8Array {
    return this.struct_hashTreeRoot(value);
  }

  /**
   * Convert from JSON-serializable object
   */
  fromJson(data: Json, options?: IJsonOptions): T {
    return this.struct_convertFromJson(data, options);
  }

  /**
   * Convert to JSON-serializable object
   */
  toJson(value: T, options?: IJsonOptions): Json {
    return this.struct_convertToJson(value, options);
  }
}
