import {ByteVectorType} from "./byteVector";
import {CompositeType} from "./abstract";
import {isTypeOf, Type} from "../type";
import {ByteVector, CompositeValue} from "../../interface";
import {BackedValue, isTreeBacked} from "../../backings";
import {byteArrayEquals} from "../../util/byteArray";

/**
 * Allow for lazily evaulated expandedType thunk
 */
export interface IRootOptions<T extends CompositeValue> {
  expandedType: CompositeType<T> | (() => CompositeType<T>);
}

export const ROOT_TYPE = Symbol.for("ssz/RootType");

export function isRootType<T extends CompositeValue = CompositeValue>(type: Type<unknown>): type is RootType<T> {
  return isTypeOf(type, ROOT_TYPE);
}

function convertRootToUint8Array<T>(value: BackedValue<T> | T): Uint8Array {
  if (value instanceof Uint8Array) {
    return value;
  } else if (isTreeBacked(value)) {
    return value.tree.root;
  } else if (Array.isArray(value)) {
    return new Uint8Array(value);
  } else {
    throw new Error("Unable to convert root to Uint8Array: not Uint8Array, tree-backed, or Array");
  }
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

  struct_equals(value1: ByteVector, value2: ByteVector): boolean {
    return byteArrayEquals(convertRootToUint8Array(value1), convertRootToUint8Array(value2));
  }

  equals(value1: BackedValue<ByteVector> | ByteVector, value2: BackedValue<ByteVector> | ByteVector): boolean {
    return this.struct_equals(value1, value2);
  }
}
