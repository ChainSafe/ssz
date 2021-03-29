/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

  struct_clone(value: T): T {
    return value;
  }

  struct_equals(value1: T, value2: T): boolean {
    this.assertValidValue(value1);
    this.assertValidValue(value2);
    return value1 === value2;
  }

  /**
   * Check if type has a variable number of elements (or subelements)
   *
   * For basic types, this is always false
   */
  hasVariableSerializedLength(): boolean {
    return false;
  }

  getMaxSerializedLength(): number {
    return this.struct_getSerializedLength();
  }

  getMinSerializedLength(): number {
    return this.struct_getSerializedLength();
  }

  bytes_validate(data: Uint8Array, offset: number): void {
    if (!data) {
      throw new Error("Data is null or undefined");
    }
    if (data.length === 0) {
      throw new Error("Data is empty");
    }
    const length = data.length - offset;
    if (length < this.struct_getSerializedLength()) {
      throw new Error(`Data length of ${length} is too small, expect ${this.struct_getSerializedLength()}`);
    }
    // accept data length > this.size()
  }

  abstract struct_deserializeFromBytes(data: Uint8Array, offset: number): T;

  struct_hashTreeRoot(value: T): Uint8Array {
    const output = new Uint8Array(32);
    this.struct_serializeToBytes(value, output, 0);
    return output;
  }
}
