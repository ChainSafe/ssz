import {IUintOptions, UintType} from ".";
import {isTypeOf} from "..";
import {Json} from "../../..";

export const NUMBER_UINT_TYPE = Symbol.for("ssz/NumberUintType");

export function isNumberUintType(type: unknown): type is NumberUintType {
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
