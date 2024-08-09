import {
  concatGindices,
  Gindex,
  Node,
  Tree,
  zeroNode,
  HashComputationLevel,
  getHashComputations,
} from "@chainsafe/persistent-merkle-tree";
import {mixInLength} from "../util/merkleize";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {Type, ByteViews, JsonPath, JsonPathProp} from "./abstract";
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
  readonly depth: number;
  readonly maxChunkCount: number;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = true;
  readonly isViewMutable = true;

  constructor(readonly elementType: ElementType, opts?: OptionalOpts) {
    super();

    this.typeName = opts?.typeName ?? `Optional[${elementType.typeName}]`;
    this.maxChunkCount = 1;
    // Depth includes the extra level for the true/false node
    this.depth = elementType.depth + 1;

    this.minSize = 0;
    // Max size includes prepended 0x01 byte
    this.maxSize = elementType.maxSize + 1;
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

  // TODO add an OptionalView
  getView(tree: Tree): ValueOfType<ElementType> {
    return this.tree_toValue(tree.rootNode);
  }

  // TODO add an OptionalViewDU
  getViewDU(node: Node): ValueOfType<ElementType> {
    return this.tree_toValue(node);
  }

  // TODO add an OptionalView
  commitView(view: ValueOfType<ElementType>): Node {
    return this.value_toTree(view);
  }

  // TODO add an OptionalViewDU
  commitViewDU(view: ValueOfType<ElementType>, hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): Node {
    const node = this.value_toTree(view);
    if (hcByLevel !== null && node.h0 === null) {
      getHashComputations(node, hcOffset, hcByLevel);
    }
    return node;
  }

  // TODO add an OptionalViewDU
  cacheOfViewDU(): unknown {
    return;
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
        throw new Error(`Invalid selector for Optional type: ${selector}`);
      }
      return this.elementType.value_deserializeFromBytes(data, start + 1, end) as ValueOfType<ElementType>;
    }
  }

  tree_serializedSize(node: Node): number {
    const selector = getLengthFromRootNode(node);

    if (selector === 0) {
      return 0;
    } else if (selector === 1) {
      return 1 + this.elementType.value_serializedSize(node.left);
    } else {
      throw new Error(`Invalid selector for Optional type: ${selector}`);
    }
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const selector = getLengthFromRootNode(node);

    if (selector === 0) {
      return offset;
    } else if (selector === 1) {
      output.uint8Array[offset] = 1;
      return this.elementType.tree_serializeToBytes(output, offset + 1, node.left);
    } else {
      throw new Error(`Invalid selector for Optional type: ${selector}`);
    }
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
        throw new Error(`Invalid selector for Optional type: ${selector}`);
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
    const valueRoot = value === null ? new Uint8Array(32) : this.elementType.hashTreeRoot(value);
    return [valueRoot];
  }

  // Proofs

  getPropertyGindex(prop: JsonPathProp): Gindex | null {
    if (isCompositeType(this.elementType)) {
      const propIndex = this.elementType.getPropertyGindex(prop);
      return propIndex === null ? propIndex : concatGindices([VALUE_GINDEX, propIndex]);
    } else {
      throw new Error("not applicable for Optional basic type");
    }
  }

  getPropertyType(prop: JsonPathProp): Type<unknown> {
    if (isCompositeType(this.elementType)) {
      return this.elementType.getPropertyType(prop);
    } else {
      throw new Error("not applicable for Optional basic type");
    }
  }

  getIndexProperty(index: number): JsonPathProp | null {
    if (isCompositeType(this.elementType)) {
      return this.elementType.getIndexProperty(index);
    } else {
      throw new Error("not applicable for Optional basic type");
    }
  }

  tree_createProofGindexes(node: Node, jsonPaths: JsonPath[]): Gindex[] {
    if (isCompositeType(this.elementType)) {
      return super.tree_createProofGindexes(node, jsonPaths);
    } else {
      throw new Error("not applicable for Optional basic type");
    }
  }

  tree_getLeafGindices(rootGindex: bigint, rootNode?: Node): Gindex[] {
    if (!rootNode) {
      throw new Error("Optional type requires rootNode argument to get leaves");
    }

    const selector = getLengthFromRootNode(rootNode);

    if (isCompositeType(this.elementType) && selector === 1) {
      return [
        //
        ...this.elementType.tree_getLeafGindices(concatGindices([rootGindex, VALUE_GINDEX]), rootNode.left),
        concatGindices([rootGindex, SELECTOR_GINDEX]),
      ];
    } else if (selector === 0 || selector === 1) {
      return [
        //
        concatGindices([rootGindex, VALUE_GINDEX]),
        concatGindices([rootGindex, SELECTOR_GINDEX]),
      ];
    } else {
      throw new Error(`Invalid selector for Optional type: ${selector}`);
    }
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
