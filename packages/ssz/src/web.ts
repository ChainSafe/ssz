/** @module ssz */
import * as ssz from "./index.js";

// biome-ignore lint/suspicious/noExplicitAny: We need to use `any` here explicitly
((window: any) => {
  window.ssz = ssz;
})(window);
