const wasm = require('./index.js')
const f = new wasm.jsSHA256()
// sha256("abc")

// f.sha256_update(wasm.newArray(new Uint8Array([97, 98, 99])), 3)
// f.sha256_final();
const arr = wasm.getArray(Uint8Array, f.hashBrowns(wasm.newArray(new Uint8Array([97, 98, 99])), 3))
console.log(arr.length)
console.log(`as-sha256 `, toHexString(arr))
f.init()
console.log(toHexString(wasm.getArray(Uint8Array, f.hashBrowns(wasm.newArray(new Uint8Array([97, 98, 99])), 3))))
f.init()

console.log(toHexString(wasm.getArray(Uint8Array, f.hashBrowns(wasm.newArray(new Uint8Array([97, 98, 99])), 3))))
f.init()

console.log(toHexString(wasm.getArray(Uint8Array, f.hashBrowns(wasm.newArray(new Uint8Array([97, 98, 99])), 3))))
f.init()

console.log(toHexString(wasm.getArray(Uint8Array, f.hashBrowns(wasm.newArray(new Uint8Array([97, 98, 99])), 3))))
f.init()

console.log(toHexString(wasm.getArray(Uint8Array, f.hashBrowns(wasm.newArray(new Uint8Array([97, 98, 99])), 3))))
f.init()

console.log(toHexString(wasm.getArray(Uint8Array, f.hashBrowns(wasm.newArray(new Uint8Array([97, 98, 99])), 3))))

// sha256("abc")
// ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
// console.log(wasm)

// // var data: Byte[];
// // var datalen: Word;
// // var bitlen: u64;
// // var state: Word[];

// wasm.init();
// wasm.sha256_update(wasm.newArray(new Uint8Array([97, 98, 99])), 3)
// const arr = wasm.getArray(Uint8Array, wasm.sha256_final());
// console.log(arr.length)
// console.log(`as-sha256 `, toHexString(arr))





function toHexString(byteArray) {
    return byteArray.reduce((output, elem) =>
        (output + ('0' + elem.toString(16)).slice(-2)),
        '');
}
