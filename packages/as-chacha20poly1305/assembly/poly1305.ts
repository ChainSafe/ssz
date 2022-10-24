import {DATA_CHUNK_LENGTH, KEY_LENGTH, TAG_LENGTH} from "../common/const";
import {load8, store8, load16, store16, wipe8, wipe16} from "./util";

// to debug
const debugArr = new Uint32Array(64);
export const debug = debugArr.buffer;

export const POLY1305_INPUT_LENGTH = DATA_CHUNK_LENGTH;
export const poly1305Key = new ArrayBuffer(KEY_LENGTH);
export const poly1305Input = new ArrayBuffer(POLY1305_INPUT_LENGTH);
export const poly1305Output = new ArrayBuffer(TAG_LENGTH);
export const poly1305KeyPtr = changetype<usize>(poly1305Key);
export const poly1305InputPtr = changetype<usize>(poly1305Input);
export const poly1305OutputPtr = changetype<usize>(poly1305Output);

export function poly1305Init(): void {
  init(poly1305KeyPtr);
}

export function poly1305Update(dataLength: u32): void {
  update(poly1305InputPtr, dataLength);
}

/**
 * The 16 byte output is set to poly1305OutputPtr
 */
export function poly1305Digest(): void {
  digest(poly1305OutputPtr);
  clean();
}

const _bufferBuffer = new ArrayBuffer(16);
const _buffer = changetype<usize>(_bufferBuffer);
// equivalent to new Uint16Array(10);
const _rBuffer = new ArrayBuffer(20);
const _r = changetype<usize>(_rBuffer);
// equivalent to new Uint16Array(10);
const _hBuffer = new ArrayBuffer(20);
const _h = changetype<usize>(_hBuffer);
// equivalent to new Uint16Array(8);
const _padBuffer = new ArrayBuffer(16);
const _pad = changetype<usize>(_padBuffer);
let _leftover: u32 = 0;
let _fin: u8 = 0;
let _finished = false;
// temporary variable in finish function, init here to avoid the memory growing
// equivalent to new Uint16Array(10);
const tempGBuffer = new ArrayBuffer(20);
const tempG = changetype<usize>(tempGBuffer);

/**
 * KeyArr is set externally, we initialize other params from keyArr.
 */
function init(key: usize): void {
  const t0 = u16(load8(key, 0)) | (u16(load8(key, 1)) << 8);
  store16(_r, 0, t0 & 0x1fff);
  const t1 = u16(load8(key, 2)) | (u16(load8(key, 3)) << 8);
  store16(_r, 1, ((t0 >>> 13) | (t1 << 3)) & 0x1fff);
  const t2 = u16(load8(key, 4)) | (u16(load8(key, 5)) << 8);
  store16(_r, 2, ((t1 >>> 10) | (t2 << 6)) & 0x1f03);
  const t3 = u16(load8(key, 6)) | (u16(load8(key, 7)) << 8);
  store16(_r, 3, ((t2 >>> 7) | (t3 << 9)) & 0x1fff);
  const t4 = u16(load8(key, 8)) | (u16(load8(key, 9)) << 8);
  store16(_r, 4, ((t3 >>> 4) | (t4 << 12)) & 0x00ff);
  store16(_r, 5, (t4 >>> 1) & 0x1ffe);
  const t5 = u16(load8(key, 10)) | (u16(load8(key, 11)) << 8);
  store16(_r, 6, ((t4 >>> 14) | (t5 << 2)) & 0x1fff);
  const t6 = u16(load8(key, 12)) | (u16(load8(key, 13)) << 8);
  store16(_r, 7, ((t5 >>> 11) | (t6 << 5)) & 0x1f81);
  const t7 = u16(load8(key, 14)) | (u16(load8(key, 15)) << 8);
  store16(_r, 8, ((t6 >>> 8) | (t7 << 8)) & 0x1fff);
  store16(_r, 9, (t7 >>> 5) & 0x007f);

  store16(_pad, 0, u16(load8(key, 16)) | (u16(load8(key, 17)) << 8));
  store16(_pad, 1, u16(load8(key, 18)) | (u16(load8(key, 19)) << 8));
  store16(_pad, 2, u16(load8(key, 20)) | (u16(load8(key, 21)) << 8));
  store16(_pad, 3, u16(load8(key, 22)) | (u16(load8(key, 23)) << 8));
  store16(_pad, 4, u16(load8(key, 24)) | (u16(load8(key, 25)) << 8));
  store16(_pad, 5, u16(load8(key, 26)) | (u16(load8(key, 27)) << 8));
  store16(_pad, 6, u16(load8(key, 28)) | (u16(load8(key, 29)) << 8));
  store16(_pad, 7, u16(load8(key, 30)) | (u16(load8(key, 31)) << 8));
}

/** m: a pointer to Uint8Array */
function _blocks(m: usize, mpos: u32, bytes: u32): void {
  const hibit: u16 = _fin ? 0 : 1 << 11;

  let h0: u32 = load16(_h, 0),
    h1: u32 = load16(_h, 1),
    h2: u32 = load16(_h, 2),
    h3: u32 = load16(_h, 3),
    h4: u32 = load16(_h, 4),
    h5: u32 = load16(_h, 5),
    h6: u32 = load16(_h, 6),
    h7: u32 = load16(_h, 7),
    h8: u32 = load16(_h, 8),
    h9: u32 = load16(_h, 9);

  const r0: u32 = load16(_r, 0),
    r1: u32 = load16(_r, 1),
    r2: u32 = load16(_r, 2),
    r3: u32 = load16(_r, 3),
    r4: u32 = load16(_r, 4),
    r5: u32 = load16(_r, 5),
    r6: u32 = load16(_r, 6),
    r7: u32 = load16(_r, 7),
    r8: u32 = load16(_r, 8),
    r9: u32 = load16(_r, 9);

  while (bytes >= 16) {
    const t0: u16 = u16(load8(m, mpos + 0)) | (u16(load8(m, mpos + 1)) << 8);
    h0 += t0 & 0x1fff;
    const t1: u16 = u16(load8(m, mpos + 2)) | (u16(load8(m, mpos + 3)) << 8);
    h1 += ((t0 >>> 13) | (t1 << 3)) & 0x1fff;
    const t2: u16 = u16(load8(m, mpos + 4)) | (u16(load8(m, mpos + 5)) << 8);
    h2 += ((t1 >>> 10) | (t2 << 6)) & 0x1fff;
    const t3: u16 = u16(load8(m, mpos + 6)) | (u16(load8(m, mpos + 7)) << 8);
    h3 += ((t2 >>> 7) | (t3 << 9)) & 0x1fff;
    const t4: u16 = u16(load8(m, mpos + 8)) | (u16(load8(m, mpos + 9)) << 8);
    h4 += ((t3 >>> 4) | (t4 << 12)) & 0x1fff;
    h5 += (t4 >>> 1) & 0x1fff;
    const t5: u16 = u16(load8(m, mpos + 10)) | (u16(load8(m, mpos + 11)) << 8);
    h6 += ((t4 >>> 14) | (t5 << 2)) & 0x1fff;
    const t6: u16 = u16(load8(m, mpos + 12)) | (u16(load8(m, mpos + 13)) << 8);
    h7 += ((t5 >>> 11) | (t6 << 5)) & 0x1fff;
    const t7: u16 = u16(load8(m, mpos + 14)) | (u16(load8(m, mpos + 15)) << 8);
    h8 += ((t6 >>> 8) | (t7 << 8)) & 0x1fff;
    h9 += (t7 >>> 5) | hibit;

    let c: u32 = 0;

    let d0: u32 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = d0 >>> 13;
    d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += d0 >>> 13;
    d0 &= 0x1fff;

    let d1: u32 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = d1 >>> 13;
    d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += d1 >>> 13;
    d1 &= 0x1fff;

    let d2: u32 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = d2 >>> 13;
    d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += d2 >>> 13;
    d2 &= 0x1fff;

    let d3: u32 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = d3 >>> 13;
    d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += d3 >>> 13;
    d3 &= 0x1fff;

    let d4: u32 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = d4 >>> 13;
    d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += d4 >>> 13;
    d4 &= 0x1fff;

    let d5: u32 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = d5 >>> 13;
    d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += d5 >>> 13;
    d5 &= 0x1fff;

    let d6: u32 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = d6 >>> 13;
    d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += d6 >>> 13;
    d6 &= 0x1fff;

    let d7: u32 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = d7 >>> 13;
    d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += d7 >>> 13;
    d7 &= 0x1fff;

    let d8: u32 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = d8 >>> 13;
    d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += d8 >>> 13;
    d8 &= 0x1fff;

    let d9: u32 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = d9 >>> 13;
    d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += d9 >>> 13;
    d9 &= 0x1fff;

    c = ((c << 2) + c) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = c >>> 13;
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }

  store16(_h, 0, u16(h0));
  store16(_h, 1, u16(h1));
  store16(_h, 2, u16(h2));
  store16(_h, 3, u16(h3));
  store16(_h, 4, u16(h4));
  store16(_h, 5, u16(h5));
  store16(_h, 6, u16(h6));
  store16(_h, 7, u16(h7));
  store16(_h, 8, u16(h8));
  store16(_h, 9, u16(h9));
}

function finish(mac: usize, macpos: u32 = 0): void {
  // const g = new Uint16Array(10);
  let c: u16;
  let mask: u16;
  let f: u32;
  let i: u32;

  if (_leftover) {
    i = _leftover;
    store8(_buffer, i, 1);
    i++;
    for (; i < 16; i++) {
      store8(_buffer, i, 0);
    }
    _fin = 1;
    _blocks(_buffer, 0, 16);
  }

  c = load16(_h, 1) >>> 13;
  store16(_h, 1, load16(_h, 1) & 0x1fff);
  for (i = 2; i < 10; i++) {
    store16(_h, i, load16(_h, i) + c);
    c = load16(_h, i) >>> 13;
    store16(_h, i, load16(_h, i) & 0x1fff);
  }
  store16(_h, 0, load16(_h, 0) + c * 5);
  c = load16(_h, 0) >>> 13;
  store16(_h, 0, load16(_h, 0) & 0x1fff);
  store16(_h, 1, load16(_h, 1) + c);
  c = load16(_h, 1) >>> 13;
  store16(_h, 1, load16(_h, 1) & 0x1fff);
  store16(_h, 2, load16(_h, 2) + c);

  store16(tempG, 0, load16(_h, 0) + 5);
  c = load16(tempG, 0) >>> 13;
  store16(tempG, 0, load16(tempG, 0) & 0x1fff);
  for (i = 1; i < 10; i++) {
    store16(tempG, i, load16(_h, i) + c);
    c = load16(tempG, i) >>> 13;
    store16(tempG, i, load16(tempG, i) & 0x1fff);
  }
  store16(tempG, 9, load16(tempG, 9) - (1 << 13));

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) {
    store16(tempG, i, load16(tempG, i) & mask);
  }
  mask = ~mask;
  for (i = 0; i < 10; i++) {
    store16(_h, i, (load16(_h, i) & mask) | load16(tempG, i));
  }

  // _h[0] = (_h[0] | (_h[1] << 13)) & 0xffff;
  store16(_h, 0, (load16(_h, 0) | (load16(_h, 1) << 13)) & 0xffff);
  // _h[1] = ((_h[1] >>> 3) | (_h[2] << 10)) & 0xffff;
  store16(_h, 1, ((load16(_h, 1) >>> 3) | (load16(_h, 2) << 10)) & 0xffff);
  // _h[2] = ((_h[2] >>> 6) | (_h[3] << 7)) & 0xffff;
  store16(_h, 2, ((load16(_h, 2) >>> 6) | (load16(_h, 3) << 7)) & 0xffff);
  // _h[3] = ((_h[3] >>> 9) | (_h[4] << 4)) & 0xffff;
  store16(_h, 3, ((load16(_h, 3) >>> 9) | (load16(_h, 4) << 4)) & 0xffff);
  // _h[4] = ((_h[4] >>> 12) | (_h[5] << 1) | (_h[6] << 14)) & 0xffff;
  store16(_h, 4, ((load16(_h, 4) >>> 12) | (load16(_h, 5) << 1) | (load16(_h, 6) << 14)) & 0xffff);
  // _h[5] = ((_h[6] >>> 2) | (_h[7] << 11)) & 0xffff;
  store16(_h, 5, ((load16(_h, 6) >>> 2) | (load16(_h, 7) << 11)) & 0xffff);
  // _h[6] = ((_h[7] >>> 5) | (_h[8] << 8)) & 0xffff;
  store16(_h, 6, ((load16(_h, 7) >>> 5) | (load16(_h, 8) << 8)) & 0xffff);
  // _h[7] = ((_h[8] >>> 8) | (_h[9] << 5)) & 0xffff;
  store16(_h, 7, ((load16(_h, 8) >>> 8) | (load16(_h, 9) << 5)) & 0xffff);
  // f = u32(_h[0]) + u32(_pad[0]);
  f = u32(load16(_h, 0)) + u32(load16(_pad, 0));
  store16(_h, 0, u16(f & 0xffff));
  for (i = 1; i < 8; i++) {
    // f = (((u32(_h[i]) + u32(_pad[i])) | 0) + (f >>> 16)) | 0;
    f = (((u32(load16(_h, i)) + u32(load16(_pad, i))) | 0) + (f >>> 16)) | 0;
    // _h[i] = f & 0xffff;
    store16(_h, i, u16(f & 0xffff));
  }

  // mac[macpos + 0] = _h[0] >>> 0;
  store8(mac, macpos + 0, u8(load16(_h, 0) >>> 0));
  // mac[macpos + 1] = _h[0] >>> 8;
  store8(mac, macpos + 1, u8(load16(_h, 0) >>> 8));
  // mac[macpos + 2] = _h[1] >>> 0;
  store8(mac, macpos + 2, u8(load16(_h, 1) >>> 0));
  // mac[macpos + 3] = _h[1] >>> 8;
  store8(mac, macpos + 3, u8(load16(_h, 1) >>> 8));
  // mac[macpos + 4] = _h[2] >>> 0;
  store8(mac, macpos + 4, u8(load16(_h, 2) >>> 0));
  // mac[macpos + 5] = _h[2] >>> 8;
  store8(mac, macpos + 5, u8(load16(_h, 2) >>> 8));
  // mac[macpos + 6] = _h[3] >>> 0;
  store8(mac, macpos + 6, u8(load16(_h, 3) >>> 0));
  // mac[macpos + 7] = _h[3] >>> 8;
  store8(mac, macpos + 7, u8(load16(_h, 3) >>> 8));
  // mac[macpos + 8] = _h[4] >>> 0;
  store8(mac, macpos + 8, u8(load16(_h, 4) >>> 0));
  // mac[macpos + 9] = _h[4] >>> 8;
  store8(mac, macpos + 9, u8(load16(_h, 4) >>> 8));
  // mac[macpos + 10] = _h[5] >>> 0;
  store8(mac, macpos + 10, u8(load16(_h, 5) >>> 0));
  // mac[macpos + 11] = _h[5] >>> 8;
  store8(mac, macpos + 11, u8(load16(_h, 5) >>> 8));
  // mac[macpos + 12] = _h[6] >>> 0;
  store8(mac, macpos + 12, u8(load16(_h, 6) >>> 0));
  // mac[macpos + 13] = _h[6] >>> 8;
  store8(mac, macpos + 13, u8(load16(_h, 6) >>> 8));
  // mac[macpos + 14] = _h[7] >>> 0;
  store8(mac, macpos + 14, u8(load16(_h, 7) >>> 0));
  // mac[macpos + 15] = _h[7] >>> 8;
  store8(mac, macpos + 15, u8(load16(_h, 7) >>> 8));

  _finished = true;
}

function update(m: usize, dataLength: u32): void {
  let mpos = 0;
  let bytes: u32 = dataLength;
  let want: u32;

  if (_leftover) {
    want = 16 - _leftover;
    if (want > bytes) {
      want = bytes;
    }
    for (let i: u32 = 0; i < want; i++) {
      // _buffer[_leftover + i] = m[mpos + i];
      store8(_buffer, _leftover + i, load8(m, mpos + i));
    }
    bytes -= want;
    mpos += want;
    _leftover += want;
    if (_leftover < 16) {
      return;
    }
    _blocks(_buffer, 0, 16);
    _leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    _blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }
  if (bytes) {
    for (let i: u32 = 0; i < bytes; i++) {
      // _buffer[_leftover + i] = m[mpos + i];
      store8(_buffer, _leftover + i, load8(m, mpos + i));
    }
    _leftover += bytes;
  }
}

export function digest(out: usize): void {
  // TODO(dchest): it behaves differently than other hashes/HMAC,
  // because it throws when finished — others just return saved result.
  if (_finished) {
    throw new Error("Poly1305 was finished");
  }
  // TODO: remove this 0 constant
  finish(out, 0);
}

export function clean(): void {
  wipe8(_buffer, 16);
  wipe16(_r, 10);
  wipe16(_h, 10);
  wipe16(_pad, 8);
  _leftover = 0;
  _fin = 0;
  _finished = false;
}
