import {Json} from "../interface";
export interface IJsonOptions {
  case: "camel" | "snake";
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

  /**
   * Valid value assertion
   */
  abstract assertValidValue(value: unknown): asserts value is T;

  /**
   * Default constructor
   */
  abstract defaultValue(): T;

  /**
   * Clone / copy
   */
  abstract clone(value: T): T;

  /**
   * Equality
   */
  abstract equals(value1: T, value2: T): boolean;

  // Serialization / Deserialization

  /**
   * Check if type has a variable number of elements (or subelements)
   *
   * For basic types, this is always false
   */
  abstract isVariableSize(): boolean;

  /**
   * Serialized byte length
   */
  abstract size(value?: T): number;

  /**
   * Maximal serialized byte length
   */
  abstract maxSize(): number;

  /**
   * Minimal serialized byte length
   */
  abstract minSize(): number;

  /**
   * Low-level deserialization
   */
  //abstract fromBytes(data: Uint8Array, offset: number): T;

  /**
   * Low-level deserialization
   */
  abstract fromBytes(data: Uint8Array, start: number, end?: number): T;
  /**
   * Deserialization
   */
  abstract deserialize(data: Uint8Array): T;

  /**
   * Low-level serialization
   *
   * Serializes to a pre-allocated Uint8Array
   */
  abstract toBytes(value: T, output: Uint8Array, offset: number): number;

  /**
   * Serialization
   */
  abstract serialize(value: T): Uint8Array;

  /**
   * Merkleization
   */
  abstract hashTreeRoot(value: T): Uint8Array;

  /**
   * Convert from JSON-serializable object
   */
  abstract fromJson(data: Json, options?: IJsonOptions): T;

  /**
   * Convert to JSON-serializable object
   */
  abstract toJson(value: T, options?: IJsonOptions): Json;
}
