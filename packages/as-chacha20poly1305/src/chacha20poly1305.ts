import {DATA_CHUNK_LENGTH, KEY_LENGTH, NONCE_LENGTH, TAG_LENGTH} from "./const";
import {WasmContext} from "./wasm";

export class ChaCha20Poly1305 {
  private wasmKeyArr: Uint8Array;
  private wasmNonceArr: Uint8Array;
  private wasmAdArr: Uint8Array;
  private wasmInputArr: Uint8Array;
  private wasmChacha20OutputArr: Uint8Array;
  private wasmPoly1305OutputArr: Uint8Array;
  private wasmDebugArr: Uint32Array;

  constructor(private readonly ctx: WasmContext) {
    const wasmKeyValue = ctx.cpKey.value;
    this.wasmKeyArr = new Uint8Array(ctx.memory.buffer, wasmKeyValue, KEY_LENGTH);
    const wasmNonceValue = ctx.cpNonce.value;
    this.wasmNonceArr = new Uint8Array(ctx.memory.buffer, wasmNonceValue, NONCE_LENGTH);
    const wasmAdValue = ctx.cpAssociatedData.value;
    // 32, same to KEY_LENGTH
    this.wasmAdArr = new Uint8Array(ctx.memory.buffer, wasmAdValue, KEY_LENGTH);
    const wasmSealedValue = ctx.cpInput.value;
    this.wasmInputArr = new Uint8Array(ctx.memory.buffer, wasmSealedValue, DATA_CHUNK_LENGTH);
    const wasmChacha20OutputValue = ctx.chacha20Output.value;
    this.wasmChacha20OutputArr = new Uint8Array(ctx.memory.buffer, wasmChacha20OutputValue, DATA_CHUNK_LENGTH);
    const wasmPoly1305OutputValue = ctx.poly1305Output.value;
    this.wasmPoly1305OutputArr = new Uint8Array(ctx.memory.buffer, wasmPoly1305OutputValue, TAG_LENGTH);
    const wasmDebugValue = ctx.debug.value;
    this.wasmDebugArr = new Uint32Array(ctx.memory.buffer, wasmDebugValue, 64);
  }

  seal(key: Uint8Array, nonce: Uint8Array, plaintext: Uint8Array, associatedData?: Uint8Array): Uint8Array {
    this.init(key, nonce, associatedData);
    const resultLength = plaintext.length + TAG_LENGTH;
    const result = new Uint8Array(resultLength);
    this.sealUpdate(plaintext, result);
    this.digest(plaintext.length, associatedData?.length ?? 0);
    result.set(this.wasmPoly1305OutputArr, plaintext.length);
    return result;
  }

  // TODO: avoid 1 digest call to wasm for specific data
  open(key: Uint8Array, nonce: Uint8Array, sealed: Uint8Array, associatedData?: Uint8Array): Uint8Array | null {
    this.init(key, nonce, associatedData);
    const sealedNoTag = sealed.subarray(0, sealed.length - TAG_LENGTH);
    // TODO: use the same input data to avoid a memory allocation here??
    const result = new Uint8Array(sealedNoTag.length);
    this.openUpdate(sealedNoTag, result);
    const tag = sealed.subarray(sealed.length - TAG_LENGTH, sealed.length);
    const isTagValid = this.openDigest(tag, sealedNoTag.length, associatedData?.length ?? 0);
    return isTagValid ? result : null;
  }

  private init(key: Uint8Array, nonce: Uint8Array, ad: Uint8Array = new Uint8Array(0)): void {
    if (key.length != KEY_LENGTH) {
      throw Error(`Invalid chacha20poly1305 key length ${key.length}, expect ${KEY_LENGTH}`);
    }
    if (ad.length > KEY_LENGTH) {
      throw Error(`Invalid ad length ${ad.length}, expect <= ${KEY_LENGTH}`);
    }
    if (nonce.length !== NONCE_LENGTH) {
      throw Error(`Invalid nonce length ${nonce.length}, expect ${NONCE_LENGTH}`);
    }

    this.wasmKeyArr.set(key);
    this.wasmNonceArr.set(nonce);
    this.wasmAdArr.set(ad);
    this.ctx.init(ad.length);
  }

  private openUpdate(data: Uint8Array, dst: Uint8Array): void {
    this.commonUpdate(data, this.ctx.openUpdate, dst);
  }

  private sealUpdate(data: Uint8Array, dst: Uint8Array): void {
    this.commonUpdate(data, this.ctx.sealUpdate, dst);
  }

  private commonUpdate(data: Uint8Array, updateFn: (length: number) => void, dst: Uint8Array): void {
    const length = data.length;
    if (data.length <= DATA_CHUNK_LENGTH) {
      this.wasmInputArr.set(data);
      updateFn(length);
      dst.set(
        length === DATA_CHUNK_LENGTH ? this.wasmChacha20OutputArr : this.wasmChacha20OutputArr.subarray(0, length)
      );
      return;
    }

    for (let offset = 0; offset < length; offset += DATA_CHUNK_LENGTH) {
      const end = Math.min(length, offset + DATA_CHUNK_LENGTH);
      this.wasmInputArr.set(data.subarray(offset, end));
      updateFn(end - offset);
      dst.set(
        end - offset === DATA_CHUNK_LENGTH
          ? this.wasmChacha20OutputArr
          : this.wasmChacha20OutputArr.subarray(0, end - offset),
        offset
      );
    }
    return;
  }

  private openDigest(tag: Uint8Array, ciphertextLength: number, asDataLength: number): boolean {
    this.digest(ciphertextLength, asDataLength);
    let isSameTag = true;
    for (let i = 0; i < TAG_LENGTH; i++) {
      if (this.wasmPoly1305OutputArr[i] !== tag[i]) {
        isSameTag = false;
        break;
      }
    }

    return isSameTag;
  }

  /**
   * output is set to wasmPoly1305OutputArr
   * @param ciphertextLength
   * @param asDataLength
   */
  private digest(ciphertextLength: number, asDataLength: number): void {
    this.ctx.digest(ciphertextLength, asDataLength);
  }
}
