import {List} from "../../interface";
import {IArrayOptions, BasicArrayType, CompositeArrayType} from "./array";
import {isTypeOf} from "../basic";
import {
  BasicListStructuralHandler,
  CompositeListStructuralHandler,
  BasicListTreeHandler,
  CompositeListTreeHandler,
  BasicListByteArrayHandler,
  CompositeListByteArrayHandler,
} from "../../backings";

export interface IListOptions extends IArrayOptions {
  limit: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListType<T extends List<any> = List<any>> = BasicListType<T> | CompositeListType<T>;
type ListTypeConstructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new <T extends List<any>>(options: IListOptions): ListType<T>;
};

export const LIST_TYPE = Symbol.for("ssz/ListType");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isListType<T extends List<any> = List<any>>(type: unknown): type is ListType<T> {
  return isTypeOf(type, LIST_TYPE);
}

// Trick typescript into treating ListType as a constructor
export const ListType: ListTypeConstructor =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function ListType<T extends List<any> = List<any>>(options: IListOptions): ListType<T> {
    if (options.elementType.isBasic()) {
      return new BasicListType(options);
    } else {
      return new CompositeListType(options);
    }
  } as unknown) as ListTypeConstructor;

export class BasicListType<T extends List<unknown> = List<unknown>> extends BasicArrayType<T> {
  limit: number;
  constructor(options: IListOptions) {
    super(options);
    this.limit = options.limit;
    this.structural = new BasicListStructuralHandler(this);
    this.tree = new BasicListTreeHandler(this);
    this.byteArray = new BasicListByteArrayHandler(this);
    this._typeSymbols.add(LIST_TYPE);
  }
  isVariableSize(): boolean {
    return true;
  }
  chunkCount(): number {
    return Math.ceil((this.limit * this.elementType.size()) / 32);
  }
}

export class CompositeListType<T extends List<object> = List<object>> extends CompositeArrayType<T> {
  limit: number;
  constructor(options: IListOptions) {
    super(options);
    this.limit = options.limit;
    this.structural = new CompositeListStructuralHandler(this);
    this.tree = new CompositeListTreeHandler(this);
    this.byteArray = new CompositeListByteArrayHandler(this);
    this._typeSymbols.add(LIST_TYPE);
  }
  isVariableSize(): boolean {
    return true;
  }
  chunkCount(): number {
    return this.limit;
  }
}
