/* eslint-disable @typescript-eslint/no-unused-vars */
import {Json} from "../../interface";
import {CompositeType, IJsonOptions} from "../../types";
import {merkleize} from "../../util/compat";

/**
 * StructuralHandler differs slightly from the TreeHandler in that it is NOT a ProxyHandler.
 * It is only meant to be called via the CompositeType.structural object, rather than through a Proxied call.
 * It also acts on targets of type T rather than TreeBacked<T>.
 */
export class StructuralHandler<T extends object> {
  _type: CompositeType<T>;
  type(): CompositeType<T> {
    return this._type;
  }
  defaultValue(): T {
    throw new Error("Not implemented");
  }
  clone(target: T): T {
    throw new Error("Not implemented");
  }
  size(target: T): number {
    throw new Error("Not implemented");
  }
  maxSize(): number {
    throw new Error("Not implemented.");
  }
  minSize(): number {
    throw new Error("Not implemented.");
  }
  assertValidValue(target: unknown): asserts target is T {
    throw new Error("Not implemented");
  }
  equals(target: T, other: T): boolean {
    throw new Error("Not implemented");
  }
  validateBytes(data: Uint8Array, start: number, end: number): void {
    if (!data) {
      throw new Error("Data is null or undefined");
    }
    if (data.length === 0) {
      throw new Error("Data is empty");
    }
    if (start < 0) {
      throw new Error(`Start param is negative: ${start}`);
    }
    if (start >= data.length) {
      throw new Error(`Start param: ${start} is greater than length: ${data.length}`);
    }
    if (end < 0) {
      throw new Error(`End param is negative: ${end}`);
    }
    if (end > data.length) {
      throw new Error(`End param: ${end} is greater than length: ${data.length}`);
    }
    const length = end - start;
    if (!this._type.isVariableSize() && length !== this.size(null)) {
      throw new Error(`Incorrect data length ${length}, expect ${this.size(null)}`);
    }
    if (end - start < this.minSize()) {
      throw new Error(`Data length ${length} is too small, expect at least ${this.minSize()}`);
    }
  }
  fromBytes(data: Uint8Array, start: number, end: number): T {
    throw new Error("Not implemented");
  }
  deserialize(data: Uint8Array): T {
    return this.fromBytes(data, 0, data.length);
  }
  serialize(target: T): Uint8Array {
    const output = new Uint8Array(this._type.size(target));
    this.toBytes(target, output, 0);
    return output;
  }
  toBytes(target: T, output: Uint8Array, offset: number): number {
    throw new Error("Not implemented");
  }
  nonzeroChunkCount(value: T): number {
    return this._type.chunkCount();
  }
  chunk(value: T, index: number): Uint8Array {
    throw new Error("Not implemented");
  }
  chunks(value: T): Iterable<Uint8Array> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const t = this;
    const chunkCount = this.nonzeroChunkCount(value);
    const iterator = function* (): Iterable<Uint8Array> {
      for (let i = 0; i < chunkCount; i++) {
        yield t.chunk(value, i);
      }
    };
    return iterator();
  }
  hashTreeRoot(target: T): Uint8Array {
    return merkleize(this.chunks(target), this._type.chunkCount());
  }
  fromJson(data: Json, options?: IJsonOptions): T {
    throw new Error("Not implemented");
  }
  toJson(value: T, options?: IJsonOptions): Json {
    throw new Error("Not implemented");
  }
}
