export function bigIntPow(base: bigint, exponent: bigint): bigint {
  if (exponent < 0) {
    throw new RangeError("Exponent must be positive");
  }

  let out = BigInt(1);
  for (; exponent > 0; exponent--) {
    out *= base;
  }
  return out;
}
