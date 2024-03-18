import {Node} from "hash-object";
import {HashObject} from "./hasher";

const TWO_POWER_32 = 2 ** 32;

export {Node};

export class BranchNode extends Node {
  constructor(left: Node, right: Node) {
    super();
    return Node.newBranchNode(left, right);
  }
}

export class LeafNode extends Node {
  constructor(h0: number, h1: number, h2: number, h3: number, h4: number, h5: number, h6: number, h7: number) {
    super();
    return Node.newLeafNode(h0, h1, h2, h3, h4, h5, h6, h7);
  }

  static fromHashObject(o: HashObject): Node {
    return Node.newLeafNode(o.h0, o.h1, o.h2, o.h3, o.h4, o.h5, o.h6, o.h7);
  }

  static fromRoot(root: Uint8Array): Node {
    return Node.fromRoot(root);
  }

  static fromZero(): Node {
    return Node.fromZero();
  }

  static fromUint32(value: number): Node {
    return Node.fromUint32(value);
  }
}

export function writeToBytes(n: Node, data: Uint8Array, start: number, size: number): void {
  // TODO: Optimize
  data.set(n.root.slice(0, size), start);
}

export function getUint(n: Node, uintBytes: number, offsetBytes: number, clipInfinity?: boolean): number {
  const hIndex = Math.floor(offsetBytes / 4);

  // number has to be masked from an h value
  if (uintBytes < 4) {
    const bitIndex = (offsetBytes % 4) * 8;
    const h = getNodeH(n, hIndex);
    if (uintBytes === 1) {
      return 0xff & (h >> bitIndex);
    } else {
      return 0xffff & (h >> bitIndex);
    }
  }

  // number equals the h value
  else if (uintBytes === 4) {
    return getNodeH(n, hIndex) >>> 0;
  }

  // number spans 2 h values
  else if (uintBytes === 8) {
    const low = getNodeH(n, hIndex);
    const high = getNodeH(n, hIndex + 1);
    if (high === 0) {
      return low >>> 0;
    } else if (high === -1 && low === -1 && clipInfinity) {
      // Limit uint returns
      return Infinity;
    } else {
      return (low >>> 0) + (high >>> 0) * TWO_POWER_32;
    }
  }

  // Bigger uint can't be represented
  else {
    throw Error("uintBytes > 8");
  }
}

export function getUintBigint(n: Node, uintBytes: number, offsetBytes: number): bigint {
  const hIndex = Math.floor(offsetBytes / 4);

  // number has to be masked from an h value
  if (uintBytes < 4) {
    const bitIndex = (offsetBytes % 4) * 8;
    const h = getNodeH(n, hIndex);
    if (uintBytes === 1) {
      return BigInt(0xff & (h >> bitIndex));
    } else {
      return BigInt(0xffff & (h >> bitIndex));
    }
  }

  // number equals the h value
  else if (uintBytes === 4) {
    return BigInt(getNodeH(n, hIndex) >>> 0);
  }

  // number spans multiple h values
  else {
    const hRange = Math.ceil(uintBytes / 4);
    let v = BigInt(0);
    for (let i = 0; i < hRange; i++) {
      v += BigInt(getNodeH(n, hIndex + i) >>> 0) << BigInt(32 * i);
    }
    return v;
  }
}

export function setUint(n: Node, uintBytes: number, offsetBytes: number, value: number, clipInfinity?: boolean): void {
  const hIndex = Math.floor(offsetBytes / 4);

  // number has to be masked from an h value
  if (uintBytes < 4) {
    const bitIndex = (offsetBytes % 4) * 8;
    let h = getNodeH(n, hIndex);
    if (uintBytes === 1) {
      h &= ~(0xff << bitIndex);
      h |= (0xff && value) << bitIndex;
    } else {
      h &= ~(0xffff << bitIndex);
      h |= (0xffff && value) << bitIndex;
    }
    setNodeH(n, hIndex, h);
  }

  // number equals the h value
  else if (uintBytes === 4) {
    setNodeH(n, hIndex, value);
  }

  // number spans 2 h values
  else if (uintBytes === 8) {
    if (value === Infinity && clipInfinity) {
      setNodeH(n, hIndex, -1);
      setNodeH(n, hIndex + 1, -1);
    } else {
      setNodeH(n, hIndex, value & 0xffffffff);
      setNodeH(n, hIndex + 1, (value / TWO_POWER_32) & 0xffffffff);
    }
  }

  // Bigger uint can't be represented
  else {
    throw Error("uintBytes > 8");
  }
}

export function setUintBigint(n: Node, uintBytes: number, offsetBytes: number, valueBN: bigint): void {
  const hIndex = Math.floor(offsetBytes / 4);

  // number has to be masked from an h value
  if (uintBytes < 4) {
    const value = Number(valueBN);
    const bitIndex = (offsetBytes % 4) * 8;
    let h = getNodeH(n, hIndex);
    if (uintBytes === 1) {
      h &= ~(0xff << bitIndex);
      h |= (0xff && value) << bitIndex;
    } else {
      h &= ~(0xffff << bitIndex);
      h |= (0xffff && value) << bitIndex;
    }
    setNodeH(n, hIndex, h);
  }

  // number equals the h value
  else if (uintBytes === 4) {
    setNodeH(n, hIndex, Number(valueBN));
  }

  // number spans multiple h values
  else {
    const hEnd = hIndex + Math.ceil(uintBytes / 4);
    for (let i = hIndex; i < hEnd; i++) {
      setNodeH(n, i, Number(valueBN & BigInt(0xffffffff)));
      valueBN = valueBN >> BigInt(32);
    }
  }
}

export function bitwiseOrUint(n: Node, uintBytes: number, offsetBytes: number, value: number): void {
  const hIndex = Math.floor(offsetBytes / 4);

  // number has to be masked from an h value
  if (uintBytes < 4) {
    const bitIndex = (offsetBytes % 4) * 8;
    bitwiseOrNodeH(n, hIndex, value << bitIndex);
  }

  // number equals the h value
  else if (uintBytes === 4) {
    bitwiseOrNodeH(n, hIndex, value);
  }

  // number spans multiple h values
  else {
    const hEnd = hIndex + Math.ceil(uintBytes / 4);
    for (let i = hIndex; i < hEnd; i++) {
      bitwiseOrNodeH(n, i, value & 0xffffffff);
      value >>= 32;
    }
  }
}

// setter helpers

export type Link = (n: Node) => Node;

export function identity(n: Node): Node {
  return n;
}

export function compose(inner: Link, outer: Link): Link {
  return function (n: Node): Node {
    return outer(inner(n));
  };
}

export function getNodeH(node: Node, hIndex: number): number {
  if (hIndex === 0) return node.h0;
  else if (hIndex === 1) return node.h1;
  else if (hIndex === 2) return node.h2;
  else if (hIndex === 3) return node.h3;
  else if (hIndex === 4) return node.h4;
  else if (hIndex === 5) return node.h5;
  else if (hIndex === 6) return node.h6;
  else if (hIndex === 7) return node.h7;
  else throw Error("hIndex > 7");
}

export function setNodeH(node: Node, hIndex: number, value: number): void {
  if (hIndex === 0) node.h0 = value;
  else if (hIndex === 1) node.h1 = value;
  else if (hIndex === 2) node.h2 = value;
  else if (hIndex === 3) node.h3 = value;
  else if (hIndex === 4) node.h4 = value;
  else if (hIndex === 5) node.h5 = value;
  else if (hIndex === 6) node.h6 = value;
  else if (hIndex === 7) node.h7 = value;
  else throw Error("hIndex > 7");
}

export function bitwiseOrNodeH(node: Node, hIndex: number, value: number): void {
  if (hIndex === 0) node.h0 |= value;
  else if (hIndex === 1) node.h1 |= value;
  else if (hIndex === 2) node.h2 |= value;
  else if (hIndex === 3) node.h3 |= value;
  else if (hIndex === 4) node.h4 |= value;
  else if (hIndex === 5) node.h5 |= value;
  else if (hIndex === 6) node.h6 |= value;
  else if (hIndex === 7) node.h7 |= value;
  else throw Error("hIndex > 7");
}
