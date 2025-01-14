import {
  INPUT_LENGTH,
  PARALLEL_FACTOR,
  input,
  output,
  init,
  update,
  final,
  digest,
  digest64,
  digest64WithStep,
  inputPtr,
} from "./common";

export const HAS_SIMD = false;

export {INPUT_LENGTH, PARALLEL_FACTOR, input, output, init, update, final, digest, digest64};

/**
 * Batch hash 4 inputs on non-simd systems. Proxies input data through standard digest64
 */
export function batchHash4UintArray64s(outPtr: usize): void {
  for (let i = 0; i < 4; i++) {
    const inOffset = changetype<usize>(i * 64);
    const outOffset = changetype<usize>(i * 32);
    digest64(inputPtr + inOffset, outPtr + outOffset);
  }
}

/**
 * Batch hash 4 inputs on non-simd systems. Proxies input data through standard digest64
 */
export function batchHash4HashObjectInputs(outPtr: usize): void {
  for (let i = 0; i < 4; i++) {
    const inOffset = changetype<usize>(i * 4);
    const outOffset = changetype<usize>(i * 32);
    digest64WithStep(inputPtr + inOffset, outPtr + outOffset, 4);
  }
}
