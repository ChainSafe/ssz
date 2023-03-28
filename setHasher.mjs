import {setHasher} from "@chainsafe/persistent-merkle-tree/hasher";
import {hasher} from "@chainsafe/persistent-merkle-tree/hasher/as-sha256";
setHasher(hasher);
