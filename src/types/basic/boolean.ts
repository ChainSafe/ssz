/* eslint-disable @typescript-eslint/camelcase */
import {Json} from "../../interface";
import {isTypeOf, Type} from "../type";
import {BasicType} from "./abstract";

export const BOOLEAN_TYPE = Symbol.for("ssz/BooleanType");

export function isBooleanType(type: Type<unknown>): type is BooleanType {
  return isTypeOf(type, BOOLEAN_TYPE);
}

export class BooleanType extends BasicType<boolean> {
  constructor() {
    super();
    this._typeSymbols.add(BOOLEAN_TYPE);
  }

  struct_getSerializedLength(): number {
    return 1;
  }

  struct_assertValidValue(value: unknown): asserts value is boolean {
    if (value !== true && value !== false) {
      throw new Error("Boolean value must be true or false");
    }
  }

  struct_defaultValue(): boolean {
    return false;
  }

  struct_serializeToBytes(value: boolean, output: Uint8Array, offset: number): number {
    output[offset] = value ? 1 : 0;
    return offset + 1;
  }

  struct_deserializeFromBytes(data: Uint8Array, offset: number): boolean {
    this.bytes_validate(data, offset);
    if (data[offset] === 1) {
      return true;
    } else if (data[offset] === 0) {
      return false;
    } else {
      throw new Error("Invalid boolean value");
    }
  }

  struct_convertFromJson(data: Json): boolean {
    this.struct_assertValidValue(data);
    return data;
  }

  struct_convertToJson(value: boolean): Json {
    return value;
  }
}
