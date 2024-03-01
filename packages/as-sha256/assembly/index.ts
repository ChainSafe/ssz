import {digest64V128} from "./simd";
import {K, W64} from "./utils/const";

// As of Mar 2024, simd support v128, and each block is 32 bits, so we can hash 4 inputs at once
export const PARALLEL_FACTOR = 4;
export const INPUT_LENGTH = 512;
//https://github.com/dchest/fast-sha256-js/blob/master/src/sha256.ts
const DIGEST_LENGTH = 32;

const kPtr = K.dataStart;

const w64Ptr = W64.dataStart;

// intermediate hash values stored in H0-H7
var H0: u32, H1: u32, H2: u32, H3: u32, H4: u32, H5: u32, H6: u32, H7: u32;

// hash registers

var a: u32, b: u32, c: u32, d: u32, e: u32, f: u32, g: u32, h: u32, i: u32, t1: u32, t2: u32;

// 16 32bit message blocks
const M = new ArrayBuffer(64);
const mPtr = changetype<usize>(M);

// 64 32bit extended message blocks = 64 * 4 = 256
const W = new ArrayBuffer(256 * PARALLEL_FACTOR);
const wPtr = changetype<usize>(W);

// input buffer
export const input = new ArrayBuffer(INPUT_LENGTH);
const inputPtr = changetype<usize>(input);

// output buffer
export const output = new ArrayBuffer(DIGEST_LENGTH);
const outputPtr = changetype<usize>(output);

// number of bytes in M buffer
var mLength = 0;

// number of total bytes hashed
var bytesHashed = 0;

@inline
function load32(ptr: usize, offset: usize): u32 {
  return load<u32>(ptr + (offset << alignof<u32>()));
}

@inline
function load32be(ptr: usize, offset: usize): u32 {
  const firstOffset = offset << alignof<u32>();
  return (
    (<u32>load8(ptr, firstOffset + 0) << 24) |
    (<u32>load8(ptr, firstOffset + 1) << 16) |
    (<u32>load8(ptr, firstOffset + 2) <<  8) |
    (<u32>load8(ptr, firstOffset + 3) <<  0)
  );
}

@inline
function store32(ptr: usize, offset: usize, u: u32): void {
  store<u32>(ptr + (offset << alignof<u32>()), u);
}

@inline
function store8(ptr: usize, offset: usize, u: u8): void {
  store<u8>(ptr + offset, u);
}

@inline
function load8(ptr: usize, offset: usize): u8 {
  return load<u8>(ptr + offset);
}

@inline
function fill(ptr: usize, value: u8, length: u32): void {
  const finalPtr = ptr + length;
  while(ptr < finalPtr) {
    store<u8>(ptr, value);
    ptr++;
  }
}

@inline
function CH(x: u32, y: u32, z: u32): u32 {
  return((x & y) ^ (~x & z));
}

@inline
function MAJ(x: u32, y: u32, z:u32): u32 {
  return ((x & y) ^ (x & z) ^ (y & z));
}

@inline
function EP0(x: u32): u32 {
  return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
}

@inline
function EP1(x: u32): u32 {
  return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
}

@inline
function SIG0(x: u32): u32 {
  return rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
}

@inline
function SIG1(x: u32): u32 {
  return rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);
}

/**
 * Expand message blocks (16 32bit blocks), into extended message blocks (64 32bit blocks),
 * Apply SHA256 compression function on extended message blocks
 * Update intermediate hash values
 * @param wPtr pointer to expanded message block memory
 * @param mPtr pointer to message block memory, pass 0 if wPtr is precomputed for e.g. in digest64
 */
function hashBlocks(wPtr: usize, mPtr: usize): void {
  a = H0;
  b = H1;
  c = H2;
  d = H3;
  e = H4;
  f = H5;
  g = H6;
  h = H7;

  // Load message blocks into first 16 expanded message blocks
  for (i = 0; i < 16; i++) {
    store32(wPtr, i,
      load32be(mPtr, i)
    );
  }
  // Expand message blocks 17-64
  for (i = 16; i < 64; i++) {
    store32(wPtr, i,
      SIG1(load32(wPtr, i - 2)) +
      load32(wPtr, i - 7) +
      SIG0(load32(wPtr, i - 15)) +
      load32(wPtr, i - 16)
    );
  }

  // Apply SHA256 compression function on expanded message blocks
  for (i = 0; i < 64; i++) {
    t1 = h + EP1(e) + CH(e, f, g) + load32(kPtr, i) + load32(wPtr, i);
    t2 = EP0(a) + MAJ(a, b, c);
    h = g;
    g = f;
    f = e;
    e = d + t1;
    d = c;
    c = b;
    b = a;
    a = t1 + t2;
  }

  H0 += a;
  H1 += b;
  H2 += c;
  H3 += d;
  H4 += e;
  H5 += f;
  H6 += g;
  H7 += h;
}

function hashPreCompW(wPtr: usize): void {
  a = H0;
  b = H1;
  c = H2;
  d = H3;
  e = H4;
  f = H5;
  g = H6;
  h = H7;

  // Apply SHA256 compression function on expanded message blocks
  for (i = 0; i < 64; i++) {
    t1 = h + EP1(e) + CH(e, f, g) + load32(wPtr, i);
    t2 = EP0(a) + MAJ(a, b, c);
    h = g;
    g = f;
    f = e;
    e = d + t1;
    d = c;
    c = b;
    b = a;
    a = t1 + t2;
  }

  H0 += a;
  H1 += b;
  H2 += c;
  H3 += d;
  H4 += e;
  H5 += f;
  H6 += g;
  H7 += h;
}

export function init(): void {
  H0 = 0x6a09e667;
  H1 = 0xbb67ae85;
  H2 = 0x3c6ef372;
  H3 = 0xa54ff53a;
  H4 = 0x510e527f;
  H5 = 0x9b05688c;
  H6 = 0x1f83d9ab;
  H7 = 0x5be0cd19;

  mLength = 0;
  bytesHashed  = 0;
}

export function update(dataPtr: usize, dataLength: i32): void {
  let dataPos = 0;
  bytesHashed += dataLength;
  // If message blocks buffer has data, fill to 64
  if (mLength) {
    if (64 - mLength <= dataLength) {
      // we can fully fill the buffer with data left over
      memory.copy(mPtr + mLength, dataPtr, 64 - mLength);
      mLength += 64 - mLength;
      dataPos += 64 - mLength;
      dataLength -= 64 - mLength;
      hashBlocks(wPtr, mPtr);
      mLength = 0;
    } else {
      // we can't fully fill the buffer but we exhaust the whole data buffer
      memory.copy(mPtr + mLength, dataPtr, dataLength);
      mLength += dataLength;
      dataPos += dataLength;
      dataLength -= dataLength;
      return;
    }
  }
  // If input has remaining 64-byte chunks, hash those
  for (let i = 0; i < dataLength / 64; i++, dataPos += 64) {
    hashBlocks(wPtr, dataPtr + dataPos);
  }
  // If any additional bytes remain, copy into message blocks buffer
  if (dataLength & 63) {
    memory.copy(mPtr + mLength, dataPtr + dataPos, dataLength & 63);
    mLength += dataLength & 63;
  }
}

export function final(outPtr: usize): void {
  // one additional round of hashes required
  // because padding will not fit
  if ((bytesHashed & 63) < 63) {
    store8(mPtr, mLength, 0x80);
    mLength++;
  }
  if ((bytesHashed & 63) >= 56) {
    fill(mPtr + mLength, 0, 64 - mLength);
    hashBlocks(wPtr, mPtr);
    mLength = 0;
  }
  if ((bytesHashed & 63) >= 63) {
    store8(mPtr, mLength, 0x80);
    mLength++;
  }
  fill(mPtr + mLength, 0, 64 - mLength - 8);

  store<u32>(mPtr + 64 - 8, bswap(bytesHashed / 0x20000000)); // length -- high bits
  store<u32>(mPtr + 64 - 4, bswap(bytesHashed << 3)); // length -- low bits

  // hash round for padding
  hashBlocks(wPtr, mPtr);

  store32(outPtr, 0, bswap(H0));
  store32(outPtr, 1, bswap(H1));
  store32(outPtr, 2, bswap(H2));
  store32(outPtr, 3, bswap(H3));
  store32(outPtr, 4, bswap(H4));
  store32(outPtr, 5, bswap(H5));
  store32(outPtr, 6, bswap(H6));
  store32(outPtr, 7, bswap(H7));
}

export function digest(length: i32): void {
  init();
  update(inputPtr, length);
  final(outputPtr);
}

export function digest64(inPtr: usize, outPtr: usize): void {
  init();
  hashBlocks(wPtr,inPtr);
  hashPreCompW(w64Ptr);
  store32(outPtr, 0, bswap(H0));
  store32(outPtr, 1, bswap(H1));
  store32(outPtr, 2, bswap(H2));
  store32(outPtr, 3, bswap(H3));
  store32(outPtr, 4, bswap(H4));
  store32(outPtr, 5, bswap(H5));
  store32(outPtr, 6, bswap(H6));
  store32(outPtr, 7, bswap(H7));
}

/**
 * Hash 4 inputs of exactly 64 bytes each
 * Input pointer is 256 bytes as below:
 *              byte                       u32
 * input 0      0 1 2 ... 63      <===>    0   1 ... 15
 * input 1      64 65 ... 127     <===>    16 17 ... 31
 * input 2      128   ... 191     <===>    32 33 ... 47
 * input 3      192   ... 255     <===>    48 49 ... 63
 *
 * we need to transfer it to expanded message blocks, with 16 first items like:
 *
 * w_v128_0     0 16 32 48
 * w_v128_1     1 17 33 49
 * ...
 * w_v128_15    15 31 47 63
 *
 * remaining 48 items are computed inside hashBlocksV128 loop.
 * @param outPtr
 */
export function hash4Inputs(outPtr: usize): void {
  for (i = 0; i < 16; i++) {
    store32(wPtr, PARALLEL_FACTOR * i, load32be(inputPtr, i));
    store32(wPtr, PARALLEL_FACTOR * i + 1, load32be(inputPtr, i + 16));
    store32(wPtr, PARALLEL_FACTOR * i + 2, load32be(inputPtr, i + 32));
    store32(wPtr, PARALLEL_FACTOR * i + 3, load32be(inputPtr, i + 48));
  }

  digest64V128(wPtr, outPtr);
}

/*
 * Hash 8 hash objects which are 4 inputs of 64 bytes each similar to hash4Inputs
 *
 * Input pointer is 64 u32 (256 bytes) as below:
 * input 0   input 1   input 2   input 3
 * h0        h0        h0        h0
 * h1        h1        h1        h1
 * ...
 * h7        h7        h7        h7
 * h0        h0        h0        h0
 * h1        h1        h1        h1
 * ...
 * h7        h7        h7        h7
 *
 * that's already the setup for wInputPtr, we only need to load be value of them to make
 * it the first 16 items of expanded message blocks
 *
 * remaining 48 items are computed inside hashBlocksV128 loop.
 *
 */
export function hash8HashObjects(outPtr: usize): void {
  for (i = 0; i < 16 * PARALLEL_FACTOR; i++) {
    store32(wPtr, i, load32be(inputPtr, i));
  }

  digest64V128(wPtr, outPtr);
}
