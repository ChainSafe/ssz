import {LeafNode} from "@chainsafe/persistent-merkle-tree";
import {Type} from "../types_old";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function basicTypeToLeafNode(type: Type<any>, value: unknown): LeafNode {
  const chunk = new Uint8Array(32);
  type.toBytes(value, chunk, 0);
  return new LeafNode(chunk);
}
