// copied from as-sha256

// constants used in the SHA256 compression function
const K: [u32; 64] = [
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


//precomputed W + K for message block representing length 64 bytes for fixed input of 64 bytes for digest64
const W64: [u32; 64] = [
  0xc28a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf374,
  0x649b69c1, 0xf0fe4786, 0x0fe1edc6, 0x240cf254,
  0x4fe9346f, 0x6cc984be, 0x61b9411e, 0x16f988fa,
  0xf2c65152, 0xa88e5a6d, 0xb019fc65, 0xb9d99ec7,
  0x9a1231c3, 0xe70eeaa0, 0xfdb1232b, 0xc7353eb0,
  0x3069bad5, 0xcb976d5f, 0x5a0f118f, 0xdc1eeefd,
  0x0a35b689, 0xde0b7a04, 0x58f4ca9d, 0xe15d5b16,
  0x007f3e86, 0x37088980, 0xa507ea32, 0x6fab9537,
  0x17406110, 0x0d8cd6f1, 0xcdaa3b6d, 0xc0bbbe37,
  0x83613bda, 0xdb48a363, 0x0b02e931, 0x6fd15ca7,
  0x521afaca, 0x31338431, 0x6ed41a95, 0x6d437890,
  0xc39c91f2, 0x9eccabbd, 0xb5c9a0e6, 0x532fb63c,
  0xd2c741c6, 0x07237ea3, 0xa4954b68, 0x4c191d76,
];

// intermediate hash values
static mut H: [u32; 8] = [0; 8];

// hash registers
static mut R: [u32; 8] = [0; 8];
static mut T1: u32 = 0;
static mut T2: u32 = 0;

// 16 32bit message blocks
static mut M: [u32; 16] = [0; 16];

// 64 32bit extended message blocks
static mut W: [u32; 64] = [0; 64];

#[inline]
fn ch(x: u32, y: u32, z: u32) -> u32 {
  (x & y) ^ ((!x) & z)
}

#[inline]
fn maj(x: u32, y: u32, z: u32) -> u32 {
  (x & y) ^ (x & z) ^ (y & z)
}

#[inline]
fn ep0(x: u32) -> u32 {
  x.rotate_right(2) ^ x.rotate_right(13) ^ x.rotate_right(22)
}

#[inline]
fn ep1(x: u32) -> u32 {
  x.rotate_right(6) ^ x.rotate_right(11) ^ x.rotate_right(25)
}

#[inline]
fn sig0(x: u32) -> u32 {
  x.rotate_right(7) ^ x.rotate_right(18) ^ (x >> 3)
}

#[inline]
fn sig1(x: u32) -> u32 {
  x.rotate_right(17) ^ x.rotate_right(19) ^ (x >> 10)
}

#[inline]
fn load_blocks(a: [u32; 8], b: [u32; 8]) {
  for t in 0..8 {
    unsafe {
      M[t] = a[t];
      M[t + 8] = b[t];
    }
  }
}

#[inline]
fn expand_blocks() {
  for t in 16..64 {
    unsafe {
      W[t] = sig1(W[t - 2]) + W[t - 7] + sig0(W[t - 15]) + W[t - 16];
    }
  }
}

#[inline]
fn sha256_round(k: u32, w: u32) {
  unsafe {
    T1 = R[7] + ep1(R[4]) + ch(R[4], R[5], R[6]) + k + w;
    T2 = ep0(R[0]) + maj(R[0], R[1], R[2]);
    R[7] = R[6];
    R[6] = R[5];
    R[5] = R[4];
    R[4] = R[3] + T1;
    R[3] = R[2];
    R[2] = R[1];
    R[1] = R[0];
    R[0] = T1 + T2;
  }
}

fn hash_blocks(a: [u32; 8], b: [u32; 8]) {
  unsafe {
    for t in 0..8 {
      R[t] = H[t];
    }

    load_blocks(a, b);
    expand_blocks();

    for t in 0..64 {
      sha256_round(K[t], W[t]);
    }

    for t in 0..8 {
      H[t] += R[t];
    }
  }
}

fn hash_w64() {
  unsafe {
    for t in 0..8 {
      R[t] = H[t];
    }

    for t in 0..64 {
      sha256_round(0, W64[t]);
    }

    for t in 0..8 {
      H[t] += R[t];
    }
  }
}

fn init() {
  unsafe {
    H[0] = 0x6a09e667;
    H[1] = 0xbb67ae85;
    H[2] = 0x3c6ef372;
    H[3] = 0xa54ff53a;
    H[4] = 0x510e527f;
    H[5] = 0x9b05688c;
    H[6] = 0x1f83d9ab;
    H[7] = 0x5be0cd19;
  }
}

pub fn digest_64(a: [u32; 8], b: [u32; 8], out: &mut [u32; 8]) {
  init();
  hash_blocks(a, b);
  hash_w64();

  unsafe {
    out[0] = H[0].to_be();
    out[1] = H[1].to_be();
    out[2] = H[2].to_be();
    out[3] = H[3].to_be();
    out[4] = H[4].to_be();
    out[5] = H[5].to_be();
    out[6] = H[6].to_be();
    out[7] = H[7].to_be();
  }
}
