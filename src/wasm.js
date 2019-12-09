const loader = require("assemblyscript/lib/loader");
const wasmBuildLocation = "../build/optimized.wasm";
const imports = {};

export async function wasmInit() {
    try {
        //nodejs
        const fs = require("fs");
        return loader.instantiate(
            new WebAssembly.Module(
                fs.readFileSync(__dirname + "/" + wasmBuildLocation)
            )
            , imports
        );
    } catch (e) {
        //browser
        return await loader.instantiateStreaming(fetch(wasmBuildLocation), imports)
    }
}