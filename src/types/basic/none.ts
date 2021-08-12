/* eslint-disable @typescript-eslint/camelcase */
import {Json} from "../../interface";
import {IJsonOptions, isTypeOf, Type} from "../type";
import {BasicType} from "./abstract";

export const NONE_TYPE = Symbol.for("ssz/NoneType");

export function isNoneType(type: Type<unknown>): type is NoneType {
  return isTypeOf(type, NONE_TYPE);
}

export class NoneType extends BasicType<null> {
  constructor() {
    super();
    this._typeSymbols.add(NONE_TYPE);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_deserializeFromBytes(data: Uint8Array, offset: number): null {
    return null;
  }
  struct_assertValidValue(value: unknown): asserts value is null {
    if (value !== null) {
      throw new Error("None value must be null");
    }
  }
  struct_defaultValue(): null {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_getSerializedLength(value?: null): number {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_serializeToBytes(value: null, output: Uint8Array, offset: number): number {
    return 0;
  }
  struct_convertFromJson(data: Json): null {
    this.assertValidValue(data);
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_convertToJson(value: null, options?: IJsonOptions): Json {
    return null;
  }
}
