
@inline
export function load32(ptr: usize, offset: usize): u32 {
  return load<u32>(ptr + (offset << alignof<u32>()));
}

@inline
export function store32(ptr: usize, offset: usize, u: u32): void {
  store<u32>(ptr + (offset << alignof<u32>()), u);
}

@inline
export function store8(ptr: usize, offset: usize, u: u8): void {
  store<u8>(ptr + offset, u);
}

@inline
export function load8(ptr: usize, offset: usize): u8 {
  return load<u8>(ptr + offset);
}

// TODO: store i32 directly after unit test passed
export function writeUint32LE(value: i32, out: usize, offset: u8 = 0): void {
  store8(out, offset + 0, u8(value >>> 0));
  store8(out, offset + 1, u8(value >>> 8));
  store8(out, offset + 2, u8(value >>> 16));
  store8(out, offset + 3, u8(value >>> 24));
}

export function wipe(array: usize, length: u32): void {
  // Right now it's similar to array.fill(0). If it turns
  // out that runtimes optimize this call away, maybe
  // we can try something else.
  for (let i: u32 = 0; i < length; i++) {
    store8(array, i, 0);
  }
}