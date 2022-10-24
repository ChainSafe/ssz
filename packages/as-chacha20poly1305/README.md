# as-chacha20poly1305

![ES Version](https://github.com/StableLib/stablelib/tree/master/packages/chacha20poly1305)

AssemblyScript implementation of chacha20poly1305, it's 20% - 60% faster compared to stablelib with no memory allocation in the middle.

## Usage

`yarn add @chainsafe/as-chacha20poly1305`

```typescript
const ctx = newInstance();
const asImpl = new ChaCha20Poly1305(ctx);
const key = new Uint8Array(crypto.randomBytes(KEY_LENGTH));
const nonce = new Uint8Array(crypto.randomBytes(NONCE_LENGTH));
const plainText = new Uint8Array(crypto.randomBytes(512));
const ad = new Uint8Array(crypto.randomBytes(32))
const asSealed = asImpl.seal(key, nonce, plainText, ad);
// overwrite sealed to save memory allocation
const plainText2 = asImpl.open(key, nonce, sealed, true, ad);
expect(plainText2).to.be.deep.equal(plainText);
```

### License

Apache 2.0
