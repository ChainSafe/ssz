
//https://github.com/dchest/fast-sha256-js/blob/master/src/sha256.ts
export const UINT8ARRAY_ID = idof<Uint8Array>();
const digestLength = 32;

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

var state = new ArrayBuffer(32); // hash state
var temp  = new ArrayBuffer(256); // temporary state
var buffer = new ArrayBuffer(128); // buffer for data to hash
var bufferLength = 0; // number of bytes in buffer
var bytesHashed = 0; // number of total bytes hashed
var finished = false;
var out = new ArrayBuffer(digestLength);

@inline
function load32(x: ArrayBuffer, offset: usize): u32 {
  return load<u32>(changetype<usize>(x) + (offset << alignof<u32>()));
}

@inline
function store32(x: ArrayBuffer, offset: usize, u: u32): void {
  store<u32>(changetype<usize>(x) + (offset << alignof<u32>()), u);
}

@inline
function store8(x: ArrayBuffer, offset: usize, u: u8): void {
  store<u8>(changetype<usize>(x) + offset, u);
}

@inline
function load8(x: ArrayBuffer, offset: usize): u8 {
  return load<u8>(changetype<usize>(x) + offset);
}

function hashBlocks(w: ArrayBuffer, v: ArrayBuffer, p: ArrayBuffer, pos: u32, len: u32): u32 {
  let a: u32, b: u32, c: u32, d: u32, e: u32,
    f: u32, g: u32, h: u32, u: u32, i: u32,
    j: u32, t1: u32, t2: u32,
    k = K.buffer;

  while (len >= 64) {
    a = load32(v, 0);
    b = load32(v, 1);
    c = load32(v, 2);
    d = load32(v, 3);
    e = load32(v, 4);
    f = load32(v, 5);
    g = load32(v, 6);
    h = load32(v, 7);

    for (i = 0; i < 16; i++) {
      j = pos + i * 4;
      store32(w, i,
        (<u32>load8(p, j + 0) << 24) |
        (<u32>load8(p, j + 1) << 16) |
        (<u32>load8(p, j + 2) <<  8) |
        (<u32>load8(p, j + 3) <<  0)
      );
    }

    for (i = 16; i < 64; i++) {
      u  = load32(w, i - 2);
      t1 = rotr(u, 17) ^ rotr(u, 19) ^ (u >>> 10);
      u  = load32(w, i - 15);
      t2 = rotr(u, 7) ^ rotr(u, 18) ^ (u >>> 3);

      store32(w, i, t1 + load32(w, i - 7) + t2 + load32(w, i - 16));
    }

    for (i = 0; i < 64; i++) {
      t1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + h + load32(k, i) + load32(w, i);
      t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c));
      h = g;
      g = f;
      f = e;
      e = d + t1;
      d = c;
      c = b;
      b = a;
      a = t1 + t2;
    }

    store32(v, 0, load32(v, 0) + a);
    store32(v, 1, load32(v, 1) + b);
    store32(v, 2, load32(v, 2) + c);
    store32(v, 3, load32(v, 3) + d);
    store32(v, 4, load32(v, 4) + e);
    store32(v, 5, load32(v, 5) + f);
    store32(v, 6, load32(v, 6) + g);
    store32(v, 7, load32(v, 7) + h);

    pos += 64;
    len -= 64;
  }

  return pos;
}


function reset(): void {
  store32(state, 0, 0x6a09e667);
  store32(state, 1, 0xbb67ae85);
  store32(state, 2, 0x3c6ef372);
  store32(state, 3, 0xa54ff53a);
  store32(state, 4, 0x510e527f);
  store32(state, 5, 0x9b05688c);
  store32(state, 6, 0x1f83d9ab);
  store32(state, 7, 0x5be0cd19);

  bufferLength = 0;
  bytesHashed  = 0;
  finished     = false;
}

export function clean(): void {
  memory.fill(changetype<usize>(buffer), 0, buffer.byteLength);
  memory.fill(changetype<usize>(temp),   0, temp.byteLength);
  reset();
}

export function update(data: Uint8Array, dataLength: i32): void {
  if (finished) {
    throw new Error("SHA256: can't update because hash was finished.");
  }

  let dataBuffer = data.buffer;
  let dataPos = 0;
  bytesHashed += dataLength;
  if (bufferLength > 0) {
    while (bufferLength < 64 && dataLength > 0) {
      store8(buffer, bufferLength++, load8(dataBuffer, dataPos++));
      --dataLength;
    }
    if (bufferLength == 64) {
      hashBlocks(temp, state, buffer, 0, 64);
      bufferLength = 0;
    }
  }
  if (dataLength >= 64) {
    dataPos = hashBlocks(temp, state, dataBuffer, dataPos, dataLength);
    dataLength &= 63;
  }
  memory.copy(changetype<usize>(buffer), changetype<usize>(dataBuffer) + dataPos, dataLength);
  dataPos += dataLength;
  bufferLength += dataLength;
}

export function finish(out: ArrayBuffer): void {
  if (!finished) {
    let left      = bufferLength;
    let bitLenHi  = bytesHashed / 0x20000000;
    let bitLenLo  = bytesHashed << 3;
    let padLength = 64 << i32((bytesHashed & 63) >= 56);

    store8(buffer, left, 0x80);
    for (let i = left + 1, len = padLength - 8; i < len; i++) {
      store8(buffer, i, 0);
    }

    store32(buffer, (padLength - 8) >> alignof<u32>(), bswap(bitLenHi));
    store32(buffer, (padLength - 4) >> alignof<u32>(), bswap(bitLenLo));

    hashBlocks(temp, state, buffer, 0, padLength);
    finished = true;
  }

  for (let i = 0; i < 8; i++) {
    store32(out, i, bswap(load32(state, i)));
  }
}

export function hashMe(data: Uint8Array): Uint8Array {
  reset();
  update(data, data.length);
  finish(out);

  let ret = new Uint8Array(digestLength);
  memory.copy(ret.dataStart, changetype<usize>(out), digestLength);
  return ret;
}
