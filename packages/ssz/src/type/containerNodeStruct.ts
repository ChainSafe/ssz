import {Node} from "@chainsafe/persistent-merkle-tree";
import {Type, ByteViews} from "./abstract";
import {ContainerType, ContainerOptions} from "./container";
import {getContainerTreeViewClass} from "../view/containerNodeStruct";
import {getContainerTreeViewDUClass} from "../viewDU/containerNodeStruct";
import {BranchNodeStruct, BranchNodeStructSchema} from "../branchNodeStruct";
import {ValueOfFields} from "../view/container";

export class ContainerNodeStructType<Fields extends Record<string, Type<unknown>>> extends ContainerType<Fields> {
  private branchNodeStructSchema: BranchNodeStructSchema<ValueOfFields<Fields>>;

  constructor(readonly fields: Fields, opts?: ContainerOptions<Fields>) {
    super(fields, {
      ...opts,
      getContainerTreeViewClass,
      getContainerTreeViewDUClass,
    });

    this.branchNodeStructSchema = {
      valueToNode: this.valueToTree.bind(this),
      hashTreeRoot: this.hashTreeRoot.bind(this),
      cloneValue: this.cloneValue.bind(this),
    };
  }

  tree_serializedSize(node: Node): number {
    return this.value_serializedSize((node as BranchNodeStruct<ValueOfFields<Fields>>).value);
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const {value} = node as BranchNodeStruct<ValueOfFields<Fields>>;
    return this.value_serializeToBytes(output, offset, value);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const value = this.value_deserializeFromBytes(data, start, end);
    return new BranchNodeStruct(this.branchNodeStructSchema, value);
  }

  // Overwrites for fast conversion node <-> value

  tree_toValue(node: Node): ValueOfFields<Fields> {
    return (node as BranchNodeStruct<ValueOfFields<Fields>>).value;
  }

  value_toTree(value: ValueOfFields<Fields>): Node {
    return new BranchNodeStruct(this.branchNodeStructSchema, value);
  }

  // TODO: Optimize conversion
  private valueToTree(value: ValueOfFields<Fields>): Node {
    const uint8Array = new Uint8Array(this.value_serializedSize(value));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, value);
    return super.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }

  private cloneValue(value: ValueOfFields<Fields>): ValueOfFields<Fields> {
    return {...value};
  }
}
