import {List} from "../../interface";
import {IArrayOptions, BasicArrayType, CompositeArrayType} from "./array";
import {isTypeOf, UINT_TYPE} from "../basic";
import {ArrayElement, FULL_HASH_LENGTH, GIndexPathKeys, GINDEX_LEN_PATH} from "../../util/gIndex";
import {getPowerOfTwoCeil} from "../../util/math";
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
    return Math.ceil((this.limit * this.elementType.getItemLength()) / 32);
  }

  getItemPosition(index: number): [number, number, number] {
    const start = index + this.elementType.getItemLength();
    return [
      Math.floor(start / FULL_HASH_LENGTH),
      start % FULL_HASH_LENGTH,
      (start % FULL_HASH_LENGTH) + this.elementType.getItemLength(),
    ];
  }

  getGeneralizedIndex(root = 1, ...paths: GIndexPathKeys[]): number {
    if (!paths.length) {
      return root;
    }
    const path = paths[0];
    if (path === GINDEX_LEN_PATH) {
      if (this.elementType._typeSymbols.has(UINT_TYPE)) {
        return root * 2 + 1;
      } else {
        throw new Error(`${GINDEX_LEN_PATH} is only supported on ${UINT_TYPE.toString()} array`);
      }
    }
    if (typeof path !== "number") {
      throw new Error("Not supported path on BasicList");
    }
    const [pos] = this.getItemPosition(path);
    const baseIndex = 2;
    root = root * baseIndex * getPowerOfTwoCeil(this.chunkCount()) + pos;
    return this.elementType.getGeneralizedIndex(root, ...paths.slice(1));
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
    return Math.ceil((this.limit * this.elementType.getItemLength()) / 32);
  }

  getItemPosition(index: number): [number, number, number] {
    const start = index + this.elementType.getItemLength();
    return [
      Math.floor(start / FULL_HASH_LENGTH),
      start % FULL_HASH_LENGTH,
      (start % FULL_HASH_LENGTH) + this.elementType.getItemLength(),
    ];
  }

  getGeneralizedIndex(root = 1, ...paths: GIndexPathKeys[]): number {
    if (!paths.length) {
      return root;
    }
    const path = paths[0];
    if (typeof path !== "number") {
      throw new Error("CompositeArray supports only element index as path");
    }
    const [pos] = this.getItemPosition(path);
    const baseIndex = 2;
    root = root * baseIndex * getPowerOfTwoCeil(this.chunkCount()) + pos;
    return this.elementType.getGeneralizedIndex(root, ...paths.slice(1));
  }
}
