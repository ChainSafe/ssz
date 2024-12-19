import {digest64V128} from "./simd";
import {
  INPUT_LENGTH,
  input,
  output,
  init,
  update,
  final,
  digest,
  digest64,
  PARALLEL_FACTOR,
  store32,
  load32be,
  wPtr,
  inputPtr
} from "./common";

export {
  INPUT_LENGTH,
  PARALLEL_FACTOR,
  input,
  output,
  init,
  update,
  final,
  digest,
  digest64
};

/**
 * Hash 4 inputs of exactly 64 bytes each
 * Input pointer is 256 bytes as below:
 *              byte                       u32
 * input 0      0 1 2 ... 63      <===>    0   1 ... 15
 * input 1      64 65 ... 127     <===>    16 17 ... 31
 * input 2      128   ... 191     <===>    32 33 ... 47
 * input 3      192   ... 255     <===>    48 49 ... 63
 *
 * we need to transfer it to expanded message blocks, with 16 first items like:
 *
 * w_v128_0     0 16 32 48
 * w_v128_1     1 17 33 49
 * ...
 * w_v128_15    15 31 47 63
 *
 * remaining 48 items are computed inside hashBlocksV128 loop.
 * @param outPtr
 */
export function batchHash4UintArray64s(outPtr: usize): void {
  for (let i = 0; i < 16; i++) {
    store32(wPtr, PARALLEL_FACTOR * i, load32be(inputPtr, i));
    store32(wPtr, PARALLEL_FACTOR * i + 1, load32be(inputPtr, i + 16));
    store32(wPtr, PARALLEL_FACTOR * i + 2, load32be(inputPtr, i + 32));
    store32(wPtr, PARALLEL_FACTOR * i + 3, load32be(inputPtr, i + 48));
  }

  digest64V128(wPtr, outPtr);
}

/*
 * Hash 4 HashObject inputs, 64 bytes each similar to batchHash4UintArray64s
 *
 * Input pointer is 64 u32 (256 bytes) as below:
 * input 0   input 1   input 2   input 3
 * h0        h0        h0        h0
 * h1        h1        h1        h1
 * ...
 * h7        h7        h7        h7
 * h0        h0        h0        h0
 * h1        h1        h1        h1
 * ...
 * h7        h7        h7        h7
 *
 * that's already the setup for wInputPtr, we only need to load be value of them to make
 * it the first 16 items of expanded message blocks
 *
 * remaining 48 items are computed inside hashBlocksV128 loop.
 *
 */
export function batchHash4HashObjectInputs(outPtr: usize): void {
  for (let i = 0; i < 16 * PARALLEL_FACTOR; i++) {
    store32(wPtr, i, load32be(inputPtr, i));
  }

  digest64V128(wPtr, outPtr);
}
