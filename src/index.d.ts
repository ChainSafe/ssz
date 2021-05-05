export default class SHA256 {
  constructor();
  init(): this;
  update(data: Uint8Array): this;
  final(): Uint8Array;

  static digest(data: Uint8Array): Uint8Array;
  static digest64(data: Uint8Array): Uint8Array;
}
