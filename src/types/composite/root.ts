import {CompositeValue} from "../../interface";
import {isTypeOf} from "../basic";
import {CompositeType} from "./abstract";
import {ByteVectorType} from "./byteVector";

/**
 * Allow for lazily evaulated expandedType thunk
 */
export interface IRootOptions<T extends CompositeValue> {
  expandedType: CompositeType<T> | (() => CompositeType<T>);
}

export const ROOT_TYPE = Symbol.for("ssz/RootType");

export function isRootType<T extends CompositeValue = CompositeValue>(type: unknown): type is RootType<T> {
  return isTypeOf(type, ROOT_TYPE);
}

export class RootType<T extends CompositeValue> extends ByteVectorType {
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
