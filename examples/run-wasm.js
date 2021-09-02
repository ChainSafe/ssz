const crypto = require('crypto');
const wasm = require('../src/wasm.js');
const sha = require('../lib/index.js');

const toHexString = byteArray => byteArray.reduce((acc, val) => (acc + ('0' + val.toString(16)).slice(-2)), '');

const emptyMessage = new Uint8Array(0);

const testString = 'testi';
const Message = new Uint8Array(Buffer.from(testString));

const aMessage = new Uint8Array([97,98,99]);
const randomMessage2048 = new Uint8Array(crypto.randomBytes(2048));
const randomMessage16384 = new Uint8Array(crypto.randomBytes(16384));

const message = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, Message));
const amessage = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, aMessage));
const emptymessage = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, emptyMessage));
const randomessage2048 = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, randomMessage2048));
const randomessage16384 = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, randomMessage16384));


console.time('as (wasm)');
  const messageOut = wasm.hash(message);
  const amessageOut = wasm.hash(amessage);
  const emptymessageOut = wasm.hash(emptymessage);
  for (let i = 0; i < 1000; i++) {
    wasm.hash(randomessage2048);
  }
  for (let i = 0; i < 100; i++) {
    wasm.hash(randomessage16384);
  }
console.timeEnd('as (wasm)');

console.log(toHexString(wasm.__getUint8Array(messageOut)), '26e19f2b4dd93a3a7c49c3e785ec8932550af6aa6bea13078672a8c81508f18e');
console.log(toHexString(wasm.__getUint8Array(amessageOut)), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
console.log(toHexString(wasm.__getUint8Array(emptymessageOut)), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

const h = sha.default(testString);
console.log(toHexString(h), '26e19f2b4dd93a3a7c49c3e785ec8932550af6aa6bea13078672a8c81508f18e');

wasm.__release(messageOut);
wasm.__release(amessageOut);
wasm.__release(emptymessageOut);

wasm.__release(message);
wasm.__release(amessage);
wasm.__release(emptymessage);
wasm.__release(randomessage2048);
wasm.__release(randomessage16384);