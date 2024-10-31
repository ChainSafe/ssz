import {
  concatGindices,
  getNode,
  Gindex,
  Node,
  Tree,
  merkleizeBlocksBytes,
  getHashComputations,
  HashComputationLevel,
} from "@chainsafe/persistent-merkle-tree";
import {Require} from "../util/types";
import {namedClass} from "../util/named";
import {Type, ByteViews} from "./abstract";
import {CompositeType, isCompositeType} from "./composite";
import {addLengthNode, getLengthFromRootNode} from "./arrayBasic";
import {NoneType} from "./none";
import {allocUnsafe} from "@chainsafe/as-sha256";

/* eslint-disable @typescript-eslint/member-ordering */

type Union<T> = {
  readonly selector: number;
  value: T;
};

type ValueOfTypes<Types extends Type<unknown>[]> = Types extends Type<infer T>[] ? Union<T> : never;

const VALUE_GINDEX = BigInt(2);
const SELECTOR_GINDEX = BigInt(3);

export type UnionOpts = {
  typeName?: string;
};

/**
 * Union: union type containing one of the given subtypes
 * - Notation: Union[type_0, type_1, ...], e.g. union[None, uint64, uint32]
 */
export class UnionType<Types extends Type<unknown>[]> extends CompositeType<
  ValueOfTypes<Types>,
  ValueOfTypes<Types>,
  ValueOfTypes<Types>
> {
  readonly typeName: string;
  readonly depth = 1;
  readonly maxChunkCount = 1;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = true;
  readonly isViewMutable = true;
  readonly mixInLengthChunkBytes = new Uint8Array(64);
  readonly mixInLengthBuffer = Buffer.from(
    this.mixInLengthChunkBytes.buffer,
    this.mixInLengthChunkBytes.byteOffset,
    this.mixInLengthChunkBytes.byteLength
  );

  protected readonly maxSelector: number;

  constructor(readonly types: Types, opts?: UnionOpts) {
    super();

    if (types.length >= 128) {
      throw Error("Must have less than 128 types");
    }

    if (types.length === 0) {
      throw Error("Must have at least 1 type option");
    }

    if (types[0] instanceof NoneType && types.length < 2) {
      throw Error("Must have at least 2 type options if the first is None");
    }

    for (let i = 1; i < types.length; i++) {
      if (types[i] instanceof NoneType) {
        throw Error("None may only be the first option");
      }
    }

    this.typeName = opts?.typeName ?? `Union[${types.map((t) => t.typeName).join(",")}]`;

    const minLens: number[] = [];
    const maxLens: number[] = [];

    for (const _type of types) {
      minLens.push(_type.minSize);
      maxLens.push(_type.maxSize);
    }

    this.minSize = 1 + Math.min(...minLens);
    this.maxSize = 1 + Math.max(...maxLens);
    this.maxSelector = this.types.length - 1;
    this.blocksBuffer = new Uint8Array(32);
  }

  static named<Types extends Type<unknown>[]>(types: Types, opts: Require<UnionOpts, "typeName">): UnionType<Types> {
    return new (namedClass(UnionType, opts.typeName))(types, opts);
  }

  defaultValue(): ValueOfTypes<Types> {
    return {
      selector: 0,
      value: this.types[0].defaultValue() as unknown,
    } as ValueOfTypes<Types>;
  }

  getView(tree: Tree): ValueOfTypes<Types> {
    return this.tree_toValue(tree.rootNode);
  }

  getViewDU(node: Node): ValueOfTypes<Types> {
    return this.tree_toValue(node);
  }

  cacheOfViewDU(): unknown {
    return;
  }

  commitView(view: ValueOfTypes<Types>): Node {
    return this.value_toTree(view);
  }

  commitViewDU(view: ValueOfTypes<Types>, hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): Node {
    const node = this.value_toTree(view);
    if (hcByLevel !== null && node.h0 === null) {
      getHashComputations(node, hcOffset, hcByLevel);
    }
    return node;
  }

  value_serializedSize(value: ValueOfTypes<Types>): number {
    return 1 + this.types[value.selector].value_serializedSize(value.value);
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: ValueOfTypes<Types>): number {
    output.uint8Array[offset] = value.selector;
    return this.types[value.selector].value_serializeToBytes(output, offset + 1, value.value);
  }

  value_deserializeFromBytes(data: ByteViews, start: number, end: number): ValueOfTypes<Types> {
    const selector = data.uint8Array[start];
    if (selector > this.maxSelector) {
      throw Error(`Invalid selector ${selector}`);
    }

    return {
      selector,
      value: this.types[selector].value_deserializeFromBytes(data, start + 1, end) as unknown,
    } as ValueOfTypes<Types>;
  }

  tree_serializedSize(node: Node): number {
    const selector = getLengthFromRootNode(node);
    const valueNode = node.left;
    return 1 + this.types[selector].value_serializedSize(valueNode);
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const selector = getLengthFromRootNode(node);
    const valueNode = node.left;

    output.uint8Array[offset] = selector;
    return this.types[selector].tree_serializeToBytes(output, offset + 1, valueNode);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    const selector = data.uint8Array[start];
    if (selector > this.maxSelector) {
      throw Error(`Invalid selector ${selector}`);
    }

    const valueNode = this.types[selector].tree_deserializeFromBytes(data, start + 1, end);
    return addLengthNode(valueNode, selector);
  }

  // Merkleization

  hashTreeRoot(value: ValueOfTypes<Types>): Uint8Array {
    const root = allocUnsafe(32);
    this.hashTreeRootInto(value, root, 0);
    return root;
  }

  hashTreeRootInto(value: ValueOfTypes<Types>, output: Uint8Array, offset: number): void {
    super.hashTreeRootInto(value, this.mixInLengthChunkBytes, 0);
    this.mixInLengthBuffer.writeUIntLE(value.selector, 32, 6);
    const chunkCount = 2;
    merkleizeBlocksBytes(this.mixInLengthChunkBytes, chunkCount, output, offset);
  }

  protected getBlocksBytes(value: ValueOfTypes<Types>): Uint8Array {
    this.types[value.selector].hashTreeRootInto(value.value, this.blocksBuffer, 0);
    return this.blocksBuffer;
  }

  // Proofs

  getPropertyGindex(prop: string): bigint {
    switch (prop) {
      case "value":
        return VALUE_GINDEX;
      case "selector":
        return SELECTOR_GINDEX;
      default:
        throw new Error(`Invalid Union type property ${prop}`);
    }
  }

  getPropertyType(): never {
    // a Union has multiple types
    throw new Error("Not applicable for Union type");
  }

  getIndexProperty(index: number): string | number {
    if (index === 0) return "value";
    if (index === 1) return "selector";
    throw Error("Union index of out bounds");
  }

  tree_getLeafGindices(rootGindex: bigint, rootNode?: Node): bigint[] {
    if (!rootNode) {
      throw Error("rootNode required");
    }

    const gindices: Gindex[] = [concatGindices([rootGindex, SELECTOR_GINDEX])];
    const selector = getLengthFromRootNode(rootNode);
    const type = this.types[selector];
    const extendedFieldGindex = concatGindices([rootGindex, VALUE_GINDEX]);
    if (isCompositeType(type)) {
      gindices.push(...type.tree_getLeafGindices(extendedFieldGindex, getNode(rootNode, VALUE_GINDEX)));
    } else {
      gindices.push(extendedFieldGindex);
    }
    return gindices;
  }

  // JSON

  fromJson(json: unknown): ValueOfTypes<Types> {
    if (typeof json !== "object") {
      throw new Error("JSON must be of type object");
    }

    const union = json as Union<unknown>;
    if (typeof union.selector !== "number") {
      throw new Error("Invalid JSON Union selector must be number");
    }

    const type = this.types[union.selector];
    if (!type) {
      throw new Error("Invalid JSON Union selector out of range");
    }

    return {
      selector: union.selector,
      value: type.toJson(union.value),
    } as ValueOfTypes<Types>;
  }

  toJson(value: ValueOfTypes<Types>): Record<string, unknown> {
    return {
      selector: value.selector,
      value: this.types[value.selector].toJson(value.value),
    };
  }

  clone(value: ValueOfTypes<Types>): ValueOfTypes<Types> {
    return {
      selector: value.selector,
      value: this.types[value.selector].clone(value.value),
    } as ValueOfTypes<Types>;
  }

  equals(a: ValueOfTypes<Types>, b: ValueOfTypes<Types>): boolean {
    if (a.selector !== b.selector) {
      return false;
    }

    return this.types[a.selector].equals(a.value, b.value);
  }
}
