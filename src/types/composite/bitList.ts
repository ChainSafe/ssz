import {BitList} from "../../interface";
import {BasicListType} from "./list";
import {booleanType, isTypeOf} from "../basic";
import {BitListStructuralHandler, BitListTreeHandler} from "../../backings";

export interface IBitListOptions {
  limit: number;
}

export const BITLIST_TYPE = Symbol.for("ssz/BitListType");

export function isBitListType<T extends BitList = BitList>(type: unknown): type is BitListType {
  return isTypeOf(type, BITLIST_TYPE);
}

export class BitListType extends BasicListType<BitList> {

  constructor(options: IBitListOptions) {
    super({elementType: booleanType, ...options});
    this.structural = new BitListStructuralHandler(this);
    this.tree = new BitListTreeHandler(this);
    this._typeSymbols.add(BITLIST_TYPE);
  }

  chunkCount(): number {
    return Math.ceil(this.limit / 256);
  }
}
