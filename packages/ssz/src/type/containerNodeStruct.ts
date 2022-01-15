import {Node} from "@chainsafe/persistent-merkle-tree";
import {Type} from "./abstract";
import {ContainerType, ContainerOptions} from "./container";
import {getContainerTreeViewClass} from "../view/containerNodeStruct";
import {getContainerTreeViewDUClass} from "../viewDU/containerNodeStruct";
import {BranchNodeStruct} from "../branchNodeStruct";
import {ValueOfFields} from "../view/container";

export class ContainerNodeStructType<Fields extends Record<string, Type<unknown>>> extends ContainerType<Fields> {
  constructor(readonly fields: Fields, opts?: ContainerOptions<Fields>) {
    super(fields, {
      ...opts,
      getContainerTreeViewClass,
      getContainerTreeViewDUClass,
    });
  }

  tree_serializedSize(node: Node): number {
    return this.value_serializedSize((node as BranchNodeStruct<ValueOfFields<Fields>>).value);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const {value} = node as BranchNodeStruct<ValueOfFields<Fields>>;
    const dataView = new DataView(output.buffer, output.byteOffset, output.byteLength);
    return this.value_serializeToBytes({uint8Array: output, dataView}, offset, value);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const value = this.value_deserializeFromBytes({uint8Array: data, dataView}, start, end);
    return new BranchNodeStruct(this.valueToTree.bind(this), value);
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
