"use strict";

var fs = require("fs");

var loader = require("assemblyscript/lib/loader");

var compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/../build/optimized.wasm"));
var imports = {};
Object.defineProperty(module, "exports", {
  get: function get() {
    return loader.instantiate(compiled, imports);
  }
});