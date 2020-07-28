/* eslint-disable @typescript-eslint/no-unused-vars */
import {Json} from "../../interface";
import {IJsonOptions} from "../type";

/**
 * Check if `type` is an instance of `typeSymbol` type
 *
 * Used by various isFooType functions
 */
export function isTypeOf(type: unknown, typeSymbol: symbol): boolean {
  return (
    type &&
    (type as BasicType<unknown>)._typeSymbols &&
    (type as BasicType<unknown>)._typeSymbols.has &&
    (type as BasicType<unknown>)._typeSymbols.has(typeSymbol)
  );
}

/**
 * A BasicType is a terminal type, which has no flexibility in its representation.
 *
 * It is serialized as, at maximum, 32 bytes and merkleized as, at maximum, a single chunk
 */
export class BasicType<T> {
  /**
   * Symbols used to track the identity of a type
   *
   * Used by various isFooType functions
   */
  _typeSymbols: Set<symbol>;

  constructor() {
    this._typeSymbols = new Set();
  }

  isBasic(): this is BasicType<T> {
    return true;
  }

  /**
   * Valid value assertion
   */
  assertValidValue(value: unknown): asserts value is T {
    throw new Error("Not implemented");
  }

  /**
   * Default constructor
   */
  defaultValue(): T {
    throw new Error("Not implemented");
  }

  /**
   * Clone / copy
   */
  clone(value: T): T {
    return value;
  }

  /**
   * Equality
   */
  equals(value1: T, value2: T): boolean {
    this.assertValidValue(value1);
    this.assertValidValue(value2);
    return value1 === value2;
  }

  // Serialization / Deserialization

  /**
   * Check if type has a variable number of elements (or subelements)
   *
   * For basic types, this is always false
   */
  isVariableSize(): boolean {
    return false;
  }
  /**
   * Serialized byte length
   */
  size(): number {
    throw new Error("Not implemented");
  }

  /**
   * Maximal serialized byte length
   */
  maxSize(): number {
    return this.size();
  }

  /**
   * Minimal serialized byte length
   */
  minSize(): number {
    return this.size();
  }

  /**
   * Validate bytes before calling fromBytes
   * @param data
   * @param offset
   */
  validateBytes(data: Uint8Array, offset: number): void {
    if (!data) {
      throw new Error("Data is null or undefined");
    }
    if (data.length === 0) {
      throw new Error("Data is empty");
    }
    const length = data.length - offset;
    if (length < this.size()) {
      throw new Error(`Data length of ${length} is too small, expect ${this.size()}`);
    }
    // accept data length > this.size()
  }

  /**
   * Low-level deserialization
   */
  fromBytes(data: Uint8Array, offset: number): T {
    throw new Error("Not implemented");
  }
  /**
   * Deserialization
   */
  deserialize(data: Uint8Array): T {
    return this.fromBytes(data, 0);
  }

  /**
   * Low-level serialization
   *
   * Serializes to a pre-allocated Uint8Array
   */
  toBytes(value: T, output: Uint8Array, offset: number): number {
    throw new Error("Not implemented");
  }
  /**
   * Serialization
   */
  serialize(value: T): Uint8Array {
    const output = new Uint8Array(this.size());
    this.toBytes(value, output, 0);
    return output;
  }

  /**
   * Merkleization
   */
  hashTreeRoot(value: T): Uint8Array {
    const output = new Uint8Array(32);
    this.toBytes(value, output, 0);
    return output;
  }

  /**
   * Convert from JSON-serializable object
   */
  fromJson(data: Json, options?: IJsonOptions): T {
    throw new Error("Not implemented");
  }

  /**
   * Convert to JSON-serializable object
   */
  toJson(value: T, options?: IJsonOptions): Json {
    throw new Error("Not implemented");
  }
}
