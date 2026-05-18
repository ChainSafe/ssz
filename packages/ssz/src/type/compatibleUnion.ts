import {allocUnsafe} from "@chainsafe/as-sha256";
import {
  Gindex,
  HashComputationLevel,
  Node,
  Proof,
  ProofType,
  Tree,
  concatGindices,
  createProof,
  getHashComputations,
  getNode,
  merkleizeBlocksBytes,
} from "@chainsafe/persistent-merkle-tree";
import {byteArrayEquals} from "../util/byteArray.ts";
import {namedClass} from "../util/named.ts";
import {Require} from "../util/types.ts";
import {TreeView} from "../view/abstract.ts";
import {TreeViewDU} from "../viewDU/abstract.ts";
import {ByteViews, JsonPath, Type} from "./abstract.ts";
import {addLengthNode, getLengthFromRootNode} from "./arrayBasic.ts";
import {BasicType, isBasicType} from "./basic.ts";
import {BitListType} from "./bitList.ts";
import {BitVectorType} from "./bitVector.ts";
import {BooleanType} from "./boolean.ts";
import {ByteListType} from "./byteList.ts";
import {ByteVectorType} from "./byteVector.ts";
import {CompositeType, isCompositeType} from "./composite.ts";
import {ContainerType} from "./container.ts";
import {ListBasicType} from "./listBasic.ts";
import {ListCompositeType} from "./listComposite.ts";
import {ProgressiveBitListType} from "./progressiveBitList.ts";
import {ProgressiveByteListType} from "./progressiveByteList.ts";
import {ProgressiveContainerType} from "./progressiveContainer.ts";
import {ProgressiveListBasicType, ProgressiveListCompositeType} from "./progressiveList.ts";
import {UintBigintType, UintNumberType} from "./uint.ts";
import {VectorBasicType} from "./vectorBasic.ts";
import {VectorCompositeType} from "./vectorComposite.ts";

export type CompatibleUnion<T> = {
  readonly selector: number;
  data: T;
};

export type CompatibleUnionOpts = {
  typeName?: string;
};

const VALUE_GINDEX = BigInt(2);
const SELECTOR_GINDEX = BigInt(3);

/**
 * CompatibleUnion: union type containing one of the given subtypes with compatible Merkleization.
 * - Notation: CompatibleUnion({selector: type}), e.g. CompatibleUnion({1: Square, 2: Circle})
 *
 * The right leaf encodes the selector and reuses existing list length-node helpers for tree operations.
 */
export class CompatibleUnionType<Types extends Record<number, Type<unknown>>> extends CompositeType<
  CompatibleUnion<unknown>,
  CompatibleUnionTreeView<Types>,
  CompatibleUnionTreeViewDU<Types>
> {
  readonly typeName: string;
  readonly depth = 1;
  readonly maxChunkCount = 1;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;
  readonly isList = true;
  readonly isViewMutable = true;
  readonly mixInSelectorBlockBytes = new Uint8Array(64);
  readonly mixInSelectorBuffer = Buffer.from(
    this.mixInSelectorBlockBytes.buffer,
    this.mixInSelectorBlockBytes.byteOffset,
    this.mixInSelectorBlockBytes.byteLength
  );

  readonly selectors: number[];
  private readonly selectorToType: Record<number, Type<unknown>>;
  private readonly representativeType: Type<unknown>;
  private readonly selectorType = new UintNumberType(1);

  constructor(options: Types, opts?: CompatibleUnionOpts) {
    super();

    const selectorToType: Record<number, Type<unknown>> = {};
    const selectors = Object.keys(options)
      .map((selector) => Number(selector))
      .sort((a, b) => a - b);

    if (selectors.length === 0) {
      throw Error("CompatibleUnion must have at least one type option");
    }

    for (const selector of selectors) {
      if (!Number.isSafeInteger(selector) || selector < 1 || selector > 127) {
        throw Error(`CompatibleUnion selector ${selector} must be in range 1..127`);
      }
      selectorToType[selector] = options[selector];
    }

    for (let i = 0; i < selectors.length; i++) {
      for (let j = i + 1; j < selectors.length; j++) {
        const selectorA = selectors[i];
        const selectorB = selectors[j];
        if (!areTypesCompatible(selectorToType[selectorA], selectorToType[selectorB])) {
          throw Error(`CompatibleUnion options ${selectorA} and ${selectorB} are not compatible`);
        }
      }
    }

    this.selectorToType = selectorToType;
    this.selectors = selectors;
    this.representativeType = selectorToType[selectors[0]];
    this.typeName =
      opts?.typeName ??
      `CompatibleUnion({${selectors.map((selector) => `${selector}: ${selectorToType[selector].typeName}`).join(",")}})`;
    this.minSize = 1 + Math.min(...selectors.map((selector) => selectorToType[selector].minSize));
    this.maxSize = 1 + Math.max(...selectors.map((selector) => selectorToType[selector].maxSize));
    this.blocksBuffer = new Uint8Array(32);
  }

  static named<Types extends Record<number, Type<unknown>>>(
    options: Types,
    opts: Require<CompatibleUnionOpts, "typeName">
  ): CompatibleUnionType<Types> {
    return new (namedClass(CompatibleUnionType, opts.typeName))(options, opts);
  }

  defaultValue(): CompatibleUnion<unknown> {
    throw Error("CompatibleUnion does not define a default value");
  }

  getView(tree: Tree): CompatibleUnionTreeView<Types> {
    return new CompatibleUnionTreeView(this, tree);
  }

  getViewDU(node: Node): CompatibleUnionTreeViewDU<Types> {
    return new CompatibleUnionTreeViewDU(this, node);
  }

  cacheOfViewDU(): unknown {
    return;
  }

  commitView(view: CompatibleUnionTreeView<Types>): Node {
    return view.node;
  }

  commitViewDU(
    view: CompatibleUnionTreeViewDU<Types>,
    hcOffset = 0,
    hcByLevel: HashComputationLevel[] | null = null
  ): Node {
    view.commit(hcOffset, hcByLevel);
    return view.node;
  }

  value_serializedSize(value: CompatibleUnion<unknown>): number {
    return 1 + this.getType(value.selector).value_serializedSize(value.data);
  }

  value_serializeToBytes(output: ByteViews, offset: number, value: CompatibleUnion<unknown>): number {
    output.uint8Array[offset] = value.selector;
    return this.getType(value.selector).value_serializeToBytes(output, offset + 1, value.data);
  }

  value_deserializeFromBytes(
    data: ByteViews,
    start: number,
    end: number,
    reuseBytes?: boolean
  ): CompatibleUnion<unknown> {
    if (end <= start) {
      throw Error("CompatibleUnion requires a selector byte");
    }

    const selector = data.uint8Array[start];
    const type = this.getType(selector);
    return {
      selector,
      data: type.value_deserializeFromBytes(data, start + 1, end, reuseBytes),
    };
  }

  tree_serializedSize(node: Node): number {
    const selector = getLengthFromRootNode(node);
    return 1 + this.getType(selector).tree_serializedSize(node.left);
  }

  tree_serializeToBytes(output: ByteViews, offset: number, node: Node): number {
    const selector = getLengthFromRootNode(node);
    output.uint8Array[offset] = selector;
    return this.getType(selector).tree_serializeToBytes(output, offset + 1, node.left);
  }

  tree_deserializeFromBytes(data: ByteViews, start: number, end: number): Node {
    if (end <= start) {
      throw Error("CompatibleUnion requires a selector byte");
    }

    const selector = data.uint8Array[start];
    const valueNode = this.getType(selector).tree_deserializeFromBytes(data, start + 1, end);
    return addLengthNode(valueNode, selector);
  }

  hashTreeRoot(value: CompatibleUnion<unknown>): Uint8Array {
    const root = allocUnsafe(32);
    this.hashTreeRootInto(value, root, 0);
    return root;
  }

  hashTreeRootInto(value: CompatibleUnion<unknown>, output: Uint8Array, offset: number): void {
    const type = this.getType(value.selector);
    type.hashTreeRootInto(value.data, this.mixInSelectorBlockBytes, 0);
    this.mixInSelectorBlockBytes.subarray(32).fill(0);
    this.mixInSelectorBuffer.writeUIntLE(value.selector, 32, 6);
    merkleizeBlocksBytes(this.mixInSelectorBlockBytes, 2, output, offset);
  }

  protected getBlocksBytes(value: CompatibleUnion<unknown>): Uint8Array {
    this.getType(value.selector).hashTreeRootInto(value.data, this.blocksBuffer, 0);
    return this.blocksBuffer;
  }

  getPropertyGindex(prop: string): Gindex {
    switch (prop) {
      case "data":
        return VALUE_GINDEX;
      case "selector":
        return SELECTOR_GINDEX;
      default:
        throw new Error(`Invalid CompatibleUnion type property ${prop}`);
    }
  }

  createFromProof(proof: Proof, root?: Uint8Array): CompatibleUnionTreeView<Types> {
    const rootNode = Tree.createFromProof(proof).rootNode;
    if (root !== undefined && !byteArrayEquals(rootNode.root, root)) {
      throw new Error("Proof does not match trusted root");
    }

    return this.getView(new Tree(rootNode));
  }

  tree_createProof(node: Node, jsonPaths: JsonPath[]): Proof {
    const gindices = this.tree_createProofGindexes(node, jsonPaths);
    return createProof(node, {
      type: ProofType.treeOffset,
      gindices,
    });
  }

  tree_createProofGindexes(node: Node, jsonPaths: JsonPath[]): Gindex[] {
    const gindices: Gindex[] = [];
    const selector = getLengthFromRootNode(node);
    const selectedType = this.getType(selector);
    const dataNode = getNode(node, VALUE_GINDEX);

    for (const jsonPath of jsonPaths) {
      const [prop, ...remainingPath] = jsonPath;

      if (prop === undefined) {
        gindices.push(...this.tree_getLeafGindices(BigInt(1), node));
        continue;
      }

      if (prop === "selector") {
        if (remainingPath.length > 0) {
          throw Error("Invalid path: cannot navigate beyond CompatibleUnion selector");
        }
        gindices.push(SELECTOR_GINDEX);
        continue;
      }

      if (prop !== "data") {
        throw Error(`Invalid CompatibleUnion type property ${String(prop)}`);
      }

      if (remainingPath.length === 0) {
        if (isCompositeType(selectedType)) {
          gindices.push(
            ...selectedType.tree_getLeafGindices(VALUE_GINDEX, selectedType.fixedSize === null ? dataNode : undefined)
          );
        } else {
          gindices.push(VALUE_GINDEX);
        }
        continue;
      }

      if (!isCompositeType(selectedType)) {
        throw Error("Invalid path: cannot navigate beyond CompatibleUnion basic data");
      }

      const childGindices = selectedType.tree_createProofGindexes(dataNode, [remainingPath]);
      for (const childGindex of childGindices) {
        gindices.push(concatGindices([VALUE_GINDEX, childGindex]));
      }
    }

    return gindices;
  }

  getPropertyType(prop: string): Type<unknown> {
    switch (prop) {
      case "selector":
        return this.selectorType;
      case "data":
        return this.representativeType;
      default:
        throw new Error(`Invalid CompatibleUnion type property ${prop}`);
    }
  }

  getIndexProperty(index: number): string {
    if (index === 0) return "data";
    if (index === 1) return "selector";
    throw Error("CompatibleUnion index of out bounds");
  }

  tree_getLeafGindices(rootGindex: Gindex, rootNode?: Node): Gindex[] {
    if (!rootNode) {
      throw Error("rootNode required");
    }

    const selector = getLengthFromRootNode(rootNode);
    const type = this.getType(selector);
    const valueGindex = concatGindices([rootGindex, VALUE_GINDEX]);
    const gindices: Gindex[] = [];
    if (isCompositeType(type)) {
      gindices.push(...type.tree_getLeafGindices(valueGindex, getNode(rootNode, VALUE_GINDEX)));
    } else {
      gindices.push(valueGindex);
    }
    gindices.push(concatGindices([rootGindex, SELECTOR_GINDEX]));
    return gindices;
  }

  tree_fromProofNode(node: Node): {node: Node; done: boolean} {
    return {node, done: true};
  }

  fromJson(json: unknown): CompatibleUnion<unknown> {
    if (typeof json !== "object" || json === null) {
      throw new Error("JSON must be of type object");
    }

    const union = json as {selector?: unknown; data?: unknown};
    const selector = parseSelector(union.selector);
    const type = this.getType(selector);
    if (!("data" in union)) {
      throw new Error("JSON CompatibleUnion missing data");
    }

    return {
      selector,
      data: type.fromJson(union.data),
    };
  }

  toJson(value: CompatibleUnion<unknown>): Record<string, unknown> {
    return {
      selector: value.selector.toString(10),
      data: this.getType(value.selector).toJson(value.data),
    };
  }

  clone(value: CompatibleUnion<unknown>): CompatibleUnion<unknown> {
    return {
      selector: value.selector,
      data: this.getType(value.selector).clone(value.data),
    };
  }

  equals(a: CompatibleUnion<unknown>, b: CompatibleUnion<unknown>): boolean {
    if (a.selector !== b.selector) {
      return false;
    }

    return this.getType(a.selector).equals(a.data, b.data);
  }

  getType(selector: number): Type<unknown> {
    const type = this.selectorToType[selector];
    if (type === undefined) {
      throw Error(`Invalid CompatibleUnion selector ${selector}`);
    }
    return type;
  }
}

export class CompatibleUnionTreeView<Types extends Record<number, Type<unknown>>> extends TreeView<
  CompatibleUnionType<Types>
> {
  constructor(
    readonly type: CompatibleUnionType<Types>,
    protected tree: Tree
  ) {
    super();
  }

  get node(): Node {
    return this.tree.rootNode;
  }

  get selector(): number {
    return getLengthFromRootNode(this.tree.rootNode);
  }

  get data(): unknown {
    const selector = this.selector;
    return this.type.getType(selector).tree_toValue(this.tree.rootNode.left);
  }
}

export class CompatibleUnionTreeViewDU<Types extends Record<number, Type<unknown>>> extends TreeViewDU<
  CompatibleUnionType<Types>
> {
  constructor(
    readonly type: CompatibleUnionType<Types>,
    protected _rootNode: Node
  ) {
    super();
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): unknown {
    return undefined;
  }

  get selector(): number {
    return getLengthFromRootNode(this._rootNode);
  }

  get data(): unknown {
    const selector = this.selector;
    return this.type.getType(selector).tree_toValue(this._rootNode.left);
  }

  commit(hcOffset = 0, hcByLevel: HashComputationLevel[] | null = null): void {
    if (hcByLevel !== null && this._rootNode.h0 === null) {
      getHashComputations(this._rootNode, hcOffset, hcByLevel);
    }
  }

  protected clearCache(): void {
    return;
  }
}

export function areTypesCompatible(a: Type<unknown>, b: Type<unknown>): boolean {
  if (a === b) {
    return true;
  }

  if (a instanceof CompatibleUnionType && b instanceof CompatibleUnionType) {
    return a.selectors.every((selectorA) =>
      b.selectors.every((selectorB) => areTypesCompatible(a.getType(selectorA), b.getType(selectorB)))
    );
  }

  if (isBasicType(a) && isBasicType(b)) {
    return areBasicTypesCompatible(a, b);
  }

  if (a instanceof BitListType && b instanceof BitListType) {
    return a.limitBits === b.limitBits;
  }
  if (a instanceof BitVectorType && b instanceof BitVectorType) {
    return a.lengthBits === b.lengthBits;
  }
  if (a instanceof ProgressiveBitListType && b instanceof ProgressiveBitListType) {
    return true;
  }

  if (isByteListCompatibleType(a) && isByteListCompatibleType(b)) {
    return getByteListCompatibleLimit(a) === getByteListCompatibleLimit(b);
  }
  if (isByteVectorCompatibleType(a) && isByteVectorCompatibleType(b)) {
    return getByteVectorCompatibleLength(a) === getByteVectorCompatibleLength(b);
  }

  if (isProgressiveByteListCompatibleType(a) && isProgressiveByteListCompatibleType(b)) {
    return true;
  }

  if (isLimitedListType(a) && isLimitedListType(b)) {
    return a.limit === b.limit && areTypesCompatible(a.elementType, b.elementType);
  }
  if (isVectorType(a) && isVectorType(b)) {
    return a.length === b.length && areTypesCompatible(a.elementType, b.elementType);
  }

  if (isProgressiveListType(a) && isProgressiveListType(b)) {
    return areTypesCompatible(a.elementType, b.elementType);
  }

  if (a instanceof ContainerType && b instanceof ContainerType) {
    return areContainersCompatible(a, b);
  }
  if (a instanceof ProgressiveContainerType && b instanceof ProgressiveContainerType) {
    return areProgressiveContainersCompatible(a, b);
  }

  return false;
}

function parseSelector(selector: unknown): number {
  if (typeof selector === "number") {
    if (Number.isSafeInteger(selector)) {
      return selector;
    }
  } else if (typeof selector === "bigint") {
    if (selector >= BigInt(Number.MIN_SAFE_INTEGER) && selector <= BigInt(Number.MAX_SAFE_INTEGER)) {
      return Number(selector);
    }
  } else if (typeof selector === "string") {
    const parsed = Number(selector);
    if (Number.isSafeInteger(parsed) && parsed.toString(10) === selector) {
      return parsed;
    }
  }

  throw Error("Invalid JSON CompatibleUnion selector");
}

function areBasicTypesCompatible(a: BasicType<unknown>, b: BasicType<unknown>): boolean {
  if (a instanceof BooleanType || b instanceof BooleanType) {
    return a instanceof BooleanType && b instanceof BooleanType;
  }

  if (isUintType(a) && isUintType(b)) {
    return a.byteLength === b.byteLength;
  }

  return a.constructor === b.constructor && a.byteLength === b.byteLength;
}

function isUintType(type: Type<unknown>): type is UintNumberType | UintBigintType {
  return type instanceof UintNumberType || type instanceof UintBigintType;
}

function isByteBasicType(type: Type<unknown>): boolean {
  return isUintType(type) && type.byteLength === 1;
}

function isByteListCompatibleType(type: Type<unknown>): type is ByteListType | ListBasicType<BasicType<unknown>> {
  return type instanceof ByteListType || (type instanceof ListBasicType && isByteBasicType(type.elementType));
}

function getByteListCompatibleLimit(type: ByteListType | ListBasicType<BasicType<unknown>>): number {
  return type instanceof ByteListType ? type.limitBytes : type.limit;
}

function isByteVectorCompatibleType(type: Type<unknown>): type is ByteVectorType | VectorBasicType<BasicType<unknown>> {
  return type instanceof ByteVectorType || (type instanceof VectorBasicType && isByteBasicType(type.elementType));
}

function getByteVectorCompatibleLength(type: ByteVectorType | VectorBasicType<BasicType<unknown>>): number {
  return type instanceof ByteVectorType ? type.lengthBytes : type.length;
}

function isProgressiveByteListCompatibleType(
  type: Type<unknown>
): type is ProgressiveByteListType | ProgressiveListBasicType<BasicType<unknown>> {
  return (
    type instanceof ProgressiveByteListType ||
    (type instanceof ProgressiveListBasicType && isByteBasicType(type.elementType))
  );
}

function isLimitedListType(
  type: Type<unknown>
): type is ListBasicType<BasicType<unknown>> | ListCompositeType<CompositeType<unknown, unknown, unknown>> {
  return type instanceof ListBasicType || type instanceof ListCompositeType;
}

function isVectorType(
  type: Type<unknown>
): type is VectorBasicType<BasicType<unknown>> | VectorCompositeType<CompositeType<unknown, unknown, unknown>> {
  return type instanceof VectorBasicType || type instanceof VectorCompositeType;
}

function isProgressiveListType(
  type: Type<unknown>
): type is
  | ProgressiveListBasicType<BasicType<unknown>>
  | ProgressiveListCompositeType<CompositeType<unknown, unknown, unknown>> {
  return type instanceof ProgressiveListBasicType || type instanceof ProgressiveListCompositeType;
}

function areContainersCompatible(
  a: ContainerType<Record<string, Type<unknown>>>,
  b: ContainerType<Record<string, Type<unknown>>>
): boolean {
  if (a.fieldsEntries.length !== b.fieldsEntries.length) {
    return false;
  }

  for (let i = 0; i < a.fieldsEntries.length; i++) {
    const fieldA = a.fieldsEntries[i];
    const fieldB = b.fieldsEntries[i];
    if (fieldA.fieldName !== fieldB.fieldName || !areTypesCompatible(fieldA.fieldType, fieldB.fieldType)) {
      return false;
    }
  }
  return true;
}

function areProgressiveContainersCompatible(
  a: ProgressiveContainerType<Record<string, Type<unknown>>>,
  b: ProgressiveContainerType<Record<string, Type<unknown>>>
): boolean {
  const fieldsA = progressiveContainerFieldMap(a);
  const fieldsB = progressiveContainerFieldMap(b);
  const maxActiveFields = Math.max(a.activeFields.bitLen, b.activeFields.bitLen);

  for (let i = 0; i < maxActiveFields; i++) {
    if (a.activeFields.get(i) && b.activeFields.get(i)) {
      const fieldA = a.getIndexProperty(i);
      const fieldB = b.getIndexProperty(i);
      if (fieldA === null || fieldB === null || fieldA !== fieldB) {
        return false;
      }
      const fieldInfoA = fieldsA.get(fieldA);
      const fieldInfoB = fieldsB.get(fieldB);
      if (
        fieldInfoA === undefined ||
        fieldInfoB === undefined ||
        !areTypesCompatible(fieldInfoA.type, fieldInfoB.type)
      ) {
        return false;
      }
    }
  }

  for (const [fieldName, fieldA] of fieldsA) {
    const fieldB = fieldsB.get(fieldName);
    if (fieldB !== undefined && fieldA.chunkIndex !== fieldB.chunkIndex) {
      return false;
    }
  }

  return true;
}

function progressiveContainerFieldMap(
  type: ProgressiveContainerType<Record<string, Type<unknown>>>
): Map<string, {chunkIndex: number; type: Type<unknown>}> {
  const fields = new Map<string, {chunkIndex: number; type: Type<unknown>}>();
  for (const entry of type.fieldsEntries) {
    fields.set(entry.fieldName as string, {chunkIndex: entry.chunkIndex, type: entry.fieldType});
  }
  return fields;
}
