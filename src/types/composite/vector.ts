import {ArrayLike, Json, Vector} from "../../interface";
import {IArrayOptions, BasicArrayType, CompositeArrayType} from "./array";
import {isBasicType} from "../basic";
import {isTypeOf, Type} from "../type";
import {Node, subtreeFillToLength, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";

export interface IVectorOptions<T extends ArrayLike<unknown>> extends IArrayOptions<T> {
  length: number;
}

export const VECTOR_TYPE = Symbol.for("ssz/VectorType");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isVectorType<T extends Vector<any> = Vector<any>>(type: Type<unknown>): type is VectorType<T> {
  return isTypeOf(type, VECTOR_TYPE);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VectorType<T extends Vector<any> = Vector<any>> = BasicVectorType<T> | CompositeVectorType<T>;
type VectorTypeConstructor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new <T extends Vector<any>>(options: IVectorOptions<T>): VectorType<T>;
};

// Trick typescript into treating VectorType as a constructor
export const VectorType: VectorTypeConstructor =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (function VectorType<T extends Vector<any> = Vector<any>>(options: IVectorOptions<T>): VectorType<T> {
    if (isBasicType(options.elementType)) {
      return new BasicVectorType(options);
    } else {
      return new CompositeVectorType(options);
    }
  } as unknown) as VectorTypeConstructor;

export class BasicVectorType<T extends Vector<unknown> = Vector<unknown>> extends BasicArrayType<T> {
  length: number;

  constructor(options: IVectorOptions<T>) {
    super(options);
    this.length = options.length;
    this._typeSymbols.add(VECTOR_TYPE);
  }

  struct_defaultValue(): T {
    return (Array.from({length: this.length}, () => {
      return this.elementType.struct_defaultValue();
    }) as unknown) as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_getLength(value?: T): number {
    return this.length;
  }

  getMaxLength(): number {
    return this.length;
  }

  getMinLength(): number {
    return this.length;
  }

  bytes_validate(data: Uint8Array, start: number, end: number): void {
    super.bytes_validate(data, start, end);
    if (end - start !== this.size(null)) {
      throw new Error("Incorrect deserialized vector length");
    }
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    return super.struct_deserializeFromBytes(data, start, end);
  }

  struct_assertValidValue(value: unknown): asserts value is T {
    const actualLength = (value as T).length;
    const expectedLength = this.struct_getLength(value as T);
    if (actualLength !== expectedLength) {
      throw new Error(`Invalid vector length: expected ${expectedLength}, actual ${actualLength}`);
    }
    super.struct_assertValidValue(value);
  }

  struct_convertFromJson(data: Json): T {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON vector: expected an Array");
    }
    const expectedLength = this.length;
    if (data.length !== expectedLength) {
      throw new Error(`Invalid JSON vector length: expected ${expectedLength}, actual ${data.length}`);
    }
    return super.fromJson(data);
  }

  tree_defaultNode(): Node {
    if (!this._defaultNode) {
      this._defaultNode = subtreeFillToLength(zeroNode(0), this.getChunkDepth(), this.getMaxChunkCount());
    }
    return this._defaultNode;
  }

  tree_defaultValue(): Tree {
    return new Tree(this.tree_defaultNode());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tree_getLength(target: Tree): number {
    return this.length;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    if (end - start !== this.struct_getSerializedLength(null)) {
      throw new Error("Incorrect deserialized vector length");
    }
    return super.tree_deserializeFromBytes(data, start, end);
  }

  tree_setProperty(target: Tree, property: number, value: T[number]): boolean {
    if (property >= this.tree_getLength(target)) {
      throw new Error("Invalid array index");
    }
    return super.tree_setProperty(target, property, value, false);
  }

  hasVariableSerializedLength(): boolean {
    return false;
  }

  getMaxChunkCount(): number {
    return Math.ceil((this.length * this.elementType.size()) / 32);
  }
}

export class CompositeVectorType<
  T extends Vector<Record<string, unknown>> = Vector<Record<string, unknown>>
> extends CompositeArrayType<T> {
  length: number;

  constructor(options: IVectorOptions<T>) {
    super(options);
    this.length = options.length;
    this._typeSymbols.add(VECTOR_TYPE);
  }

  struct_defaultValue(): T {
    return (Array.from({length: this.length}, () => {
      return this.elementType.struct_defaultValue();
    }) as unknown) as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  struct_getLength(value: T): number {
    return this.length;
  }

  getMaxLength(): number {
    return this.length;
  }

  getMinLength(): number {
    return this.length;
  }

  struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): T {
    this.bytes_validate(data, start, end);
    const value = super.struct_deserializeFromBytes(data, start, end);
    if (value.length !== this.length) {
      throw new Error("Incorrect deserialized vector length");
    }
    return value;
  }

  struct_assertValidValue(value: unknown): asserts value is T {
    const actualLength = (value as T).length;
    const expectedLength = this.struct_getLength(value as T);
    if (actualLength !== expectedLength) {
      throw new Error(`Invalid vector length: expected ${expectedLength}, actual ${actualLength}`);
    }
    super.struct_assertValidValue(value);
  }

  struct_convertFromJson(data: Json): T {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON vector: expected an Array");
    }
    const expectedLength = this.length;
    if (data.length !== expectedLength) {
      throw new Error(`Invalid JSON vector length: expected ${expectedLength}, actual ${data.length}`);
    }
    return super.struct_convertFromJson(data);
  }

  tree_defaultNode(): Node {
    if (!this._defaultNode) {
      this._defaultNode = subtreeFillToLength(this.elementType.tree_defaultNode(), this.getChunkDepth(), this.length);
    }
    return this._defaultNode;
  }

  tree_defaultValue(): Tree {
    return new Tree(this.tree_defaultNode());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tree_getLength(target: Tree): number {
    return this.length;
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree {
    const target = this.tree_defaultValue();
    if (this.elementType.hasVariableSerializedLength()) {
      const offsets = this.bytes_getVariableOffsets(new Uint8Array(data.buffer, data.byteOffset + start, end - start));
      if (offsets.length !== this.length) {
        throw new Error("Incorrect deserialized vector length");
      }
      for (let i = 0; i < offsets.length; i++) {
        const [currentOffset, nextOffset] = offsets[i];
        this.tree_setSubtreeAtChunkIndex(
          target,
          i,
          this.elementType.tree_deserializeFromBytes(data, start + currentOffset, start + nextOffset)
        );
      }
    } else {
      const elementSize = this.elementType.struct_getSerializedLength(null);
      const length = (end - start) / elementSize;
      if (length !== this.length) {
        throw new Error("Incorrect deserialized vector length");
      }
      for (let i = 0; i < length; i++) {
        this.tree_setSubtreeAtChunkIndex(
          target,
          i,
          this.elementType.tree_deserializeFromBytes(data, start + i * elementSize, start + (i + 1) * elementSize)
        );
      }
    }
    return target;
  }

  setProperty(target: Tree, property: number, value: Tree): boolean {
    if (property >= this.tree_getLength(target)) {
      throw new Error("Invalid array index");
    }
    return super.tree_setProperty(target, property, value, false);
  }

  hasVariableSerializedLength(): boolean {
    return this.elementType.hasVariableSerializedLength();
  }

  getMaxChunkCount(): number {
    return this.length;
  }
}
