#![deny(clippy::all)]


use std::{cell::{OnceCell, RefCell}, rc::Rc};
use ethereum_hashing::hash32_concat;
use napi::Error;

#[repr(transparent)]
#[derive(Copy, Clone, Debug, PartialEq)]
pub struct HashObject(pub [u32; 8]);

pub enum Node {
  Branch(BranchNode),
  Leaf(LeafNode),
}

pub struct BranchNode {
  hash_object: OnceCell<HashObject>,
  pub left: Rc<Node>,
  pub right: Rc<Node>,
}

pub struct LeafNode {
  hash_object: RefCell<HashObject>,
}

impl HashObject {
  pub fn new(h0: u32, h1: u32, h2: u32, h3: u32, h4: u32, h5: u32, h6: u32, h7: u32) -> Self {
    HashObject([h0, h1, h2, h3, h4, h5, h6, h7])
  }

  pub fn zero() -> Self {
    HashObject([0; 8])
  }

  pub fn from_uint32(value: u32) -> Self {
    HashObject([value, 0, 0, 0, 0, 0, 0, 0])
  }

  pub fn set_h0(&mut self, value: u32) {
    self.0[0] = value;
  }

  pub fn set_h1(&mut self, value: u32) {
    self.0[1] = value;
  }

  pub fn set_h2(&mut self, value: u32) {
    self.0[2] = value;
  }

  pub fn set_h3(&mut self, value: u32) {
    self.0[3] = value;
  }

  pub fn set_h4(&mut self, value: u32) {
    self.0[4] = value;
  }

  pub fn set_h5(&mut self, value: u32) {
    self.0[5] = value;
  }

  pub fn set_h6(&mut self, value: u32) {
    self.0[6] = value;
  }

  pub fn set_h7(&mut self, value: u32) {
    self.0[7] = value;
  }

  pub fn apply_hash(&mut self, other: &HashObject) {
    self.0 = other.0;
  }

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


impl Clone for Node {
  fn clone(&self) -> Self {
    match self {
      Node::Branch(b) => Node::Branch(b.clone()),
      Node::Leaf(l) => Node::Leaf(l.clone()),
    }
  }
}

impl Clone for BranchNode {
  fn clone(&self) -> Self {
    BranchNode {
      hash_object: self.hash_object.clone(),
      left: self.left.clone(),
      right: self.right.clone(),
    }
  }
}

impl Clone for LeafNode {
  fn clone(&self) -> Self {
    LeafNode {
      hash_object: self.hash_object.clone(),
    }
  }
}

impl BranchNode {
  pub fn new(left: Rc<Node>, right: Rc<Node>) -> Self {
    BranchNode {
      hash_object: OnceCell::new(),
      left,
      right,
    }
  }
}


impl BranchNode {
  pub fn get_hash_object(&self) -> HashObject {
    *self.hash_object.get_or_init(|| {
      let left = self.left.get_hash_object();
      let right = self.right.get_hash_object();
      HashObject::from_bytes(hash32_concat(&left.as_bytes(), &right.as_bytes()))
    })
  }
}

impl LeafNode {
  pub fn new(hash_object: HashObject) -> Self {
    LeafNode { hash_object: hash_object.into() }
  }

  pub fn get_hash_object(&self) -> HashObject {
    self.hash_object.clone().into_inner()
  }


  pub fn set_h0(&self, value: u32) {
    self.hash_object.borrow_mut().set_h0(value);
  }
  pub fn set_h1(&self, value: u32) {
    self.hash_object.borrow_mut().set_h1(value);
  }
  pub fn set_h2(&self, value: u32) {
    self.hash_object.borrow_mut().set_h2(value);
  }
  pub fn set_h3(&self, value: u32) {
    self.hash_object.borrow_mut().set_h3(value);
  }
  pub fn set_h4(&self, value: u32) {
    self.hash_object.borrow_mut().set_h4(value);
  }
  pub fn set_h5(&self, value: u32) {
    self.hash_object.borrow_mut().set_h5(value);
  }
  pub fn set_h6(&self, value: u32) {
    self.hash_object.borrow_mut().set_h6(value);
  }
  pub fn set_h7(&self, value: u32) {
    self.hash_object.borrow_mut().set_h7(value);
  }
}

impl Node {
  pub fn get_hash_object(&self) -> HashObject {
    match self {
      Node::Branch(branch) => branch.get_hash_object(),
      Node::Leaf(leaf) => leaf.get_hash_object(),
    }
  }

  pub fn get_left(&self) -> Result<Rc<Node>, Error> {
    match self {
      Node::Branch(branch) => Ok(branch.left.clone()),
      _ => Err(Error::from_reason("Node is not a branch")),
    }
  }

  pub fn get_right(&self) -> Result<Rc<Node>, Error> {
    match self {
      Node::Branch(branch) => Ok(branch.right.clone()),
      _ => Err(Error::from_reason("Node is not a branch")),
    }
  }

  pub fn is_leaf(&self) -> bool {
    match self {
      Node::Branch(_) => false,
      Node::Leaf(_) => true,
    }
  }
}
