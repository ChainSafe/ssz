const wasm = require('./index.js')
const f = new wasm.jsSHA256()
// sha256("abc")
f.sha256_update(wasm.newArray(new Uint8Array([97, 98, 99])), 3)
f.sha256_final();
const arr = wasm.getArray(Uint8Array, f.digest())
console.log(arr.length)
console.log(`as-sha256 `, toHexString(arr))





function toHexString(byteArray) {
    return byteArray.reduce((output, elem) =>
        (output + ('0' + elem.toString(16)).slice(-2)),
        '');
}
