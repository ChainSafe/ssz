import {isTypeOf, IUintOptions} from "..";
import {Json} from "../../..";
import {UintType} from ".";

export const BIGINT_UINT_TYPE = Symbol.for("ssz/BigIntUintType");

export function isBigIntUintType(type: unknown): type is BigIntUintType {
  return isTypeOf(type, BIGINT_UINT_TYPE);
}

export class BigIntUintType extends UintType<bigint> {
  constructor(options: IUintOptions) {
    super(options);
    this._typeSymbols.add(BIGINT_UINT_TYPE);
  }
  assertValidValue(value: unknown): asserts value is bigint {
    if (typeof value !== "bigint") {
      throw new Error("Uint value is not a bigint");
    }
    if ((value as bigint) < 0) {
      throw new Error("Uint value must be gte 0");
    }
  }
  defaultValue(): bigint {
    return BigInt(0);
  }
  toBytes(value: bigint, output: Uint8Array, offset: number): number {
    let v = value;
    for (let i = 0; i < this.byteLength; i++) {
      output[offset + i] = Number(v & BigInt(0xff));
      v >>= BigInt(8);
    }
    return offset + this.byteLength;
  }
  fromBytes(data: Uint8Array, offset: number): bigint {
    this.validateBytes(data, offset);
    let output = BigInt(0);
    for (let i = 0; i < this.byteLength; i++) {
      output += BigInt(data[offset + i]) << BigInt(8 * i);
    }
    return output;
  }
  fromJson(data: Json): bigint {
    const value = BigInt(data);
    this.assertValidValue(value);
    return value;
  }
  toJson(value: bigint): Json {
    if (this.byteLength > 4) {
      return value.toString();
    } else {
      return Number(value);
    }
  }
}
