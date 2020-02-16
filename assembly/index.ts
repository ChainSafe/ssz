
//https://github.com/dchest/fast-sha256-js/blob/master/src/sha256.ts
export const UINT8ARRAY_ID = idof<Uint8Array>();
const DIGEST_LENGTH = 32;
const INPUT_LENGTH = 512;

// constants used in the SHA256 compression function
const K: u32[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
  0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
  0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
  0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
  0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
  0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
  0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
  0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];
const kPtr = K.dataStart;

// intermediate hash values stored in H0-H7
var H0: u32, H1: u32, H2: u32, H3: u32, H4: u32, H5: u32, H6: u32, H7: u32;

// hash registers
var a: u32, b: u32, c: u32, d: u32, e: u32, f: u32, g: u32, h: u32, i: u32, t1: u32, t2: u32;

// 16 32bit message blocks
const M = new ArrayBuffer(64);
const mPtr = changetype<usize>(M);

// 64 32bit extended message blocks
const W = new ArrayBuffer(256);
const wPtr = changetype<usize>(W);

// output buffer
const output = new ArrayBuffer(DIGEST_LENGTH);
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
function load32Bswap(ptr: usize, offset: usize): u32 {
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
 * @param mPtr pointer to message block memory
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
      load32Bswap(mPtr, i)
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

function reset(): void {
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

export function update(data: Uint8Array, dataLength: i32): void {
  let dataPtr = data.dataStart;
  let dataPos = 0;
  bytesHashed += dataLength;
  while (dataLength > 0) {
    const minLength = min(64 - mLength, dataLength);
    memory.copy(mPtr + mLength, dataPtr + dataPos, minLength);
    mLength += minLength;
    dataPos += minLength;
    dataLength -= minLength;
    if (mLength === 64) {
      hashBlocks(wPtr, mPtr);
      mLength = 0;
    }
  }
}

export function finish(output: ArrayBuffer): void {
  let left      = mLength;
  let bitLenHi  = bytesHashed / 0x20000000;
  let bitLenLo  = bytesHashed << 3;

  // one additional round of hashes required
  // because padding will not fit
  if ((bytesHashed & 63) < 63) {
    store8(mPtr, left, 0x80);
    left++;
  }
  if ((bytesHashed & 63) >= 56) {
    memory.fill(mPtr + left, 0, 64 - left);
    hashBlocks(wPtr, mPtr);
    left = 0;
  }
  if ((bytesHashed & 63) >= 63) {
    store8(mPtr, left, 0x80);
    left++;
  }
  memory.fill(mPtr + left, 0, 64 - left - 8);

  store<u32>(mPtr + 64 - 8, bswap(bitLenHi));
  store<u32>(mPtr + 64 - 4, bswap(bitLenLo));

  // hash round for padding
  hashBlocks(wPtr, mPtr);

  let outPtr = changetype<usize>(output);

  store32(outPtr, 0, bswap(H0));
  store32(outPtr, 1, bswap(H1));
  store32(outPtr, 2, bswap(H2));
  store32(outPtr, 3, bswap(H3));
  store32(outPtr, 4, bswap(H4));
  store32(outPtr, 5, bswap(H5));
  store32(outPtr, 6, bswap(H6));
  store32(outPtr, 7, bswap(H7));
}

export function digest(): Uint8Array {
  finish(output);
  let ret = new Uint8Array(DIGEST_LENGTH);
  memory.copy(ret.dataStart, outputPtr, DIGEST_LENGTH);
  return ret;
}

export function hash(data: Uint8Array): Uint8Array {
  reset();
  update(data, data.length);
  finish(output);

  let ret = new Uint8Array(DIGEST_LENGTH);
  memory.copy(ret.dataStart, changetype<usize>(output), DIGEST_LENGTH);
  return ret;
}

export function toHexString(bin: Uint8Array): string {
  let bin_len = bin.length;
  let hex = "";
  for (let i = 0; i < bin_len; i++) {
    let bin_i = bin[i] as u32;
    let c = bin_i & 0xf;
    let b = bin_i >> 4;
    let x: u32 = ((87 + c + (((c - 10) >> 8) & ~38)) << 8) |
        (87 + b + (((b - 10) >> 8) & ~38));
    hex += String.fromCharCode(x as u8);
    x >>= 8;
    hex += String.fromCharCode(x as u8);
  }
  return hex;
}
