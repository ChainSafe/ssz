import {ByteVectorType} from "./byteVector";
import {CompositeType} from "./abstract";
import {isTypeOf, Type} from "../type";

/**
 * Allow for lazily evaulated expandedType thunk
 */
export interface IRootOptions<T extends object> {
  expandedType: CompositeType<T> | (() => CompositeType<T>);
}

export const ROOT_TYPE = Symbol.for("ssz/RootType");

export function isRootType<T extends object = object>(type: Type<unknown>): type is RootType<T> {
  return isTypeOf(type, ROOT_TYPE);
}

export class RootType<T extends object> extends ByteVectorType {
  _expandedType: CompositeType<T> | (() => CompositeType<T>);
  constructor(options: IRootOptions<T>) {
    super({length: 32});
    this._expandedType = options.expandedType;
    this._typeSymbols.add(ROOT_TYPE);
  }
  get expandedType(): CompositeType<T> {
    if (typeof this._expandedType === "function") {
      this._expandedType = this._expandedType();
    }
    return this._expandedType;
  }
}
