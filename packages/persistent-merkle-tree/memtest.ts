//import * as ps from "./lib";

const ps = require("./lib");
const as = require("@chainsafe/as-sha256");

let n = ps.zeroNode(0);

function getCacheByIndex(i) {
  return as.getCache(i << 16);
}

function hash() {
  n = new ps.BranchNode(n, n);
  n.root;
}

while (i++ < 32000) { hash(); }
