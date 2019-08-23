
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
function load32_be(x: ArrayBuffer, offset: isize): u32 {
  return load<u32>(changetype<usize>(x) + (offset << alignof<u32>()));
}

@inline
function store32_be(x: ArrayBuffer, offset: isize, u: u32): void {
  store<u32>(changetype<usize>(x) + (offset << alignof<u32>()), u);
}

@inline
function store8_be(x: ArrayBuffer, offset: isize, u: u8): void {
  store<u8>(changetype<usize>(x) + offset, u);
}

@inline
function load8_be(x: ArrayBuffer, offset: isize): u8 {
  return load<u8>(changetype<usize>(x) + offset);
}

function hashBlocks(w: ArrayBuffer, v: ArrayBuffer, p: ArrayBuffer, pos: u32, len: u32): u32 {
  let a: u32, b: u32, c: u32, d: u32, e: u32,
    f: u32, g: u32, h: u32, u: u32, i: u32,
    j: u32, t1: u32, t2: u32;

  while (len >= 64) {
    a = load32_be(v, 0);
    b = load32_be(v, 1);
    c = load32_be(v, 2);
    d = load32_be(v, 3);
    e = load32_be(v, 4);
    f = load32_be(v, 5);
    g = load32_be(v, 6);
    h = load32_be(v, 7);

    for (i = 0; i < 16; i++) {
      j = pos + i * 4;
      store32_be(w, i, (((<u32>load8_be(p, j) & 0xff) << 24) | ((<u32>load8_be(p, j + 1) & 0xff) << 16) |
        ((<u32>load8_be(p, j + 2) & 0xff) << 8) | (<u32>load8_be(p, j + 3) & 0xff)));
      // j = pos + i;
      //weird. i get memory access issues after a few runs
      // store32_be(w, i , load32_be(p,j));
    }

    for (i = 16; i < 64; i++) {
      u = load32_be(w, (i - 2) );
      t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10);

      u = load32_be(w, (i - 15) );
      t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3);

      store32_be(w, i, (t1 + load32_be(w, i - 7)) + (t2 + load32_be(w, i - 16)));
    }

    const k = K.buffer;
    for (i = 0; i < 64; i++) {
      t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
        (e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g)))) +
        ((h + ((load32_be(k, i) + load32_be(w, i ))))));

      t2 = (((a >>> 2 | a << (32 - 2)) ^ (a >>> 13 | a << (32 - 13)) ^
        (a >>> 22 | a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c)));

      h = g;
      g = f;
      f = e;
      e = d + t1;
      d = c;
      c = b;
      b = a;
      a = t1 + t2;
    }
    load32_be(v, 0);
    store32_be(v, 0, load32_be(v, 0) + a);
    store32_be(v, 1, load32_be(v, 1) + b);
    store32_be(v, 2, load32_be(v, 2) + c);
    store32_be(v, 3, load32_be(v, 3) + d);
    store32_be(v, 4, load32_be(v, 4) + e);
    store32_be(v, 5, load32_be(v, 5) + f);
    store32_be(v, 6, load32_be(v, 6) + g);
    store32_be(v, 7, load32_be(v, 7) + h);

    pos += 64;
    len -= 64;
  }

  return pos;
}


function reset(): void {
  // for (let i = 0; i < 32; i++) {
  //   store8_be(state, i, iv[i]);
  // }
  store32_be(state,  0, 0x6a09e667);
  store32_be(state,  4, 0xbb67ae85);
  store32_be(state,  8, 0x3c6ef372);
  store32_be(state, 12, 0xa54ff53a);
  store32_be(state, 16, 0x510e527f);
  store32_be(state, 20, 0x9b05688c);
  store32_be(state, 24, 0x1f83d9ab);
  store32_be(state, 28, 0x5be0cd19);

  bufferLength = 0;
  bytesHashed = 0;
  finished = false;
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

  let dataBuffer = new ArrayBuffer(dataLength);
  for(let i = 0 ; i < dataLength; i++){
    store8_be(dataBuffer, i, data[i]);
  }

  let dataPos = 0;
  bytesHashed += dataLength;
  if (bufferLength > 0) {
    while (bufferLength < 64 && dataLength > 0) {
      store8_be(buffer, bufferLength++, load8_be(dataBuffer, dataPos++));
      dataLength--;
    }
    if (bufferLength === 64) {
      hashBlocks(temp, state, buffer, 0, 64);
      bufferLength = 0;
    }
  }
  if (dataLength >= 64) {
    dataPos = hashBlocks(temp, state, dataBuffer, dataPos, dataLength);
    dataLength &= 63;
  }
  while (dataLength > 0) {
    store8_be(buffer, bufferLength++, load8_be(dataBuffer, dataPos++));
    dataLength--;
  }
}

export function finish(out: ArrayBuffer): void {
  if (!finished) {
    let left      = bufferLength;
    let bitLenHi  = bytesHashed / 0x20000000;
    let bitLenLo  = bytesHashed << 3;
    let padLength = (bytesHashed % 64 < 56) ? 64 : 128; // 64 << i32((bytesHashed & 63) >= 56);

    store8_be(buffer, left, 0x80);
    for (let i = left + 1, len = padLength - 8; i < len; i++) {
      store8_be(buffer, i, 0);
    }

    //store32_be(buffer, (padLength - 8) >> alignof<u32>(), bswap(bitLenHi));
    //store32_be(buffer, (padLength - 4) >> alignof<u32>(), bswap(bitLenLo));
    store8_be(buffer, padLength - 8, <u8>(bitLenHi >>> 24));
    store8_be(buffer, padLength - 7, <u8>(bitLenHi >>> 16));
    store8_be(buffer, padLength - 6, <u8>(bitLenHi >>>  8));
    store8_be(buffer, padLength - 5, <u8>(bitLenHi >>>  0));
    store8_be(buffer, padLength - 4, <u8>(bitLenLo >>> 24));
    store8_be(buffer, padLength - 3, <u8>(bitLenLo >>> 16));
    store8_be(buffer, padLength - 2, <u8>(bitLenLo >>>  8));
    store8_be(buffer, padLength - 1, <u8>(bitLenLo >>>  0));

    hashBlocks(temp, state, buffer, 0, padLength);
    finished = true;
  }

  for (let i = 0; i < 8; i++) {
    //let state_i = bswap<u32>(load32_be(state, i));
    //store32_be(out, i, state_i);

    let state_i = load32_be(state, i);
    store8_be(out, i * 4 + 0, <u8>(state_i >> 4));
    store8_be(out, i * 4 + 1, <u8>(state_i >> 6));
    store8_be(out, i * 4 + 2, <u8>(state_i >> 8));
    store8_be(out, i * 4 + 3, <u8>(state_i >> 0));
  }
}

export function hashMe(data: Uint8Array): Uint8Array {
  reset();
  update(data, data.length);
  finish(out);

  let ret = new Uint8Array(digestLength);
  for(let i = 0 ; i < digestLength ; i++){
    ret[i] = load8_be(out, i);
  }
  return ret;
}
