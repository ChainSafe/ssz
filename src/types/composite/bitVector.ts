import {BitVector} from "../../interface";
import {BasicVectorType} from "./vector";
import {booleanType} from "../basic";
import {isTypeOf, Type} from "../type";
import {BitVectorStructuralHandler, BitVectorTreeHandler} from "../../backings";

export interface IBitVectorOptions {
  length: number;
}

export const BITVECTOR_TYPE = Symbol.for("ssz/BitVectorType");

export function isBitVectorType<T extends BitVector = BitVector>(type: Type<unknown>): type is BitVectorType {
  return isTypeOf(type, BITVECTOR_TYPE);
}

export class BitVectorType extends BasicVectorType<BitVector> {
  constructor(options: IBitVectorOptions) {
    super({elementType: booleanType, ...options});
    this.structural = new BitVectorStructuralHandler(this);
    this.tree = new BitVectorTreeHandler(this);
    this._typeSymbols.add(BITVECTOR_TYPE);
  }
  chunkCount(): number {
    return Math.ceil(this.length / 256);
  }
}
