
//https://github.com/dchest/fast-sha256-js/blob/master/src/sha256.ts
import "allocator/arena"
export { memory };

type Byte = u8;
type Word = u32
const digestLength: u32 = 32;

const K: Word[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]

@unmanaged
class CTX {
  public state: Int32Array; // hash state
  public temp: Int32Array; // temporary state
  public buffer: Uint8Array; // buffer for data to hash
  public bufferLength: u32 = 0; // number of bytes in buffer
  public bytesHashed: u32 = 0; // number of total bytes hashed 
  public finished: bool = false;

  constructor() {
    this.state = new Int32Array(8);
    this.temp = new Int32Array(64);
    this.buffer = new Uint8Array(128);
  }
}

var ctx: CTX = new CTX();

function hashBlocks(w: Int32Array, v: Int32Array, p: Uint8Array, pos: i32, len: i32): i32 {
  let a: i32, b: i32, c: i32, d: i32, e: i32,
    f: i32, g: i32, h: i32, u: i32, i: i32,
    j: i32, t1: i32, t2: i32;
  while (len >= 64) {
    a = v[0];
    b = v[1];
    c = v[2];
    d = v[3];
    e = v[4];
    f = v[5];
    g = v[6];
    h = v[7];

    for (i = 0; i < 16; i++) {
      j = pos + i * 4;
      w[i] = (((<i32>p[j] & 0xff) << 24) | ((<i32>p[j + 1] & 0xff) << 16) |
        ((<i32>p[j + 2] & 0xff) << 8) | (<i32>p[j + 3] & 0xff));
    }

    for (i = 16; i < 64; i++) {
      u = w[i - 2];
      t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10);

      u = w[i - 15];
      t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3);

      w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
    }

    for (i = 0; i < 64; i++) {
      t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
        (e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g))) | 0) +
        ((h + ((K[i] + w[i]) | 0)) | 0)) | 0;

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

    v[0] += a;
    v[1] += b;
    v[2] += c;
    v[3] += d;
    v[4] += e;
    v[5] += f;
    v[6] += g;
    v[7] += h;

    pos += 64;
    len -= 64;
  }
  return pos;
}

// export function init(): CTX {
//   let ctx: CTX = new CTX();
//   reset(ctx);
//   return ctx;
// }

function reset(): void {
  ctx.state[0] = 0x6a09e667;
  ctx.state[1] = 0xbb67ae85;
  ctx.state[2] = 0x3c6ef372;
  ctx.state[3] = 0xa54ff53a;
  ctx.state[4] = 0x510e527f;
  ctx.state[5] = 0x9b05688c;
  ctx.state[6] = 0x1f83d9ab;
  ctx.state[7] = 0x5be0cd19;
  ctx.bufferLength = 0;
  ctx.bytesHashed = 0;
  ctx.finished = false;
}

function clean(): void {
  for (let i = 0; i < ctx.buffer.length; i++) {
    ctx.buffer[i] = 0;
  }
  for (let i = 0; i < ctx.temp.length; i++) {
    ctx.temp[i] = 0;
  }
  reset();
}

export function update( data: Uint8Array, dataLength: i32): void {
  if (ctx.finished) {
    throw new Error("SHA256: can't update because hash was finished.");
  }
  let dataPos = 0;
  ctx.bytesHashed += dataLength;
  if (ctx.bufferLength > 0) {
    while (ctx.bufferLength < 64 && dataLength > 0) {
      ctx.buffer[ctx.bufferLength++] = data[dataPos++];
      dataLength--;
    }
    if (ctx.bufferLength === 64) {
      hashBlocks(ctx.temp, ctx.state, ctx.buffer, 0, 64);
      ctx.bufferLength = 0;
    }
  }
  if (dataLength >= 64) {
    dataPos = hashBlocks(ctx.temp, ctx.state, data, dataPos, dataLength);
    dataLength %= 64;
  }
  while (dataLength > 0) {
    ctx.buffer[ctx.bufferLength++] = data[dataPos++];
    dataLength--;
  }
}

export function finish( out: Uint8Array): void {
  if (!ctx.finished) {
    let bytesHashed = ctx.bytesHashed;
    let left = ctx.bufferLength;
    let bitLenHi = (bytesHashed / 0x20000000) | 0;
    let bitLenLo = bytesHashed << 3;
    let padLength = (bytesHashed % 64 < 56) ? 64 : 128;

    ctx.buffer[left] = 0x80;
    for (let i: i32 = left + 1; i < padLength - 8; i++) {
      ctx.buffer[i] = 0;
    }
    ctx.buffer[padLength - 8] = (bitLenHi >>> 24) & 0xff;
    ctx.buffer[padLength - 7] = (bitLenHi >>> 16) & 0xff;
    ctx.buffer[padLength - 6] = (bitLenHi >>> 8) & 0xff;
    ctx.buffer[padLength - 5] = (bitLenHi >>> 0) & 0xff;
    ctx.buffer[padLength - 4] = (bitLenLo >>> 24) & 0xff;
    ctx.buffer[padLength - 3] = (bitLenLo >>> 16) & 0xff;
    ctx.buffer[padLength - 2] = (bitLenLo >>> 8) & 0xff;
    ctx.buffer[padLength - 1] = (bitLenLo >>> 0) & 0xff;

    hashBlocks(ctx.temp, ctx.state, ctx.buffer, 0, padLength);

    ctx.finished = true;
  }

  for (let i = 0; i < 8; i++) {
    out[i * 4 + 0] = (ctx.state[i] >>> 24) & 0xff;
    out[i * 4 + 1] = (ctx.state[i] >>> 16) & 0xff;
    out[i * 4 + 2] = (ctx.state[i] >>> 8) & 0xff;
    out[i * 4 + 3] = (ctx.state[i] >>> 0) & 0xff;
  }
}

export function hashMe(data: Uint8Array): Uint8Array{
  clean();
  let out: Uint8Array = new Uint8Array(digestLength);
  update(data, data.length);
  finish(out);
  return out;
}
