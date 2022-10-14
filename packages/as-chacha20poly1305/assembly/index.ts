import {inputArr, keyArr, outputArr} from "./poly1305";

export {
  CHACHA20_INPUT_LENGTH,
  CHACHA20_KEY_LENGTH,
  CHACHA20_COUNTER_LENGTH,
  chacha20Input,
  chacha20Key,
  chacha20Counter,
  chacha20Output,
  chacha20StreamXORUpdate,
} from "./chacha20";

export const poly1305Input = inputArr.buffer;
export const poly1305Key = keyArr.buffer;
export const poly1305Output = outputArr.buffer;
export {poly1305Init, poly1305Update, poly1305Digest} from "./poly1305";
