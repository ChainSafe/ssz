import {Node} from "@chainsafe/persistent-merkle-tree";
import {Type} from "./abstract";
import {ContainerType, ContainerOptions} from "./container";
import {getContainerTreeViewClass} from "../view/containerNodeStruct";
import {getContainerTreeViewDUClass} from "../viewDU/containerNodeStruct";
import {BranchNodeStruct} from "../branchNodeStruct";
import {ValueOfFields} from "../view/container";

export class ContainerNodeStructType<Fields extends Record<string, Type<unknown>>> extends ContainerType<Fields> {
  constructor(readonly fields: Fields, opts?: ContainerOptions) {
    super(fields, {
      ...opts,
      getContainerTreeViewClass,
      getContainerTreeViewDUClass,
    });
  }

  tree_serializedSize(node: Node): number {
    return this.value_serializedSize((node as BranchNodeStruct<ValueOfFields<Fields>>).value);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const value = this.value_deserializeFromBytes(data, start, end);
    return new BranchNodeStruct(this.valueToTree.bind(this), value);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const {value} = node as BranchNodeStruct<ValueOfFields<Fields>>;
    return this.value_serializeToBytes(output, offset, value);
  }

  // Overwrites for fast conversion node <-> value

  tree_toValue(node: Node): ValueOfFields<Fields> {
    return (node as BranchNodeStruct<ValueOfFields<Fields>>).value;
  }

  value_toTree(value: ValueOfFields<Fields>): Node {
    return new BranchNodeStruct(this.valueToTree.bind(this), value);
  }

  private valueToTree(value: ValueOfFields<Fields>): Node {
    // TODO: Optimize conversion
    const bytes = this.serialize(value);
    return super.tree_deserializeFromBytes(bytes, 0, bytes.length);
  }
}
