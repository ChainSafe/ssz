import {Node} from "@chainsafe/persistent-merkle-tree";
import {Type, ByteViews} from "./abstract";
import {isCompositeType} from "./composite";
import {ContainerType, ContainerOptions, renderContainerTypeName} from "./container";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {getContainerTreeViewClass} from "../view/containerNodeStruct";
import {getContainerTreeViewDUClass} from "../viewDU/containerNodeStruct";
import {BranchNodeStruct} from "../branchNodeStruct";
import {ValueOfFields} from "../view/container";

/**
 * ContainerNodeStruct: ordered heterogeneous collection of values.
 * - Notation: Custom name per instance
 *
 * A ContainerNodeStruct is identical to a Container type except that it represents tree data with a custom
 * BranchNodeStruct node. This special branch node represents the data of its entire sub tree as a value, instead
 * of a tree of nodes. This approach is a tradeoff:
 *
 * - More memory efficient
 * - Faster reads, since it doesn't require parsing merkleized data
 * - Slower hashing, since it has to merkleize the entire value everytime and has not intermediary hashing cache
 *
 * This tradeoff is good for data that is read often, written rarely, and consumes a lot of memory (i.e. Validator)
 */
export class ContainerNodeStructType<Fields extends Record<string, Type<unknown>>> extends ContainerType<Fields> {
  constructor(readonly fields: Fields, opts?: ContainerOptions<Fields>) {
    super(fields, {
      // Overwrite default "Container" typeName
      // Render detailed typeName. Consumers should overwrite since it can get long
      typeName: opts?.typeName ?? renderContainerTypeName(fields, "ContainerNodeStruct"),
      ...opts,
      getContainerTreeViewClass,
      getContainerTreeViewDUClass,
    });

    // ContainerNodeStructType TreeViews don't handle recursive mutable TreeViews like ContainerType does.
    // Using ContainerNodeStructType for fields that have mutable views (like a ListBasic), will result in
    // unnexpected behaviour if those child views are mutated.
    //
    // For example, this example below won't persist the pushed values to the list:
    // ```ts
    // const type = ContainerNodeStructType({a: new ListBasicType(byteType, 1)});
    // const view = type.defaultViewDU();
    // view.a.push(0)
    // ```
    // because the ListBasicViewDU in view.a will never propagate the changes upwards to its ContainerNodeStructType.
    for (const {fieldName, fieldType} of this.fieldsEntries) {
      if (isCompositeType(fieldType) && fieldType.isViewMutable) {
        throw Error(`ContainerNodeStructType field '${fieldName}' ${fieldType.typeName} view is mutable`);
      }
    }
  }

  static named<Fields extends Record<string, Type<unknown>>>(
    fields: Fields,
    opts: Require<ContainerOptions<Fields>, "typeName">
  ): ContainerType<Fields> {
    return new (namedClass(ContainerType, opts.typeName))(fields, opts);
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
    return new BranchNodeStruct(this.valueToTree.bind(this), value);
  }

  // Proofs

  // ContainerNodeStructType can only parse proofs that contain all the data.
  // TODO: Support converting a partial tree to a partial value

  // Post process tree to convert regular BranchNode to BranchNodeStruct
  // TODO: Optimize conversions
  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    // TODO: Figure out from `node` alone if it contains complete data.
    // Otherwise throw a nice error "ContainerNodeStruct type requires proofs for all its data"
    const uint8Array = new Uint8Array(super.tree_serializedSize(node));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    super.tree_serializeToBytes({uint8Array, dataView}, 0, node);
    const value = this.value_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
    return {
      node: new BranchNodeStruct(this.valueToTree.bind(this), value),
      done: true,
    };
  }

  // Overwrites for fast conversion node <-> value

  tree_toValue(node: Node): ValueOfFields<Fields> {
    return (node as BranchNodeStruct<ValueOfFields<Fields>>).value;
  }

  value_toTree(value: ValueOfFields<Fields>): Node {
    return new BranchNodeStruct(this.valueToTree.bind(this), value);
  }

  // TODO: Optimize conversion
  private valueToTree(value: ValueOfFields<Fields>): Node {
    const uint8Array = new Uint8Array(this.value_serializedSize(value));
    const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    this.value_serializeToBytes({uint8Array, dataView}, 0, value);
    return super.tree_deserializeFromBytes({uint8Array, dataView}, 0, uint8Array.length);
  }
}
