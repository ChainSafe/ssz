import {BasicType, isTypeOf} from "..";

export interface IUintOptions {
  byteLength: number;
}

export const UINT_TYPE = Symbol.for("ssz/UintType");

export function isUintType<T>(type: unknown): type is UintType<T> {
  return isTypeOf(type, UINT_TYPE);
}
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
