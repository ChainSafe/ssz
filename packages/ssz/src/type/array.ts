import {Gindex, Node, concatGindices, getNode, toGindex} from "@chainsafe/persistent-merkle-tree";
import {Type, ValueOf } from "./abstract.js";
import {
  ArrayProps,
  value_cloneArray,
  value_defaultValueArray,
  value_equals,
  value_fromJsonArray,
  value_toJsonArray,
} from "./arrayBasic.js";
import {CompositeType, LENGTH_GINDEX, isCompositeType } from "./composite.js";



/**
 * Array: ordered homogeneous collection
 */
export abstract class ArrayType<ElementType extends Type<unknown>, TV, TVDU> extends CompositeType<
  ValueOf<ElementType>[],
  TV,
  TVDU
> {
  abstract readonly itemsPerChunk: number;
  protected abstract readonly defaultLen: number;

  constructor(readonly elementType: ElementType, cachePermanentRootStruct?: boolean) {
    super(cachePermanentRootStruct);
  }

  defaultValue(): ValueOf<ElementType>[] {
    return value_defaultValueArray(this.elementType, this.defaultLen);
  }

  abstract tree_getLength(node: Node): number;

  // Proofs

  getPropertyType(): Type<unknown> {
    return this.elementType;
  }

  getPropertyGindex(prop: string | number): bigint {
    if (typeof prop !== "number") {
      throw Error(`Invalid array index: ${prop}`);
    }

    const chunkIdx = Math.floor(prop / this.itemsPerChunk);
    return toGindex(this.depth, BigInt(chunkIdx));
  }

  getIndexProperty(index: number): string | number {
    return index;
  }

  tree_getLeafGindices(rootGindex: bigint, rootNode?: Node): bigint[] {
    let length: number;
    if (this.isList) {
      if (!rootNode) {
        throw new Error("List type requires tree argument to get leaves");
      }
      length = this.tree_getLength(rootNode);
    } else {
      // Vectors don't need a rootNode to return length
      length = this.tree_getLength(null as unknown as Node);
    }

    const gindices: Gindex[] = [];

    if (isCompositeType(this.elementType)) {
      // Underlying elements exist one per chunk
      // Iterate through chunk gindices, recursively fetching leaf gindices from each chunk
      const startIndex = toGindex(this.depth, BigInt(0));
      const endGindex = startIndex + BigInt(length);
      const extendedStartIndex = concatGindices([rootGindex, startIndex]);

      if (this.elementType.fixedSize === null) {
        if (!rootNode) {
          /* istanbul ignore next - unreachable code */
          throw new Error("Array of variable size requires tree argument to get leaves");
        }

        // variable-length elements must pass the underlying subtrees to determine the length
        for (
          let gindex = startIndex, extendedGindex = extendedStartIndex;
          gindex < endGindex;
          gindex++, extendedGindex++
        ) {
          gindices.push(...this.elementType.tree_getLeafGindices(extendedGindex, getNode(rootNode, gindex)));
        }
      } else {
        for (let i = 0, extendedGindex = extendedStartIndex; i < length; i++, extendedGindex++) {
          gindices.push(...this.elementType.tree_getLeafGindices(extendedGindex));
        }
      }
    }

    // Basic
    else {
      const chunkCount = Math.ceil(length / this.itemsPerChunk);
      const startIndex = concatGindices([rootGindex, toGindex(this.depth, BigInt(0))]);
      const endGindex = startIndex + BigInt(chunkCount);
      for (let gindex = startIndex; gindex < endGindex; gindex++) {
        gindices.push(gindex);
      }
    }

    // include the length chunk
    if (this.isList) {
      gindices.push(concatGindices([rootGindex, LENGTH_GINDEX]));
    }

    return gindices;
  }

  // JSON

  fromJson(json: unknown): ValueOf<ElementType>[] {
    // TODO: Do a better typesafe approach, all final classes of ArrayType implement ArrayProps
    // There are multiple tests that cover this path for all clases
    return value_fromJsonArray(this.elementType, json, this as unknown as ArrayProps);
  }

  toJson(value: ValueOf<ElementType>[]): unknown {
    return value_toJsonArray(this.elementType, value, this as unknown as ArrayProps);
  }

  clone(value: ValueOf<ElementType>[]): ValueOf<ElementType>[] {
    return value_cloneArray(this.elementType, value);
  }

  equals(a: ValueOf<ElementType>[], b: ValueOf<ElementType>[]): boolean {
    return value_equals(this.elementType, a, b);
  }
}
