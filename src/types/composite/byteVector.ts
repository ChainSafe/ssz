import {ByteVector, Json} from "../../interface";
import {BasicVectorType} from "./vector";
import {byteType} from "../basic";
import {isTypeOf, Type} from "../type";
import {fromHexString, toHexString} from "../../util/byteArray";
import {Tree} from "@chainsafe/persistent-merkle-tree";

export interface IByteVectorOptions {
  length: number;
}

export const BYTEVECTOR_TYPE = Symbol.for("ssz/ByteVectorType");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isByteVectorType<T extends ByteVector = ByteVector>(type: Type<unknown>): type is ByteVectorType {
  return isTypeOf(type, BYTEVECTOR_TYPE);
}

export class ByteVectorType extends BasicVectorType<ByteVector> {
  constructor(options: IByteVectorOptions) {
    super({elementType: byteType, ...options});
    this._typeSymbols.add(BYTEVECTOR_TYPE);
  }

  struct_defaultValue(): ByteVector {
    return new Uint8Array(this.length);
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ByteVector {
    this.bytes_validate(data, start, end);
    const length = end - start;
    if (length !== this.length) {
      throw new Error(`Invalid deserialized vector length: expected ${this.length}, actual: ${length}`);
    }
    const value = new Uint8Array(length);
    value.set(data.slice(start, end));
    return value;
  }

  struct_serializeToBytes(value: ByteVector, output: Uint8Array, offset: number): number {
    output.set(value, offset);
    return offset + this.length;
  }

  struct_convertFromJson(data: Json): ByteVector {
    const value = fromHexString(data as string);
    if (value.length !== this.length) {
      throw new Error(`Invalid JSON vector length: expected ${this.length}, actual: ${value.length}`);
    }
    return value;
  }

  struct_convertToJson(value: ByteVector): Json {
    return toHexString(value);
  }

  tree_convertToStruct(target: Tree): ByteVector {
    const value = new Uint8Array(this.length);
    const chunks = target.getNodesAtDepth(this.getChunkDepth(), 0, this.getMaxChunkCount());
    let chunkIx = 0;
    if (this.length % 32 === 0) {
      for (let i = 0; i < this.length; i += 32) {
        value.set(chunks[chunkIx].root, i);
        chunkIx++;
      }
    } else {
      let i;
      for (i = 0; i < this.length - 32; i += 32) {
        value.set(chunks[chunkIx].root, i);
        chunkIx++;
      }
      value.set(chunks[chunkIx].root.subarray(0, this.length - i), i);
    }
    return value;
  }
}
