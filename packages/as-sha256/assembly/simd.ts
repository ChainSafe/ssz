import {K, W64} from "./utils/const";
import {getV128, setV128} from "./utils/v128";

let H0V128: v128, H1V128: v128, H2V128: v128, H3V128: v128, H4V128: v128, H5V128: v128, H6V128: v128, H7V128: v128;
let aV128: v128, bV128: v128, cV128: v128, dV128: v128, eV128: v128, fV128: v128, gV128: v128, hV128: v128, iV128: v128, t1V128: v128, t2V128: v128;
let i: i32
let tmpW: v128;

const kV128ArrayBuffer = new ArrayBuffer(4 * 64 * 4);
const kV128Ptr = changetype<usize>(kV128ArrayBuffer);
for (let i = 0; i < 64; i++) {
  setV128(kV128Ptr, i, i32x4.splat(K[i]));
}

const w64V12ArrayBuffer = new ArrayBuffer(4 * 64 * 4);
const w64V128Ptr = changetype<usize>(w64V12ArrayBuffer);
for (let i = 0; i < 64; i++) {
  setV128(w64V128Ptr, i, i32x4.splat(W64[i]));
}

const DEFAULT_H0V128 = i32x4.splat(0x6a09e667);
const DEFAULT_H1V128 = i32x4.splat(0xbb67ae85);
const DEFAULT_H2V128 = i32x4.splat(0x3c6ef372);
const DEFAULT_H3V128 = i32x4.splat(0xa54ff53a);
const DEFAULT_H4V128 = i32x4.splat(0x510e527f);
const DEFAULT_H5V128 = i32x4.splat(0x9b05688c);
const DEFAULT_H6V128 = i32x4.splat(0x1f83d9ab);
const DEFAULT_H7V128 = i32x4.splat(0x5be0cd19);

function initV128(): void {
  H0V128 = DEFAULT_H0V128;
  H1V128 = DEFAULT_H1V128;
  H2V128 = DEFAULT_H2V128;
  H3V128 = DEFAULT_H3V128;
  H4V128 = DEFAULT_H4V128;
  H5V128 = DEFAULT_H5V128;
  H6V128 = DEFAULT_H6V128;
  H7V128 = DEFAULT_H7V128;
}

/**
 * wInputPtr: pointer to extended blocks
 *                    block 0 (4 bytes)   block 1 (4 bytes)    block 2 (4 bytes)    block 3 (4 bytes)
 *   wV128_0       |--------------------|--------------------|--------------------|--------------------|
 *   wV128_1       |--------------------|--------------------|--------------------|--------------------|
 *   ...           ...
 *   wV128_15      |--------------------|--------------------|--------------------|--------------------| ===> end of input data, below is extended area
 *   wV128_16      based on item 0 to 14
 *   wV128_17      based on item 1 to 15
 *   ...
 *   wV128_63      based on item 47 to 62
 *
 * outPtr is 32 bytes each x 4 (PARALLEL_FACTOR) = 128 bytes
 */
export function digest64V128(wInputPtr: usize, outPtr: usize): void {
  initV128();
  hashBlocksV128(wInputPtr);
  hashPreCompWV128();

  // extract lane manually otherwise get "Expression must be a compile-time constant.""
  store32(outPtr, 0, bswap(i32x4.extract_lane(H0V128, 0)));
  store32(outPtr, 1, bswap(i32x4.extract_lane(H1V128, 0)));
  store32(outPtr, 2, bswap(i32x4.extract_lane(H2V128, 0)));
  store32(outPtr, 3, bswap(i32x4.extract_lane(H3V128, 0)));
  store32(outPtr, 4, bswap(i32x4.extract_lane(H4V128, 0)));
  store32(outPtr, 5, bswap(i32x4.extract_lane(H5V128, 0)));
  store32(outPtr, 6, bswap(i32x4.extract_lane(H6V128, 0)));
  store32(outPtr, 7, bswap(i32x4.extract_lane(H7V128, 0)));

  store32(outPtr, 8, bswap(i32x4.extract_lane(H0V128, 1)));
  store32(outPtr, 9, bswap(i32x4.extract_lane(H1V128, 1)));
  store32(outPtr, 10, bswap(i32x4.extract_lane(H2V128, 1)));
  store32(outPtr, 11, bswap(i32x4.extract_lane(H3V128, 1)));
  store32(outPtr, 12, bswap(i32x4.extract_lane(H4V128, 1)));
  store32(outPtr, 13, bswap(i32x4.extract_lane(H5V128, 1)));
  store32(outPtr, 14, bswap(i32x4.extract_lane(H6V128, 1)));
  store32(outPtr, 15, bswap(i32x4.extract_lane(H7V128, 1)));

  store32(outPtr, 16, bswap(i32x4.extract_lane(H0V128, 2)));
  store32(outPtr, 17, bswap(i32x4.extract_lane(H1V128, 2)));
  store32(outPtr, 18, bswap(i32x4.extract_lane(H2V128, 2)));
  store32(outPtr, 19, bswap(i32x4.extract_lane(H3V128, 2)));
  store32(outPtr, 20, bswap(i32x4.extract_lane(H4V128, 2)));
  store32(outPtr, 21, bswap(i32x4.extract_lane(H5V128, 2)));
  store32(outPtr, 22, bswap(i32x4.extract_lane(H6V128, 2)));
  store32(outPtr, 23, bswap(i32x4.extract_lane(H7V128, 2)));

  store32(outPtr, 24, bswap(i32x4.extract_lane(H0V128, 3)));
  store32(outPtr, 25, bswap(i32x4.extract_lane(H1V128, 3)));
  store32(outPtr, 26, bswap(i32x4.extract_lane(H2V128, 3)));
  store32(outPtr, 27, bswap(i32x4.extract_lane(H3V128, 3)));
  store32(outPtr, 28, bswap(i32x4.extract_lane(H4V128, 3)));
  store32(outPtr, 29, bswap(i32x4.extract_lane(H5V128, 3)));
  store32(outPtr, 30, bswap(i32x4.extract_lane(H6V128, 3)));
  store32(outPtr, 31, bswap(i32x4.extract_lane(H7V128, 3)));
}

/**
 * Expand message blocks (16 32bit blocks), into extended message blocks (64 32bit blocks)
 * There are 4 inputs, each input is 64 bytes which is 16 v128 objects of wInputPtr
 * The first 16 v128 objects are computed before this function
 * The remaining 48 v128 objects are computed from the first 16 v128 objects in this function
 * Apply SHA256 compression function on extended message blocks
 * Update intermediate hash values
 * @param WV128 64 v128 objects respective to 4 expanded message blocks memory
 * @param mV12Arr 16 v128 objects respective to 4 message blocks memory
 *
 *
 */
@inline
function hashBlocksV128(wInputPtr: usize): void {
  // this is a copy of data
  aV128 = H0V128;
  bV128 = H1V128;
  cV128 = H2V128;
  dV128 = H3V128;
  eV128 = H4V128;
  fV128 = H5V128;
  gV128 = H6V128;
  hV128 = H7V128;

  // Apply SHA256 compression function on expanded message blocks
  for (i = 0; i < 64; i++) {
    tmpW = i < 16 ? getV128(wInputPtr, i) : i32x4.add(i32x4.add(i32x4.add(SIG1V128(getV128(wInputPtr, i - 2)), getV128(wInputPtr, i - 7)),
      SIG0V128(getV128(wInputPtr, i - 15))), getV128(wInputPtr, i - 16));
    if (i >= 16) {
      setV128(wInputPtr, i, tmpW);
    }
    t1V128 = i32x4.add(i32x4.add(i32x4.add(i32x4.add(hV128, EP1V128(eV128)), CHV128(eV128, fV128, gV128)), getV128(kV128Ptr, i)), tmpW);
    t2V128 = i32x4.add(EP0V128(aV128), MAJV128(aV128, bV128, cV128));
    hV128 = gV128;
    gV128 = fV128;
    fV128 = eV128;
    eV128 = i32x4.add(dV128, t1V128);
    dV128 = cV128;
    cV128 = bV128;
    bV128 = aV128;
    aV128 = i32x4.add(t1V128, t2V128);
  }

  H0V128 = i32x4.add(H0V128, aV128);
  H1V128 = i32x4.add(H1V128, bV128);
  H2V128 = i32x4.add(H2V128, cV128);
  H3V128 = i32x4.add(H3V128, dV128);
  H4V128 = i32x4.add(H4V128, eV128);
  H5V128 = i32x4.add(H5V128, fV128);
  H6V128 = i32x4.add(H6V128, gV128);
  H7V128 = i32x4.add(H7V128, hV128);
}

function hashPreCompWV128(): void {
  aV128 = H0V128;
  bV128 = H1V128;
  cV128 = H2V128;
  dV128 = H3V128;
  eV128 = H4V128;
  fV128 = H5V128;
  gV128 = H6V128;
  hV128 = H7V128;

  // Apply SHA256 compression function on expanded message blocks
  for (i = 0; i < 64; i++) {
    t1V128 = i32x4.add(i32x4.add(i32x4.add(hV128, EP1V128(eV128)), CHV128(eV128, fV128, gV128)), getV128(w64V128Ptr, i));
    t2V128 = i32x4.add(EP0V128(aV128), MAJV128(aV128, bV128, cV128));
    hV128 = gV128;
    gV128 = fV128;
    fV128 = eV128;
    eV128 = i32x4.add(dV128, t1V128);
    dV128 = cV128;
    cV128 = bV128;
    bV128 = aV128;
    aV128 = i32x4.add(t1V128, t2V128);
  }

  H0V128 = i32x4.add(H0V128, aV128);
  H1V128 = i32x4.add(H1V128, bV128);
  H2V128 = i32x4.add(H2V128, cV128);
  H3V128 = i32x4.add(H3V128, dV128);
  H4V128 = i32x4.add(H4V128, eV128);
  H5V128 = i32x4.add(H5V128, fV128);
  H6V128 = i32x4.add(H6V128, gV128);
  H7V128 = i32x4.add(H7V128, hV128);
}

@inline
function CHV128(x: v128, y: v128, z: v128): v128 {
  return v128.xor(v128.and(x, y), v128.and(v128.not(x), z));
}

@inline
function MAJV128(x: v128, y: v128, z: v128): v128 {
  return v128.xor(v128.xor(v128.and(x, y), v128.and(x, z)), v128.and(y, z));
}

@inline
function EP0V128(x: v128): v128 {
  return v128.xor(v128.xor(rotrV128(x, 2), rotrV128(x, 13)), rotrV128(x, 22));
}

@inline
function EP1V128(x: v128): v128 {
  return v128.xor(v128.xor(rotrV128(x, 6), rotrV128(x, 11)), rotrV128(x, 25));
}

@inline
function SIG0V128(x: v128): v128 {
  return v128.xor(v128.xor(rotrV128(x, 7), rotrV128(x, 18)), i32x4.shr_u(x, 3));
}

@inline
function SIG1V128(x: v128): v128 {
  return v128.xor(v128.xor(rotrV128(x, 17), rotrV128(x, 19)), i32x4.shr_u(x, 10));
}

/**
 * rotr is not natively supported by v128 so we have to implement it manually
 * @param value
 * @param bits
 * @returns
 */
@inline
function rotrV128(value: v128, bits: i32): v128 {
  const maskBits = 32 - bits;

  // Shift right (logical) each lane by 'bits'
  const rightShifted = i32x4.shr_u(value, bits);

  // Shift left each lane by (32 - bits) to handle the wrap-around part of rotation
  const leftShifted = i32x4.shl(value, maskBits);

  // Combine the shifted parts with bitwise OR to achieve rotation
  return v128.or(rightShifted, leftShifted);
}

@inline
function store32(ptr: usize, offset: usize, u: u32): void {
  store<u32>(ptr + (offset << alignof<u32>()), u);
}