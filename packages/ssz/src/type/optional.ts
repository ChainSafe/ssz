import {concatGindices, getNode, Gindex, Node, Tree, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {mixInLength} from "../util/merkleize";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {Type, ByteViews, JsonPath} from "./abstract";
import {CompositeType, isCompositeType} from "./composite";
import {addLengthNode, getLengthFromRootNode} from "./arrayBasic";
/* eslint-disable @typescript-eslint/member-ordering */

export type OptionalOpts = {
  typeName?: string;
};
type ValueOfType<ElementType extends Type<unknown>> = ElementType extends Type<infer T> ? T | null : never;
const VALUE_GINDEX = BigInt(2);
const SELECTOR_GINDEX = BigInt(3);

/**
 * Optional: optional type containing either None or a type
 * - Notation: Optional[type], e.g. optional[uint64]
 * - merklizes as list of length 0 or 1, essentially acts like
 *   - like Union[none,type] or
 *   - list [], [type]
 */
export class OptionalType<ElementType extends Type<unknown>> extends CompositeType<
  ValueOfType<ElementType>,
  ValueOfType<ElementType>,
  ValueOfType<ElementType>
> {
  readonly typeName: string;
  readonly depth = 1;
  readonly maxChunkCount = 1;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = true;
  readonly isViewMutable = true;

  constructor(readonly elementType: ElementType, opts?: OptionalOpts) {
    super();

    this.typeName = opts?.typeName ?? `Optional[${elementType.typeName}]`;

    this.minSize = 0;
    this.maxSize = elementType.maxSize;
  }

  static named<ElementType extends Type<unknown>>(
    elementType: ElementType,
    opts: Require<OptionalOpts, "typeName">
  ): OptionalType<ElementType> {
    return new (namedClass(OptionalType, opts.typeName))(elementType, opts);
  }

  defaultValue(): ValueOfType<ElementType> {
    return null as ValueOfType<ElementType>;
  }

  getView(tree: Tree): ValueOfType<ElementType> {
    return this.tree_toValue(tree.rootNode);
  }

  getViewDU(node: Node): ValueOfType<ElementType> {
    return this.tree_toValue(node);
  }

  cacheOfViewDU(): unknown {
    return;
  }

  commitView(view: ValueOfType<ElementType>): Node {
    return this.value_toTree(view);
  }

  commitViewDU(view: ValueOfType<ElementType>): Node {
    return this.value_toTree(view);
  }

  value_serializedSize(value: ValueOfType<ElementType>): number {
    return value !== null ? 1 + this.elementType.value_serializedSize(value) : 0;
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOfType<ElementType>): number {
    if (value !== null) {
      output.uint8Array[offset] = 1;
      return this.elementType.value_serializeToBytes(output, offset + 1, value);
    } else {
      return offset;
    }
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ValueOfType<ElementType> {
    if (start === end) {
      return null as ValueOfType<ElementType>;
    } else {
      const selector = data.uint8Array[start];
      if (selector !== 1) {
        throw Error(`Invalid selector=${selector} for Optional type`);
      }
      return this.elementType.value_deserializeFromBytes(data, start + 1, end) as ValueOfType<ElementType>;
    }
  }

  tree_serializedSize(node: Node): number {
    const length = getLengthFromRootNode(node);
    return length === 1 ? 1 + this.elementType.value_serializedSize(node.left) : 0;
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const selector = getLengthFromRootNode(node);

    const valueNode = node.left;
    if (selector === 0) {
      return offset;
    } else {
      output.uint8Array[offset] = 1;
    }
    return this.elementType.tree_serializeToBytes(output, offset + 1, valueNode);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    let valueNode;
    let selector;
    if (start === end) {
      selector = 0;
      valueNode = zeroNode(0);
    } else {
      selector = data.uint8Array[start];
      if (selector !== 1) {
        throw Error(`Invalid selector=${selector} for Optional type`);
      }
      valueNode = this.elementType.tree_deserializeFromBytes(data, start + 1, end);
    }

    return addLengthNode(valueNode, selector);
  }

  // Merkleization

  hashTreeRoot(value: ValueOfType<ElementType>): Uint8Array {
    const selector = value === null ? 0 : 1;
    return mixInLength(super.hashTreeRoot(value), selector);
  }

  protected getRoots(value: ValueOfType<ElementType>): Uint8Array[] {
    const valueRoot = value ? this.elementType.hashTreeRoot(value) : new Uint8Array(32);
    return [valueRoot];
  }

  // Proofs

  getPropertyGindex(prop: string): bigint {
    if (isCompositeType(this.elementType)) {
      const propIndex = this.elementType.getPropertyGindex(prop);
      if (propIndex === null) {
        throw Error(`index not found for property=${prop}`);
      }
      return concatGindices([VALUE_GINDEX, propIndex]);
    } else {
      throw new Error("not applicable for Optional basic type");
    }
  }

  getPropertyType(): Type<unknown> {
    return this.elementType;
  }

  getIndexProperty(index: number): string | number | null {
    if (isCompositeType(this.elementType)) {
      // TODO: need to unconcat the VALUE_GINDEX from the index
      return this.elementType.getIndexProperty(index);
    } else {
      throw Error("not applicable for Optional basic type");
    }
  }

  tree_createProofGindexes(node: Node, jsonPaths: JsonPath[]): Gindex[] {
    if (isCompositeType(this.elementType)) {
      const valueNode = node.left;
      const gindices = this.elementType.tree_createProofGindexes(valueNode, jsonPaths);
      return gindices.map((gindex) => concatGindices([VALUE_GINDEX, gindex]));
    } else {
      throw Error("not applicable for Optional basic type");
    }
  }

  tree_getLeafGindices(rootGindex: bigint, rootNode?: Node): bigint[] {
    if (!rootNode) {
      throw Error("rootNode required");
    }

    const gindices: Gindex[] = [concatGindices([rootGindex, SELECTOR_GINDEX])];
    const selector = getLengthFromRootNode(rootNode);
    const extendedFieldGindex = concatGindices([rootGindex, VALUE_GINDEX]);
    if (selector !== 0 && isCompositeType(this.elementType)) {
      gindices.push(...this.elementType.tree_getLeafGindices(extendedFieldGindex, getNode(rootNode, VALUE_GINDEX)));
    } else {
      gindices.push(extendedFieldGindex);
    }
    return gindices;
  }

  // JSON

  fromJson(json: unknown): ValueOfType<ElementType> {
    return (json === null ? null : this.elementType.fromJson(json)) as ValueOfType<ElementType>;
  }

  toJson(value: ValueOfType<ElementType>): unknown | Record<string, unknown> {
    return value === null ? null : this.elementType.toJson(value);
  }

  clone(value: ValueOfType<ElementType>): ValueOfType<ElementType> {
    return (value === null ? null : this.elementType.clone(value)) as ValueOfType<ElementType>;
  }

  equals(a: ValueOfType<ElementType>, b: ValueOfType<ElementType>): boolean {
    if (a === null && b === null) {
      return true;
    } else if (a === null || b === null) {
      return false;
    }

    return this.elementType.equals(a, b);
  }
}
