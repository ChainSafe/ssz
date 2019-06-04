// https://github.com/marco-fp/Bitcoin-Mining-Benchmark/blob/master/src/sha256.cpp
import "allocator/arena"
export {memory}

const sha256_k: u32[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]

const DIGEST_SIZE: i8 = 256 / 8; 

let m_h: u32[] = new Array<u32>(8);
let m_len: i32;
let m_tot_len: i32;
let SHA224_256_BLOCK_SIZE: i32 = (512/8);

function SHFR(x, n) {return x >> n};
function ROTR(x, n) {return ((x >> n) | (x << ((x.length() << 3) - n)))};
function ROTL(x, n) {return ((x << n) | (x >> ((x.length() << 3) -n )))};
function CH(x, y, z) {return ((x & y) ^ (~x & z))};
function MAJ(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z))};
function F1(x) {return (ROTR(x, 2) ^ ROTR(x, 13) ^ ROTR(x, 22))};
function F2(x) {return (ROTR(x, 6) ^ ROTR(x, 11) ^ ROTR(x, 25))};
function F3(x) {return (ROTR(x,  7) ^ ROTR(x, 18) ^ SHFR(x,  3))};
function F4(x) {return (ROTR(x, 17) ^ ROTR(x, 19) ^ SHFR(x, 10))};

function transform(message: string, block: i32): void {
  // uint32 w[64];
  // uint32 wv[8];
  // uint32 t1, t2;
  // const unsigned char *sub_block;
  let w = new Array<any>(64);
  let wv = new Array<any>(8);
  let t1: u32;
  let t2: u32;
  let j: i32;
  for (let i: i32 = 0; i < block; i++) {
    let subBlock = message + (i << 6);
    for (let j: i32 = 0; j < 16; j++) {
      pack32(subBlock[j << 2], w[j]);  
    }
    for (let j: i32 = 16; j < 64; j++) {
      w[j] = f4(w[j - 2] + w[j - 7] + f3(w[j - 15])) + w[j - 16];  
    }
    for (let j: i32 = 0; j < 8; j++) {
      wv[j] = m_h[j];
    }
    for (let j: i32 = 0; j < 64; j++) {
      t1 = wv[7] + f2(wv[4]) + ch(wv[4], wv[5], wv[6]) + sha256_k[j] + w[j];
      t2 = f1(wv[0]) + maj(wv[0], wv[1], wv[2]);
      wv[7] = wv[6];
      wv[6] = wv[5];
      wv[5] = wv[4];
      wv[4] = wv[3];
      wv[3] = wv[2];
      wv[2] = wv[1];
      wv[1] = wv[0];
      wv[0] = t1 + t2;
    }
    for (let j: i32 = 0; j < 8; j++) {
      m_h[j] += wv[j];
    }
  }
}

function init(): void {
  m_h[0] = 0x6a09e667;
  m_h[1] = 0xbb67ae85;
  m_h[2] = 0x3c6ef372;
  m_h[3] = 0xa54ff53a;
  m_h[4] = 0x510e527f;
  m_h[5] = 0x9b05688c;
  m_h[6] = 0x1f83d9ab;
  m_h[7] = 0x5be0cd19;
  m_len = 0;
  m_tot_len = 0;
}

function update(message: string, len: i32): void {
  let blockNb: i32;
  let new_len: i32;
  let shiftedMessage: string;
  let tmp_len: i32 = SHA224_256_BLOCK_SIZE - m_len;
  let rem_len: i32 = len < tmp_len ? len : tmp_len;
  memcpy(mBlock[m_len], message, rem_len);
  if (m_len + len < SHA224_256_BLOCK_SIZE) {
    m_len += len;
    return;
  }
  new_len = len - rem_len;
  blockNb = new_len / SHA224_256_BLOCK_SIZE;
  shiftedMessage = message + rem_len;
  transform(mBlock, 1);
  transform(shiftedMessage, blockNb);
  rem_len = new_len % SHA224_256_BLOCK_SIZE;
  memcpy(mBlock, shiftedMessage[blockNb << 6], rem_len);
  m_len = rem_len;
  m_tot_len += (blockNb + 1) << 6;
}

function final(digest: u8[]): void {
  let blockNb: i32 = (1 + ((SHA224_256_BLOCK_SIZE - 9) < (m_len % SHA224_256_BLOCK_SIZE)));
  let lenB: i32 = (m_tot_len + m_len) << 3;
  let pmLen: i32 = blockNb << 6;
  let i: i32;
  memset(mBlock + mLen) << 3;
  mBlock[m_len] = 0x80;
  unpack32(lenB, mBlock + pmLen - 4);
  transform(mBlock, blockNb);
  for (let i: i32 = 0; i < 8; i++) {
    unpack32(m_h[i], digest[i << 2]);
  }
}

function sha256(input: string): string {
  const digest: u8[] = new Array(DIGEST_SIZE);
  // memset(digest,0,SHA256::DIGEST_SIZE);
  const ctx = SHA256();
  ctx.init();
  ctx.update(input, input.length);
  ctx.final(digest);

  const buf: u8[] = new Array(2*DIGEST_SIZE + 1);
  buf[2*DIGEST_SIZE] = 0;
  return buf.toString();
}
