import {ByteVector, Json} from "../../interface";
import {ByteVectorType} from "../../types";
import {fromHexString, toHexString} from "../byteArray";
import {BasicVectorStructuralHandler} from "./vector";

export class ByteVectorStructuralHandler extends BasicVectorStructuralHandler<ByteVector> {
  _type: ByteVectorType;
  constructor(type: ByteVectorType) {
    super(type);
    this._type = type;
  }
  defaultValue(): ByteVector {
    return new Uint8Array(this._type.length);
  }
  fromBytes(data: Uint8Array, start: number, end: number): ByteVector {
    this.validateBytes(data, start, end);
    const length = end - start;
    if (length !== this._type.length) {
      throw new Error(`Invalid deserialized vector length: expected ${this._type.length}, actual: ${length}`);
    }
    const value = new Uint8Array(length);
    value.set(data.slice(start, end));
    return value;
  }
  toBytes(value: ByteVector, output: Uint8Array, offset: number): number {
    output.set(value, offset);
    return offset + this._type.length;
  }
  fromJson(data: Json): ByteVector {
    const value = fromHexString(data as string);
    if (value.length !== this._type.length) {
      throw new Error(`Invalid JSON vector length: expected ${this._type.length}, actual: ${value.length}`);
    }
    return value;
  }
  toJson(value: ByteVector): Json {
    return toHexString(value);
  }
}
