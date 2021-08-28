import {Json} from "../../interface";
import {bigIntPow} from "../../util/bigInt";
import {isTypeOf, Type} from "../type";
import {BasicType} from "./abstract";
import {HashObject} from "@chainsafe/as-sha256";

export interface IUintOptions {
  byteLength: number;
  infinityWhenBig?: boolean;
}

export const UINT_TYPE = Symbol.for("ssz/UintType");

export function isUintType<T>(type: Type<unknown>): type is UintType<T> {
  return isTypeOf(type, UINT_TYPE);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class UintType<T> extends BasicType<T> {
  byteLength: number;
  infinityWhenBig: boolean;

  constructor(options: IUintOptions) {
    super();
    this.byteLength = options.byteLength;
    this.infinityWhenBig = options.infinityWhenBig === true ? true : this.byteLength > 6;

    this._typeSymbols.add(UINT_TYPE);
  }
  struct_getSerializedLength(): number {
    return this.byteLength;
  }
}

export const NUMBER_UINT_TYPE = Symbol.for("ssz/NumberUintType");
export const NUMBER_64_UINT_TYPE = Symbol.for("ssz/Number64UintType");

const BIGINT_4_BYTES = BigInt(32);

export function isNumberUintType(type: Type<unknown>): type is NumberUintType {
  return isTypeOf(type, NUMBER_UINT_TYPE);
}

export function isNumber64UintType(type: Type<unknown>): type is Number64UintType {
  return isTypeOf(type, NUMBER_64_UINT_TYPE);
}

export class NumberUintType extends UintType<number> {
  _maxBigInt?: BigInt;

  constructor(options: IUintOptions) {
    super(options);
    this._typeSymbols.add(NUMBER_UINT_TYPE);
  }

  struct_assertValidValue(value: unknown): asserts value is number {
    if (
      value !== Infinity &&
      (!Number.isSafeInteger(value as number) ||
        (value as number) > bigIntPow(BigInt(2), BigInt(8) * BigInt(this.byteLength)))
    ) {
      throw new Error("Uint value is not a number");
    }
    if ((value as number) < 0) {
      throw new Error("Uint value must be gte 0");
    }
  }

  struct_defaultValue(): number {
    return 0;
  }

  struct_getMaxBigInt(): BigInt {
    if (this._maxBigInt === undefined) {
      this._maxBigInt = bigIntPow(BigInt(2), BigInt(this.byteLength * 8)) - BigInt(1);
    }
    return this._maxBigInt;
  }

  struct_serializeToBytes(value: number, output: Uint8Array, offset: number): number {
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

  struct_deserializeFromBytes(data: Uint8Array, offset: number): number {
    this.bytes_validate(data, offset);
    let isInfinity = true;
    let output = 0;
    for (let i = 0; i < this.byteLength; i++) {
      output += data[offset + i] * 2 ** (8 * i);
      if (data[offset + i] !== 0xff) {
        isInfinity = false;
      }
    }
    if (this.infinityWhenBig && isInfinity) {
      return Infinity;
    }
    return Number(output);
  }

  struct_convertFromJson(data: Json): number {
    let n: number;
    const bigN = BigInt(data as string);
    if (this.infinityWhenBig && bigN === this.struct_getMaxBigInt()) {
      n = Infinity;
    } else if (bigN < Number.MAX_SAFE_INTEGER) {
      n = Number(bigN);
    } else {
      throw new Error("Uint value unsafe");
    }
    this.assertValidValue(n);
    return n;
  }

  struct_convertToJson(value: number): Json {
    if (this.byteLength > 4) {
      if (value === Infinity) {
        return this.struct_getMaxBigInt().toString();
      }
      return String(value);
    }
    return value;
  }
}

const TWO_POWER_32 = 2 ** 32;

/**
 * For 64 bit number, we want to operator on HashObject
 * over bytes to improve performance.
 */
export class Number64UintType extends NumberUintType {
  constructor() {
    super({byteLength: 8});
    this._typeSymbols.add(NUMBER_64_UINT_TYPE);
  }

  /**
   * TODO: move this logic all the way to persistent-merkle-tree?
   * That's save us 1 time to traverse the tree in the applyDelta scenario
   */
  struct_deserializeFromHashObject(data: HashObject, byteOffset: number): number {
    const numberOffset = Math.floor(byteOffset / 8);
    // a chunk contains 4 items
    if (numberOffset < 0 || numberOffset > 3) {
      throw new Error(`Invalid numberOffset ${numberOffset}`);
    }
    let low32Number = 0;
    let high32Number = 0;

    switch (numberOffset) {
      case 0:
        low32Number = data.h0 & 0xffffffff;
        high32Number = data.h1 & 0xffffffff;
        break;
      case 1:
        low32Number = data.h2 & 0xffffffff;
        high32Number = data.h3 & 0xffffffff;
        break;
      case 2:
        low32Number = data.h4 & 0xffffffff;
        high32Number = data.h5 & 0xffffffff;
        break;
      case 3:
        low32Number = data.h6 & 0xffffffff;
        high32Number = data.h7 & 0xffffffff;
        break;
      default:
        throw new Error(`Invalid offset ${numberOffset}`);
    }
    if (low32Number < 0) low32Number = low32Number >>> 0;
    if (high32Number === 0) {
      return low32Number;
    } else if (high32Number < 0) {
      high32Number = high32Number >>> 0;
    }
    if (low32Number === 0xffffffff && high32Number === 0xffffffff) {
      return Infinity;
    }
    return high32Number * TWO_POWER_32 + low32Number;
  }

  struct_serializeToHashObject(value: number, output: HashObject, byteOffset: number): number {
    const numberOffset = Math.floor(byteOffset / 8);
    let low32Number: number;
    let high32Number: number;
    if (value !== Infinity) {
      low32Number = value & 0xffffffff;
      high32Number = Math.floor(value / TWO_POWER_32) & 0xffffffff;
    } else {
      low32Number = 0xffffffff;
      high32Number = 0xffffffff;
    }
    switch (numberOffset) {
      case 0:
        output.h0 = low32Number;
        output.h1 = high32Number;
        break;
      case 1:
        output.h2 = low32Number;
        output.h3 = high32Number;
        break;
      case 2:
        output.h4 = low32Number;
        output.h5 = high32Number;
        break;
      case 3:
        output.h6 = low32Number;
        output.h7 = high32Number;
        break;
      default:
        throw new Error(`Invalid offset ${numberOffset}`);
    }
    return numberOffset + 1;
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

  struct_assertValidValue(value: unknown): asserts value is bigint {
    if (typeof value !== "bigint") {
      throw new Error("Uint value is not a bigint");
    }
    if ((value as bigint) < 0) {
      throw new Error("Uint value must be gte 0");
    }
  }

  struct_defaultValue(): bigint {
    return BigInt(0);
  }

  struct_serializeToBytes(value: bigint, output: Uint8Array, offset: number): number {
    // Motivation
    // BigInt bit shifting and BigInt allocation is slower compared to number
    // For every 4 bytes, we extract value to groupedBytes
    // and do bit shifting on the number
    let v = value;
    let groupedBytes = Number(BigInt.asUintN(32, v));
    for (let i = 0; i < this.byteLength; i++) {
      output[offset + i] = Number(groupedBytes & 0xff);
      if ((i + 1) % 4 !== 0) {
        groupedBytes >>= 8;
      } else {
        v >>= BIGINT_4_BYTES;
        groupedBytes = Number(BigInt.asUintN(32, v));
      }
    }
    return offset + this.byteLength;
  }

  struct_deserializeFromBytes(data: Uint8Array, offset: number): bigint {
    this.bytes_validate(data, offset);
    // Motivation:
    //   Creating BigInts and bitshifting is more expensive than
    // number bitshifting.
    // Implementation:
    //   Iterate throuth the bytearray, bitshifting the data into a 'groupOutput' number, byte by byte
    // After each 4 bytes, bitshift the groupOutput into the bigint output and clear the groupOutput out
    // After iterating through the bytearray,
    // There may be additional data in the groupOutput if the bytearray if the bytearray isn't divisible by 4
    let output = BigInt(0);
    let groupIndex = 0,
      groupOutput = 0;
    for (let i = 0; i < this.byteLength; i++) {
      groupOutput += data[offset + i] << (8 * (i % 4));
      if ((i + 1) % 4 === 0) {
        // Left shift returns a signed integer and the output may have become negative
        // In that case, the output needs to be converted to unsigned integer
        if (groupOutput < 0) {
          groupOutput >>>= 0;
        }
        // Optimization to set the output the first time, forgoing BigInt addition
        if (groupIndex === 0) {
          output = BigInt(groupOutput);
        } else {
          output += BigInt(groupOutput) << BigInt(32 * groupIndex);
        }
        groupIndex++;
        groupOutput = 0;
      }
    }
    // if this.byteLength isn't a multiple of 4, there will be additional data
    if (groupOutput) {
      output += BigInt(groupOutput >>> 0) << BigInt(32 * groupIndex);
    }
    return output;
  }

  struct_convertFromJson(data: Json): bigint {
    const value = BigInt(data as string);
    this.assertValidValue(value);
    return value;
  }

  struct_convertToJson(value: bigint): Json {
    if (this.byteLength > 4) {
      return value.toString();
    } else {
      return Number(value);
    }
  }
}
