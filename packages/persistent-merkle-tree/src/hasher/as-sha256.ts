import {digest2Bytes32, digest64HashObjects} from "@chainsafe/as-sha256";
import type {Hasher} from "./types";

export const hasher: Hasher = {
  digest64: digest2Bytes32,
  digest64HashObjects,
};
