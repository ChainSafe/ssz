
export interface IHashObject {
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
  static digestObjects(obj1: IHashObject, obj2: IHashObject): IHashObject;
}
