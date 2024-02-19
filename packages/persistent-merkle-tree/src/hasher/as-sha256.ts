import {digest2Bytes32, digest64HashObjects, digest64HashIds} from "@chainsafe/as-sha256";
import type {Hasher} from "./types";

export const hasher: Hasher = {
  digest64: digest2Bytes32,
  digest64HashObjects,
  digest64HashIds: (a, b, out) => digest64HashIds(a, b, out),
};
