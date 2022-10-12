import {wipe, writeUint32LE} from "./util";

// Number of ChaCha rounds (ChaCha20).
const ROUNDS: i32 = 20;
const block = new Uint8Array(64);

/**
 * The logical streamXOR function should include multiple streamXORUpdate calls
 * passed from javascript side.
 * @param key keyArr, 32 bytes
 * @param nonce counterArr, 16 bytes
 * @param src inputArr
 * @param dst outputArr
 * @param nonceInplaceCounterLength 4
 * @returns number of bytes
 */
export function doStreamXORUpdate(
  inputArr: Uint8Array,
  dataLength: u32,
  keyArr: Uint8Array,
  counterArr: Uint8Array,
  outputArr: Uint8Array
): u32 {
  for (let i: u32 = 0; i < dataLength; i += 64) {
    // Generate a block.
    core(block, counterArr, keyArr);

    // XOR block bytes with src into dst.
    for (let j = i; j < i + 64 && j < dataLength; j++) {
      outputArr[j] = inputArr[j] ^ block[j - i];
    }

    // we only support a nonce length of 16 and nonceInplaceCounterLength of 4
    const counterLength: u8 = 4;
    incrementCounter(counterArr, 0, counterLength);
  }

  // Cleanup temporary space.
  wipe(block);

  return dataLength;
}

// Applies the ChaCha core function to 16-byte input,
// 32-byte key key, and puts the result into 64-byte array out.
function core(out: Uint8Array, input: Uint8Array, key: Uint8Array): void {
  const j0: i32 = 1634760805; // 0x61707865; // "expa"  -- ChaCha's "sigma" constant
  const j1: i32 = 857760878; // 0x3320646e; // "nd 3"     for 32-byte keys
  const j2: i32 = 2036477234; // 0x79622d32; // "2-by"
  const j3: i32 = 1797285236; // 0x6b206574; // "te k"
  const j4: i32 = (i32(key[3]) << 24) | (i32(key[2]) << 16) | (i32(key[1]) << 8) | i32(key[0]);
  const j5: i32 = (i32(key[7]) << 24) | (i32(key[6]) << 16) | (i32(key[5]) << 8) | i32(key[4]);
  const j6: i32 = (i32(key[11]) << 24) | (i32(key[10]) << 16) | (i32(key[9]) << 8) | i32(key[8]);
  const j7: i32 = (i32(key[15]) << 24) | (i32(key[14]) << 16) | (i32(key[13]) << 8) | i32(key[12]);
  const j8: i32 = (i32(key[19]) << 24) | (i32(key[18]) << 16) | (i32(key[17]) << 8) | i32(key[16]);
  const j9: i32 = (i32(key[23]) << 24) | (i32(key[22]) << 16) | (i32(key[21]) << 8) | i32(key[20]);
  const j10: i32 = (i32(key[27]) << 24) | (i32(key[26]) << 16) | (i32(key[25]) << 8) | i32(key[24]);
  const j11: i32 = (i32(key[31]) << 24) | (i32(key[30]) << 16) | (i32(key[29]) << 8) | i32(key[28]);
  const j12: i32 = (i32(input[3]) << 24) | (i32(input[2]) << 16) | (i32(input[1]) << 8) | i32(input[0]);
  const j13: i32 = (i32(input[7]) << 24) | (i32(input[6]) << 16) | (i32(input[5]) << 8) | i32(input[4]);
  const j14: i32 = (i32(input[11]) << 24) | (i32(input[10]) << 16) | (i32(input[9]) << 8) | i32(input[8]);
  const j15: i32 = (i32(input[15]) << 24) | (i32(input[14]) << 16) | (i32(input[13]) << 8) | i32(input[12]);

  let x0: i32 = j0;
  let x1: i32 = j1;
  let x2: i32 = j2;
  let x3: i32 = j3;
  let x4: i32 = j4;
  let x5: i32 = j5;
  let x6: i32 = j6;
  let x7: i32 = j7;
  let x8: i32 = j8;
  let x9: i32 = j9;
  let x10: i32 = j10;
  let x11: i32 = j11;
  let x12: i32 = j12;
  let x13: i32 = j13;
  let x14: i32 = j14;
  let x15: i32 = j15;

  for (let i: i32 = 0; i < ROUNDS; i += 2) {
    x0 = (x0 + x4) | 0;
    x12 ^= x0;
    x12 = (x12 >>> (32 - 16)) | (x12 << 16);
    x8 = (x8 + x12) | 0;
    x4 ^= x8;
    x4 = (x4 >>> (32 - 12)) | (x4 << 12);
    x1 = (x1 + x5) | 0;
    x13 ^= x1;
    x13 = (x13 >>> (32 - 16)) | (x13 << 16);
    x9 = (x9 + x13) | 0;
    x5 ^= x9;
    x5 = (x5 >>> (32 - 12)) | (x5 << 12);

    x2 = (x2 + x6) | 0;
    x14 ^= x2;
    x14 = (x14 >>> (32 - 16)) | (x14 << 16);
    x10 = (x10 + x14) | 0;
    x6 ^= x10;
    x6 = (x6 >>> (32 - 12)) | (x6 << 12);
    x3 = (x3 + x7) | 0;
    x15 ^= x3;
    x15 = (x15 >>> (32 - 16)) | (x15 << 16);
    x11 = (x11 + x15) | 0;
    x7 ^= x11;
    x7 = (x7 >>> (32 - 12)) | (x7 << 12);

    x2 = (x2 + x6) | 0;
    x14 ^= x2;
    x14 = (x14 >>> (32 - 8)) | (x14 << 8);
    x10 = (x10 + x14) | 0;
    x6 ^= x10;
    x6 = (x6 >>> (32 - 7)) | (x6 << 7);
    x3 = (x3 + x7) | 0;
    x15 ^= x3;
    x15 = (x15 >>> (32 - 8)) | (x15 << 8);
    x11 = (x11 + x15) | 0;
    x7 ^= x11;
    x7 = (x7 >>> (32 - 7)) | (x7 << 7);

    x1 = (x1 + x5) | 0;
    x13 ^= x1;
    x13 = (x13 >>> (32 - 8)) | (x13 << 8);
    x9 = (x9 + x13) | 0;
    x5 ^= x9;
    x5 = (x5 >>> (32 - 7)) | (x5 << 7);
    x0 = (x0 + x4) | 0;
    x12 ^= x0;
    x12 = (x12 >>> (32 - 8)) | (x12 << 8);
    x8 = (x8 + x12) | 0;
    x4 ^= x8;
    x4 = (x4 >>> (32 - 7)) | (x4 << 7);

    x0 = (x0 + x5) | 0;
    x15 ^= x0;
    x15 = (x15 >>> (32 - 16)) | (x15 << 16);
    x10 = (x10 + x15) | 0;
    x5 ^= x10;
    x5 = (x5 >>> (32 - 12)) | (x5 << 12);
    x1 = (x1 + x6) | 0;
    x12 ^= x1;
    x12 = (x12 >>> (32 - 16)) | (x12 << 16);
    x11 = (x11 + x12) | 0;
    x6 ^= x11;
    x6 = (x6 >>> (32 - 12)) | (x6 << 12);

    x2 = (x2 + x7) | 0;
    x13 ^= x2;
    x13 = (x13 >>> (32 - 16)) | (x13 << 16);
    x8 = (x8 + x13) | 0;
    x7 ^= x8;
    x7 = (x7 >>> (32 - 12)) | (x7 << 12);
    x3 = (x3 + x4) | 0;
    x14 ^= x3;
    x14 = (x14 >>> (32 - 16)) | (x14 << 16);
    x9 = (x9 + x14) | 0;
    x4 ^= x9;
    x4 = (x4 >>> (32 - 12)) | (x4 << 12);

    x2 = (x2 + x7) | 0;
    x13 ^= x2;
    x13 = (x13 >>> (32 - 8)) | (x13 << 8);
    x8 = (x8 + x13) | 0;
    x7 ^= x8;
    x7 = (x7 >>> (32 - 7)) | (x7 << 7);
    x3 = (x3 + x4) | 0;
    x14 ^= x3;
    x14 = (x14 >>> (32 - 8)) | (x14 << 8);
    x9 = (x9 + x14) | 0;
    x4 ^= x9;
    x4 = (x4 >>> (32 - 7)) | (x4 << 7);

    x1 = (x1 + x6) | 0;
    x12 ^= x1;
    x12 = (x12 >>> (32 - 8)) | (x12 << 8);
    x11 = (x11 + x12) | 0;
    x6 ^= x11;
    x6 = (x6 >>> (32 - 7)) | (x6 << 7);
    x0 = (x0 + x5) | 0;
    x15 ^= x0;
    x15 = (x15 >>> (32 - 8)) | (x15 << 8);
    x10 = (x10 + x15) | 0;
    x5 ^= x10;
    x5 = (x5 >>> (32 - 7)) | (x5 << 7);
  }

  writeUint32LE((x0 + j0) | 0, out, 0);
  writeUint32LE((x1 + j1) | 0, out, 4);
  writeUint32LE((x2 + j2) | 0, out, 8);
  writeUint32LE((x3 + j3) | 0, out, 12);
  writeUint32LE((x4 + j4) | 0, out, 16);
  writeUint32LE((x5 + j5) | 0, out, 20);
  writeUint32LE((x6 + j6) | 0, out, 24);
  writeUint32LE((x7 + j7) | 0, out, 28);
  writeUint32LE((x8 + j8) | 0, out, 32);
  writeUint32LE((x9 + j9) | 0, out, 36);
  writeUint32LE((x10 + j10) | 0, out, 40);
  writeUint32LE((x11 + j11) | 0, out, 44);
  writeUint32LE((x12 + j12) | 0, out, 48);
  writeUint32LE((x13 + j13) | 0, out, 52);
  writeUint32LE((x14 + j14) | 0, out, 56);
  writeUint32LE((x15 + j15) | 0, out, 60);
}

function incrementCounter(counter: Uint8Array, pos: u8, len: u8): void {
  let carry = 1;
  while (len--) {
    carry = (carry + (counter[pos] & 0xff)) | 0;
    counter[pos] = carry & 0xff;
    carry >>>= 8;
    pos++;
  }
  if (carry > 0) {
    throw new Error("ChaCha: counter overflow");
  }
}
