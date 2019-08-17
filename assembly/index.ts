
//https://github.com/dchest/fast-sha256-js/blob/master/src/sha256.ts
export const UINT8ARRAY_ID = idof<Uint8Array>();
type Byte = u8;
type Word = u32
const digestLength: u32 = 32;

const k: u8[] = [
  0x42, 0x8a, 0x2f, 0x98, 0x71, 0x37, 0x44, 0x91, 0xb5, 0xc0, 0xfb, 0xcf, 0xe9, 0xb5, 0xdb, 0xa5, 0x39, 0x56, 0xc2, 0x5b, 0x59, 0xf1, 0x11, 0xf1, 0x92, 0x3f, 0x82, 0xa4, 0xab, 0x1c, 0x5e, 0xd5,
  0xd8, 0x07, 0xaa, 0x98, 0x12, 0x83, 0x5b, 0x01, 0x24, 0x31, 0x85, 0xbe, 0x55, 0x0c, 0x7d, 0xc3, 0x72, 0xbe, 0x5d, 0x74, 0x80, 0xde, 0xb1, 0xfe, 0x9b, 0xdc, 0x06, 0xa7, 0xc1, 0x9b, 0xf1, 0x74,
  0xe4, 0x9b, 0x69, 0xc1, 0xef, 0xbe, 0x47, 0x86, 0x0f, 0xc1, 0x9d, 0xc6, 0x24, 0x0c, 0xa1, 0xcc, 0x2d, 0xe9, 0x2c, 0x6f, 0x4a, 0x74, 0x84, 0xaa, 0x5c, 0xb0, 0xa9, 0xdc, 0x76, 0xf9, 0x88, 0xda,
  0x98, 0x3e, 0x51, 0x52, 0xa8, 0x31, 0xc6, 0x6d, 0xb0, 0x03, 0x27, 0xc8, 0xbf, 0x59, 0x7f, 0xc7, 0xc6, 0xe0, 0x0b, 0xf3, 0xd5, 0xa7, 0x91, 0x47, 0x06, 0xca, 0x63, 0x51, 0x14, 0x29, 0x29, 0x67,
  0x27, 0xb7, 0x0a, 0x85, 0x2e, 0x1b, 0x21, 0x38, 0x4d, 0x2c, 0x6d, 0xfc, 0x53, 0x38, 0x0d, 0x13, 0x65, 0x0a, 0x73, 0x54, 0x76, 0x6a, 0x0a, 0xbb, 0x81, 0xc2, 0xc9, 0x2e, 0x92, 0x72, 0x2c, 0x85,
  0xa2, 0xbf, 0xe8, 0xa1, 0xa8, 0x1a, 0x66, 0x4b, 0xc2, 0x4b, 0x8b, 0x70, 0xc7, 0x6c, 0x51, 0xa3, 0xd1, 0x92, 0xe8, 0x19, 0xd6, 0x99, 0x06, 0x24, 0xf4, 0x0e, 0x35, 0x85, 0x10, 0x6a, 0xa0, 0x70,
  0x19, 0xa4, 0xc1, 0x16, 0x1e, 0x37, 0x6c, 0x08, 0x27, 0x48, 0x77, 0x4c, 0x34, 0xb0, 0xbc, 0xb5, 0x39, 0x1c, 0x0c, 0xb3, 0x4e, 0xd8, 0xaa, 0x4a, 0x5b, 0x9c, 0xca, 0x4f, 0x68, 0x2e, 0x6f, 0xf3,
  0x74, 0x8f, 0x82, 0xee, 0x78, 0xa5, 0x63, 0x6f, 0x84, 0xc8, 0x78, 0x14, 0x8c, 0xc7, 0x02, 0x08, 0x90, 0xbe, 0xff, 0xfa, 0xa4, 0x50, 0x6c, 0xeb, 0xbe, 0xf9, 0xa3, 0xf7, 0xc6, 0x71, 0x78, 0xf2
]

let iv: u8[] =[
  0x6a, 0x09, 0xe6, 0x67,
  0xbb, 0x67, 0xae, 0x85,
  0x3c, 0x6e, 0xf3, 0x72,
  0xa5, 0x4f, 0xf5, 0x3a, 
  0x51, 0x0e, 0x52, 0x7f,
  0x9b, 0x05, 0x68, 0x8c,
  0x1f, 0x83, 0xd9, 0xab,
  0x5b, 0xe0, 0xcd, 0x19 
] 

var state: ArrayBuffer = new ArrayBuffer(32); // hash state
var temp: ArrayBuffer  = new ArrayBuffer(256); // temporary state
var buffer: ArrayBuffer = new ArrayBuffer(128); // buffer for data to hash
var bufferLength: u32 = 0; // number of bytes in buffer
var bytesHashed: u32 = 0; // number of total bytes hashed 
var finished: bool = false;
var out: ArrayBuffer = new ArrayBuffer(digestLength)
var K: ArrayBuffer = new ArrayBuffer (256);

@inline
function load32_be(x: ArrayBuffer, offset: isize): u32 {
  return bswap(load<u32>(changetype<usize>(x) + (offset << alignof<u32>())));
}
@inline
function store32_be(x: ArrayBuffer, offset: isize, u: u32): void {
  store<u32>(changetype<usize>(x) + (offset << alignof<u32>()), bswap(u));
}
@inline
function store8_be(x: ArrayBuffer, offset: isize, u: u8): void {
  store<u8>(changetype<usize>(x) + offset, bswap(u));
}
@inline
function load8_be(x: ArrayBuffer, offset: isize): u8 {
  return bswap<u8>(load<u8>(changetype<usize>(x) + offset));
}

//Convert k to ArrayBuffers
for(let i: i32 = 0 ; i < k.length ; i++){
  store8_be(K, i, k[i])
}




function hashBlocks(w: ArrayBuffer, v: ArrayBuffer, p: ArrayBuffer, pos: u32, len: u32): u32 {
  let a: u32, b: u32, c: u32, d: u32, e: u32,
    f: u32, g: u32, h: u32, u: u32, i: u32,
    j: u32, t1: u32, t2: u32;
  while (len >= 64) {
    a = load32_be(v, 0);
    b = load32_be(v, 1)
    c = load32_be(v, 2)
    d = load32_be(v, 3)
    e = load32_be(v, 4)
    f = load32_be(v, 5)
    g = load32_be(v, 6)
    h = load32_be(v, 7)

    for (i = 0; i < 16; i++) {
      j = pos + i * 4;
      store32_be(w, i , (((<u32>load8_be(p, j) & 0xff) << 24) | ((<u32>load8_be(p, j+1) & 0xff) << 16) |
        ((<u32>load8_be(p, j+2) & 0xff) << 8) | (<u32>load8_be(p, j+3) & 0xff)))
    }

    for (i = 16; i < 64; i++) {
      u = load32_be(w, (i - 2) );
      t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10);

      u = load32_be(w, (i - 15) );
      t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3);

      store32_be(w, i   , (t1 + load32_be(w, (i - 7) ) | 0) + (t2 + load32_be(w, (i - 16) )) | 0);
    }

    for (i = 0; i < 64; i++) {
      t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
        (e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g))) | 0) +
        ((h + (( load32_be(K, i) + load32_be(w, i )) | 0)) | 0)) | 0;

      t2 = (((a >>> 2 | a << (32 - 2)) ^ (a >>> 13 | a << (32 - 13)) ^
        (a >>> 22 | a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    load32_be(v,0  )
    store32_be(v, 0  , load32_be(v, 0  ) + a);
    store32_be(v, 1  , load32_be(v, 1  ) + b);
    store32_be(v, 2  , load32_be(v, 2  ) + c);
    store32_be(v, 3  , load32_be(v, 3  ) + d);
    store32_be(v, 4  , load32_be(v, 4  ) + e);
    store32_be(v, 5  , load32_be(v, 5  ) + f);
    store32_be(v, 6  , load32_be(v, 6  ) + g);
    store32_be(v, 7  , load32_be(v, 7  ) + h);

    pos += 64;
    len -= 64;
  }
  return pos;
}


function reset(): void {
  for (let i = 0; i < 32; i++) {
    store8_be(state, i, iv[i])
}
  bufferLength = 0;
  bytesHashed = 0;
  finished = false;
}

function clean(): void {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = 0;
  }
  for (let i = 0; i < temp.length; i++) {
    temp[i] = 0;
  }
  reset();
}

export function update( data: Uint8Array, dataLength: u32): void {
  if (finished) {
    throw new Error("SHA256: can't update because hash was finished.");
  }

  let dataBuffer: ArrayBuffer = new ArrayBuffer(dataLength);
  for(let i: u32 = 0 ; i < dataLength ; i++){
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
    dataLength %= 64;
  }
  while (dataLength > 0) {
    store8_be(buffer, bufferLength++, load8_be(dataBuffer, dataPos++));
    dataLength--;
  }
}

export function finish(out: ArrayBuffer): void {
  if (!finished) {
    let bytesHashed = bytesHashed;
    let left = bufferLength;
    let bitLenHi = (bytesHashed / 0x20000000) | 0;
    let bitLenLo = bytesHashed << 3;
    let padLength = (bytesHashed % 64 < 56) ? 64 : 128;

    store8_be(buffer, left, 0x80);
    for (let i: i32 = left + 1; i < padLength - 8; i++) {
      store8_be(buffer, i, 0);
    }

    store32_be(buffer, (padLength-8) >> alignof<u32>() , bitLenHi)
    store32_be(buffer, padLength-4 >> alignof<u32>(), bitLenLo)

    hashBlocks(temp, state, buffer, 0, padLength);

    finished = true;
  }

  for (let i = 0; i < 8; i++) {
    let state_i: u32 = load32_be(state, i );
    store32_be(out, i , state_i)
  }
}

export function hashMe(data: Uint8Array): Uint8Array{
  reset();
  update(data, data.length);
  finish(out);
  let ret: Uint8Array = new Uint8Array(digestLength);
  for(let i: u32 = 0 ; i < digestLength ; i++){
    ret[i] = load8_be(out, i)
  }
  return ret;
}
