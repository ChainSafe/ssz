import {Node} from "@chainsafe/persistent-merkle-tree";
import {Type} from "./abstract";
import {ContainerType, IContainerOptions, ValueOfFields} from "./container";
import {getContainerTreeViewClass, getContainerTreeViewDUClass} from "./containerNodeStructTreeView";
import {BranchNodeStruct} from "./branchNodeStruct";

export class ContainerNodeStructType<Fields extends Record<string, Type<unknown>>> extends ContainerType<Fields> {
  constructor(readonly fields: Fields, opts?: IContainerOptions) {
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

  private valueToTree(value: ValueOfFields<Fields>): Node {
    // TODO: Optimize conversion
    const bytes = this.serialize(value);
    return super.tree_deserializeFromBytes(bytes, 0, bytes.length);
  }
}
