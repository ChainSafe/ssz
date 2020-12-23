import {Json} from "..";
import {BasicType} from "./basic";
import {CompositeType} from "./composite";
import {CompositeValue} from "../interface";

export interface IJsonOptions {
  case: "camel" | "snake";
}

// /**
//  * A Type is either a BasicType or a CompositeType.
//  */
export abstract class Type<T> {
  /**
   * Symbols used to track the identity of a type
   *
   * Used by various isFooType functions
   */
  public _typeSymbols: Set<symbol>;

  constructor() {
    this._typeSymbols = new Set();
  }

  isComposite(): this is CompositeType<CompositeValue> {
    return !this.isBasic();
  }

  abstract isBasic(): this is BasicType<T>;

  abstract clone(value: T): T;

  abstract equals(value1: T, value2: T): boolean;

  /**
   * Valid value assertion
   */
  abstract assertValidValue(value: unknown): asserts value is T;

  abstract isVariableSize(): boolean;

  /**
   * Maximal serialized byte length
   */
  abstract maxSize(): number;

  /**
   * Minimal serialized byte length
   */
  abstract minSize(): number;

  /**
   * Default constructor
   */
  abstract defaultValue(): T;

  /**
   * Convert from JSON-serializable object
   */
  abstract fromJson(data: Json, options?: IJsonOptions): T;

  /**
   * Convert to JSON-serializable object
   */
  abstract toJson(value: T, options?: IJsonOptions): Json;

  abstract size(value?: T): number;

  /**
   * Low-level serialization
   *
   * Serializes to a pre-allocated Uint8Array
   */
  abstract toBytes(value: T, output: Uint8Array, offset: number): number;

  abstract hashTreeRoot(value: T): Uint8Array;
}
