import {ByteList, Json} from "../../interface";
import {BasicListType} from "./list";
import {byteType} from "../basic";
import {isTypeOf, Type} from "../type";
import {fromHexString, toHexString} from "../../util/byteArray";
import {BYTES_PER_CHUNK} from "../../util/constants";
import {Tree} from "@chainsafe/persistent-merkle-tree";

export interface IByteListOptions {
  limit: number;
}

export const BYTELIST_TYPE = Symbol.for("ssz/ByteListType");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isByteListType<T extends ByteList = ByteList>(type: Type<unknown>): type is ByteListType {
  return isTypeOf(type, BYTELIST_TYPE);
}

export class ByteListType extends BasicListType<ByteList> {
  constructor(options: IByteListOptions) {
    super({elementType: byteType, ...options});
    this._typeSymbols.add(BYTELIST_TYPE);
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): ByteList {
    this.bytes_validate(data, start, end);
    const length = end - start;
    const value = new Array(end - start);
    for (let i = 0; i < length; i++) {
      value[i] = data[start + i];
    }
    return value as unknown as ByteList;
  }

  struct_serializeToBytes(value: ByteList, output: Uint8Array, offset: number): number {
    const length = value.length;
    output.set(value, offset);
    return offset + length;
  }

  struct_convertFromJson(data: Json): ByteList {
    const bytes = fromHexString(data as string);
    return this.struct_deserializeFromBytes(bytes, 0, bytes.length);
  }

  struct_convertToJson(value: ByteList): Json {
    return toHexString(this.serialize(value));
  }

  tree_convertToStruct(target: Tree): ByteList {
    const length = this.tree_getLength(target);
    const value = new Array(length);
    const chunks = target.getNodesAtDepth(this.getChunkDepth(), 0, this.getMaxChunkCount());
    let chunkIx = 0;
    let i;
    for (i = 0; i < length - BYTES_PER_CHUNK; i += BYTES_PER_CHUNK) {
      for (let j = 0; j < BYTES_PER_CHUNK; j++) {
        value[i + j] = chunks[chunkIx].root[j];
      }
      chunkIx++;
    }
    for (let j = 0; j < length - i; j++) {
      value[i + j] = chunks[chunkIx].root[j];
    }
    return value as unknown as ByteList; // value;
  }
}
