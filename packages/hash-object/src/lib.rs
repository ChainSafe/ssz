#![deny(clippy::all)]


pub mod node;

use std::{rc::Rc, vec};
use once_cell::sync::Lazy;
use napi::{bindgen_prelude::Uint8Array, Error};
use node::{BranchNode, HashObject, LeafNode, Node};

#[macro_use]
extern crate napi_derive;

#[derive(Clone)]
#[napi(js_name="Node")]
pub struct JsNode {
  node: Rc<Node>,
}

#[napi]
impl JsNode {
  pub fn get_hash_object(&self) -> HashObject {
    self.node.get_hash_object()
  }

  #[napi(getter)]
  pub fn get_h0(&self) -> u32 {
    self.node.get_hash_object().0[0]
  }

  #[napi(getter)]
  pub fn get_h1(&self) -> u32 {
    self.node.get_hash_object().0[1]
  }

  #[napi(getter)]
  pub fn get_h2(&self) -> u32 {
    self.node.get_hash_object().0[2]
  }

  #[napi(getter)]
  pub fn get_h3(&self) -> u32 {
    self.node.get_hash_object().0[3]
  }

  #[napi(getter)]
  pub fn get_h4(&self) -> u32 {
    self.node.get_hash_object().0[4]
  }

  #[napi(getter)]
  pub fn get_h5(&self) -> u32 {
    self.node.get_hash_object().0[5]
  }

  #[napi(getter)]
  pub fn get_h6(&self) -> u32 {
    self.node.get_hash_object().0[6]
  }

  #[napi(getter)]
  pub fn get_h7(&self) -> u32 {
    self.node.get_hash_object().0[7]
  }
  
  #[napi(setter)]
  pub fn set_h0(&mut self, value: u32) -> Result<(), Error> {
    match self.node.as_ref() {
      Node::Leaf(leaf) => Ok(leaf.set_h0(value)),
      _ => Err(Error::from_reason(
        "BranchNode has no h0",
      )),
    }
  }

  #[napi(setter)]
  pub fn set_h1(&mut self, value: u32) -> Result<(), Error> {
    match self.node.as_ref() {
      Node::Leaf(leaf) => Ok(leaf.set_h1(value)),
      _ => Err(Error::from_reason(
        "BranchNode has no h1",
      )),
    }
  }

  #[napi(setter)]
  pub fn set_h2(&mut self, value: u32) -> Result<(), Error> {
    match self.node.as_ref() {
      Node::Leaf(leaf) => Ok(leaf.set_h2(value)),
      _ => Err(Error::from_reason(
        "BranchNode has no h2",
      )),
    }
  }

  #[napi(setter)]
  pub fn set_h3(&mut self, value: u32) -> Result<(), Error> {
    match self.node.as_ref() {
      Node::Leaf(leaf) => Ok(leaf.set_h3(value)),
      _ => Err(Error::from_reason(
        "BranchNode has no h3",
      )),
    }
  }

  #[napi(setter)]
  pub fn set_h4(&mut self, value: u32) -> Result<(), Error> {
    match self.node.as_ref() {
      Node::Leaf(leaf) => Ok(leaf.set_h4(value)),
      _ => Err(Error::from_reason(
        "BranchNode has no h4",
      )),
    }
  }

  #[napi(setter)]
  pub fn set_h5(&mut self, value: u32) -> Result<(), Error> {
    match self.node.as_ref() {
      Node::Leaf(leaf) => Ok(leaf.set_h5(value)),
      _ => Err(Error::from_reason(
        "BranchNode has no h5",
      )),
    }
  }

  #[napi(setter)]
  pub fn set_h6(&mut self, value: u32) -> Result<(), Error> {
    match self.node.as_ref() {
      Node::Leaf(leaf) => Ok(leaf.set_h6(value)),
      _ => Err(Error::from_reason(
        "BranchNode has no h6",
      )),
    }
  }

  #[napi(setter)]
  pub fn set_h7(&mut self, value: u32) -> Result<(), Error> {
    match self.node.as_ref() {
      Node::Leaf(leaf) => Ok(leaf.set_h7(value)),
      _ => Err(Error::from_reason(
        "BranchNode has no h7",
      )),
    }
  }

  #[napi(getter)]
  pub fn get_left(&self) -> Result<JsNode, Error> {
    match self.node.as_ref() {
      Node::Branch(branch) => Ok(JsNode {
        node: branch.left.clone(),
      }),
      _ => Err(Error::from_reason(
        "LeafNode has no left node",
      )),
    }
  }

  #[napi(getter)]
  pub fn get_right(&self) -> Result<JsNode, Error> {
    match self.node.as_ref() {
      Node::Branch(branch) => Ok(JsNode {
        node: branch.right.clone(),
      }),
      _ => Err(Error::from_reason(
        "LeafNode has no right node",
      )),
    }
  }

  #[napi(getter)]
  pub fn get_root(&self) -> Uint8Array {
    self.node.get_hash_object().as_bytes().to_vec().into()
  }

  #[napi(getter)]
  pub fn get_root_hash_object(&self) -> &Self {
    self
  }

  #[napi]
  pub fn is_leaf(&self) -> bool {
    self.node.is_leaf()
  }

  #[napi(constructor)]
  pub fn new() -> JsNode {
    JsNode {
      node: Rc::new(Node::Leaf(LeafNode::new(HashObject::zero()))),
    }
  }

  #[napi(factory)]
  pub fn new_leaf_node(h0: u32, h1: u32, h2: u32, h3: u32, h4: u32, h5: u32, h6: u32, h7: u32) -> JsNode {
    JsNode {
    node: Rc::new(Node::Leaf(LeafNode::new(HashObject::new(h0, h1, h2, h3, h4, h5, h6, h7)))),
    }
  }

  #[napi(factory)]
  pub fn from_root(bytes: Uint8Array) -> Result<JsNode, Error> {
    let res: Result<&[u8; 32], _> = bytes.as_ref().try_into();
    match res {
      Ok(b) => Ok(JsNode {
        node: Rc::new(Node::Leaf(LeafNode::new(HashObject::from_bytes(*b))))
      }),

      Err(_) => Err(Error::from_reason("HashObject must be 32 bytes")),
    }
  }

  #[napi(factory)]
  pub fn from_zero() -> JsNode {
    JsNode {
      node: Rc::new(Node::Leaf(LeafNode::new(HashObject::zero()))),
    }
  }

  #[napi(factory)]
  pub fn from_uint32(value: u32) -> JsNode {
    JsNode {
      node: Rc::new(Node::Leaf(LeafNode::new(HashObject::from_uint32(value)))),
    }
  }

  #[napi(factory)]
  pub fn new_branch_node(left: &JsNode, right: &JsNode) -> JsNode {
    JsNode {
      node: Rc::new(Node::Branch(BranchNode::new(left.node.clone(), right.node.clone()))),
    }
  }
}

#[napi]
pub fn get_node(root: &JsNode, gindex: String) -> Result<JsNode, Error> {
  let mut node = &root.node;
  for c in gindex.chars().skip(1) {
    match node.as_ref() {
      Node::Branch(branch) => {
        node = match c {
          '0' => &branch.left,
          '1' => &branch.right,
          _ => return Err(Error::from_reason("Invalid gindex")),
        }
      },
      _ => return Err(Error::from_reason("Invalid gindex")),
    }
  }
  Ok(JsNode {
    node: node.clone(),
  })
}

#[napi]
pub fn set_node(root: &JsNode, gindex: String, value: &JsNode) -> Result<JsNode, Error> {
  let parent_nodes = get_parent_nodes(root.node.clone(), gindex.clone())?;
  let new_node = rebind_node_to_root(gindex, parent_nodes, value.node.clone())?;
  Ok(JsNode {
    node: new_node,
  })
}

#[napi]
pub fn set_node_with_fn<F: Fn(JsNode) -> Result<&'static JsNode, Error>>(root: &JsNode, gindex: String, get_new_node: F) -> Result<JsNode, Error> {
  let parent_nodes = get_parent_nodes(root.node.clone(), gindex.clone())?;
  let new_node = rebind_node_to_root(gindex, parent_nodes, get_new_node(root.clone())?.node.clone())?;
  Ok(JsNode {
    node: new_node,
  })
}

#[napi]
pub fn get_node_at_depth(root: &JsNode, depth: u32, index: u32) -> Result<JsNode, Error> {
  let mut node = &root.node;
  for _ in 0..depth {
    node = match node.as_ref() {
      Node::Branch(branch) => {
        if index & 1 == 0 {
          &branch.left
        } else {
          &branch.right
        }
      },
      _ => return Err(Error::from_reason("Invalid depth")),
    }
  }
  Ok(JsNode {
    node: node.clone(),
  })
}

#[napi]
/// Fast read-only iteration
/// In-order traversal of nodes at `depth`
/// starting from the `start_index`-indexed node
/// iterating through `count` nodes
/// 
/// **Strategy**
/// 1. Navigate down to parent depth storing a stack of parents
/// 2. At target level push current node
/// 3. Go up to the first level that navigated left
/// 4. Repeat (1) for next index
pub fn get_nodes_at_depth(root: &JsNode, depth: u32, start_index: u32, count: u32) -> Result<Vec<JsNode>, Error> {
  if depth == 0 {
    return if start_index == 0 && count > 0 {
      Ok(vec![root.clone()])
    } else {
      Ok(vec![])
    }
  }
  if depth == 1 {
    return if count == 0 {
      Ok(vec![])
    } else if count == 1 {
      if start_index == 0 {
        Ok(vec![root.get_left()?])
      } else {
        Ok(vec![root.get_right()?])
      }
    } else {
      Ok(vec![root.get_left()?, root.get_right()?])
    }
  }

  let depth: usize = depth as usize;
  let mut pivot_depth: usize = 0;
  let mut node = root.node.clone();

  // Pre-allocate stacks
  let mut parent_node_stack = vec![node.clone(); depth];
  let mut is_left_stack = vec![false; depth];
  let mut nodes = Vec::with_capacity(count as usize);

  for i in 0..count {
    // Navigate down to parent depth storing a stack of parents and directions
    for d in pivot_depth..depth {
      // Each successive parent put on the stack
      parent_node_stack[d] = node.clone();

      // Choose how to navigate from the current level towards the target index (left or right)
      let is_left = is_left_node(depth - 1 - d, start_index + i);
      is_left_stack[d] = is_left;
      node = if is_left {
        node.get_left()?
      } else {
        node.get_right()?
      };
    }

    nodes.push(JsNode { node: node.clone() });


    // Go up to the first level that navigated left
    for d in (0..depth).rev() {
      if is_left_stack[d] {
        pivot_depth = d;
        break;
      }
    }

    // Restart from the pivot depth
    node = parent_node_stack[pivot_depth].clone();
  }

  Ok(nodes)
}

#[napi]
/// Set multiple nodes in batch, editing and traversing nodes strictly once.
/// - gindexes MUST be sorted in ascending order beforehand.
/// - All gindexes must be at the exact same depth.
/// - Depth must be > 0, if 0 just replace the root node.
///
/// Strategy: for each gindex in `gindexes` navigate to the depth of its parent,
/// and create a new parent. Then calculate the closest common depth with the next
/// gindex and navigate upwards creating or caching nodes as necessary. Loop and repeat.
pub fn set_nodes_at_depth(root: &JsNode, depth: u32, indices: Vec<u32>, nodes: Vec<&JsNode>) -> Result<JsNode, Error> {
  // depth nav_bit_index   gindexes   indexes
  // 0     1                  1          0
  // 1     0                2   3      0   1
  // 2     -               4 5 6 7    0 1 2 3
  // gindex 4 (binary '100') means, at depth 2, node is left then left
  //
  // For index N check if the bit at position nav_bit_index is set to navigate right at nav_bit_index
  // ```
  // mask = 1 << nav_bit_index
  // goRight = (N & mask) == mask

  // If depth is 0 there's only one node max and the optimization below will cause a navigation error.
  // For this case, check if there's a new root node and return it, otherwise the current rootNode.
  if depth == 0 {
    return if nodes.len() > 0 {
      Ok(nodes[0].clone())
    } else {
      Ok(root.clone())
    }
  }

  let depth: usize = depth as usize;
  let mut node = root.node.clone();
  let mut pivot_depth = 0;

  // Contiguous filled stack of parent nodes. It get filled in the first descent
  // Indexed by nav_bit_index
  let mut parent_node_stack = vec![node.clone(); depth];

  // Temp stack of left parent nodes, index by nav_bit_index.
  // Node leftParentNodeStack[nav_bit_index] is a node at d = nav_bit_index - 1, such that:
  // parentNodeStack[nav_bit_index].left = leftParentNodeStack[nav_bit_index]
  let mut left_parent_node_stack = vec![None; depth];

  let mut indices_index_iter = 0..indices.len();
  // for mut i in indices_index_iter {
  while let Some(mut i) = indices_index_iter.next() {
    let index = indices[i];
    println!("\nindex: {:?}", index);
    // Navigate down until parent depth, and store the chain of nodes
    //
    // Starts from latest common depth, so node is the parent node at `depthi`
    // When persisting the next node, store at the `d - 1` since its the child of node at `depthi`
    //
    // Stops at the level above depthiParent. For the re-binding routing below node must be at depthiParent

    for d in pivot_depth..depth - 1 {
      // Print the node bytes as hex
      println!("Loop 1: d: {:?}, Node bytes: {:x}", d, node.get_hash_object().0[0].swap_bytes());

      parent_node_stack[d] = node.clone();
      let is_left = is_left_node(depth - 1 - d, index);
      node = if is_left {
        node.get_left()?
      } else {
        node.get_right()?
      };
    }
    println!("Post loop 1: Node bytes after navigation: {:x}", node.get_hash_object().0[0].swap_bytes());

    // If this is the left node, check first it the next node is on the right
    //
    //   -    If both nodes exist, create new
    //  / \
    // x   x
    //
    //   -    If only the left node exists, rebind left
    //  / \
    // x   -
    //
    //   -    If this is the right node, only the right node exists, rebind right
    //  / \
    // -   x

    let is_left_leaf_node = is_left_node(0, index);
    println!("is_left_leaf_node: {:?}", is_left_leaf_node);
    if is_left_leaf_node {
      // Next node is the very next to the current node
      if index + 1 == *indices.get(i + 1).unwrap_or(&0) {
        println!("Next node is the very next");
        node = Rc::new(Node::Branch(BranchNode::new(
          nodes[i].node.clone(),
          nodes[i + 1].node.clone(),
        )));
        // Move index pointer one extra forward since `node` has consumed two nodes
        i += 1;
        indices_index_iter.next();
      } else {
        node = Rc::new(Node::Branch(BranchNode::new(
          nodes[i].node.clone(),
          node.get_right()?,
        )));
      }
    } else {
      node = Rc::new(Node::Branch(BranchNode::new(
        node.get_left()?,
        nodes[i].node.clone(),
      )));
    }
    println!("Post reattachment: Node bytes reattachment: {:x}", node.get_hash_object().0[0].swap_bytes());

    // Here `node` is the new BranchNode at parent depth

    // Now climb upwards until finding the common node with the next index
    // For the last iteration, climb to the root
    let is_last_index = i >= indices.len() - 1;
    let diff_nav_bit_index = if is_last_index {
      depth - 1
    } else {
      find_diff_nav_bit_index(index, indices[i + 1]) as usize
    };
    println!("depth={:?}, diff_nav_bit_index={:?}", depth, diff_nav_bit_index);
    // Prepare next loop
    // Go to the parent of the depth with diff, to switch branches to the right
    pivot_depth = depth - 1 - diff_nav_bit_index;
    println!("pivot_depth={:?}, diff_nav_bit_index={:?}", pivot_depth, diff_nav_bit_index);

    // When climbing up from a left node there are two possible paths
    // 1. Go to the right of the parent: Store left node to rebind later
    // 2. Go another level up: Will never visit the left node again, so must rebind now

    // 🡼 \     Rebind left only, will never visit this node again
    // 🡽 /\
    //
    //    / 🡽  Rebind left only (same as above)
    // 🡽 /\
    //
    // 🡽 /\ 🡾  Store left node to rebind the entire node when returning
    //
    // 🡼 \     Rebind right with left if exists, will never visit this node again
    //   /\ 🡼
    //
    //    / 🡽  Rebind right with left if exists (same as above)
    //   /\ 🡼

    for d in (pivot_depth..depth-1).rev() {
      println!("d={:?}, pivot_depth={:?}, depth={:?}", d, pivot_depth, depth);
      println!("Node bytes climbing: {:x}", node.get_hash_object().0[0].swap_bytes());
      println!("Parent Node bytes climbing: {:x}", parent_node_stack[d].get_hash_object().0[0].swap_bytes());
      // If node is on the left, store for later
      // If node is on the right, merge with stored left node
      if is_left_node(depth - 1 - d, index) {
        println!("here?A");
        if is_last_index || d != pivot_depth {
          // If its the last index, bind with parent since it won't navigate to the right anymore
          // Also, if still has to move upwards. rebind since the node won't be visited anymore
          node = Rc::new(Node::Branch(BranchNode::new(
            node,
            parent_node_stack[d].get_right()?,
          )));
        } else {
          // Only store the left node if its at the pivot depth
          left_parent_node_stack[d] = Some(node.clone());
          node = parent_node_stack[d].clone();
        }
      } else {
        println!("here?B");
        match left_parent_node_stack.get(d).unwrap_or(&None) {
          Some(left) => {
            println!("here?C");
            node = Rc::new(Node::Branch(BranchNode::new(
              left.clone(),
              node,
            )));
            left_parent_node_stack[d] = None;
          },
          None => {
            println!("here?D");
            node = Rc::new(Node::Branch(BranchNode::new(
              parent_node_stack[d].get_left()?,
              node,
            )));
          },
        }
      }
    }
  }

  // Done, return new root node
  Ok(JsNode {
    node,
  })
}

static mut ZEROS: Lazy<Vec<Rc<Node>>> = Lazy::new(|| vec![Rc::new(Node::Leaf(LeafNode::new(HashObject::zero())))]);

pub fn zero_node(height: u32) -> Rc<Node> {
  unsafe {
    if height as usize >= ZEROS.len() {
      for i in ZEROS.len()..=height as usize {
        let node = Rc::new(Node::Branch(BranchNode::new(
          ZEROS[i - 1].clone(),
          ZEROS[i - 1].clone(),
        )));
        ZEROS.push(node);
      }
    }
    ZEROS[height as usize].clone()
  }
}

#[napi(js_name="zeroNode")]
/// Return the `Node` at a specified height from the merkle tree made of "zero data"
/// ```
///           ...
///          /
///         x           <- height 2
///      /     \
///     x       x       <- height 1
///   /  \      /  \
/// 0x0  0x0  0x0  0x0  <- height 0
/// ```
pub fn zero_js_node(height: u32) -> JsNode {
  JsNode {
    node: zero_node(height),
  }
}

/// `nav_bit_index` is the index of the bit currently determining navigation direction
///
/// Eg: for `nav_bit_index = 1`, with `index = 6` (binary 110), the bit at position 1 is 1, so it navigates right
pub fn is_left_node(nav_bit_index: usize, index: u32) -> bool {
  let mask: u64 = 1 << nav_bit_index;
  index as u64 & mask != mask
}

pub fn find_diff_nav_bit_index(from: u32, to: u32) -> u32 {
  let x = f32::ceil(f32::log2((from ^ to) as f32 + 1.0)) as u32 - 1;
  println!("from={:?}, to={:?}, x={:?}", from, to, x);
  x
}

/// Traverse the tree from root node, ignore the last bit to get all parent nodes of the specified bitstring.
pub fn get_parent_nodes(root: Rc<Node>, gindex: String) -> Result<Vec<Rc<Node>>, Error> {
  let mut node = &root;

  // Keep a list of all parent nodes of node at gindex `index`. Then walk the list
  // backwards to rebind them "recursively" with the new nodes without using functions
  let mut parent_nodes = vec![node.clone()];

  // Ignore the first bit, left right directions are at bits [1,..]
  // Ignore the last bit, no need to push the target node to the parentNodes array
  for c in gindex.chars().skip(1) {
    match node.as_ref() {
      Node::Branch(branch) => {
        parent_nodes.push(node.clone());
        node = match c {
          '0' => &branch.left,
          '1' => &branch.right,
          _ => return Err(Error::from_reason("Invalid gindex")),
        };
      },
      _ => return Err(Error::from_reason("Invalid gindex")),
    }
  }
  Ok(parent_nodes)
}

pub fn rebind_node_to_root(gindex: String, parent_nodes: Vec<Rc<Node>>, new_node: Rc<Node>) -> Result<Rc<Node>, Error> {
  let mut node = new_node;
  let mut parent_nodes = parent_nodes.iter().rev();
  // Ignore the first bit, left right directions are at bits [1,..]
  let mut iter = gindex.chars();
  iter.next();

  for c in iter.rev() {
    let parent_node = parent_nodes.next().ok_or(Error::from_reason("Invalid gindex"))?;
    match c {
      '0' => node = Rc::new(Node::Branch(BranchNode::new(node, parent_node.get_right()?))),
      '1' => node = Rc::new(Node::Branch(BranchNode::new(parent_node.get_left()?, node))),
      _ => return Err(Error::from_reason("Invalid gindex")),
    }
  }
  Ok(node)
}

#[napi]
pub fn subtree_fill_to_depth(bottom: &JsNode, depth: u32) -> Result<JsNode, Error> {
  let mut node = bottom.node.clone();
  for _ in 0..depth {
    node = Rc::new(Node::Branch(BranchNode::new(node.clone(), node.clone())));
  }
  Ok(JsNode {
    node,
  })
}

#[napi]
pub fn subtree_fill_to_length(bottom: &JsNode, depth: u32, length: u32) -> Result<JsNode, Error> {
  let max_length = 1 << depth;
  if length > max_length {
    return Err(Error::from_reason("Length exceeds subtree capacity"));
  }
  if length == max_length {
    return Ok(subtree_fill_to_depth(bottom, depth)?);
  }

  if depth == 0 {
    if length == 1 {
      return Ok(bottom.clone());
    } else {
      return Err(Error::from_reason("Length exceeds subtree capacity"));
    }
  }

  if depth == 1 {
    return Ok(JsNode {
      node: Rc::new(Node::Branch(BranchNode::new(
        bottom.node.clone(),
        if length > 1 {
          bottom.node.clone()
        } else {
          zero_node(0)
        }
      ))),
    });
  }

  let pivot = max_length >> 1;
  if length <= pivot {
    return Ok(JsNode {
      node: Rc::new(Node::Branch(BranchNode::new(
        subtree_fill_to_length(bottom, depth - 1, length)?.node.clone(),
        zero_node(depth - 1),
      ))),
    });
  } else {
    return Ok(JsNode {
      node: Rc::new(Node::Branch(BranchNode::new(
        subtree_fill_to_depth(bottom, depth - 1)?.node.clone(),
        subtree_fill_to_length(bottom, depth - 1, length - pivot)?.node.clone(),
      ))),
    });
  }
}

#[napi]
pub fn subtree_fill_to_contents(nodes: Vec<&JsNode>, depth: u32) -> Result<JsNode, Error> {
  let max_length: u64 = 1 << depth;
  if nodes.len() > max_length as usize {
    return Err(Error::from_reason("Length exceeds subtree capacity"));
  }

  if nodes.len() == 0 {
    return Ok(JsNode {
      node: zero_node(depth),
    });
  }

  if depth == 0 {
    return Ok(nodes[0].clone());
  }

  if depth == 1 {
    return Ok(JsNode {
      node: Rc::new(Node::Branch(BranchNode::new(
        nodes[0].node.clone(),
        if nodes.len() > 1 {
          nodes[1].node.clone()
        } else {
          zero_node(0)
        }
      ))),
    });
  }

  let mut nodes = nodes.iter().map(|n| n.node.clone()).collect::<Vec<Rc<Node>>>();
  let mut count = nodes.len();

  for d in (1..=depth).rev() {
    let count_remainder = count % 2;
    let count_even = count - count_remainder;

    // For each depth level, compute the new BranchNodes and overwrite the nodes array
    for i in (0..count_even).step_by(2) {
      nodes[i / 2] = Rc::new(Node::Branch(BranchNode::new(
        nodes[i].clone(),
        nodes[i + 1].clone(),
      )));
    }

    if count_remainder > 0 {
      nodes[count_even / 2] = Rc::new(Node::Branch(BranchNode::new(
        nodes[count - 1].clone(),
        zero_node(depth - d),
      )));
    }

    // If there was remainder, 2 nodes are added to the count
    count = count_even / 2 + count_remainder;
  }

  Ok(JsNode {
    node: nodes[0].clone(),
  })
}
