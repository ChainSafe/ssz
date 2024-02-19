#![deny(clippy::all)]

mod sha256;

use std::{ffi::c_ulonglong, os::raw::c_uchar};

use ethereum_hashing::hash32_concat;
use napi::{bindgen_prelude::{Array, Uint8Array}, Env, Error};
use sha256::digest_64;

#[macro_use]
extern crate napi_derive;

#[repr(transparent)]
#[derive(Copy, Clone)]
#[napi]
pub struct HashObject([u32; 8]);

#[napi]
impl HashObject {
  #[napi(constructor)]
  pub fn new(h0: u32, h1: u32, h2: u32, h3: u32, h4: u32, h5: u32, h6: u32, h7: u32) -> Self {
    HashObject([h0, h1, h2, h3, h4, h5, h6, h7])
  }

  #[napi(factory)]
  pub fn zero() -> Self {
    HashObject([0; 8])
  }

  #[napi(factory)]
  pub fn from_uint8array(bytes: Uint8Array) -> Result<Self, Error> {
    let res: Result<&[u8; 32], _> = bytes.as_ref().try_into();
    match res {
      Ok(b) => Ok(Self::from_bytes(*b)),
      Err(_) => Err(Error::from_reason("HashObject must be 32 bytes")),
    }
  }

  #[napi(getter)]
  pub fn get_h0(&self) -> u32 {
    self.0[0]
  }

  #[napi(getter)]
  pub fn get_h1(&self) -> u32 {
    self.0[1]
  }

  #[napi(getter)]
  pub fn get_h2(&self) -> u32 {
    self.0[2]
  }

  #[napi(getter)]
  pub fn get_h3(&self) -> u32 {
    self.0[3]
  }

  #[napi(getter)]
  pub fn get_h4(&self) -> u32 {
    self.0[4]
  }

  #[napi(getter)]
  pub fn get_h5(&self) -> u32 {
    self.0[5]
  }

  #[napi(getter)]
  pub fn get_h6(&self) -> u32 {
    self.0[6]
  }

  #[napi(getter)]
  pub fn get_h7(&self) -> u32 {
    self.0[7]
  }

  #[napi(setter)]
  pub fn set_h0(&mut self, value: u32) {
    self.0[0] = value;
  }

  #[napi(setter)]
  pub fn set_h1(&mut self, value: u32) {
    self.0[1] = value;
  }

  #[napi(setter)]
  pub fn set_h2(&mut self, value: u32) {
    self.0[2] = value;
  }

  #[napi(setter)]
  pub fn set_h3(&mut self, value: u32) {
    self.0[3] = value;
  }

  #[napi(setter)]
  pub fn set_h4(&mut self, value: u32) {
    self.0[4] = value;
  }

  #[napi(setter)]
  pub fn set_h5(&mut self, value: u32) {
    self.0[5] = value;
  }

  #[napi(setter)]
  pub fn set_h6(&mut self, value: u32) {
    self.0[6] = value;
  }

  #[napi(setter)]
  pub fn set_h7(&mut self, value: u32) {
    self.0[7] = value;
  }

  #[napi]
  pub fn apply_hash(&mut self, other: &HashObject) {
    self.0 = other.0;
  }

  #[napi]
  pub fn apply_uint8array(&mut self, bytes: Uint8Array) -> Result<(), Error> {
    let res: Result<&[u8; 32], _> = bytes.as_ref().try_into();
    match res {
      Ok(b) => {
        self.0 = unsafe { std::mem::transmute(*b) };
        Ok(())
      },
      Err(_) => Err(Error::from_reason("HashObject must be 32 bytes")),
    }
  }

  #[napi]
  pub fn to_uint8array(&self) -> Uint8Array {
    Uint8Array::from(self.as_bytes())
  }

  #[napi]
  pub fn as_bytes(&self) -> [u8; 32] {
    unsafe {
      let output: [u8; 32] = std::mem::transmute(self.0);
      output
    }
  }

  pub fn from_bytes(bytes: [u8; 32]) -> Self {
    unsafe {
      let output: [u32; 8] = std::mem::transmute(bytes);
      HashObject(output)
    }
  }
}

#[napi]
pub fn hash(left: &HashObject, right: &HashObject) -> HashObject {
  HashObject::from_bytes(hash32_concat(left.as_bytes().as_ref(), right.as_bytes().as_ref()))
}

#[napi]
pub fn hash64(left: &HashObject, right: &HashObject) -> HashObject {
  let mut output = HashObject::zero();
  digest_64(left.0, right.0, &mut output.0);
  output
}

#[link(name = "hashtree", kind = "static")]
extern "C" {
  pub fn hashtree_hash(output: *mut c_uchar, input: *const c_uchar, length: c_ulonglong);
}

#[napi]
pub fn hashtree_one(left: &HashObject, right: &HashObject) -> HashObject {
  let mut output: [u8; 32] = [0; 32];
  let mut input: [u8; 64] = [0; 64];
  input[..32].copy_from_slice(&left.as_bytes());
  input[32..].copy_from_slice(&right.as_bytes());
  unsafe {
    hashtree_hash(output.as_mut_ptr(), input.as_ptr(), 1);
  }
  HashObject::from_bytes(output)
}

#[napi(ts_args_type = "objects: HashObject[]", ts_return_type = "HashObject[]")]
pub fn hashtree(env: Env, objects: Array) -> Result<Array, Error> {
  let objects_len = objects.len();
  if objects_len % 2 == 1 {
    return Err(Error::from_reason("Array must have an even number of elements"));
  }

  let mut output = vec![0u8; 32 * objects.len() as usize];
  let mut input = vec![0u8; 64 * objects.len() as usize];
  for i in 0..objects_len {
    let obj: Option<&HashObject> = objects.get(i).unwrap();
    match obj {
      Some(obj) => {
        input[(i * 32) as usize..((i + 1) * 32) as usize].copy_from_slice(obj.as_bytes().as_ref());
      },
      None => {
        return Err(Error::from_reason("Array must contain only HashObjects"));
      }
    }
  }

  let output_len = objects_len / 2;
  unsafe{
    hashtree_hash(output.as_mut_ptr(), input.as_ptr(), output_len as u64);
  };


  let mut output_objects = env.create_array(output_len)?;
  for i in 0..output_len {
    match output_objects.set(i, HashObject::from_bytes(output[(i * 32) as usize..((i + 1) * 32) as usize].try_into().unwrap())) {
      Ok(_) => {},
      Err(err) => {
        return Err(err);
      }
    }
  }

  Ok(output_objects)
}

#[napi]
pub fn hashtree_uint8array(input: Uint8Array) -> Result<Uint8Array, Error> {
  let input_len = input.len();
  if (input_len % 64) != 0 {
    return Err(Error::from_reason("Input must be a multiple of 64 bytes"));
  }
  let output_len = input_len / 2;
  let mut output = vec![0u8; output_len];
  unsafe {
    hashtree_hash(output.as_mut_ptr(), input.as_ptr(), (output_len / 32) as u64);
  }
  Ok(Uint8Array::from(output))
}

static mut HASH_OBJECT_CACHE: Vec<HashObject> = Vec::new();

#[napi]
pub fn init_hash_object_cache(n: u32) -> Result<(), Error> {
  unsafe {
    HASH_OBJECT_CACHE = Vec::with_capacity(n as usize);
    for _ in 0..n {
      HASH_OBJECT_CACHE.push(HashObject::zero());
    }
  }
  Ok(())
}