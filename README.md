# as-sha256

AssemblyScript implementation of SHA256.

## Usage

`yarn add @chainsafe/as-sha256`

```typescript
import SHA256 from "@chainsafe/as-sha256";

let hash: Uint8Array;

// create a new sha256 context
const sha256 = new SHA256();
// with init(), update(data), and final()
hash = sha256.init().update(Buffer.from("Hello world")).final();

// or use a one-pass interface
hash = SHA256.digest(Buffer.from("Hello world"));
```

### License

Apache 2.0
