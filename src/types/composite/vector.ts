import {Vector} from "../../interface";
import {IArrayOptions, BasicArrayType, CompositeArrayType} from "./array";
import {isTypeOf, UINT_TYPE} from "../basic";
import {
  BasicVectorStructuralHandler,
  CompositeVectorStructuralHandler,
  BasicVectorTreeHandler,
  CompositeVectorTreeHandler,
  BasicVectorByteArrayHandler,
  CompositeVectorByteArrayHandler,
} from "../../backings";
import {FULL_HASH_LENGTH, GIndexPathKeys, GINDEX_LEN_PATH} from "../../util/gIndex";
import { getPowerOfTwoCeil } from "../../util/math";

export interface IVectorOptions extends IArrayOptions {
  length: number;
}

export const VECTOR_TYPE = Symbol.for("ssz/VectorType");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isVectorType<T extends Vector<any> = Vector<any>>(type: unknown): type is VectorType<T> {
  return isTypeOf(type, VECTOR_TYPE);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VectorType<T extends Vector<any> = Vector<any>> = BasicVectorType<T> | CompositeVectorType<T>;
type VectorTypeConstructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new <T extends Vector<any>>(options: IVectorOptions): VectorType<T>;
};

// Trick typescript into treating VectorType as a constructor
export const VectorType: VectorTypeConstructor =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function VectorType<T extends Vector<any> = Vector<any>>(options: IVectorOptions): VectorType<T> {
    if (options.elementType.isBasic()) {
      return new BasicVectorType(options);
    } else {
      return new CompositeVectorType(options);
    }
  } as unknown) as VectorTypeConstructor;

export class BasicVectorType<T extends Vector<unknown> = Vector<unknown>> extends BasicArrayType<T> {
  length: number;
  constructor(options: IVectorOptions) {
    super(options);
    this.length = options.length;
    this.structural = new BasicVectorStructuralHandler(this);
    this.tree = new BasicVectorTreeHandler(this);
    this.byteArray = new BasicVectorByteArrayHandler(this);
    this._typeSymbols.add(VECTOR_TYPE);
  }
  isVariableSize(): boolean {
    return false;
  }
  chunkCount(): number {
    return Math.ceil((this.length * this.elementType.getItemLength() + 31) / 32);
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

export class CompositeVectorType<T extends Vector<object> = Vector<object>> extends CompositeArrayType<T> {
  length: number;
  constructor(options: IVectorOptions) {
    super(options);
    this.length = options.length;
    this.structural = new CompositeVectorStructuralHandler(this);
    this.tree = new CompositeVectorTreeHandler(this);
    this.byteArray = new CompositeVectorByteArrayHandler(this);
    this._typeSymbols.add(VECTOR_TYPE);
  }
  isVariableSize(): boolean {
    return this.elementType.isVariableSize();
  }
  chunkCount(): number {
    return Math.ceil((this.length * this.elementType.getItemLength() + 31) / 32);
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
