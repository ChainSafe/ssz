
export interface IHashObject {
  "0": number;
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
  "6": number;
  "7": number;
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
