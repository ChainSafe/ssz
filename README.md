# as-sha256
Assembly Script implementation of SHA256.

This repository contains two npm distributions; a pure AssemblyScript version, and a Typescript wrapper for the WASM build.

## Benchmarks

```
Sha256-Rust#hash x 328,611 ops/sec ±5.99% (75 runs sampled)
Sha256-Js#hash x 340,641 ops/sec ±4.64% (77 runs sampled)
Sha256-Asm#hash x 5,217 ops/sec ±8.83% (74 runs sampled)
Sha256-BCrypto#hash x 411,191 ops/sec ±9.87% (59 runs sampled)
AS-Sha256#hash x 537,124 ops/sec ±8.91% (76 runs sampled)
Fastest is AS-Sha256#hash
```


## AssemblyScript

`yarn add @chainsafe/as-sha256`

## Typescript Warpper

`yarn add @chainsafe/sha256`

## Usage

```JS
import sha256 from "@chainsafe/sha256";

const message = Buffer.from("Hello world");

const hash = sha256(message);
```

We also expose the lower level WASM exports for those that may wish to use it. It can be accessed as follows:
```JS
import sha256, {wasm} from "@chainsafe/sha256"

const buffer = Buffer.from("Hello world");
const array = wasm.__retain(wasm.__allocArray(wasm.UINT8ARRAY_ID, buffer));
const message = wasm.hash(array)

// To prevent memory leaks
wasm.__release(array);
wasm.__release(message);

console.log(toHexString(wasm.__getArray(message)));
```

### License

LGPL-V3
