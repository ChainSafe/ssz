import {simd} from "wasm-feature-detect";
import {allocUnsafe} from "./alloc.js";
import {newInstance, WasmSimdContext, WasmContext} from "./wasm.js";
import type {HashObject} from "./hashObject.js";
import {byteArrayIntoHashObject, byteArrayToHashObject, hashObjectToByteArray} from "./hashObject.js";
import SHA256 from "./sha256.js";
export {HashObject, byteArrayToHashObject, hashObjectToByteArray, byteArrayIntoHashObject, SHA256};

class BaseAssemblyScriptSha256Hasher {
  private ctx: WasmSimdContext | WasmContext;
  private wasmInputValue!: number;
  private wasmOutputValue!: number;
  private inputUint8Array!: Uint8Array;
  private outputUint8Array32!: Uint8Array;

  constructor() {
    this.ctx = newInstance(false);
    this.wasmInputValue = this.ctx.input.value;
    this.wasmOutputValue = this.ctx.output.value;
    this.inputUint8Array = new Uint8Array(this.ctx.memory.buffer, this.wasmInputValue, this.ctx.INPUT_LENGTH);
    /** output uint8array, length 32, used to easily copy output data */
    this.outputUint8Array32 = new Uint8Array(this.ctx.memory.buffer, this.wasmOutputValue, 32);
  }

  /**
   * Sha256 for data of any length
   */
  digest(data: Uint8Array): Uint8Array {
    if (data.length === 64) {
      return this.digest64(data);
    }

    if (data.length <= this.ctx.INPUT_LENGTH) {
      this.inputUint8Array.set(data);
      this.ctx.digest(data.length);
      return this.allocDigest();
    }

    this.ctx.init();
    this.update(data);
    return this.final();
  }

  /**
   * Sha256 for 64byte ArrayBuffer
   */
  digest64(data: Uint8Array): Uint8Array {
    if (data.length === 64) {
      this.inputUint8Array.set(data);
      this.ctx.digest64(this.wasmInputValue, this.wasmOutputValue);
      return this.allocDigest();
    }
    throw new Error("InvalidLengthForDigest64");
  }

  protected update(data: Uint8Array): void {
    const INPUT_LENGTH = this.ctx.INPUT_LENGTH;
    if (data.length > INPUT_LENGTH) {
      for (let i = 0; i < data.length; i += INPUT_LENGTH) {
        const sliced = data.subarray(i, i + INPUT_LENGTH);
        this.inputUint8Array.set(sliced);
        this.ctx.update(this.wasmInputValue, sliced.length);
      }
    } else {
      this.inputUint8Array.set(data);
      this.ctx.update(this.wasmInputValue, data.length);
    }
  }

  protected final(): Uint8Array {
    this.ctx.final(this.wasmOutputValue);
    return this.allocDigest();
  }

  /**
   * allocate memory and copy result
   */
  protected allocDigest(): Uint8Array {
    const out = allocUnsafe(32);
    out.set(this.outputUint8Array32);
    return out;
  }
}

const baseHasher = new BaseAssemblyScriptSha256Hasher();

const digest = baseHasher.digest.bind(baseHasher);
const digest64 = baseHasher.digest64.bind(baseHasher);

export {digest, digest64};

export class AssemblyScriptSha256Hasher {
  private ctx!: WasmSimdContext | WasmContext;
  private hasSimd!: boolean;
  private wasmInputValue!: number;
  private wasmOutputValue!: number;
  private inputUint8Array!: Uint8Array;
  private outputUint8Array!: Uint8Array;
  private outputUint8Array32!: Uint8Array;
  private inputUint32Array!: Uint32Array;
  private constructor(useSimd: boolean) {
    this.initializeInstance(useSimd);
  }

  static async initialize(shouldUseSimd?: boolean): Promise<AssemblyScriptSha256Hasher> {
    const useSimd = shouldUseSimd !== undefined ? shouldUseSimd : await simd();
    return new AssemblyScriptSha256Hasher(useSimd);
  }

  reinitializeInstance(useSimd: boolean): boolean {
    this.initializeInstance(useSimd);
    return this.simdEnabled();
  }

  simdEnabled(): boolean {
    return Boolean(this.ctx.HAS_SIMD.valueOf());
  }

  /**
   * Sha256 for data of any length
   */
  digest(data: Uint8Array): Uint8Array {
    if (data.length === 64) {
      return this.digest64(data);
    }

    if (data.length <= this.ctx.INPUT_LENGTH) {
      this.inputUint8Array.set(data);
      this.ctx.digest(data.length);
      return this.allocDigest();
    }

    this.ctx.init();
    this.update(data);
    return this.final();
  }

  /**
   * Sha256 for 64byte ArrayBuffer
   */
  digest64(data: Uint8Array): Uint8Array {
    if (data.length === 64) {
      this.inputUint8Array.set(data);
      this.ctx.digest64(this.wasmInputValue, this.wasmOutputValue);
      return this.allocDigest();
    }
    throw new Error("InvalidLengthForDigest64");
  }

  digest2Bytes32(bytes1: Uint8Array, bytes2: Uint8Array): Uint8Array {
    if (bytes1.length !== 32 || bytes2.length !== 32) {
      throw new Error("InvalidLengthForDigest64");
    }
    this.inputUint8Array.set(bytes1);
    this.inputUint8Array.set(bytes2, 32);
    this.ctx.digest64(this.wasmInputValue, this.wasmOutputValue);
    return this.allocDigest();
  }

  /**
   * Digest 2 objects, each has 8 properties from h0 to h7.
   * The performance is a little bit better than digest64 due to the use of Uint32Array
   * and the memory is a little bit better than digest64 due to no temporary Uint8Array.
   */
  digest64HashObjects(obj1: HashObject, obj2: HashObject): HashObject {
    const result: HashObject = {
      h0: 0,
      h1: 0,
      h2: 0,
      h3: 0,
      h4: 0,
      h5: 0,
      h6: 0,
      h7: 0,
    };
    this.digest64HashObjectsInto(obj1, obj2, result);
    return result;
  }

  /**
   * Same to above but this set result to the output param to save memory.
   */
  digest64HashObjectsInto(obj1: HashObject, obj2: HashObject, output: HashObject): void {
    // TODO: expect obj1 and obj2 as HashObject
    this.inputUint32Array[0] = obj1.h0;
    this.inputUint32Array[1] = obj1.h1;
    this.inputUint32Array[2] = obj1.h2;
    this.inputUint32Array[3] = obj1.h3;
    this.inputUint32Array[4] = obj1.h4;
    this.inputUint32Array[5] = obj1.h5;
    this.inputUint32Array[6] = obj1.h6;
    this.inputUint32Array[7] = obj1.h7;
    this.inputUint32Array[8] = obj2.h0;
    this.inputUint32Array[9] = obj2.h1;
    this.inputUint32Array[10] = obj2.h2;
    this.inputUint32Array[11] = obj2.h3;
    this.inputUint32Array[12] = obj2.h4;
    this.inputUint32Array[13] = obj2.h5;
    this.inputUint32Array[14] = obj2.h6;
    this.inputUint32Array[15] = obj2.h7;

    this.ctx.digest64(this.wasmInputValue, this.wasmOutputValue);

    // extracting numbers from Uint32Array causes more memory
    byteArrayIntoHashObject(this.outputUint8Array, 0, output);
  }

  /**
   * Hash 4 HashObject inputs in parallel
   *   - Each input (inputs{i}) is 4 bytes which make it 32 bytes
   *   - Each HashObject input contains 2 HashObjects which is 64 bytes similar to batchHash4UintArray64s
   *
   * Inputs      i0    i1    i2    i3    i4    i5    i6   i7
   *               \   /      \    /       \   /      \   /
   * Outputs         o0          o1          o2         o3
   * // TODO - batch: support equivalent method to hash into
   */
  batchHash4HashObjectInputs(inputs: HashObject[]): HashObject[] {
    if (inputs.length !== 8) {
      throw new Error("Input length must be 8");
    }

    if (!this.hasSimd) {
      const output: HashObject[] = new Array<HashObject>(4);
      for (let i = 0; i < 4; i++) {
        output[i] = this.digest64HashObjects(inputs[2 * i], inputs[2 * i + 1]);
      }
      return output;
    }

    // inputUint8Array is 256 bytes
    // inputUint32Array is 64 items
    // v128 0
    this.inputUint32Array[0] = inputs[0].h0;
    this.inputUint32Array[1] = inputs[2].h0;
    this.inputUint32Array[2] = inputs[4].h0;
    this.inputUint32Array[3] = inputs[6].h0;

    // v128 1
    this.inputUint32Array[4] = inputs[0].h1;
    this.inputUint32Array[5] = inputs[2].h1;
    this.inputUint32Array[6] = inputs[4].h1;
    this.inputUint32Array[7] = inputs[6].h1;

    // v128 2
    this.inputUint32Array[8] = inputs[0].h2;
    this.inputUint32Array[9] = inputs[2].h2;
    this.inputUint32Array[10] = inputs[4].h2;
    this.inputUint32Array[11] = inputs[6].h2;

    // v128 3
    this.inputUint32Array[12] = inputs[0].h3;
    this.inputUint32Array[13] = inputs[2].h3;
    this.inputUint32Array[14] = inputs[4].h3;
    this.inputUint32Array[15] = inputs[6].h3;

    // v128 4
    this.inputUint32Array[16] = inputs[0].h4;
    this.inputUint32Array[17] = inputs[2].h4;
    this.inputUint32Array[18] = inputs[4].h4;
    this.inputUint32Array[19] = inputs[6].h4;

    // v128 5
    this.inputUint32Array[20] = inputs[0].h5;
    this.inputUint32Array[21] = inputs[2].h5;
    this.inputUint32Array[22] = inputs[4].h5;
    this.inputUint32Array[23] = inputs[6].h5;

    // v128 6
    this.inputUint32Array[24] = inputs[0].h6;
    this.inputUint32Array[25] = inputs[2].h6;
    this.inputUint32Array[26] = inputs[4].h6;
    this.inputUint32Array[27] = inputs[6].h6;

    // v128 7
    this.inputUint32Array[28] = inputs[0].h7;
    this.inputUint32Array[29] = inputs[2].h7;
    this.inputUint32Array[30] = inputs[4].h7;
    this.inputUint32Array[31] = inputs[6].h7;

    // v128 8
    this.inputUint32Array[32] = inputs[1].h0;
    this.inputUint32Array[33] = inputs[3].h0;
    this.inputUint32Array[34] = inputs[5].h0;
    this.inputUint32Array[35] = inputs[7].h0;

    // v128 9
    this.inputUint32Array[36] = inputs[1].h1;
    this.inputUint32Array[37] = inputs[3].h1;
    this.inputUint32Array[38] = inputs[5].h1;
    this.inputUint32Array[39] = inputs[7].h1;

    // v128 10
    this.inputUint32Array[40] = inputs[1].h2;
    this.inputUint32Array[41] = inputs[3].h2;
    this.inputUint32Array[42] = inputs[5].h2;
    this.inputUint32Array[43] = inputs[7].h2;

    // v128 11
    this.inputUint32Array[44] = inputs[1].h3;
    this.inputUint32Array[45] = inputs[3].h3;
    this.inputUint32Array[46] = inputs[5].h3;
    this.inputUint32Array[47] = inputs[7].h3;

    // v128 12
    this.inputUint32Array[48] = inputs[1].h4;
    this.inputUint32Array[49] = inputs[3].h4;
    this.inputUint32Array[50] = inputs[5].h4;
    this.inputUint32Array[51] = inputs[7].h4;

    // v128 13
    this.inputUint32Array[52] = inputs[1].h5;
    this.inputUint32Array[53] = inputs[3].h5;
    this.inputUint32Array[54] = inputs[5].h5;
    this.inputUint32Array[55] = inputs[7].h5;

    // v128 14
    this.inputUint32Array[56] = inputs[1].h6;
    this.inputUint32Array[57] = inputs[3].h6;
    this.inputUint32Array[58] = inputs[5].h6;
    this.inputUint32Array[59] = inputs[7].h6;

    // v128 15
    this.inputUint32Array[60] = inputs[1].h7;
    this.inputUint32Array[61] = inputs[3].h7;
    this.inputUint32Array[62] = inputs[5].h7;
    this.inputUint32Array[63] = inputs[7].h7;

    (this.ctx as WasmSimdContext).batchHash4HashObjectInputs(this.wasmOutputValue);

    const output0 = byteArrayToHashObject(this.outputUint8Array, 0);
    const output1 = byteArrayToHashObject(this.outputUint8Array, 32);
    const output2 = byteArrayToHashObject(this.outputUint8Array, 64);
    const output3 = byteArrayToHashObject(this.outputUint8Array, 96);

    return [output0, output1, output2, output3];
  }

  /**
   * Hash 4 Uint8Array objects in parallel, each 64 length as below
   *
   * Inputs: i0    i1    i2    i3    i4    i5    i6    i7
   *          \    /      \    /      \   /       \   /
   * Outputs:   o0          o1          o2          o3
   */
  batchHash4UintArray64s(inputs: Uint8Array[]): Uint8Array[] {
    if (inputs.length !== 4) {
      throw new Error("Input length must be 4");
    }
    for (let i = 0; i < 4; i++) {
      const input = inputs[i];
      if (input == null) {
        throw new Error(`Input ${i} is null or undefined`);
      }
      if (input.length !== 64) {
        throw new Error(`Invalid length ${input.length} at input ${i}`);
      }
    }

    if (!this.hasSimd) {
      return inputs.map(this.digest64.bind(this));
    }

    // set up input buffer for v128
    this.inputUint8Array.set(inputs[1], 64);
    this.inputUint8Array.set(inputs[0], 0);
    this.inputUint8Array.set(inputs[2], 128);
    this.inputUint8Array.set(inputs[3], 192);

    (this.ctx as WasmSimdContext).batchHash4UintArray64s(this.wasmOutputValue);

    const output0 = this.allocDigest();
    const output1 = this.allocDigestOffset(32);
    const output2 = this.allocDigestOffset(64);
    const output3 = this.allocDigestOffset(96);

    return [output0, output1, output2, output3];
  }

  /**
   * Hash an input into preallocated input using batch if possible.
   */
  hashInto(input: Uint8Array, output: Uint8Array): void {
    if (input.length % 64 !== 0) {
      throw new Error(`Invalid input length ${input.length}`);
    }
    if (input.length !== output.length * 2) {
      throw new Error(`Invalid output length ${output.length}`);
    }

    let num64ByteChunksHashed = 0;
    let num64ByteChunksRemaining = input.length / 64;
    if (this.hasSimd) {
      // for every 64 x 4 = 256 bytes, do the batch hash if SIMD is present
      const num256ByteChunks = Math.floor(input.length / 256);
      for (let i = 0; i < num256ByteChunks; i++) {
        this.inputUint8Array.set(input.subarray(i * 256, (i + 1) * 256), 0);
        (this.ctx as WasmSimdContext).batchHash4UintArray64s(this.wasmOutputValue);
        output.set(this.outputUint8Array.subarray(0, 128), i * 128);
      }
      num64ByteChunksHashed = num256ByteChunks * 4;
      num64ByteChunksRemaining -= num64ByteChunksHashed;
    }

    const inputOffset = num64ByteChunksHashed * 64;
    const outputOffset = num64ByteChunksHashed * 32;
    for (let i = 0; i < num64ByteChunksRemaining; i++) {
      this.inputUint8Array.set(input.subarray(inputOffset + i * 64, inputOffset + (i + 1) * 64), 0);
      this.ctx.digest64(this.wasmInputValue, this.wasmOutputValue);
      output.set(this.outputUint8Array.subarray(0, 32), outputOffset + i * 32);
    }
  }

  private initializeInstance(useSimd: boolean): void {
    this.ctx = newInstance(useSimd);
    this.hasSimd = this.simdEnabled();
    this.wasmInputValue = this.ctx.input.value;
    this.wasmOutputValue = this.ctx.output.value;
    this.inputUint8Array = new Uint8Array(this.ctx.memory.buffer, this.wasmInputValue, this.ctx.INPUT_LENGTH);
    this.outputUint8Array = new Uint8Array(this.ctx.memory.buffer, this.wasmOutputValue, this.ctx.PARALLEL_FACTOR * 32);
    /** output uint8array, length 32, used to easily copy output data */
    this.outputUint8Array32 = new Uint8Array(this.ctx.memory.buffer, this.wasmOutputValue, 32);
    this.inputUint32Array = new Uint32Array(this.ctx.memory.buffer, this.wasmInputValue, this.ctx.INPUT_LENGTH);
  }

  private update(data: Uint8Array): void {
    const INPUT_LENGTH = this.ctx.INPUT_LENGTH;
    if (data.length > INPUT_LENGTH) {
      for (let i = 0; i < data.length; i += INPUT_LENGTH) {
        const sliced = data.subarray(i, i + INPUT_LENGTH);
        this.inputUint8Array.set(sliced);
        this.ctx.update(this.wasmInputValue, sliced.length);
      }
    } else {
      this.inputUint8Array.set(data);
      this.ctx.update(this.wasmInputValue, data.length);
    }
  }

  private final(): Uint8Array {
    this.ctx.final(this.wasmOutputValue);
    return this.allocDigest();
  }

  /**
   * allocate memory and copy result
   */
  private allocDigest(): Uint8Array {
    const out = allocUnsafe(32);
    out.set(this.outputUint8Array32);
    return out;
  }

  /**
   * allocate memory and copy result at offset
   */
  private allocDigestOffset(offset: number): Uint8Array {
    const out = allocUnsafe(32);
    out.set(this.outputUint8Array.subarray(offset, offset + 32));
    return out;
  }
}
