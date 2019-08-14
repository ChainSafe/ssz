const wasm = require('./index.js')
// const f = new wasm.tsSHA256Fast()
// // sha256("abc")

// // f.sha256_update(wasm.newArray(new Uint8Array([97, 98, 99])), 3)
// // f.sha256_final();
// f.update(wasm.newArray(new Uint8Array([97, 98, 99])), 3);
// let arr = wasm.getArray(Uint8Array, f.digest());

// console.log(arr.length)
// console.log(`tsSHA256Fast `, toHexString(arr))

// f.clean()
// f.update(wasm.newArray(new Uint8Array([97, 98, 99])), 3);
// let res = wasm.getArray(Uint8Array, f.digest());
// console.log(`tsSHA256Fast again `, toHexString(res))




function toHexString(byteArray) {
    return byteArray.reduce((output, elem) =>
        (output + ('0' + elem.toString(16)).slice(-2)),
        '');
}

console.log(toHexString(wasm.getArray(Uint8Array, wasm.hashMe(wasm.newArray(new Uint8Array([97, 98, 99]))))))

// let preimg = wasm.newArray(new Uint8Array([97, 98, 99]))
// let ctx = wasm.init();
// let out = 0; 
// wasm.update(ctx, preimg);
// console.log(wasm.finish(ctx, out))
// console.log(out)