extern crate napi_build;

fn main() {
  println!("cargo:rustc-link-search=native=/home/cayman/Code/hashtree/src/");
  println!("cargo:rustc-link-lib=static=hashtree");
  napi_build::setup();
}
