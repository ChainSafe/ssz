
/**
 * This is a hash representation with 8 numbers, each 4 bytes.
 * That makes it 32 bytes, the same to Uint8Array(32).
 */
export interface HashObject {
  h0: number;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  h7: number;
}

export default class SHA256 {
  constructor();
  init(): this;
  update(data: Uint8Array): this;
  final(): Uint8Array;

  static digest(data: Uint8Array): Uint8Array;
  static digest64(data: Uint8Array): Uint8Array;
  static digestTwoHashObjects(obj1: HashObject, obj2: HashObject): HashObject;
}

export function hashObjectToByteArray(obj: HashObject, byteArr: ArrayLike<number>, offset: number): void;
export function byteArrayToHashObject(byteArr: ArrayLike<number>): HashObject;
