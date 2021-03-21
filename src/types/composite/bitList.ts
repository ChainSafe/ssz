import {BitList} from "../../interface";
import {BasicListType, IListOptions} from "./list";
import {booleanType} from "../basic";
import {isTypeOf, Type} from "../type";
import {BitListStructuralHandler, BitListTreeHandler} from "../../backings";

export type IBitListOptions = Omit<IListOptions, "elementType">;

export const BITLIST_TYPE = Symbol.for("ssz/BitListType");

export function isBitListType<T extends BitList = BitList>(type: Type<unknown>): type is BitListType {
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
