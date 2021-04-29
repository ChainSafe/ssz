
//https://github.com/dchest/fast-sha256-js/blob/master/src/sha256.ts
const DIGEST_LENGTH = 32;
export const INPUT_LENGTH = 512;

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

//precomputed W for message block representing length 64 bytes for fixed input of 64 bytes for digest64
const W64: u32[] = [
  0x80000000, 0x00000000, 0x00000000, 0x00000000,
  0x00000000, 0x00000000, 0x00000000, 0x00000000,
  0x00000000, 0x00000000, 0x00000000, 0x00000000,
  0x00000000, 0x00000000, 0x00000000, 0x00000200,
  0x80000000, 0x01400000, 0x00205000, 0x00005088,
  0x22000800, 0x22550014, 0x05089742, 0xa0000020,
  0x5a880000, 0x005c9400, 0x0016d49d, 0xfa801f00,
  0xd33225d0, 0x11675959, 0xf6e6bfda, 0xb30c1549,
  0x08b2b050, 0x9d7c4c27, 0x0ce2a393, 0x88e6e1ea,
  0xa52b4335, 0x67a16f49, 0xd732016f, 0x4eeb2e91,
  0x5dbf55e5, 0x8eee2335, 0xe2bc5ec2, 0xa83f4394,
  0x45ad78f7, 0x36f3d0cd, 0xd99c05e8, 0xb0511dc7,
  0x69bc7ac4, 0xbd11375b, 0xe3ba71e5, 0x3b209ff2,
  0x18feee17, 0xe25ad9e7, 0x13375046, 0x0515089d,
  0x4f0d0f04, 0x2627484e, 0x310128d2, 0xc668b434,
  0x420841cc, 0x62d311b8, 0xe59ba771, 0x85a7a484
];
const w64Ptr = W64.dataStart;

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
function hashBlocks(wPtr: usize, mPtr: usize = 0): void {
  a = H0;
  b = H1;
  c = H2;
  d = H3;
  e = H4;
  f = H5;
  g = H6;
  h = H7;

  // If mPtr is null, wPtr is assumed to be precomputed
  if(mPtr){
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
  final(outputPtr)
}

export function digest64(inPtr: usize, outPtr: usize): void {
  init();
  hashBlocks(wPtr,inPtr);
  hashBlocks(w64Ptr);
  store32(outPtr, 0, bswap(H0));
  store32(outPtr, 1, bswap(H1));
  store32(outPtr, 2, bswap(H2));
  store32(outPtr, 3, bswap(H3));
  store32(outPtr, 4, bswap(H4));
  store32(outPtr, 5, bswap(H5));
  store32(outPtr, 6, bswap(H6));
  store32(outPtr, 7, bswap(H7));
}
