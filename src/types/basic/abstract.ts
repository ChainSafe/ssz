/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Json} from "../../interface";
import {isTypeOf, Type} from "../type";

export const BASIC_TYPE = Symbol.for("ssz/BasicType");

export function isBasicType(type: Type<unknown>): type is BasicType<unknown> {
  return isTypeOf(type, BASIC_TYPE);
}

/**
 * A BasicType is a terminal type, which has no flexibility in its representation.
 *
 * It is serialized as, at maximum, 32 bytes and merkleized as, at maximum, a single chunk
 */
export abstract class BasicType<T> extends Type<T> {
  constructor() {
    super();
    this._typeSymbols.add(BASIC_TYPE);
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
  abstract fromBytes(data: Uint8Array, offset: number): T;
  /**
   * Deserialization
   */
  deserialize(data: Uint8Array): T {
    return this.fromBytes(data, 0);
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
}
