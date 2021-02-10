import {Json} from "../../interface";
import {isTypeOf, Type} from "../type";
import {BasicType} from "./abstract";

export interface IUintOptions {
  byteLength: number;
}

export const UINT_TYPE = Symbol.for("ssz/UintType");

export function isUintType<T>(type: Type<unknown>): type is UintType<T> {
  return isTypeOf(type, UINT_TYPE);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class UintType<T> extends BasicType<T> {
  byteLength: number;
  constructor(options: IUintOptions) {
    super();
    this.byteLength = options.byteLength;
    this._typeSymbols.add(UINT_TYPE);
  }
  size(): number {
    return this.byteLength;
  }
}

export const NUMBER_UINT_TYPE = Symbol.for("ssz/NumberUintType");

export function isNumberUintType(type: Type<unknown>): type is NumberUintType {
  return isTypeOf(type, NUMBER_UINT_TYPE);
}

export class NumberUintType extends UintType<number> {
  constructor(options: IUintOptions) {
    super(options);
    this._typeSymbols.add(NUMBER_UINT_TYPE);
  }
  assertValidValue(value: unknown): asserts value is number {
    if (
      value !== Infinity &&
      (!Number.isSafeInteger(value as number) || value > BigInt(2) ** (BigInt(8) * BigInt(this.byteLength)))
    ) {
      throw new Error("Uint value is not a number");
    }
    if ((value as number) < 0) {
      throw new Error("Uint value must be gte 0");
    }
  }
  defaultValue(): number {
    return 0;
  }
  maxBigInt(): BigInt {
    return BigInt(2) ** BigInt(this.byteLength * 8) - BigInt(1);
  }
  toBytes(value: number, output: Uint8Array, offset: number): number {
    if (this.byteLength > 6 && value === Infinity) {
      for (let i = offset; i < offset + this.byteLength; i++) {
        output[i] = 0xff;
      }
    } else {
      let v = value;
      const MAX_BYTE = 0xff;
      for (let i = 0; i < this.byteLength; i++) {
        output[offset + i] = v & MAX_BYTE;
        v = Math.floor(v / 256);
      }
    }
    return offset + this.byteLength;
  }
  fromBytes(data: Uint8Array, offset: number): number {
    this.validateBytes(data, offset);
    let isInfinity = true;
    let output = BigInt(0);
    for (let i = 0; i < this.byteLength; i++) {
      output += BigInt(data[offset + i]) << BigInt(8 * i);
      if (data[offset + i] !== 0xff) {
        isInfinity = false;
      }
    }
    if (this.byteLength > 6 && isInfinity) {
      return Infinity;
    }
    return Number(output);
  }
  fromJson(data: Json): number {
    let n: number;
    const bigN = BigInt(data);
    if (bigN === this.maxBigInt()) {
      n = Infinity;
    } else if (bigN < Number.MAX_SAFE_INTEGER) {
      n = Number(bigN);
    } else {
      throw new Error("Uint value unsafe");
    }
    this.assertValidValue(n);
    return n;
  }
  toJson(value: number): Json {
    if (this.byteLength > 4) {
      if (value === Infinity) {
        return this.maxBigInt().toString();
      }
      return String(value);
    }
    return value;
  }
}

export const BIGINT_UINT_TYPE = Symbol.for("ssz/BigIntUintType");

export function isBigIntUintType(type: Type<unknown>): type is BigIntUintType {
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
