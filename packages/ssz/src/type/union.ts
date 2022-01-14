import {Node, Tree} from "@chainsafe/persistent-merkle-tree";
import {JsonOptions, Type} from "./abstract";
import {CompositeType} from "./composite";
import {addLengthNode, getLengthFromRootNode} from "./arrayBasic";
import {NoneType} from "./none";

/* eslint-disable @typescript-eslint/member-ordering */

type Union<T> = {
  readonly selector: number;
  value: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueOfTypes<Types extends Type<any>[]> = Types extends Type<infer T>[] ? Union<T> : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UnionType<Types extends Type<any>[]> extends CompositeType<
  ValueOfTypes<Types>,
  ValueOfTypes<Types>,
  ValueOfTypes<Types>
> {
  readonly typeName: string;
  // Immutable characteristics
  readonly depth = 1;
  readonly maxChunkCount = 2;
  readonly fixedSize = null;
  readonly minSize: number;
  readonly maxSize: number;

  protected readonly maxSelector: number;

  constructor(readonly types: Types) {
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

    this.typeName = `Union[${types.map((t) => t.typeName).join(",")}]`;

    const minLens: number[] = [];
    const maxLens: number[] = [];

    for (const _type of types) {
      minLens.push(_type.minSize);
      maxLens.push(_type.maxSize);
    }

    this.minSize = 1 + Math.min(...minLens);
    this.maxSize = 1 + Math.min(...maxLens);
    this.maxSelector = this.types.length - 1;
  }

  get defaultValue(): ValueOfTypes<Types> {
    return {
      selector: 0,
      value: this.types[0].defaultValue as unknown,
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

  commitViewDU(view: ValueOfTypes<Types>): Node {
    return this.value_toTree(view);
  }

  value_serializedSize(value: ValueOfTypes<Types>): number {
    return 1 + this.types[value.selector].value_serializedSize(value.value);
  }

  value_deserializeFromBytes(data: Uint8Array, start: number, end: number): ValueOfTypes<Types> {
    const selector = data[start];
    if (selector > this.maxSelector) {
      throw Error(`Invalid selector ${selector}`);
    }

    return {
      selector,
      value: this.types[selector].value_deserializeFromBytes(data, start + 1, end) as unknown,
    } as ValueOfTypes<Types>;
  }

  value_serializeToBytes(output: Uint8Array, offset: number, value: ValueOfTypes<Types>): number {
    output[offset] = value.selector;
    return this.types[value.selector].value_serializeToBytes(output, offset + 1, value.value);
  }

  tree_serializedSize(node: Node): number {
    const selector = getLengthFromRootNode(node);
    const valueNode = node.left;
    return 1 + this.types[selector].value_serializedSize(valueNode);
  }

  tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node {
    const selector = data[start];
    if (selector > this.maxSelector) {
      throw Error(`Invalid selector ${selector}`);
    }

    const valueNode = this.types[selector].tree_deserializeFromBytes(data, start + 1, end);
    return addLengthNode(valueNode, selector);
  }

  tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number {
    const selector = getLengthFromRootNode(node);
    const valueNode = node.left;

    output[offset] = selector;
    return this.types[selector].tree_serializeToBytes(output, offset + 1, valueNode);
  }

  // Merkleization

  protected getRoots(value: ValueOfTypes<Types>): Uint8Array {
    const roots = new Uint8Array(64);

    const root = this.types[value.selector].hashTreeRoot(value.value);
    roots.set(root, 0);
    roots[32] = value.selector;

    return roots;
  }

  // JSON

  fromJson(json: unknown, opts?: JsonOptions): ValueOfTypes<Types> {
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
      value: type.toJson(union.value, opts),
    } as ValueOfTypes<Types>;
  }

  toJson(value: ValueOfTypes<Types>, opts?: JsonOptions): Record<string, unknown> {
    return {
      selector: value.selector,
      value: this.types[value.selector].toJson(value.value, opts),
    };
  }
}
