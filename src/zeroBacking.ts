import { zeroNode } from "./zeroNode";
import { TreeBacking } from "./backing";

export function zeroBacking(index: number): TreeBacking {
  return new TreeBacking(zeroNode(index));
}
