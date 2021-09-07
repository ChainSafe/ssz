/** @module ssz */
import * as ssz from "./index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(function (window: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  window.ssz = ssz;
})(window);
