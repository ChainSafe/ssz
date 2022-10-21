import {DATA_CHUNK_LENGTH, KEY_LENGTH, NONCE_LENGTH, TAG_LENGTH} from "./const";
import {WasmContext} from "./wasm";

export class ChaCha20Poly1305 {
  private wasmKeyArr: Uint8Array;
  private wasmNonceArr: Uint8Array;
  private wasmAdArr: Uint8Array;
  private wasmSealedArr: Uint8Array;
  private wasmTagArr: Uint8Array;
  private wasmOutputArr: Uint8Array;
  private wasmDebugArr: Uint32Array;

  constructor(private readonly ctx: WasmContext) {
    const wasmKeyValue = ctx.cpKey.value;
    this.wasmKeyArr = new Uint8Array(ctx.memory.buffer, wasmKeyValue, KEY_LENGTH);
    const wasmNonceValue = ctx.cpNonce.value;
    this.wasmNonceArr = new Uint8Array(ctx.memory.buffer, wasmNonceValue, NONCE_LENGTH);
    const wasmAdValue = ctx.cpAssociatedData.value;
    // 32, same to KEY_LENGTH
    this.wasmAdArr = new Uint8Array(ctx.memory.buffer, wasmAdValue, KEY_LENGTH);
    const wasmSealedValue = ctx.cpSealed.value;
    this.wasmSealedArr = new Uint8Array(ctx.memory.buffer, wasmSealedValue, DATA_CHUNK_LENGTH);
    const wasmTagValue = ctx.cpTag.value;
    this.wasmTagArr = new Uint8Array(ctx.memory.buffer, wasmTagValue, TAG_LENGTH);
    const wasmOutputValue = ctx.chacha20Output.value;
    this.wasmOutputArr = new Uint8Array(ctx.memory.buffer, wasmOutputValue, DATA_CHUNK_LENGTH);
    const wasmDebugValue = ctx.debug.value;
    this.wasmDebugArr = new Uint32Array(ctx.memory.buffer, wasmDebugValue, 64);
  }

  // TODO: avoid 1 digest call to wasm for specific data
  open(key: Uint8Array, nonce: Uint8Array, sealed: Uint8Array, associatedData?: Uint8Array): Uint8Array | null {
    this._openInit(key, nonce, associatedData);
    const sealedNoTag = sealed.subarray(0, sealed.length - TAG_LENGTH);
    const result = this._openUpdate(sealedNoTag);
    const tag = sealed.subarray(sealed.length - TAG_LENGTH, sealed.length);
    const isTagValid = this._openDigest(tag, sealedNoTag.length, associatedData?.length ?? 0);
    return isTagValid ? result : null;
  }

  private _openInit(key: Uint8Array, nonce: Uint8Array, ad: Uint8Array = new Uint8Array(0)): void {
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
    this.ctx.openInit(ad.length);
  }

  private _openUpdate(data: Uint8Array): Uint8Array {
    const length = data.length;
    // TODO: use the same input data to avoid a memory allocation here??
    const result = new Uint8Array(length);
    if (data.length <= DATA_CHUNK_LENGTH) {
      this.wasmSealedArr.set(data);
      this.ctx.openUpdate(length);
      result.set(length === DATA_CHUNK_LENGTH ? this.wasmOutputArr : this.wasmOutputArr.subarray(0, length));
      return result;
    }

    for (let offset = 0; offset < length; offset += DATA_CHUNK_LENGTH) {
      const end = Math.min(length, offset + DATA_CHUNK_LENGTH);
      this.wasmSealedArr.set(data.subarray(offset, end));
      this.ctx.openUpdate(end - offset);
      result.set(
        end - offset === DATA_CHUNK_LENGTH ? this.wasmOutputArr : this.wasmOutputArr.subarray(0, end - offset), offset
      );
    }
    return result;
  }

  private _openDigest(tag: Uint8Array, ciphertextLength: number, asDataLength: number): boolean {
    this.wasmTagArr.set(tag);
    return this.ctx.openDigest(ciphertextLength, asDataLength);
  }
}
