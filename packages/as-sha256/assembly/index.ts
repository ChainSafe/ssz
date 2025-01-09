import {INPUT_LENGTH, PARALLEL_FACTOR, input, output, init, update, final, digest, digest64, inputPtr} from "./common";

export const HAS_SIMD = false;

export {INPUT_LENGTH, PARALLEL_FACTOR, input, output, init, update, final, digest, digest64};

export function batchHash4UintArray64s(outPtr: usize): void {
  for (let i = 0; i < 4; i++) {
    const inOffset = changetype<usize>(i * 64);
    const outOffset = changetype<usize>(i * 32);
    digest64(inputPtr + inOffset, outPtr + outOffset);
  }
}
