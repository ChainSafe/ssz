"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = sha256;
exports.clean = clean;
exports.init = init;
exports.update = update;
exports.digest = digest;

var _wasm = _interopRequireDefault(require("./wasm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Wraps the AssemblyScript build in a JS function.
 * This allows users to not have to make AS a dependency in their project.
 * @param {Uint8Array} message Message to hash
 */
function sha256(message) {
  // @ts-ignore
  var arr = _wasm["default"].__retain(_wasm["default"].__allocArray(_wasm["default"].UINT8ARRAY_ID, message));

  var result = _wasm["default"].hash(arr);

  _wasm["default"].__release(arr);

  return result;
}

function clean() {
  // @ts-ignore
  _wasm["default"].clean();
}

function init() {
  // @ts-ignore
  clean();
}

function update(data, length) {
  // @ts-ignore
  var arr = _wasm["default"].__retain(_wasm["default"].__allocArray(_wasm["default"].UINT8ARRAY_ID, data));

  _wasm["default"].update(arr, length);

  _wasm["default"].__release(arr);
}

function digest() {
  // @ts-ignore
  var digestPointer = _wasm["default"].digest();

  var digest = _wasm["default"].__getUint8Array(digestPointer);

  _wasm["default"].__release(digestPointer);

  return digest;
}