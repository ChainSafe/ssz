
// TODO: move to chacha20.ts??
// TODO: review this const
export const INPUT_LENGTH = 512;
// See stablelib
const KEY_LENGTH = 32;
const COUNTER_LENGTH = 32;

// Number of ChaCha rounds (ChaCha20).
const ROUNDS = 20;

// input buffer
export const input = new ArrayBuffer(INPUT_LENGTH);
const inputPtr = changetype<usize>(input);

export const key = new ArrayBuffer(KEY_LENGTH);
const keyPtr = changetype<usize>(key);

// the nonce in chacha
export const counter = new ArrayBuffer(COUNTER_LENGTH);
const counterPtr = changetype<usize>(counter);

// output buffer
export const output = new ArrayBuffer(INPUT_LENGTH);
const outputPtr = changetype<usize>(output);

@inline
function store8(ptr: usize, offset: usize, u: u8): void {
  store<u8>(ptr + offset, u);
}

@inline
function load8(ptr: usize, offset: usize): u8 {
  return load<u8>(ptr + offset);
}

export function stream(size: i32): number {
  for (let i = 0; i < size; i++) {
    const v = load8(inputPtr, i);
    store8(outputPtr, i, v + 1);
  }
  return size;
}

const block = new Uint8Array(64);

/**
 *
 * @param key keyPtr
 * @param nonce counterPtr
 * @param src inputPtr
 * @param dst outputPtr
 * @param nonceInplaceCounterLength always 4 as in stablelib
 * @returns
 */
export function streamXOR(dataLength: u32): void {
  // TODO: verify at js side
  // if (key.length !== 32) {
  //     throw new Error("ChaCha: key size must be 32 bytes");
  // }

  // if (dst.length < src.length) {
  //     throw new Error("ChaCha: destination is shorter than source");
  // }

  // let nc: Uint8Array;
  // let counterLength: number;

  // // this implementation only supports nonceInplaceCounterLength 4
  // if (nonceInplaceCounterLength === 0) {
  //     if (nonce.length !== 8 && nonce.length !== 12) {
  //         throw new Error("ChaCha nonce must be 8 or 12 bytes");
  //     }
  //     nc = new Uint8Array(16);
  //     // First counterLength bytes of nc are counter, starting with zero.
  //     counterLength = nc.length - nonce.length;
  //     // Last bytes of nc after counterLength are nonce, set them.
  //     nc.set(nonce, counterLength);
  // } else {
  //     if (nonce.length !== 16) {
  //         throw new Error("ChaCha nonce with counter must be 16 bytes");
  //     }
  //     // This will update passed nonce with counter inplace.
  //     nc = nonce;
  //     counterLength = nonceInplaceCounterLength;
  // }

  // // Allocate temporary space for ChaCha block.
  // const block = new Uint8Array(64);

  for (let i = 0; i < dataLength; i += 64) {
      // Generate a block.
      core(block, counterPtr, keyPtr);

      // XOR block bytes with src into dst.
      for (let j = i; j < i + 64 && j < dataLength; j++) {
          // dst[j] = src[j] ^ block[j - i];
          store8(outputPtr, j, load8(inputPtr, j) ^ block[j - i]);
      }

      // Increment counter.
      // TODO: 4 as constant
      incrementCounter(counterPtr, 0, 4);
  }

  // Cleanup temporary space.
  wipe(block);

  // if (nonceInplaceCounterLength === 0) {
  //     // Cleanup counter.
  //     wipe(nc);
  // }

}

function core(out: Uint8Array, inputPtr: usize, keyPtr: usize): void {
  let j0 = 0x61707865; // "expa"  -- ChaCha's "sigma" constant
  let j1 = 0x3320646E; // "nd 3"     for 32-byte keys
  let j2 = 0x79622D32; // "2-by"
  let j3 = 0x6B206574; // "te k"
  let j4 = (load8(keyPtr, 3) << 24) | (load8(keyPtr, 2) << 16) | (load8(keyPtr, 1) << 8) | load8(keyPtr, 0);
  let j5 = (load8(keyPtr, 7) << 24) | (load8(keyPtr, 6) << 16) | (load8(keyPtr, 5) << 8) | load8(keyPtr, 4);
  let j6 = (load8(keyPtr, 11) << 24) | (load8(keyPtr, 10) << 16) | (load8(keyPtr, 9) << 8) | load8(keyPtr, 8);
  let j7 = (load8(keyPtr, 15) << 24) | (load8(keyPtr, 14) << 16) | (load8(keyPtr, 13) << 8) | load8(keyPtr, 12);
  let j8 = (load8(keyPtr, 19) << 24) | (load8(keyPtr, 18) << 16) | (load8(keyPtr, 17) << 8) | load8(keyPtr, 16);
  let j9 = (load8(keyPtr, 23) << 24) | (load8(keyPtr, 22) << 16) | (load8(keyPtr, 21) << 8) | load8(keyPtr, 20);
  let j10 = (load8(keyPtr, 27) << 24) | (load8(keyPtr, 26) << 16) | (load8(keyPtr, 25) << 8) | load8(keyPtr, 24);
  let j11 = (load8(keyPtr, 31) << 24) | (load8(keyPtr, 30) << 16) | (load8(keyPtr, 29) << 8) | load8(keyPtr, 28);
  let j12 = (load8(inputPtr, 3) << 24) | (load8(inputPtr, 2) << 16) | (load8(inputPtr, 1) << 8) | load8(inputPtr, 0);
  let j13 = (load8(inputPtr, 7) << 24) | (load8(inputPtr, 6) << 16) | (load8(inputPtr, 5) << 8) | load8(inputPtr, 4);
  let j14 = (load8(inputPtr, 11) << 24) | (load8(inputPtr, 10) << 16) | (load8(inputPtr, 9) << 8) | load8(inputPtr, 8);
  let j15 = (load8(inputPtr, 15) << 24) | (load8(inputPtr, 14) << 16) | (load8(inputPtr, 13) << 8) | load8(inputPtr, 12);

  let x0 = j0;
  let x1 = j1;
  let x2 = j2;
  let x3 = j3;
  let x4 = j4;
  let x5 = j5;
  let x6 = j6;
  let x7 = j7;
  let x8 = j8;
  let x9 = j9;
  let x10 = j10;
  let x11 = j11;
  let x12 = j12;
  let x13 = j13;
  let x14 = j14;
  let x15 = j15;

  for (let i = 0; i < ROUNDS; i += 2) {
    x0 = x0 + x4 | 0; x12 ^= x0; x12 = x12 >>> (32 - 16) | x12 << 16;
    x8 = x8 + x12 | 0; x4 ^= x8; x4 = x4 >>> (32 - 12) | x4 << 12;
    x1 = x1 + x5 | 0; x13 ^= x1; x13 = x13 >>> (32 - 16) | x13 << 16;
    x9 = x9 + x13 | 0; x5 ^= x9; x5 = x5 >>> (32 - 12) | x5 << 12;

    x2 = x2 + x6 | 0; x14 ^= x2; x14 = x14 >>> (32 - 16) | x14 << 16;
    x10 = x10 + x14 | 0; x6 ^= x10; x6 = x6 >>> (32 - 12) | x6 << 12;
    x3 = x3 + x7 | 0; x15 ^= x3; x15 = x15 >>> (32 - 16) | x15 << 16;
    x11 = x11 + x15 | 0; x7 ^= x11; x7 = x7 >>> (32 - 12) | x7 << 12;

    x2 = x2 + x6 | 0; x14 ^= x2; x14 = x14 >>> (32 - 8) | x14 << 8;
    x10 = x10 + x14 | 0; x6 ^= x10; x6 = x6 >>> (32 - 7) | x6 << 7;
    x3 = x3 + x7 | 0; x15 ^= x3; x15 = x15 >>> (32 - 8) | x15 << 8;
    x11 = x11 + x15 | 0; x7 ^= x11; x7 = x7 >>> (32 - 7) | x7 << 7;

    x1 = x1 + x5 | 0; x13 ^= x1; x13 = x13 >>> (32 - 8) | x13 << 8;
    x9 = x9 + x13 | 0; x5 ^= x9; x5 = x5 >>> (32 - 7) | x5 << 7;
    x0 = x0 + x4 | 0; x12 ^= x0; x12 = x12 >>> (32 - 8) | x12 << 8;
    x8 = x8 + x12 | 0; x4 ^= x8; x4 = x4 >>> (32 - 7) | x4 << 7;

    x0 = x0 + x5 | 0; x15 ^= x0; x15 = x15 >>> (32 - 16) | x15 << 16;
    x10 = x10 + x15 | 0; x5 ^= x10; x5 = x5 >>> (32 - 12) | x5 << 12;
    x1 = x1 + x6 | 0; x12 ^= x1; x12 = x12 >>> (32 - 16) | x12 << 16;
    x11 = x11 + x12 | 0; x6 ^= x11; x6 = x6 >>> (32 - 12) | x6 << 12;

    x2 = x2 + x7 | 0; x13 ^= x2; x13 = x13 >>> (32 - 16) | x13 << 16;
    x8 = x8 + x13 | 0; x7 ^= x8; x7 = x7 >>> (32 - 12) | x7 << 12;
    x3 = x3 + x4 | 0; x14 ^= x3; x14 = x14 >>> (32 - 16) | x14 << 16;
    x9 = x9 + x14 | 0; x4 ^= x9; x4 = x4 >>> (32 - 12) | x4 << 12;

    x2 = x2 + x7 | 0; x13 ^= x2; x13 = x13 >>> (32 - 8) | x13 << 8;
    x8 = x8 + x13 | 0; x7 ^= x8; x7 = x7 >>> (32 - 7) | x7 << 7;
    x3 = x3 + x4 | 0; x14 ^= x3; x14 = x14 >>> (32 - 8) | x14 << 8;
    x9 = x9 + x14 | 0; x4 ^= x9; x4 = x4 >>> (32 - 7) | x4 << 7;

    x1 = x1 + x6 | 0; x12 ^= x1; x12 = x12 >>> (32 - 8) | x12 << 8;
    x11 = x11 + x12 | 0; x6 ^= x11; x6 = x6 >>> (32 - 7) | x6 << 7;
    x0 = x0 + x5 | 0; x15 ^= x0; x15 = x15 >>> (32 - 8) | x15 << 8;
    x10 = x10 + x15 | 0; x5 ^= x10; x5 = x5 >>> (32 - 7) | x5 << 7;
  }
  writeUint32LE(x0 + j0 | 0, out, 0);
  writeUint32LE(x1 + j1 | 0, out, 4);
  writeUint32LE(x2 + j2 | 0, out, 8);
  writeUint32LE(x3 + j3 | 0, out, 12);
  writeUint32LE(x4 + j4 | 0, out, 16);
  writeUint32LE(x5 + j5 | 0, out, 20);
  writeUint32LE(x6 + j6 | 0, out, 24);
  writeUint32LE(x7 + j7 | 0, out, 28);
  writeUint32LE(x8 + j8 | 0, out, 32);
  writeUint32LE(x9 + j9 | 0, out, 36);
  writeUint32LE(x10 + j10 | 0, out, 40);
  writeUint32LE(x11 + j11 | 0, out, 44);
  writeUint32LE(x12 + j12 | 0, out, 48);
  writeUint32LE(x13 + j13 | 0, out, 52);
  writeUint32LE(x14 + j14 | 0, out, 56);
  writeUint32LE(x15 + j15 | 0, out, 60);
}

// TODO: move to util
export function writeUint32LE(value: number, out = new Uint8Array(4), offset = 0): Uint8Array {
  out[offset + 0] = value >>> 0;
  out[offset + 1] = value >>> 8;
  out[offset + 2] = value >>> 16;
  out[offset + 3] = value >>> 24;
  return out;
}

// TODO: move to util
export function wipe(array: Uint8Array): Uint8Array {
  // Right now it's similar to array.fill(0). If it turns
  // out that runtimes optimize this call away, maybe
  // we can try something else.
  for (let i = 0; i < array.length; i++) {
      array[i] = 0;
  }
  return array;
}

function incrementCounter(counter: usize, pos: u8, len: u8): void {
  let carry = 1;
  while (len--) {
      carry = carry + (load8(counter, pos) & 0xff) | 0;
      // counter[pos] = carry & 0xff;
      store8(counter, pos, (carry & 0xff) as u8);
      carry >>>= 8;
      pos++;
  }
  if (carry > 0) {
      throw new Error("ChaCha: counter overflow");
  }
}
