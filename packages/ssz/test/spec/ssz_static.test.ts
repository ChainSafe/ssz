import {ForkName} from "../utils/fork";
import {sszStatic} from "./ssz_static";

if (process.env.LODESTAR_FORK) {
  sszStatic(process.env.LODESTAR_FORK as ForkName);
} else {
  for (const fork of [ForkName.phase0, ForkName.altair, ForkName.bellatrix]) {
    sszStatic(fork);
  }
}
