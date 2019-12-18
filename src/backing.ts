import { Gindex } from "./gindex";
import { Node } from "./node";

export type Hook = (b: TreeBacking) => void;

export class TreeBacking {
  private _node: Node;
  hook?: Hook;
  constructor(node: Node, hook?: Hook) {
    this._node = node;
    this.hook = hook;
  }
  get node(): Node {
    return this._node;
  }
  set node(n: Node) {
    this._node = n;
    if (this.hook) {
      this.hook(this);
    }
  }
  get(index: Gindex): Node {
    return this.node.get(index);
  }
  set(index: Gindex, n: Node, expand=false): void {
    let setter;
    if (expand) {
      setter = this.node.expandInto(index);
    } else {
      setter = this.node.setter(index);
    }
    this.node = setter(n);
  }
}
