/* eslint-disable @typescript-eslint/no-unused-vars */
import {ArrayLike, Json} from "../../interface";
import {BasicArrayType, CompositeArrayType, IJsonOptions} from "../../types";
import {StructuralHandler} from "./abstract";
import {SszErrorPath} from "../../util/errorPath";

export class BasicArrayStructuralHandler<T extends ArrayLike<unknown>> extends StructuralHandler<T> {
  _type: BasicArrayType<T>;
  getLength(value: T): number {
    throw new Error("Not implemented");
  }
  getMaxLength(): number {
    throw new Error("Not implemented");
  }
  getMinLength(): number {
    throw new Error("Not implemented");
  }
  size(value: T): number {
    return this._type.elementType.size() * this.getLength(value);
  }
  maxSize(): number {
    return this.getMaxLength() * this._type.elementType.maxSize();
  }
  minSize(): number {
    return this.getMinLength() * this._type.elementType.minSize();
  }
  assertValidValue(value: unknown): asserts value is T {
    for (let i = 0; i < this.getLength(value as T); i++) {
      try {
        this._type.elementType.assertValidValue((value as T)[i]);
      } catch (e) {
        throw new Error(`Invalid element ${i}: ${e.message}`);
      }
    }
  }
  equals(value1: T, value2: T): boolean {
    for (let i = 0; i < this.getLength(value1); i++) {
      if (!this._type.elementType.equals(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  }
  clone(value: T): T {
    const newValue = this._type.structural.defaultValue();
    for (let i = 0; i < this.getLength(value); i++) {
      newValue[i] = this._type.elementType.clone(value[i]);
    }
    return newValue;
  }
  fromBytes(data: Uint8Array, start: number, end: number): T {
    this.validateBytes(data, start, end);
    const elementSize = this._type.elementType.size();
    return (Array.from({length: (end - start) / elementSize}, (_, i) =>
      this._type.elementType.fromBytes(data, start + i * elementSize)
    ) as unknown) as T;
  }
  toBytes(value: T, output: Uint8Array, offset: number): number {
    const length = this.getLength(value);
    let index = offset;
    for (let i = 0; i < length; i++) {
      index = this._type.elementType.toBytes(value[i], output, index);
    }
    return index;
  }
  chunk(value: T, index: number): Uint8Array {
    const output = new Uint8Array(32);
    const itemSize = this._type.elementType.size();
    const itemsInChunk = Math.floor(32 / itemSize);
    const firstIndex = index * itemsInChunk;
    // not inclusive
    const lastIndex = Math.min(this.getLength(value), firstIndex + itemsInChunk);
    // i = array index, grows by 1
    // j = data offset, grows by itemSize
    for (let i = firstIndex, j = 0; i < lastIndex; i++, j += itemSize) {
      this._type.elementType.toBytes(value[i], output, j);
    }
    return output;
  }
  fromJson(data: Json[]): T {
    return (Array.from({length: data.length}, (_, i) => this._type.elementType.fromJson(data[i])) as unknown) as T;
  }
  toJson(value: T): Json {
    return Array.from({length: this.getLength(value)}, (_, i) => this._type.elementType.toJson(value[i]));
  }
}

export class CompositeArrayStructuralHandler<T extends ArrayLike<object>> extends StructuralHandler<T> {
  _type: CompositeArrayType<T>;
  getLength(value: T): number {
    throw new Error("Not implemented");
  }
  getMaxLength(): number {
    throw new Error("Not implemented");
  }
  getMinLength(): number {
    throw new Error("Not implemented");
  }
  size(value: T): number {
    if (this._type.elementType.isVariableSize()) {
      let s = 0;
      for (let i = 0; i < this.getLength(value); i++) {
        s += this._type.elementType.structural.size(value[i]) + 4;
      }
      return s;
    } else {
      return this._type.elementType.structural.size(null) * this.getLength(value);
    }
  }
  maxSize(): number {
    if (this._type.elementType.isVariableSize()) {
      return this.getMaxLength() * 4 + this.getMaxLength() * this._type.elementType.maxSize();
    } else {
      return this.getMaxLength() * this._type.elementType.maxSize();
    }
  }
  minSize(): number {
    if (this._type.elementType.isVariableSize()) {
      return this.getMinLength() * 4 + this.getMinLength() * this._type.elementType.minSize();
    } else {
      return this.getMinLength() * this._type.elementType.minSize();
    }
  }
  assertValidValue(value: unknown): asserts value is T {
    for (let i = 0; i < this.getLength(value as T); i++) {
      try {
        this._type.elementType.structural.assertValidValue((value as T)[i]);
      } catch (e) {
        throw new Error(`Invalid element ${i}: ${e.message}`);
      }
    }
  }
  equals(value1: T, value2: T): boolean {
    for (let i = 0; i < this.getLength(value1); i++) {
      if (!this._type.elementType.structural.equals(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  }
  clone(value: T): T {
    const newValue = this.defaultValue();
    for (let i = 0; i < this.getLength(value); i++) {
      newValue[i] = this._type.elementType.structural.clone(value[i]);
    }
    return newValue;
  }
  fromBytes(data: Uint8Array, start: number, end: number): T {
    this.validateBytes(data, start, end);
    if (start === end) {
      return ([] as unknown) as T;
    }
    if (this._type.elementType.isVariableSize()) {
      const value = [];
      // all elements variable-sized
      // indices contain offsets
      let currentIndex = start;
      let nextIndex = currentIndex;
      // data exists between offsets
      const fixedSection = new DataView(data.buffer, data.byteOffset);
      const firstOffset = start + fixedSection.getUint32(start, true);
      let currentOffset = firstOffset;
      let nextOffset = currentOffset;
      while (currentIndex < firstOffset) {
        if (currentOffset > end) {
          throw new Error("Offset out of bounds");
        }
        nextIndex = currentIndex + 4;
        nextOffset = nextIndex === firstOffset ? end : start + fixedSection.getUint32(nextIndex, true);
        if (currentOffset > nextOffset) {
          throw new Error("Offsets must be increasing");
        }
        try {
          value.push(this._type.elementType.structural.fromBytes(data, currentOffset, nextOffset));
        } catch (e) {
          throw new SszErrorPath(e, value.length);
        }
        currentIndex = nextIndex;
        currentOffset = nextOffset;
      }
      if (firstOffset !== currentIndex) {
        throw new Error("First offset skips variable data");
      }
      return (value as unknown) as T;
    } else {
      const elementSize = this._type.elementType.structural.size(null);
      return (Array.from({length: (end - start) / elementSize}, (_, i) =>
        this._type.elementType.structural.fromBytes(data, start + i * elementSize, start + (i + 1) * elementSize)
      ) as unknown) as T;
    }
  }
  toBytes(value: T, output: Uint8Array, offset: number): number {
    const length = this.getLength(value);
    if (this._type.elementType.isVariableSize()) {
      let variableIndex = offset + length * 4;
      const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
      for (let i = 0; i < length; i++) {
        // write offset
        fixedSection.setUint32(i * 4, variableIndex - offset, true);
        // write serialized element to variable section
        variableIndex = this._type.elementType.structural.toBytes(value[i], output, variableIndex);
      }
      return variableIndex;
    } else {
      let index = offset;
      for (let i = 0; i < length; i++) {
        index = this._type.elementType.structural.toBytes(value[i], output, index);
      }
      return index;
    }
  }
  chunk(value: T, index: number): Uint8Array {
    return this._type.elementType.hashTreeRoot(value[index]);
  }
  fromJson(data: Json[], options?: IJsonOptions): T {
    return (Array.from({length: data.length}, (_, i) =>
      this._type.elementType.structural.fromJson(data[i], options)
    ) as unknown) as T;
  }
  toJson(value: T, options?: IJsonOptions): Json {
    return Array.from({length: this.getLength(value)}, (_, i) =>
      this._type.elementType.structural.toJson(value[i], options)
    );
  }
}
