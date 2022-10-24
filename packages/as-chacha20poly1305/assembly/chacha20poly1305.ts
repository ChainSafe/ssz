import {
  chacha20InputPtr,
  chacha20KeyPtr,
  chacha20CounterPtr,
  CHACHA20_COUNTER_LENGTH,
  chacha20Stream,
  chacha20StreamXORUpdate,
  chacha20OutputPtr,
} from "./chacha20";
import {DATA_CHUNK_LENGTH, KEY_LENGTH} from "../common/const";
import {poly1305Digest, poly1305Init, poly1305InputPtr, poly1305KeyPtr, poly1305Update} from "./poly1305";
import {load8, store8, writeUint64LE} from "./util";

// cp stands for chacha20poly1305
export const cpKey = new ArrayBuffer(KEY_LENGTH);
const cpKeyPtr = changetype<usize>(cpKey);
// Right now js-libp2p-noise always use 12 bytes of nonce
// TODO: support 16 bytes nonce as in the protocol
export const cpNonce = new ArrayBuffer(12);
const cpNoncePtr = changetype<usize>(cpNonce);
// As the need of js-libp2p-noise, only support an associatedData of 0 or 32 bytes
export const cpAssociatedData = new ArrayBuffer(32);
const cpAssociatedDataPtr = changetype<usize>(cpAssociatedData);
// cpSealed + cpTag = sealed in stablelib open() method
export const cpInput = new ArrayBuffer(DATA_CHUNK_LENGTH);
const cpInputPtr = changetype<usize>(cpInput);

// to debug
const debugArr = new Uint32Array(64);
export const debug = debugArr.buffer;

/**
 * Call init before this openUpdate.
 * Instead of calling _authenticate() then streamXOR() we do both at the same time chunk by chunk.
 * Note that tag data is not part of cpInput
 * @param isFirst true if it's the first chunk, initialize chacha20 and poly1305
 * @param isLast true if it's the last chunk, digest that call
 * @param chunkLength length of cpInput
 * @param ciphertextLength = sealed - tag length
 * @param asDataLength length of associatedData
 */
export function openUpdate(
  isFirst: boolean,
  isLast: boolean,
  chunkLength: u32,
  ciphertextLength: u32,
  asDataLength: u32
): void {
  // instead of doing a separate init() call, do it within update() to save 1 call to wasm.
  if (isFirst) {
    doInit(cpKeyPtr, cpNoncePtr, cpAssociatedDataPtr, asDataLength);
  }

  doOpenUpdate(cpInputPtr, chunkLength);

  // instead of doing a separate digest() call, do it within update() to save 1 call to wasm.
  if (isLast) {
    doDigest(ciphertextLength, asDataLength);
  }
}

/**
 * Similar to openUpdate but we do it reversely.
 * @param isFirst true if it's the first chunk, initialize chacha20 and poly1305
 * @param isLast true if it's the last chunk, digest that call
 * @param chunkLength length of cpInputArr
 * @param ciphertextLength = sealed - tag length
 * @param asDataLength length of associatedData
 */
export function sealUpdate(
  isFirst: boolean,
  isLast: boolean,
  chunkLength: u32,
  ciphertextLength: u32,
  asDataLength: u32
): void {
  // instead of doing a separate init() call, do it within update() to save 1 call to wasm.
  if (isFirst) {
    doInit(cpKeyPtr, cpNoncePtr, cpAssociatedDataPtr, asDataLength);
  }

  doSealUpdate(cpInputPtr, chunkLength);

  // instead of doing a separate digest() call, do it within update() to save 1 call to wasm.
  if (isLast) {
    doDigest(ciphertextLength, asDataLength);
  }
}

function doInit(key: usize, nonce: usize, associatedData: usize, asDataLength: u32): void {
  for (let i = 0; i < KEY_LENGTH; i++) {
    store8(chacha20KeyPtr, i, load8(key, i));
  }

  // Same to
  // const counter = new Uint8Array(16);
  // counter.set(nonce, counter.length - nonce.length);
  for (let i = 0; i < 4; i++) {
    store8(chacha20CounterPtr, i, 0);
  }
  for (let i = 4; i < CHACHA20_COUNTER_LENGTH; i++) {
    store8(chacha20CounterPtr, i, load8(nonce, i - 4));
  }

  // Generate authentication key by taking first 32-bytes of stream.
  // output is set to chacha20OutputPtr
  chacha20Stream(KEY_LENGTH);

  // part of _authenticate
  // Initialize Poly1305 with authKey.
  for (let i = 0; i < KEY_LENGTH; i++) {
    store8(poly1305KeyPtr, i, load8(chacha20OutputPtr, i));
  }
  poly1305Init();

  if (asDataLength > 0) {
    for (let i: u32 = 0; i < asDataLength; i++) {
      store8(poly1305InputPtr, i, load8(associatedData, i));
    }
    poly1305Update(asDataLength);
    // h.update(ZEROS.subarray(ciphertext.length % 16));
    if (asDataLength % 16 > 0) {
      const paddedLength = 16 - (asDataLength % 16);
      if (paddedLength > 0) {
        for (let i: i32 = 0; i < paddedLength; i++) {
          store8(poly1305InputPtr, i, 0);
        }
        poly1305Update(paddedLength);
      }
    }
  }
}

function doOpenUpdate(ciphertext: usize, length: u32): void {
  // part of _authenticate
  // no need to initialize Poly1305 anymore as we did it in doInit()
  for (let i: u32 = 0; i < length; i++) {
    store8(poly1305InputPtr, i, load8(ciphertext, i));
  }
  poly1305Update(length);

  // part of open()
  // Decrypt even through we haven't done _authenticate
  // we may waste some streamXOR() call but should be ok for most of the times
  // key and counter are set in doInit
  // TODO: chain with the above for loop?
  for (let i: u32 = 0; i < length; i++) {
    store8(chacha20InputPtr, i, load8(ciphertext, i));
  }
  chacha20StreamXORUpdate(length);
  // output is set to chacha20Output
}

function doSealUpdate(plaintext: usize, length: u32): void {
  for (let i: u32 = 0; i < length; i++) {
    store8(chacha20InputPtr, i, load8(plaintext, i));
  }
  // output is set to chacha20Output
  chacha20StreamXORUpdate(length);

  // part of _authenticate
  // no need to initialize Poly1305 anymore as we did it in doInit()
  for (let i: u32 = 0; i < length; i++) {
    store8(poly1305InputPtr, i, load8(chacha20OutputPtr, i));
  }
  poly1305Update(length);
}

function doDigest(ciphertextLength: u32, asDataLength: u32): void {
  // h.update(ZEROS.subarray(ciphertext.length % 16));
  if (ciphertextLength % 16 > 0) {
    const paddedLength = 16 - (ciphertextLength % 16);
    if (paddedLength > 0) {
      for (let i: i32 = 0; i < paddedLength; i++) {
        store8(poly1305InputPtr, i, 0);
      }
      poly1305Update(paddedLength);
    }
  }

  // part of _authenticate
  writeUint64LE(asDataLength, poly1305InputPtr);
  poly1305Update(8);
  writeUint64LE(ciphertextLength, poly1305InputPtr);
  poly1305Update(8);

  poly1305Digest();
}
