const crypto = require('crypto');
const wasm = require('../src/wasm.js');

const toHexString = byteArray => byteArray.reduce((acc, val) => (acc + ('0' + val.toString(16)).slice(-2)), '');

const emptyMessage = new Uint8Array(Buffer.from(''));

const Message = new Uint8Array(Buffer.from('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'));

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
console.log(toHexString(wasm.__getArray(messageOut)), '7321348c8894678447b54c888fdbc4e4b825bf4d1eb0cfb27874286a23ea9fd2');
console.log(toHexString(wasm.__getArray(amessageOut)), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
console.log(toHexString(wasm.__getArray(emptymessageOut)), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
