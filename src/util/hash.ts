/** @module ssz */
import SHA256 from "@chainsafe/as-sha256";

/**
 * Hash used for hashTreeRoot
 */
export function hash(...inputs: Uint8Array[]): Uint8Array {
  return SHA256.digest(Buffer.concat(inputs));
}
