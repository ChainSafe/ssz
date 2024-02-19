#![deny(clippy::all)]

use std::sync::Arc;

use ethereum_hashing::hash32_concat;
use napi::{bindgen_prelude::Uint8Array, Error};

#[macro_use]
extern crate napi_derive;

pub enum NodeType {
  Branch(BranchNode),
  Leaf(LeafNode),
}

#[napi]
pub struct Node(Arc<NodeType>);

impl Clone for Node {
  fn clone(&self) -> Self {
    Node(Arc::new(match self.0.as_ref() {
      NodeType::Branch(b) => NodeType::Branch(b.clone()),
      NodeType::Leaf(l) => NodeType::Leaf(*l),
    }))
  }
}

#[napi]
pub struct BranchNode {
  hash_object: Option<HashObject>,
  left: Node,
  right: Node,
}

impl Clone for BranchNode {
  fn clone(&self) -> Self {
    BranchNode {
      hash_object: self.hash_object,
      left: self.left.clone(),
      right: self.right.clone(),
    }
  }
}

#[derive(Copy, Clone)]
#[napi]
pub struct LeafNode(HashObject);

#[napi]
impl Node {

  #[napi(getter)]
  pub fn get_hash_object(&mut self) -> Result<HashObject, Error> {
    match self.0  {
      Ok(NodeType::Branch(b)) => {
        match b.hash_object {
          Some(h) => Ok(h),
          None => {
            let left = b.left.get_hash_object()?;
            let right = b.right.get_hash_object()?;
            let hash = HashObject::from_bytes(hash32_concat(left.as_bytes().as_ref(), right.as_bytes().as_ref()));
            b.hash_object = Some(hash);
            Ok(hash)
          }
        }
      },
      Ok(NodeType::Leaf(l)) => Ok(l.0),
      Err(err) => Err(Error::from_reason(err.to_string())),
    }
    //   NodeType::Branch(b) => {
    //     match b.hash_object {
    //       Some(h) => h,
    //       None => {
    //         b.hash_object = Some(HashObject::from_bytes(hash32_concat(b.left.get_hash_object().as_bytes().as_ref(), b.right.get_hash_object().as_bytes().as_ref())));
    //         b.hash_object.unwrap()
    //       }
    //     }
    //   },
    //   NodeType::Leaf(l) => l.0,
    // }
  }

  #[napi(getter)]
  pub fn get_root(&mut self) -> Uint8Array {
    Uint8Array::from(self.get_hash_object().as_bytes())
  }

  #[napi(getter)]
  pub fn get_left(&self) -> Option<Node> {
    match self.0.as_ref() {
      NodeType::Branch(b) => Some(b.left.clone()),
      _ => None,
    }
  }

  #[napi(getter)]
  pub fn get_right(&self) -> Option<Node> {
    match self.0.as_ref() {
      NodeType::Branch(b) => Some(b.right.clone()),
      _ => None,
    }
  }

  #[napi]
  pub fn is_leaf(&self) -> bool {
    match self.0.as_ref() {
      NodeType::Leaf(_) => true,
      _ => false,
    }
  }
}

#[napi]
impl BranchNode {
  #[napi(constructor)]
  pub fn new(left: &Node, right: &Node) -> Self {
    BranchNode {
      hash_object: None,
      left: left.clone(),
      right: right.clone(),
    }
  }
}