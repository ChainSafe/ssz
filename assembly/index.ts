type Byte = u8;
type Word = u32
// https://github.com/B-Con/crypto-algorithms/blob/master/sha256.c
import "allocator/arena"
export { memory };

export class  jsSHA256{
    //private BLOCKSIZE: = 32;
    private datalen: Word;
    private bitlen: u64;
    private data: Byte[] = new Array<Byte>(64);
    private hash: Uint8Array = new Uint8Array(32);
    private state: Word[] = new Array<Word>(8);
    public dummy(): u32 {
      return 555;
    }
    //init 
    public constructor() {
      // this.data = new u8(64);
      // this.state = new u32(8);
      // this.hash = new u8(32);
  
      this.datalen = 0;
      this.bitlen = 0;
      this.state[0] = 0x6a09e667;
      this.state[1] = 0xbb67ae85;
      this.state[2] = 0x3c6ef372;
      this.state[3] = 0xa54ff53a;
      this.state[4] = 0x510e527f;
      this.state[5] = 0x9b05688c;
      this.state[6] = 0x1f83d9ab;
      this.state[7] = 0x5be0cd19;
    }
  
    private k: Word[] = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]
  

    @inline
    private CH(x: u32, y: u32, z: u32): u32 {
      return (x & y) ^ (~x & z);
    }

    @inline
    private MAJ(x: u32, y: u32, z: u32): u32 {
      return (x & y) ^ (x & z) ^ (y & z);
    }
  
    @inline
    private EP0(x: u32): u32 {
      return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
    }
  
    @inline
    private EP1(x: u32): u32 {
      return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
    }
  
    @inline
    private SIG0(x: u32): u32 {
      return rotr(x, 7) ^ rotr(x, 18) ^ ((x) >> 3);
    }
  
    @inline
    private SIG1(x: u32): u32 {
      return rotr(x, 17) ^ rotr(x, 19) ^ (x >> 10);
    }
  
    public sha256_update(data: Uint8Array, len: u32): void {
      for (let i: u32 = 0; i < len; ++i) {
        this.data[this.datalen] = data[i];
        this.datalen++;
        if (this.datalen == 64) {
          this.sha256_transform();
          this.bitlen += 512;
          this.datalen = 0;
        }
      }
    }
  
    private sha256_transform(): void {
      let a: u32;
      let b: u32;
      let c: u32;
      let d: u32;
      let e: u32;
      let f: u32;
      let g: u32;
      let h: u32;
      let i: u32;
      let j: u32;
      let t1: u32;
      let t2: u32;
  
      let m: Uint32Array = new Uint32Array(64);

      for (i = 0, j = 0; i < 16; ++i, j += 4) {
        m[i] = (<u32>this.data[j] << 24) | (<u32>this.data[j + 1] << 16) | (<u32>this.data[j + 2] << 8) | (<u32>this.data[j + 3]);
      }
  
      for (; i < 64; ++i) {
        m[i] = this.SIG1(m[i - 2]) + m[i - 7] + this.SIG0(m[i - 15]) + m[i - 16];
      }
      a = this.state[0];
      b = this.state[1];
      c = this.state[2];
      d = this.state[3];
      e = this.state[4];
      f = this.state[5];
      g = this.state[6];
      h = this.state[7];

    
  
      for (i = 0; i < 64; ++i) {
        t1 = h + this.EP1(e) + this.CH(e, f, g) + this.k[i] + m[i];
        t2 = this.EP0(a) + this.MAJ(a, b, c);
        h = g;
        g = f;
        f = e;
        e = d + t1;
        d = c;
        c = b;
        b = a;
        a = t1 + t2;
      }
      this.state[0] += a;
      this.state[1] += b;
      this.state[2] += c;
      this.state[3] += d;
      this.state[4] += e;
      this.state[5] += f;
      this.state[6] += g;
      this.state[7] += h;

    }
  
    public sha256_final(): void {
      let i: u32 = this.datalen;

      if (this.datalen < 56) {
        this.data[i++] = 0x80;
        while (i < 56)
          this.data[i++] = 0x00;
      }
      else {
        this.data[i++] = 0x80;
        while (i < 64)
          this.data[i++] = 0x00;
        this.sha256_transform();
        // TODO: WHY DID I COMMENT THIS OUT
        //memset(this.data, 0, 56);
        for (let x = 0; x < 56; x++) {
          this.data[x] = 0;
        }
      }

      this.bitlen += this.datalen * 8;
      this.data[63] = <u8>(this.bitlen);
      this.data[62] = <u8>(this.bitlen >> 8);
      this.data[61] = <u8>(this.bitlen >> 16);
      this.data[60] = <u8>(this.bitlen >> 24);
      this.data[59] = <u8>(this.bitlen >> 32);
      this.data[58] = <u8>(this.bitlen >> 40);
      this.data[57] = <u8>(this.bitlen >> 48);
      this.data[56] = <u8>(this.bitlen >> 56);

      this.sha256_transform();

      for (i = 0; i < 4; ++i) {
        this.hash[i] = <u8>((this.state[0] >> (24 - i * 8)) & 0x000000ff);
        this.hash[i + 4] = <u8>((this.state[1] >> (24 - i * 8)) & 0x000000ff);
        this.hash[i + 8] = <u8>((this.state[2] >> (24 - i * 8)) & 0x000000ff);
        this.hash[i + 12] = <u8>((this.state[3] >> (24 - i * 8)) & 0x000000ff);
        this.hash[i + 16] = <u8>((this.state[4] >> (24 - i * 8)) & 0x000000ff);
        this.hash[i + 20] = <u8>((this.state[5] >> (24 - i * 8)) & 0x000000ff);
        this.hash[i + 24] = <u8>((this.state[6] >> (24 - i * 8)) & 0x000000ff);
        this.hash[i + 28] = <u8>((this.state[7] >> (24 - i * 8)) & 0x000000ff);
      }
    }
    
    public digest(): Uint8Array{
      return this.hash;
    }
  }
  