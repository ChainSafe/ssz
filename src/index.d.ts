export default class SHA256 {
  constructor();
  init(): this;
  update(data: Uint8Array): this;
  final(): Uint8Array;

  static ctx: SHA256;
  static digest(data: Uint8Array): Uint8Array;
}

